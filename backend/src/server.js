import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
// import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

// Connect to the database
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Config Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/fields', fieldRoutes);
// app.use('/api/teams', teamRoutes);

// Socket logic
io.on('connection', (socket) => {
  console.log(`User connected to socket: ${socket.id}`);
  socket.on('join_team', (teamId) => {
    socket.join(teamId);
    console.log(`User ${socket.id} joined team: ${teamId}`);
  });
  socket.on('send_message', (data) => {
    io.to(data.teamId).emit('receive_message', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected from socket');
  });
});

app.set('socketio', io);

// Test route
app.get('/', (req, res) => {
  res.send('Futbol Project Backend is running');
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});