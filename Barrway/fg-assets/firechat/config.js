var hostname = window.location.host, _chat_ref;
if($.inArray(hostname, ['localhost', '127.0.0.1', 'augurs.formgenerator.in']) !== -1){
    // Development Environment
    _chat_ref = "firechat";
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCx9FibkbvZusjJpobFb1AkcG4YASEJ2-A",
        authDomain: "form-generator-89e14.firebaseapp.com",
        databaseURL: "https://form-generator-89e14.firebaseio.com",
        projectId: "form-generator-89e14",
        storageBucket: "form-generator-89e14.appspot.com",
        messagingSenderId: "887737447775"
    };
}else{
    // Production Environment
    _chat_ref = "formbuilder";
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCx9FibkbvZusjJpobFb1AkcG4YASEJ2-A",
        authDomain: "form-generator-89e14.firebaseapp.com",
        databaseURL: "https://form-generator-89e14.firebaseio.com",
        projectId: "form-generator-89e14",
        storageBucket: "form-generator-89e14.appspot.com",
        messagingSenderId: "887737447775"
    };
}
//firebase.initializeApp(config);

//// Firebase queue summary update
//var chatRef = firebase.database().ref(_chat_ref);
//// Create a new ref and log it’s push key
//var queueRef = chatRef.child('queue-summary');
function sendFiberNotificaton(ajaxUrl, firebase_room_id, postData){
    if(postData !== '') {
        $.ajax({
            type: "POST",
            url: ajaxUrl,
            data: JSON.parse(postData),
            dataType: 'json',
            success: function( response ) {
                queueRef.push({
                    roomId: firebase_room_id,
                    summary: response
                });
            }
        });
    } else {
        queueRef.push({
            roomId: firebase_room_id
        });
    }
}

//queueRef.limitToLast(1).on('child_added', function (snapshot) {
//    var queueSummary = snapshot.val();
//    var summaryKey = snapshot.key;
//    //console.log(queueSummary);
//    if(queueSummary['summary']){
//        updateQueueSummary(queueSummary['summary']);
//    } else {
//        $('body .refresh-summary').click();
//    }
//    queueRef.child(summaryKey).remove();
//    //
//});

function updateQueueSummary(response){    
    $('div.alert.calling-messages').html('');
    $.each(response, function(key, data){
        //console.log(key, data);
        if(typeof data !== 'undefined'){
            if(key < 3){
                $.each(data, function(name, value){
                    if(name !== 'status'){
                        $('div#' + name + ' span.' + data.status).text(value);
                    }
                });
            }else if(key === 3){
                //$.each(data, function(queue_slug, calling_records){
                $('body .grid-item').each(function(){
                    var queue_slug = $(this).attr('id');
                    if(typeof data[queue_slug] !== 'undefined'){
                        var calling_records = data[queue_slug];
                        if(calling_records.length > 0) {
                            if($('div#' + queue_slug + ' table').length){
                                var $table = $('div#' + queue_slug + ' table');
                                $table.find('tbody').remove();
                                var $tbody = $("<tbody>");
                                $table.append($tbody);

                                var tbody = '';                                            
                                calling_records.forEach(function(record){
                                    tbody += '<tr>';
                                    tbody += '<td>' + record['token-number'] + '</td>';
                                    if(typeof record['queue-server'] !== 'undefined')
                                        tbody += '<td>' + record['queue-server'] + '</td>';
                                    tbody += '</tr>';
                                });

                                $tbody.append(tbody);
                            }else{
                                var $html = $('<h3 class="name calling-head">Calling Numbers:</h3>');
                                var $table = $("<table>",{'style':'width:100%; color:inherit;'});
                                var $tbody = $("<tbody>");
                                $table.append($tbody);

                                var tbody = '';                                            
                                calling_records.forEach(function(record){
                                    tbody += '<tr>';
                                    tbody += '<td>' + record['token-number'] + '</td>';
                                    if(typeof record['queue-server'] !== 'undefined')
                                        tbody += '<td>' + record['queue-server'] + '</td>';
                                    tbody += '</tr>';
                                });

                                $tbody.append(tbody);
                                $html.insertAfter( $('div#' + queue_slug + ' > div.symbol') );
                                $table.insertAfter( $('div#' + queue_slug + ' > h3.calling-head') );
                            }
                            if($('div#' + queue_slug + ' > h3 span.my-tickets').length){
                                var my_tickets_str = $('div#' + queue_slug + ' > h3 span.my-tickets').text();
                                if(my_tickets_str !== 'None'){
                                    var myTickets = my_tickets_str.split(', ');
                                    if(myTickets.length){                                                    
                                        showCallingMessages(myTickets, data[queue_slug]);
                                    }
                                }
                            }                                        
                        }else{
                            $('div#' + queue_slug + ' > h3.calling-head').remove();
                            $('div#' + queue_slug + ' > table').remove();
                        }
                    }else{
                        $('div#' + queue_slug + ' > h3.calling-head').remove();
                        $('div#' + queue_slug + ' > table').remove();
                    }
                });
            }else if(key === 4){
                $('.summary-update-time').text(data);
            }
        }else{
            $('body .grid-item').each(function(){
                var queue_slug = $(this).attr('id');
                $('div#' + queue_slug + ' > h3.calling-head').remove();
                $('div#' + queue_slug + ' > table').remove();
                $('div.alert.calling-messages').remove();
            });
        }
    });
}
//console.log(hostname,':', _chat_ref);

function sendChatFiberNotificaton(ajaxUrl, postData){
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: postData,
        dataType: 'json',
        success: function( response ) {

        }
    });
}