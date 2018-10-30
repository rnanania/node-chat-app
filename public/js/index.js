var socket = io();
var messagesDom = $('#messages');
var messageInput = $('[name=message]');
var locationButton = $('#send-location');


// Mustache templates to render dynamic template and inject values easily.
var messageTemplate = $("#message-template").html();
var locationMessageTemplate = $("#location-message-template").html();

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

function scrollToBottom() {
    var clientHeight = messagesDom.prop('clientHeight');
    var scrollTop = messagesDom.prop('scrollTop');
    var scrollHeight = messagesDom.prop('scrollHeight');

    if(scrollHeight > (clientHeight + scrollTop)){
        messagesDom.animate({ scrollTop: scrollHeight - clientHeight }, 500);
    }
}

function renderNewMessage(message) {
    var formattedTime = moment().format('h:mm a');
    //var newMessage = $('<li></li>');
    //newMessage.text(`${message.from} ${formattedtime}: ${message.text}`);
    var newMessage = Mustache.render(messageTemplate, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    messagesDom.append(newMessage);
    scrollToBottom(); 
}

function renderNewLocationMessage(message) {
    var formattedTime = moment().format('h:mm a');
    //var newMessage = $(`<li>${message.from} ${formattedtime}: <a target="_blank" href="${message.url}">My Location</a</li>`);
    var newMessage = Mustache.render(locationMessageTemplate, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    messagesDom.append(newMessage);
    scrollToBottom();
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

