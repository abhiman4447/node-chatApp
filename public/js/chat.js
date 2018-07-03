var socket = io();

function scrollToBottom () {
  //selectors
    var messages = jQuery("#messages");
    var newMessage = messages.children('li:last-child')

  //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');

    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
     if (err) {
       alert(err);
       window.location.href = '/';
     } else {
       console.log('No Error');
     }
    });
})

socket.on('newEmail', function (email) {
    console.log('New Email', email);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })

  jQuery('#messages').append(html);

  scrollToBottom();
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

socket.on('updateUserList', function (users) {
 var ol = jQuery('<ol></ol>');

 users.forEach(function (user) {
     ol.append(jQuery('<li></li>').text(user));
 });

 jQuery('#users').html(ol);
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

