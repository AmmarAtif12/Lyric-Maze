import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../utils/api';

export default function Leaderboard({ user, onPlayAgain }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadScores = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchLeaderboard();
      setScores(res.data ?? res);
    } catch {
      setError('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">🏆 Leaderboard 🏆</h2>

        {loading && <div className="spinner" />}
        {error && <p className="leaderboard-error">{error}</p>}

        {!loading && !error && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Correct</th>
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-scores">
                    No scores yet. Be the first!
                  </td>
                </tr>
              )}
              {scores.map((entry, index) => (
                <tr
                  key={entry.id ?? index}
                  className={
                    user && entry.userId === user.uid
                      ? 'leaderboard-row highlight'
                      : 'leaderboard-row'
                  }
                >
                  <td className="rank">#{index + 1}</td>
                  <td className="player">{entry.playerName ?? 'Anonymous'}</td>
                  <td className="score">{entry.score}</td>
                  <td className="correct">{entry.correctAnswers ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="leaderboard-actions">
          <button className="btn btn-refresh" onClick={loadScores}>
            🔄 Refresh
          </button>
          <button className="btn btn-play-again" onClick={onPlayAgain}>
            🎮 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
