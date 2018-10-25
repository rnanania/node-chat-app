let socket = io();
socket.on('connect', function() {
    console.info('Connected to server socket');
});
socket.on('disconnect', function() {
    console.info('DisConnected from server socket');
});

socket.on('newMessage', function(message){
    console.info('New Message: ', message);
});

