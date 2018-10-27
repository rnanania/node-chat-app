const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.port || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const {generateMessage} = require('./utils/message');

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New user connected');
    //Welcome new connected user.
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));
    // Notify all users regarding new joined user.
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    // New message creation from user
    socket.on('createMessage', (message, callback) => {
        let newMessage = generateMessage(message.from, message.text);
        io.emit('newMessage', newMessage);
        callback(newMessage);
    });
    // User got disconnected
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.info(`App running at ${PORT}`);
});