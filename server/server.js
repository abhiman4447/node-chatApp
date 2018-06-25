const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./util/message');

const publicPath = path.join(__dirname, '../public');

var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))
  
//   socket.broadcast.emit('newMessage', {
//     from: 'Admin',
//     message: 'Welcome to the chat app!'
//   })

//   socket.emit('newEmail', {
//       from: 'abhi4039@gmail.com',
//       text: 'Hey, This is test mail',
//       createdAt: 123
//   });

//   socket.emit('newMessage', {
//     from: 'serverMachine',  
//     message: 'Hi gudmrng',
//     createdAt: 2222
//   })

  socket.on('createEmail', (newEmail) => {
      console.log('createEmail', newEmail);
  })

  socket.on('createMessage', (newMessage, callback) => {
    console.log('createMessage', newMessage);  
      io.emit('newMessage', {
        from: newMessage.from,
        text: newMessage.text,
        createdAt: new Date().getTime()
      });
    //socket.broadcast.emit('newMessage', generateMessage(newMessage.from, newMessage.message))
    callback('From the server');
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  })

   
}
)



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})