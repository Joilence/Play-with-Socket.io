const io = require('socket.io');

class IO {
  init(server) {

    this.server = io(server);

    this.server.on('connection', function (socket) {
      let username = socket.handshake.query.username;
      let inRoom = '';
      console.log(username + ' connected.');

      socket.on('join', function (roomId) {
        socket.join(roomId);
        inRoom = roomId;
        console.log(username + ' joined ' + roomId + '.');
      });

      socket.on('leave', function (roomId) {
        socket.leave(roomId);
        inRoom = '';
        console.log(username + ' left ' + roomId + '.');
      });

      socket.on('disconnect', function () {
        console.log(username + ' disconnected.');
      });

      socket.on('msg', function (msg) {
        this.server.to(inRoom).emit('msg', username + ': ' + msg);
      });

      socket.on('emo', function (emo) {
        this.server.to(inRoom).emit('emo', username + '- ' + emo);
      })
    });
  }
}

export default new IO();