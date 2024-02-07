"use strict";
//debugger;

//var connection = new $.hubConnection("https://localhost:44360");
//var hub = connection.createHubProxy("signalr");

//connection.start()
//    .done(function () {
//        console.log('connected');
//        hub.say("success?");
//    })
//    .fail(function (a) {
//        console.log('not connected' + a);
//    });



//hub.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});



////connection.client.ReceiveMessage = function (a, b) {
////    alert(a);
////}

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
    
//    hub.invoke("SendMessage", "a", "b").catch(function (err) {
//        return console.error(err.toString());
//    });
//});