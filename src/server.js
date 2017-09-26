const http = require('http');

const fs = require('fs');

const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`listening on 127.0.0.1: ${port}`);

const io = socketio(app);
let points = 0;

const onJoined = (sock) => {
  const socket = sock;
  socket.join('room');

  socket.on('pointTick', (data) => {
    points += data.points;
    const msgData = {
      message: points,
    };
    io.sockets.in('room').emit('pointTick', msgData);
  });
};

io.sockets.on('connection', (sock) => {
  onJoined(sock);
});

io.sockets.on('disconnect', (sock) => {
  sock.leave('room');
});

