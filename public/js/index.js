let socket = io();
let messagesDom = $('#messages');

socket.on('connect', function() {
    console.info('Connected to server socket');
});
socket.on('disconnect', function() {
    console.info('DisConnected from server socket');
});

socket.on('newMessage', function(message){
    renderNewMessage(message);
});

$('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function(message){
        console.info(message);
    });
});

function renderNewMessage(message) {
    var newMessage = $('<li></li>');
    newMessage.text(`${message.from}: ${message.text}`);
    messagesDom.append(newMessage);
}

