import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MovieQuoteGame } from '../game/movieQuotes';
import '../styles/game.css';

interface GameProps {
  notificationsUrl: string;
}

const Game: React.FC<GameProps> = ({ notificationsUrl }) => {
  const [game, setGame] = useState<MovieQuoteGame | null>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Connect to the notifications WebSocket server
    const newSocket = io(notificationsUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to notifications server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [notificationsUrl]);

  const startGame = async () => {
    try {
      const response = await fetch('/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const result = await response.json();
      if (result.success) {
        // The notification will be handled by the notifications system
        console.log('Game started:', result.quote);
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const submitGuess = async (user: string, guess: string) => {
    try {
      const response = await fetch('/game/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, guess })
      });

      if (!response.ok) {
        throw new Error('Failed to submit guess');
      }

      const result = await response.json();
      // The notification will be handled by the notifications system
      console.log('Guess result:', result);
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  };

  return (
    <div className="game-container">
      <button onClick={startGame} className="cyber-button">
        Start Quote Challenge
      </button>
    </div>
  );
};

export default Game; 