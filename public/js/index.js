var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createEmail', {
        to: 'abc@gmail.com',
        text: 'Hello Boss'
    });

    socket.emit('createMessage', {
        from: 'clientMachine',
        message: 'test',
    });
})

socket.on('newEmail', function (email) {
    console.log('New Email', email);
})

socket.on('newMessage', function (message) {
    console.log('New Message from server ',message);
})

socket.on('disconnect', function () {
    console.log('Disconnected from server');
})

