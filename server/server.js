const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./util/message');
const {isRealString} = require('./util/validation');
const {Users} = require('./util/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

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

  socket.on('join', (params, callback) => {
   if (!isRealString(params.name) || !isRealString(params.room)){
    return callback('Name and room name are required.');
   }

   socket.join(params.room);
   users.removeUser(socket.id);
   users.addUser(socket.id, params.name, params.room);

   io.to(params.room).emit('updateUserList', users.getUserList(params.room));


   //socket.leave('room name');

   //io.emit() => io.to('room name').emit();
   //io.broadcast.emit() => io.broadcast.to('room name').emit();
   //socket.emit()

   socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))

   socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))


   callback();
  })

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
    callback();
  })

  socket.on('createLocation', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');

    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  })

   
}
)



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})