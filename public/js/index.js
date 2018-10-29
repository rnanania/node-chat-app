let socket = io();
let messagesDom = $('#messages');
let messageInput = $('[name=message]');
let locationButton = $('#send-location');

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
    var formattedtime = moment().format('h:mm a');
    var newMessage = $('<li></li>');
    newMessage.text(`${message.from} ${formattedtime}: ${message.text}`);
    messagesDom.append(newMessage);
}

function renderNewLocationMessage(message) {
    var formattedtime = moment().format('h:mm a');
    var newMessage = $(`<li>${message.from} ${formattedtime}: <a target="_blank" href="${message.url}">My Location</a</li>`);
    messagesDom.append(newMessage);
}

function disableLocationButton() {
    locationButton.attr('disabled', 'disabled').text('Sending location...')
}

function enableLocationButton(){
    locationButton.removeAttr('disabled').text('Send location');
}

function createNewMessage(text) {
    socket.emit('createMessage', {
        from: 'User',
        text: text
    }, function(message){
        messageInput.val('');
    });
}

function createNewLocationMessage(latitude, longitude) {
    socket.emit('createLocationMessage', {
        latitude,
        longitude
    });
    enableLocationButton();
}

$('#message-form').on('submit', function(e){
    e.preventDefault();
    createNewMessage(messageInput.val());
});

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    disableLocationButton();

    navigator.geolocation.getCurrentPosition(function(position){
        createNewLocationMessage(position.coords.latitude, position.coords.longitude);
    }, function(error){
        alert('Unable to fetch location.');
    });
});

