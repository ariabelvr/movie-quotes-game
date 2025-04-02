# Movie Quotes Game - Build Documentation

## Overview
The Movie Quotes Game is a Twitch chat game that displays famous movie quotes for viewers to guess. It integrates with the existing notifications system to display quotes and game results in a cyberpunk-themed interface.

## Project Structure
```
movie-quotes/
├── src/
│   ├── game/              # Game logic and data
│   │   ├── movieQuotes.ts # Game class and interfaces
│   │   └── quotes.ts      # Movie quotes database
│   ├── components/        # React components
│   │   ├── Game.tsx       # Main game component
│   │   └── Quote.tsx      # Quote display component
│   ├── styles/           # CSS styles
│   │   └── game.css      # Game-specific styles
│   └── server.ts         # Game server endpoints
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── build-doc.md         # This documentation
```

## Dependencies
- Node.js
- TypeScript
- React
- Socket.IO
- Express
- @twurple/api (for Twitch integration)

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd movie-quotes
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with the following variables:
   ```
   TWITCH_CLIENT_ID=your_client_id
   TWITCH_CLIENT_SECRET=your_client_secret
   TWITCH_ACCESS_TOKEN=your_access_token
   TWITCH_REFRESH_TOKEN=your_refresh_token
   TWITCH_CHANNEL_ID=your_channel_id
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## Integration with Notifications System

The Movie Quotes Game uses the notifications system as a service. It:
1. Connects to the same WebSocket server
2. Uses the notification display system for quotes and results
3. Maintains the cyberpunk theme

### Notification Types
- `game_start`: Displays a new quote challenge
- `game_guess`: Shows correct/incorrect guess results
- `game_end`: Announces the winner

## Game Commands

### Chat Commands
- `!qc` - Start a new quote challenge
- `!guess <movie>` - Submit a guess for the current quote

### API Endpoints
- `POST /game/start` - Start a new game
- `POST /game/guess` - Submit a guess
- `GET /game/status` - Get current game status

## Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Testing**
   ```bash
   npm test
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

## Deployment

The game can be deployed alongside the notifications system. Both services should:
1. Share the same WebSocket server
2. Use the same styling theme
3. Maintain separate game logic

## Troubleshooting

Common issues and solutions:
1. **WebSocket Connection Issues**
   - Verify the notifications server is running
   - Check WebSocket URL configuration

2. **Game Not Starting**
   - Verify Twitch credentials
   - Check game cooldown period

3. **Styling Issues**
   - Ensure CSS is properly imported
   - Verify theme variables are set

## Future Enhancements

Potential improvements:
1. Score tracking system
2. Leaderboard
3. Custom quote submission
4. Difficulty levels
5. Hint system 