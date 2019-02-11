var params = new URLSearchParams(window.location.search);
var username = params.get('name');
var room = params.get('room');

//Jquery references

var divUsers = $('#divUsuarios');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

// Functions to render users

function renderUsers( users ){    
    var html = '';

    html += '<li>';
    html +=    '<a href="javascript:void(0)" class="active"> Chat of <span>' + params.get('room') + '</span></a>';
    html += '</li>';

    for(var i = 0; i < users.length; i++){
        html += '<li>';
        html += '<a data-id="'+ users[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].name + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }      
    divUsers.html(html);
}


function renderMessages( message, amItheSender ){
    
    var html = '';
    var date = new Date(message.date);
    var time = date.getHours() + ':' + date.getMinutes();
    var adminClass = message.name === 'Admin' ? 'danger' : 'inverse';
      
    if(amItheSender){
        html += '<li class="animated fadeIn">';
        html +=    '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html +=    '<div class="chat-content">';
        html +=        '<h5>'+ message.name +'</h5>';
        html +=        '<div class="box bg-light-info">'+ message.message +'</div>';
        html +=    '</div>';
        html +=    '<div class="chat-time">'+ time +'</div>';
        html += '</li>';
    }else{
        html += '<li class="reverse">';
        if( message.name !== 'Admin'){
            html +=    '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }        
        html +=    '<div class="chat-content">';
        html +=        '<h5>'+ message.name +'</h5>';
        html +=        '<div class="box bg-light-'+ adminClass +'">'+ message.message +'</div>';
        html +=    '</div>';
        html +=    '<div class="chat-time">'+ time +'</div>';
        html += '</li>';
    }
    
    divChatbox.append(html);
}


function scrollBottom() { // Determines if the window of the chat needs to be scrolled or not

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



// Linsteners

divUsers.on('click', 'a', function(){
    var id = $(this).data('id'); // this makes a reference to the element <a> that the user has clicked
    if( id ){
        console.log(id);
    }
});


formSend.on('submit', function(e){
    e.preventDefault();
    if(txtMessage.val().trim().length === 0){
        return;
    }
    console.log('The message sent is: ' + txtMessage.val());
    socket.emit('createMessage', {
        name: username,
        message: txtMessage.val()
    }, function(message){
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
});