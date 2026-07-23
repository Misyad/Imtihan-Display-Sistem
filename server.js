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
  const timestamp = () => new Date().toLocaleTimeString();
  console.log(`\x1b[32m[INFO]\x1b[0m ${timestamp()} - Socket client connected: ${socket.id}`);

  // Send current state to new connection
  try {
    socket.emit('stateUpdate', gameState);
  } catch (error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Failed to emit initial state update:`, error);
  }

  // Handle state updates from clients
  socket.on('updateState', (newState) => {
    try {
      if (!newState) {
        throw new Error("Received empty or invalid state update");
      }
      gameState = { ...gameState, ...newState };
      // Broadcast to everyone else
      socket.broadcast.emit('stateUpdate', gameState);
    } catch (error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Error handling updateState for ${socket.id}:`, error);
      socket.emit('error', { message: 'Gagal memperbarui status sinkronisasi game.' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`\x1b[33m[WARN]\x1b[0m ${timestamp()} - Socket client disconnected: ${socket.id} (${reason})`);
  });

  socket.on('error', (error) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Socket error on client ${socket.id}:`, error);
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
