// https://firechat.firebaseapp.com/docs/

'use strict';

var chat;
// A loading image URL.
var loading_image_url = 'https://www.google.com/images/spin-32.gif';

// Checks that the Firebase SDK has been correctly setup and configured.
FormBuilderChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (!config.storageBucket || config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

// Sets up shortcuts to Firebase features and initiate firebase auth.
FormBuilderChat.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FormBuilderChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get a Firebase Database ref
    var chatRef = this.database.ref(_chat_ref);
    // Create a Firechat instance
    chat = new FirechatUI(chatRef, this.firechatWrapper);
    chat.maxLengthMessage = 10000;
    chat.setUser(user.uid, user.displayName);
   
    //unread message start
    var messageRefUnreaad = chatRef.child('room-messages'), roomRefUnread= chatRef.child('room-metadata');
    //latest for unread
    if(roomId !== ""){
        roomRefUnread.child(roomId).once('value', function(roomsSnapshot) {
            var roomData = roomsSnapshot.val();
            messageRefUnreaad.child(roomId).once('child_added', function (snapshot){
                var messageUnread = snapshot.val();
                if(user.uid !== messageUnread.userId){
                    updateStatusPost(_chat_ref,roomData.id,snapshot.key,messageUnread)
                }
            });
        });
    }
    //end
    /*chat.on('auth-required', function() {
      alert("Firebase: Authentication required!!");
      return false;
    });*/
    
    // Invoked when the user successfully enters a room.
    chat.on('room-enter', function(room) {
        //console.log(room);
        roomId = room.id;
        roomName = room.name;
        chat.$messages[roomId].scrollTop(chat.$messages[roomId][0].scrollHeight);
      
        // Events for image upload.
        $( "#submitImage" + roomId ).bind( "click", function() {
            $( "#mediaCapture" + roomId ).trigger("click");
        });
        $( "#mediaCapture" + roomId ).on( "change", function() {
            saveImageMessage(this);
        });
        $('.form-builder-loader').remove();
        $('.chat-box').removeClass('hide');
    });
    
    setTimeout(initiateChatRoom, 1500);

  } else { // User is signed out!
    
  }
};

// List all messages.
FormBuilderChat.prototype.consoleLog = function(key, data) {
  var messages = [
      'Entering into chatroom...',
      'Resume chat session...',
      'Creating chat room...',
      'Exit chatroom...',
      'Invitaion sent...',
  ];
  if(isNaN(key)){
      console.log("Firebase:", data, key);
  }else{
      console.log("Firebase:", messages[key], data ? data : '');
  }
};

// Initializes FormBuilderChat.
function FormBuilderChat() {    
    this.checkSetup();
  
    // Shortcuts to DOM Elements.
    this.firechatWrapper = document.getElementById('firechat-wrapper');
    this.initFirebase();
}

// Saves a new message containing an image URI in Firebase.
// This first saves the image in our server and sends the image url as message to firebase.
function saveImageMessage ($this) {
  var currentRoom = $('div.tab-pane.active').attr('data-room-id');
  var $textarea = $('div.tab-pane.active').find('textarea').first();
  var $textareaValue = $.trim($textarea.val());

  // Check if the file is an image.
  /*if (!file.type.match('image.*')) {
    alert('You can only share images');
    return;
  }*/

  // Check if the user is signed-in
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    
    var form_data = new FormData();
    for (var i = 0, len = $this.files.length; i < len; i++) {
      form_data.append("file[]", $this.files[i]);
    }
    form_data.append('chat-ref', _chat_ref);
    form_data.append('room-id', currentRoom);
    form_data.append('user-id', user.uid);
    //form_data.append('total-files', len);

    $.ajax({
        url: uploadUrl, // point to server-side PHP script
        dataType: 'json',  // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        beforeSend: function () {
          var localtime = chat.formatTime();
          var uploader = "<div class='message message-imageUri message-self das message-imageUploader' data-user-id='" + user.uid + "' data-user-name='" + user.displayName + "' data-class='firechat-message'>" +
              "<div class='clearfix'>" +
                "<label class='fourfifth'> " +
                  "<em>(" + localtime + ")</em>:" +
                "</label>" +
              "</div>" +
              "<div class='clearfix message-content'><img class='loader' src='" + loading_image_url + "'></div>" +
            "</div>";

          for (var i = 0; i < len; i++) {
            $(chat.$messages[currentRoom]).append(uploader);
          }
          
          $("img.loader").on('load', function(){
            chat.$messages[currentRoom].scrollTop(chat.$messages[currentRoom][0].scrollHeight);
          });          
        },
        success: function(response){
            if(response.code){
              $.each(response.message, function(key, value){
                if (/\.(jpe?g|png|gif)$/i.test(value.url)) {
                  var messageType = 'imageUri';                  
                }else{
                  var messageType = 'docUri';
                }
                if($textareaValue !== ""){
                  value.note = $textareaValue;
                  $textarea.val('');
                }
                
                chat._chat.sendMessage(currentRoom, value, messageType);
              });
            }else{
              alert(response.message);
            }
        },
        complete: function () {
          // Clear the selection in the file picker input.
          document.getElementById('image-form' + currentRoom).reset();
          $(chat.$messages[currentRoom]).find('div.message-imageUri.message-self.message-imageUploader').remove();
        }
    });
  }
};

window.onload = function() {
  window.FormBuilderChat = new FormBuilderChat();
};

// Function for any update ajax call
var ajax_call = function (params){
                    $.ajax({
                        url: params.url,
                        type: "POST",
                        data: params.data,
                        //dataType: "json",
                        success: function(result){
                            //alert("Updated Successfully!!");
                        }
                    });
                };
                
 function updateStatusPost(_chat_ref,roomDataId,snapshotKey,messageUnread){
    var postData = {
        message: messageUnread.message,
        name: messageUnread.name || "",
        status: (typeof messageUnread.status !== 'undefined' && messageUnread.status == 'Deleted') ? messageUnread.status :  'No',
        timestamp: messageUnread.timestamp,
        type: messageUnread.type,
        userId: messageUnread.userId,
        messageDelete: (typeof messageUnread.messageDelete !== "undefined" ? messageUnread.messageDelete : "0")
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates[_chat_ref+'/room-messages/'+roomDataId+'/'+snapshotKey] = postData;
    return firebase.database().ref().update(updates);
}