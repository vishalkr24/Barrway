// [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': 'AIzaSyCx9FibkbvZusjJpobFb1AkcG4YASEJ2-A'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
    //console.log('Received background message ', payload);
    var notificationTitle, notificationOptions;
    
    if(typeof payload.data !== 'undefined'){
        if(payload.data.queue === 'summary-update'){
            notificationTitle = 'Queue Summary Updated!';
            notificationOptions = {
                body: 'Queue summary was updated a while ago, please check.',
                icon: '/logo.png'
            };
        }
    }
    if(typeof payload.notification !== 'undefined') {
        notificationTitle = payload.notification.title;
        notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon
        };
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]