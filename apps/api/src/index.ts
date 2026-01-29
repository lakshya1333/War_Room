import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { reconRouter } from './routes/recon.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.WEB_URL
    : 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Make io available to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api', reconRouter);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 War Room API running on port ${PORT}`);
});

export { io };
