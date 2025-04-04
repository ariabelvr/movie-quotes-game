# Movie Quotes Game - Build Documentation

## Overview
The Movie Quotes Game is a Twitch chat game that displays famous movie quotes for viewers to guess. The game operates entirely through Twitch chat, with the notifications system only being used for system events (joins, follows, subscribes).

## Project Structure
```
movie-quotes/
├── src/
│   ├── game/              # Game logic and data
│   │   ├── movieQuotes.ts # Game class and interfaces
│   │   └── quotes.ts      # Movie quotes database
│   ├── components/        # React components
│   │   ├── Leaderboard.tsx # Leaderboard display component
│   │   └── GameStatus.tsx  # Game status component
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
   TWITCH_CHANNEL_NAME=your_channel_name
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

The Movie Quotes Game uses the notifications system only for system events:
1. Service registration
2. System status updates
3. Connection status

Game-related messages are delivered exclusively through Twitch chat.

## Game Commands

### Chat Commands
- `!qc` - Start a new quote challenge (displays quote in chat)
- `!guess <movie>` - Submit a guess for the current quote (results shown in chat)

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
1. Share the same WebSocket server for system events
2. Use the same styling theme for the leaderboard
3. Maintain separate game logic

## Troubleshooting

Common issues and solutions:
1. **Chat Message Issues**
   - Verify Twitch credentials
   - Check bot permissions in channel
   - Ensure correct channel name in environment

2. **Game Not Starting**
   - Verify Twitch credentials
   - Check game cooldown period
   - Ensure bot is connected to chat

3. **Styling Issues**
   - Ensure CSS is properly imported
   - Verify theme variables are set

## Future Enhancements

Potential improvements:
1. Score tracking system
2. Leaderboard display
3. Custom quote submission
4. Difficulty levels
5. Hint system 