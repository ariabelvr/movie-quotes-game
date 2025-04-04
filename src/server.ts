import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ChatClient } from '@twurple/chat';
import { io as ioClient } from 'socket.io-client';
import dotenv from 'dotenv';
import { MovieQuoteGame } from './game/movieQuotes';
import { MovieQuote, movieQuotes } from './game/quotes';
import { StaticAuthProvider } from '@twurple/auth';

dotenv.config();

// Initialize game
const quoteGame = new MovieQuoteGame(movieQuotes);

// Connect to notifications WebSocket
const notificationsSocket = ioClient('https://twitch.introvrtlounge.com', {
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  withCredentials: true
});

notificationsSocket.on('connect', () => {
  console.log('Connected to notifications system');
  // Register this service with the notifications system
  notificationsSocket.emit('register', {
    service: 'movie-quotes',
    type: 'game',
    description: 'Movie Quotes Game',
    status: 'ready'
  });
  // Announce that we're ready to play
  notificationsSocket.emit('notification', {
    type: 'system',
    message: '🎬 Movie Quotes Game is ready to play! Use !qc to start a new game.',
    timestamp: new Date().toISOString()
  });
});

notificationsSocket.on('connect_error', (error: Error) => {
  console.error('Failed to connect to notifications system:', error);
});

// Log startup
console.log('Movie Quotes Game service is running');

interface Quote {
  quote: string;
  movie: string;
  year: number;
  character: string;
  difficulty: number;
}

interface GameResult {
  // ... existing code ...
}

async function main() {
  // Create auth provider
  const authProvider = new StaticAuthProvider(
    process.env.TWITCH_CLIENT_ID!,
    process.env.TWITCH_ACCESS_TOKEN!
  );

  // Create chat client
  const chatClient = new ChatClient({ 
    authProvider, 
    channels: [process.env.TWITCH_CHANNEL_NAME!],
    requestMembershipEvents: true,
    isAlwaysMod: true,
    logger: {
      minLevel: 'debug',
      custom: (level, message) => {
        console.log(`[${level}] ${message}`);
      }
    }
  });

  chatClient.onConnect(() => {
    console.log('Successfully connected to Twitch chat');
    console.log('Bot username:', process.env.TWITCH_BOT_USERNAME);
  });

  // Add error handling for chat client
  chatClient.onAuthenticationFailure((message: string) => {
    console.error('Failed to authenticate with Twitch chat:', message);
  });

  chatClient.onDisconnect((manually: boolean, reason?: Error) => {
    console.error(`Disconnected from chat${manually ? ' manually' : ''}${reason ? `: ${reason.message}` : ''}`);
  });

  chatClient.onJoin((channel: string, user: string) => {
    console.log(`Bot joined channel ${channel} as ${user}`);
    if (user === process.env.TWITCH_BOT_USERNAME) {
      console.log('Bot successfully joined with correct username');
      // Send a simple join message
      setTimeout(() => {
        chatClient.say(channel, '🎬 Movie Quotes Game bot is here, let\'s play!')
          .then(() => console.log('Successfully sent join message'))
          .catch((error: Error) => {
            console.error('Failed to send join message:', error);
          });
      }, 2000); // 2 second delay
    }
  });

  // Listen for chat messages
  chatClient.onMessage(async (channel: string, user: string, message: string) => {
    console.log(`Received message from ${user} in ${channel}: ${message}`);
    
    // Add specific debug logging for message type
    if (message.toLowerCase() === '!qc') {
      console.log('DEBUG: Detected !qc command');
    } else if (message.toLowerCase().startsWith('!guess ')) {
      console.log('DEBUG: Detected !guess command');
    } else if (message.toLowerCase() === '!leaderboard') {
      console.log('DEBUG: Detected !leaderboard command');
      console.log('DEBUG: Channel:', channel);
      console.log('DEBUG: User:', user);
    }

    // Handle !qc command
    if (message.toLowerCase() === '!qc') {
      console.log('Processing !qc command');
      const result = quoteGame.startGame();
      if (result.success && result.quote) {
        console.log('Sending quote to chat:', result.quote.quote);
        try {
          await chatClient.say(channel, `🎬 New Movie Quote Challenge! (Difficulty: ${result.quote.difficulty}/5) "${result.quote.quote}"`);
          console.log('Successfully sent quote to chat');
        } catch (error) {
          console.error('Failed to send quote to chat:', error);
          if (error instanceof Error) {
            console.error('Error details:', {
              channel,
              quote: result.quote.quote,
              error: error.message,
              stack: error.stack
            });
          }
        }
      } else {
        console.log('Failed to start game:', result.message);
      }
    }
    
    // Handle !guess command
    if (message.toLowerCase().startsWith('!guess ')) {
      const guess = message.substring(7).trim();
      console.log('Processing guess:', guess);
      const result = quoteGame.makeGuess(guess, user);
      if (result.success) {
        try {
          if (result.correct) {
            await chatClient.say(channel, `🎬 Correct! ${user} guessed the movie!`);
          } else {
            await chatClient.say(channel, `❌ Sorry ${user}, that's not correct. Try again!`);
          }
        } catch (error) {
          console.error('Failed to send guess response:', error);
        }
      }
    }

    // Handle !leaderboard command
    if (message.toLowerCase() === '!leaderboard') {
      console.log('Processing !leaderboard command');
      console.log('Current scores map:', quoteGame.getLeaderboard());
      const leaderboard = quoteGame.getLeaderboard();
      console.log('Leaderboard array:', leaderboard);
      
      if (leaderboard.length === 0) {
        console.log('No scores found, sending empty leaderboard message');
        try {
          await chatClient.say(channel, '🎬 No scores yet! Be the first to guess correctly!');
          console.log('Successfully sent empty leaderboard message');
        } catch (error) {
          console.error('Failed to send leaderboard message:', error);
        }
      } else {
        // Format the leaderboard message
        const topPlayers = leaderboard.slice(0, 5); // Show top 5 players
        console.log('Top players:', topPlayers);
        const leaderboardMessage = topPlayers
          .map((entry, index) => `${index + 1}. ${entry.player}: ${entry.score} correct guesses`)
          .join(' | ');
        
        console.log('Formatted leaderboard message:', leaderboardMessage);
        try {
          await chatClient.say(channel, `🎬 Movie Quotes Leaderboard: ${leaderboardMessage}`);
          console.log('Successfully sent leaderboard message');
        } catch (error) {
          console.error('Failed to send leaderboard message:', error);
        }
      }
    }
  });

  // Connect to chat
  try {
    console.log('Attempting to connect to Twitch chat...');
    console.log('Using channel:', process.env.TWITCH_CHANNEL_NAME);
    await chatClient.connect();
    console.log('Connected to Twitch chat');
  } catch (error) {
    console.error('Failed to connect to Twitch chat:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  }
}

main().catch(console.error);