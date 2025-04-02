interface MovieQuote {
  quote: string;
  answer: string;
}

interface GameState {
  isActive: boolean;
  currentQuote: MovieQuote | null;
  lastQuoteTime: number;
  cooldownPeriod: number; // in milliseconds
}

const quotes: MovieQuote[] = [
  // ... quotes will be loaded from a separate file
];

class MovieQuoteGame {
  private gameState: GameState = {
    isActive: false,
    currentQuote: null,
    lastQuoteTime: 0,
    cooldownPeriod: 300000, // 5 minutes cooldown
  };

  constructor(quotesData: MovieQuote[]) {
    quotes.push(...quotesData);
  }

  public startGame(): { success: boolean; message: string; quote?: string } {
    if (this.gameState.isActive) {
      return { success: false, message: 'A game is already in progress!' };
    }

    const now = Date.now();
    if (now - this.gameState.lastQuoteTime < this.gameState.cooldownPeriod) {
      const remainingTime = Math.ceil((this.gameState.cooldownPeriod - (now - this.gameState.lastQuoteTime)) / 1000);
      return { 
        success: false, 
        message: `Please wait ${remainingTime} seconds before starting a new game.`
      };
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    this.gameState.currentQuote = quotes[randomIndex];
    this.gameState.isActive = true;
    this.gameState.lastQuoteTime = now;

    return {
      success: true,
      message: 'New quote challenge started!',
      quote: this.gameState.currentQuote.quote
    };
  }

  public makeGuess(guess: string): { success: boolean; message: string; correct: boolean } {
    if (!this.gameState.isActive || !this.gameState.currentQuote) {
      return { 
        success: false, 
        message: 'No active quote challenge!', 
        correct: false 
      };
    }

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = this.gameState.currentQuote.answer.toLowerCase();

    const isCorrect = normalizedGuess === normalizedAnswer;

    if (isCorrect) {
      this.gameState.isActive = false;
      this.gameState.currentQuote = null;
      return {
        success: true,
        message: 'Correct answer!',
        correct: true
      };
    }

    return {
      success: true,
      message: 'Wrong answer, try again!',
      correct: false
    };
  }

  public getCurrentState(): GameState {
    return { ...this.gameState };
  }
}

export { MovieQuoteGame, MovieQuote, GameState }; 