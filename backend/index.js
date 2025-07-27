import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

//Port setup
const PORT = process.env.PORT || 5001;

// Connect to the database
connectDB();


const app = express();

// creating a serevr 
const server = http.createServer(app);

// creating a socket
const io = new Server(server, {
  cors: {
    origin: '*',    // change later to frontend URL
    methods: ['GET', 'POST'],
  },
});


//middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Error Handling Middleware ---
// (We will implement this fully later)
// app.use(notFound);
// app.use(errorHandler);

// ---------------- Socket.io ----------------
io.on('connection', (socket) => {
    console.log(`a user connected : ${socket.id}`);

     socket.on('sendMessage', (data) => {
    console.log('Message received:', data);
    io.to(data.conversationId).emit('newMessage', data);
  });

  // The 'disconnect' event fires when that specific client closes their connection.
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});