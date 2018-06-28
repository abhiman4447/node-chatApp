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
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);

});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");  
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from} ${formattedTime}:`);
  a.attr('href', message.url);

  li.append(a);
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

 var messageTextBox = jQuery('[name=message]');

 socket.emit('createMessage', {
     from: 'User',
     text: messageTextBox.val()
 }, function () {
    messageTextBox.val('')
 })
});

var locationButton = jQuery('#sendLocation');
locationButton.on('click', function () {
  if(!navigator.geolocation) {
      return alert('Geolocation not supported by browser');
  }
  
  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
      locationButton.removeAttr('disabled').text('Send Location');
       socket.emit('createLocation', {
       latitude: position.coords.latitude,
       longitude: position.coords.longitude
     });
  }, function () {
      locationButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location');
  })
});

