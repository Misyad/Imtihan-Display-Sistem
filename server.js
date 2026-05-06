const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let gameState = {
  activeQuestion: null,
  usedQuestions: [],
  showAnswer: false,
  answerText: "MUMTAZ (ISTIMEWA)"
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current state to new connection
  socket.emit('stateUpdate', gameState);

  // Handle state updates from clients
  socket.on('updateState', (newState) => {
    gameState = { ...gameState, ...newState };
    // Broadcast to everyone else
    socket.broadcast.emit('stateUpdate', gameState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('-------------------------------------------');
  console.log(`🚀 Socket.IO server running:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://${ip}:${PORT}`);
  console.log('-------------------------------------------');
});
