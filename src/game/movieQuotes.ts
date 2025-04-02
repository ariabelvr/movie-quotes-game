import { MovieQuote, movieQuotes } from './quotes';

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

  constructor(quotes: MovieQuote[]) {
    this.quotes = quotes;
    this.state = {
      isActive: false,
      currentQuote: null,
      startTime: null,
      attempts: 0
    };
  }

  public startGame(): GameResult {
    // Check if game is already active
    if (this.state.isActive) {
      return {
        success: false,
        message: 'A game is already in progress'
      };
    }

    // Check cooldown period
    if (this.state.startTime) {
      const timeSinceLastGame = Date.now() - this.state.startTime.getTime();
      if (timeSinceLastGame < this.cooldownPeriod) {
        const remainingTime = Math.ceil((this.cooldownPeriod - timeSinceLastGame) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingTime} seconds before starting a new game`
        };
      }
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];

    // Update game state
    this.state = {
      isActive: true,
      currentQuote: quote,
      startTime: new Date(),
      attempts: 0
    };

    return {
      success: true,
      quote: quote
    };
  }

  public makeGuess(guess: string): GameResult {
    if (!this.state.isActive || !this.state.currentQuote) {
      return {
        success: false,
        message: 'No active game'
      };
    }

    this.state.attempts++;

    // Normalize the guess for comparison
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = this.state.currentQuote.movie.toLowerCase().trim();

    const isCorrect = normalizedGuess === normalizedAnswer;

    if (isCorrect) {
      this.state.isActive = false;
    }

    return {
      success: true,
      correct: isCorrect,
      message: isCorrect 
        ? `Correct! The movie was "${this.state.currentQuote.movie}" (${this.state.currentQuote.year})`
        : 'Incorrect guess, try again!'
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
} 