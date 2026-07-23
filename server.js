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
  const timestamp = () => new Date().toLocaleTimeString();
  console.log(`\x1b[32m[INFO]\x1b[0m ${timestamp()} - Socket client connected: ${socket.id}`);
  console.log(`\x1b[32m[INFO]\x1b[0m ${timestamp()} - Total clients: ${io.engine.clientsCount}`);

  // Send current full state to new connection
  try {
    socket.emit('stateUpdate', globalState);
    // Broadcast current client count
    io.emit('clientCount', io.engine.clientsCount);
  } catch (error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Failed to send initial state to ${socket.id}:`, error);
  }

  // Handle full state updates from clients
  socket.on('updateState', (newState) => {
    try {
      if (!newState) {
        throw new Error("Received empty or invalid state update");
      }
      // Merge new state with global state
      globalState = { 
        ...globalState, 
        ...newState,
        lastUpdated: Date.now()
      };
      
      console.log(`\x1b[32m[INFO]\x1b[0m ${timestamp()} - State updated:`, {
        activeQuestion: globalState.activeQuestion,
        showAnswer: globalState.showAnswer,
        activeProfileId: globalState.activeProfileId
      });
      
      // Broadcast to ALL clients (including sender)
      io.emit('stateUpdate', globalState);
    } catch (error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Error handling updateState for ${socket.id}:`, error);
      socket.emit('error', { message: 'Gagal memperbarui status sinkronisasi game.' });
    }
  });

  // Handle request for current state
  socket.on('requestState', () => {
    try {
      socket.emit('stateUpdate', globalState);
    } catch (error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Error handling requestState for ${socket.id}:`, error);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`\x1b[33m[WARN]\x1b[0m ${timestamp()} - Socket client disconnected: ${socket.id} (${reason})`);
    console.log(`\x1b[32m[INFO]\x1b[0m ${timestamp()} - Total clients: ${io.engine.clientsCount}`);
    
    try {
      // Broadcast updated client count
      io.emit('clientCount', io.engine.clientsCount);
    } catch (error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp()} - Error broadcasting clientCount:`, error);
    }
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
  console.log(`?? Socket.IO server running:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://${ip}:${PORT}`);
  console.log('-------------------------------------------');
  console.log('? Full state sync enabled');
  console.log('? Reconnection support active');
});
