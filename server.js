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
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Global state (full app state synced across all clients)
let globalState = {
  profiles: {},
  activeProfileId: "default",
  activeQuestion: null,
  showAnswer: false,
  answerText: "",
  lastUpdated: Date.now()
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Total clients:', io.engine.clientsCount);

  // Send current full state to new connection
  socket.emit('stateUpdate', globalState);
  
  // Broadcast current client count
  io.emit('clientCount', io.engine.clientsCount);

  // Handle full state updates from clients
  socket.on('updateState', (newState) => {
    // Merge new state with global state
    globalState = { 
      ...globalState, 
      ...newState,
      lastUpdated: Date.now()
    };
    
    console.log('State updated:', {
      activeQuestion: globalState.activeQuestion,
      showAnswer: globalState.showAnswer,
      activeProfileId: globalState.activeProfileId
    });
    
    // Broadcast to ALL clients (including sender)
    io.emit('stateUpdate', globalState);
  });

  // Handle request for current state
  socket.on('requestState', () => {
    socket.emit('stateUpdate', globalState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    console.log('Total clients:', io.engine.clientsCount);
    
    // Broadcast updated client count
    io.emit('clientCount', io.engine.clientsCount);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', socket.id, error);
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
  console.log('✅ Full state sync enabled');
  console.log('✅ Reconnection support active');
});
