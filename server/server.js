const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.port || 3000;

const { Users } = require('./utils/users');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        //socket.leave(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updatedUserList', users.getUserList(params.room));

        //Welcome new connected user.
        socket.emit('newMessage', generateMessage('Admin', `Welcome ${params.name} to chat app.`));

        // Notify all users regarding new joined user.
        //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });
    // New message creation from user
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            let newMessage = generateMessage(user.name, message.text)
            io.to(user.room).emit('newMessage', newMessage);
            callback(newMessage);
        }
        
    });
    // New location message from user
    socket.on('createLocationMessage', (cords) => {
        var user = users.getUser(socket.id);
        if(user) {
            let newMessage = generateLocationMessage(user.name, cords.latitude, cords.longitude);
            io.to(user.room).emit('newLocationMessage', newMessage);
        }
    });
    // User got disconnected
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updatedUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.info(`App running at ${PORT}`);
});