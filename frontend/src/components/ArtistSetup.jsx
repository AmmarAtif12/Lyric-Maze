import React, { useState } from 'react';

const SUGGESTIONS = ['The Weeknd', 'Drake', 'Ariana Grande'];

export default function ArtistSetup({ onStartGame }) {
  const [artists, setArtists] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const addArtist = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (artists.length >= 5) {
      setError('Maximum 5 artists allowed.');
      return;
    }
    if (artists.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setError('Artist already added.');
      return;
    }
    setArtists((prev) => [...prev, trimmed]);
    setInputValue('');
    setError('');
  };

  const removeArtist = (index) => {
    setArtists((prev) => prev.filter((_, i) => i !== index));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addArtist(inputValue);
      return;
    }
    if (artists.length < 3) {
      setError('Select at least 3 artists to start.');
      return;
    }
    onStartGame(artists);
  };

  const canStart = artists.length >= 3 && artists.length <= 5;

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2 className="setup-title">Choose Your Artists</h2>
        <p className="setup-subtitle">
          Pick 3–5 artists. You'll be quizzed on their lyrics in the maze!
        </p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type an artist name..."
              disabled={artists.length >= 5}
            />
            <button
              type="button"
              className="btn btn-add"
              onClick={() => addArtist(inputValue)}
              disabled={artists.length >= 5 || !inputValue.trim()}
            >
              + Add
            </button>
          </div>
        </form>

        <div className="suggestions">
          <span className="suggestions-label">Quick add:</span>
          {SUGGESTIONS.filter(
            (s) => !artists.some((a) => a.toLowerCase() === s.toLowerCase())
          ).map((suggestion) => (
            <button
              key={suggestion}
              className="btn btn-suggestion"
              onClick={() => addArtist(suggestion)}
              disabled={artists.length >= 5}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {error && <p className="setup-error">{error}</p>}

        <ul className="artist-list">
          {artists.map((artist, index) => (
            <li key={`${artist}-${index}`} className="artist-item">
              <span className="artist-name">🎤 {artist}</span>
              <button
                className="btn btn-remove"
                onClick={() => removeArtist(index)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <p className="artist-count">
          {artists.length}/5 artists selected
          {artists.length < 3 && ` (need ${3 - artists.length} more)`}
        </p>

        <button
          className="btn btn-start"
          onClick={() => onStartGame(artists)}
          disabled={!canStart}
        >
          {canStart ? '🚀 Start the Maze!' : 'Select more artists'}
        </button>
      </div>
    </div>
  );
}
