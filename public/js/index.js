var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('createEmail', {
    //     to: 'abc@gmail.com',
    //     text: 'Hello Boss'
    // });

    // socket.emit('createMessage', {
    //     from: 'clientMachine',
    //     message: 'test',
    // });
})

socket.on('newEmail', function (email) {
    console.log('New Email', email);
});

socket.on('newMessage', function (message) {
    console.log('New Message from server ',message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);

});

// socket.emit('createMessage', {
//     from: 'Abhi',
//     text: 'Hello'
// }, function (data) {
//   console.log('Got it', data);
// });

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function (e) {
 e.preventDefault();

 socket.emit('createMessage', {
     from: 'User',
     text: jQuery('[name=message]').val()
 }, function () {

 })

});

