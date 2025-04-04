import { MovieQuote, movieQuotes } from './quotes';
import { io as ioClient } from 'socket.io-client';

interface GameState {
  isActive: boolean;
  currentQuote: MovieQuote | null;
  startTime: Date | null;
  attempts: number;
}

interface GameResult {
  success: boolean;
  message?: string;
  quote?: MovieQuote;
  correct?: boolean;
}

export class MovieQuoteGame {
  private quotes: MovieQuote[];
  private state: GameState;
  private cooldownPeriod: number = 300000; // 5 minutes in milliseconds
  private notificationsSocket: any;
  private currentQuote: MovieQuote | null = null;
  private scores: Map<string, number> = new Map();

  constructor(quotes: MovieQuote[]) {
    this.quotes = quotes;
    this.state = {
      isActive: false,
      currentQuote: null,
      startTime: null,
      attempts: 0
    };

    // Initialize notifications socket
    this.notificationsSocket = ioClient('https://twitch.introvrtlounge.com', {
      transports: ['websocket', 'polling'],
      path: '/socket.io',
      withCredentials: true
    });
  }

  public startGame(): GameResult {
    if (this.currentQuote) {
      return { success: false, message: 'A game is already in progress!' };
    }

    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[randomIndex];

    // Update game state
    this.state = {
      isActive: true,
      currentQuote: this.currentQuote,
      startTime: new Date(),
      attempts: 0
    };

    // Send notification about game start
    this.notificationsSocket.emit('notification', {
      type: 'game',
      message: '🎬 Movie Quote Challenge Started!',
      quote: this.currentQuote.movie,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      quote: this.currentQuote
    };
  }

  public makeGuess(guess: string, player: string): GameResult {
    if (!this.currentQuote) {
      return { success: false, correct: false, message: 'No game in progress!' };
    }

    this.state.attempts++;

    // Normalize the guess for comparison
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = this.currentQuote.movie.toLowerCase().trim();

    const isCorrect = normalizedGuess === normalizedAnswer;

    if (isCorrect) {
      // Update the player's score using their username
      const currentScore = this.scores.get(player) || 0;
      this.scores.set(player, currentScore + 1);
      
      // Store the current quote before clearing it
      const correctQuote = this.currentQuote;
      this.currentQuote = null; // End the game

      // Send notification about the guess result
      this.notificationsSocket.emit('notification', {
        type: 'game',
        message: '🎬 Correct guess!',
        correct: true,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        correct: true,
        message: `Correct! The movie was "${correctQuote.movie}" (${correctQuote.year})`
      };
    }

    // Send notification about the guess result
    this.notificationsSocket.emit('notification', {
      type: 'game',
      message: '❌ Incorrect guess',
      correct: false,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      correct: false,
      message: 'Incorrect guess, try again!'
    };
  }

  public getCurrentState(): GameState {
    return { ...this.state };
  }

  public endGame(): void {
    this.state = {
      isActive: false,
      currentQuote: null,
      startTime: this.state.startTime,
      attempts: this.state.attempts
    };
  }

  public getLeaderboard(): { player: string; score: number }[] {
    console.log('Getting leaderboard, current scores:', Array.from(this.scores.entries()));
    // Convert the scores map to an array of {player, score} objects
    const leaderboard = Array.from(this.scores.entries())
      .map(([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score); // Sort by score in descending order
    
    console.log('Generated leaderboard:', leaderboard);
    return leaderboard;
  }
} 