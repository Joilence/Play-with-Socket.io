const io = require('socket.io');

export default class IO {
  constructor(server) {
    this.server = io(server);
    let roomInfo = {};

    this.server.on('connection', function (socket) {
      let username = socket.handshake.query.username;
      console.log(username + ' connected.');

      //TODO: auth with cookie or something

      socket.on('join', function (roomId) {
        // add user into room
        if (!roomInfo[roomId]) {
          roomInfo[roomId] = [];
        } else {
          // notify other users in the room
          this.server.to(roomId).emit('system', username + ' join the room.', roomInfo[roomId]);
        }
        roomInfo[roomId].push(username);
        socket.join(roomId);

        console.log(username + ' joined ' + roomId + '.');
      });

      socket.on('leave', function (roomId) {
        let index = roomInfo[roomId].indexOf(username);
        if (index !== -1) {
          roomInfo[roomId].splice(index, 1);
        }
        socket.leave(roomId);
        this.server.to(roomId).emit('system', username + ' left the room.', roomInfo[roomId]);
        console.log(username + ' left ' + roomId + '.');
      });

      socket.on('disconnect', function () {
        //TODO: if the user still in some room?
        console.log(username + ' disconnected.');
      });

      // user send message to the room
      socket.on('msg', function (msg) {
        // auth
        if (roomInfo[roomId].indexOf(user) === -1) {
          return false;
        }
        this.server.to(roomId).emit('msg', username, msg);
      });

      socket.on('emo', function (emo) {
        //TODO: if user in the room
        this.server.to(roomId).emit('emo', username, emo);
      })
    });
  }
}