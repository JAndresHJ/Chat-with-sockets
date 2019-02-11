
// ================== CLIENT ===========================

var socket = io();
var params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')){ // If name is not provided, redirect to index
    window.location = 'index.html';
    throw new Error("The name and chat room are required");
}


var user = {
    name: params.get('name'),
    room: params.get('room')
}


// listen connection event
socket.on('connect', function() {
    console.log('Connected to server');
    socket.emit('enterChat', user, function( res ){
        console.log('Users connected', res);
        renderUsers(res); // res is a users array
    });
});


// listen disconnection event
socket.on('disconnect', function() {
    console.log('Connection to server lost');    
});


// listen createMessage from server
socket.on('createMessage', function(message) {
    console.log('Server:', message);
    renderMessages(message, false);
    scrollBottom();
});


// listen listUsers event from server
socket.on('listUsers', function(users){
    console.log("List of users connected", users);
    renderUsers(users);
})


// Private messages
socket.on('privateMessage', function(message){
    console.log('Private message: ', message);
});

