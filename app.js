const Koa = require('koa');
const session = require('koa-session2');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const Store = require("./store.js");

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
});



app.use(session({
  store: new Store()
}));


// socket io

/* Event list
  - connect
    - create
    - join
      - msg
      - emo
    - leave
  -disconnect
  - system
 */

// const io = require('socket.io')();
//
// var roomInfo = {};
//
// io.on('connection', function (socket) {
//   console.log('unknown user connected.');
//
//   //TODO: auth with cookie or something
//
//   socket.on('join', function (info) {
//     username = info.username;
//     roomId = info.roomId
//
//     // add user into room
//     if (!roomInfo[roomId]) {
//       roomInfo[roomId] = [];
//     } else {
//       // notify other users in the room
//       io.to(roomId).emit('system', username + ' join the room.', roomInfo[roomId]);
//     }
//     roomInfo[roomId].push(username);
//     socket.join(roomId);
//
//     console.log(username + ' joined ' + roomId + '.');
//   });
//
//   socket.on('leave', function (info) {
//     var username = info.username;
//     var roomId = info.roomId;
//
//     let index = roomInfo[roomId].indexOf(username);
//     if (index !== -1) {
//       roomInfo[roomId].splice(index, 1);
//     }
//     socket.leave(roomId);
//     io.to(roomId).emit('system', username + ' left the room.', roomInfo[roomId]);
//     console.log(username + ' left ' + roomId + '.');
//   });
//
//   socket.on('disconnect', function () {
//     //TODO: if the user still in some room?
//     console.log(username + ' disconnected.');
//   });
//
//   // user send message to the room
//   socket.on('msg', function (msg) {
//     // auth
//     if (roomInfo[roomId].indexOf(user) === -1) {
//         return false;
//     }
//     io.to(roomId).emit('msg', username, msg);
//   });
//
//   socket.on('emo', function (emo) {
//     //TODO: if user in the room
//     io.to(roomId).emit('emo', username, emo);
//   })
// });


module.exports = app;