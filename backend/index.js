const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let totalnum=0;
let connectedUsers = [];
let pairedUsers = [];

io.on('connection', (socket) => {
  totalnum++;
  io.emit('total_num',totalnum)
  connectedUsers.push(socket);

  const tryPairing = () => {
    if (connectedUsers.length >= 2) {
      const randomIndex1 = Math.floor(Math.random() * connectedUsers.length);
      let user1 = connectedUsers[randomIndex1];
      connectedUsers.splice(randomIndex1, 1);

      const randomIndex2 = Math.floor(Math.random() * connectedUsers.length);
      let user2 = connectedUsers[randomIndex2];
      connectedUsers.splice(randomIndex2, 1);

      pairedUsers.push([user1, user2]);

      user1.emit('paired', user2.id);
      user2.emit('paired', user1.id);

      // Update the message event to only send messages to the paired users
      user1.on('send_message', (data) => {
        user2.emit('recieve_message', data);
      });

      user2.on('send_message', (data) => {
        user1.emit('recieve_message', data);
      });
    }
  };

  tryPairing();

  socket.on('disconnect', () => {
    totalnum--;
    const index = connectedUsers.indexOf(socket);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
      io.emit('total_num',totalnum)
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

server.listen(3001, () => {
  console.log('Server is running at port 3001');
});
