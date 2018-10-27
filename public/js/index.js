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

socket.on('newLocationMessage', function(message){
    renderNewLocationMessage(message);
});

function renderNewMessage(message) {
    var newMessage = $('<li></li>');
    newMessage.text(`${message.from}: ${message.text}`);
    messagesDom.append(newMessage);
}

function renderNewLocationMessage(message) {
    var newMessage = $(`<li>${message.from}: <a target="_blank" href="${message.url}">My Location</a</li>`);
    messagesDom.append(newMessage);
}

function createNewMessage(text) {
    socket.emit('createMessage', {
        from: 'User',
        text: text
    }, function(message){
        console.info(message);
    });
}

function createNewLocationMessage(latitude, longitude) {
    socket.emit('createLocationMessage', {
        latitude,
        longitude
    });
}

$('#message-form').on('submit', function(e){
    e.preventDefault();
    createNewMessage($('[name=message]').val());
});

$('#send-location').on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        createNewLocationMessage(position.coords.latitude, position.coords.longitude);
    }, function(error){
        alert('Unable to fetch location.');
    });
});

