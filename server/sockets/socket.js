
// ================== SERVER =======================

const { io } = require('../server');
const {Users} = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    // listen enterChat from client
    client.on('enterChat', (data, callback) => {
        
        if(!data.name || !data.room){
            return callback({
                error: true,
                message: "Name and room are required"
            });
        }

        client.join(data.room);

        users.addUser(client.id , data.name, data.room);

        client.broadcast.to(data.room).emit('listUsers', users.getUsersByRoom(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin',`${data.name} has entered the chat`));

        callback(users.getUsersByRoom(data.room));
    }); 


    client.on('createMessage', (data, callback) => {
        let user = users.getUser(client.id);
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('createMessage', message); //Send a message to everyone        
        callback(message);
    });
    

    client.on('disconnect' , () => {
        let userdeleted = users.deleteUser(client.id);
        client.broadcast.to(userdeleted.room).emit('createMessage', createMessage('Admin',`${userdeleted.name} has exit the chat`));
        client.broadcast.to(userdeleted.room).emit('listUsers', users.getUsersByRoom(userdeleted.room));
    });


    // Private messages
    client.on('privateMessage', data => {
        let user = users.getUser(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(user.name, data.message));
    });
});