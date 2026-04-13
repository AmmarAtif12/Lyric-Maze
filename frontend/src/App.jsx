import React, { useState, useCallback } from 'react';
import Auth from './components/Auth';
import ArtistSetup from './components/ArtistSetup';
import MazeGame from './components/MazeGame';
import Leaderboard from './components/Leaderboard';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [user, setUser] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const handleAuth = useCallback((userData) => {
    setUser(userData);
    setCurrentScreen('setup');
  }, []);

  const handleStartGame = useCallback((artists) => {
    setSelectedArtists(artists);
    setCurrentScreen('game');
  }, []);

  const handleGameOver = useCallback(() => {
    setCurrentScreen('leaderboard');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCurrentScreen('setup');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // sign-out is best-effort
    }
    setUser(null);
    setSelectedArtists([]);
    setCurrentScreen('auth');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <Auth onAuth={handleAuth} />;
      case 'setup':
        return <ArtistSetup onStartGame={handleStartGame} />;
      case 'game':
        return (
          <MazeGame
            user={user}
            artists={selectedArtists}
            onGameOver={handleGameOver}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard
            user={user}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return <Auth onAuth={handleAuth} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🎵 Lyric Maze 🎵</h1>
        {user && (
          <div className="header-controls">
            <span className="user-name">{user.email}</span>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="app-main">{renderScreen()}</main>
    </div>
  );
}
