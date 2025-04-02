import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { MovieQuoteGame } from './game/movieQuotes';
import { movieQuotes } from './game/quotes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://twitch.introvrtlounge.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Initialize game
const quoteGame = new MovieQuoteGame(movieQuotes);

// Game endpoints
app.post('/game/start', (req: Request, res: Response) => {
  const result = quoteGame.startGame();
  if (result.success) {
    // Emit through the notifications system
    io.emit('notification', {
      type: 'game',
      message: '🎬 Movie Quote Challenge Started!',
      quote: result.quote,
      timestamp: new Date().toISOString()
    });
  }
  res.json(result);
});

app.post('/game/guess', (req: Request, res: Response) => {
  const { user, guess } = req.body;
  if (!user || !guess) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing user or guess in request body' 
    });
  }

  const result = quoteGame.makeGuess(guess);
  if (result.success) {
    // Emit through the notifications system
    io.emit('notification', {
      type: 'game',
      message: result.correct 
        ? `🎬 ${user} correctly guessed the movie!` 
        : `❌ ${user}'s guess was incorrect`,
      user,
      correct: result.correct,
      timestamp: new Date().toISOString()
    });
  }
  res.json(result);
});

app.get('/game/status', (req: Request, res: Response) => {
  res.json(quoteGame.getCurrentState());
});

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://twitch.introvrtlounge.com'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Game client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Game client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4501;
httpServer.listen(PORT, () => {
  console.log(`Movie Quotes Game server running on port ${PORT}`);
}); 