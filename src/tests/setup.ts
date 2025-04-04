import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set default environment variables for testing
process.env.TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || 'test_client_id';
process.env.TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN || 'test_access_token';
process.env.TWITCH_CHANNEL = process.env.TWITCH_CHANNEL || 'test_channel';
process.env.TWITCH_CHANNEL_ID = process.env.TWITCH_CHANNEL_ID || 'test_channel_id';

// Increase timeout for all tests
jest.setTimeout(10000); 