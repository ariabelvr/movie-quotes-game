import { MovieQuoteGame } from '../game/movieQuotes';
import { movieQuotes } from '../game/quotes';
import { io as ioClient } from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn()
  }))
}));

describe('Movie Quotes Game', () => {
  let game: MovieQuoteGame;
  let mockSocket: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a new mock socket
    mockSocket = ioClient();
    
    // Create a new game instance
    game = new MovieQuoteGame(movieQuotes);
    
    // Mock the notifications socket in the game instance
    (game as any).notificationsSocket = mockSocket;
  });

  test('should start a new game with !qc command', () => {
    const result = game.startGame();
    expect(result.success).toBe(true);
    expect(result.quote).toBeDefined();
    expect(result.quote?.quote).toBeDefined();
    expect(result.quote?.movie).toBeDefined();
  });

  test('should handle correct guess', () => {
    // Start a game
    const startResult = game.startGame();
    expect(startResult.success).toBe(true);
    expect(startResult.quote).toBeDefined();

    // Make a correct guess
    const guessResult = game.makeGuess(startResult.quote!.movie);
    expect(guessResult.success).toBe(true);
    expect(guessResult.correct).toBe(true);
  });

  test('should handle incorrect guess', () => {
    // Start a game
    const startResult = game.startGame();
    expect(startResult.success).toBe(true);
    expect(startResult.quote).toBeDefined();

    // Make an incorrect guess
    const guessResult = game.makeGuess('Wrong Movie Title');
    expect(guessResult.success).toBe(true);
    expect(guessResult.correct).toBe(false);
  });

  test('should emit notifications for game events', () => {
    // Start a game
    const result = game.startGame();
    expect(result.success).toBe(true);
    expect(result.quote).toBeDefined();

    // Verify that a notification was emitted
    expect(mockSocket.emit).toHaveBeenCalledWith('notification', expect.objectContaining({
      type: 'game',
      message: expect.any(String),
      timestamp: expect.any(String)
    }));
  });
}); 