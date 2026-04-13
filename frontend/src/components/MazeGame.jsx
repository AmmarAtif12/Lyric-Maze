import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { generateMaze } from '../utils/mazeGenerator';
import { canMove, getNewPosition, pushBack } from '../utils/collisionDetection';
import {
  calculateScore,
  updateCombo,
  getRandomInterval,
  shuffleArray,
} from '../utils/gameLogic';
import { fetchQuizQuestion, saveScore } from '../utils/api';
import LyricQuiz from './LyricQuiz';
import '../styles/MazeGame.css';

const TILE_SIZE = 24;
const MAZE_WIDTH = 15;
const MAZE_HEIGHT = 15;
const PUSHBACK_STEPS = 5;
const QUIZ_MIN_INTERVAL = 30;
const QUIZ_MAX_INTERVAL = 90;

// Placeholder questions used when the backend is not available
const PLACEHOLDER_SONGS = [
  'Sunset Dreams',
  'Neon Nights',
  'Starlight Avenue',
  'Pixel Hearts',
  'Midnight Code',
  'Retrowave',
  'Electric Pulse',
  'Crystal Skies',
];

function makePlaceholderQuestion() {
  const correct =
    PLACEHOLDER_SONGS[Math.floor(Math.random() * PLACEHOLDER_SONGS.length)];
  const options = shuffleArray(
    [correct, ...shuffleArray(PLACEHOLDER_SONGS.filter((s) => s !== correct)).slice(0, 3)]
  );
  return {
    lyrics: [
      '♪ Placeholder lyric line one ♪',
      '♪ Placeholder lyric line two ♪',
      '♪ Placeholder lyric line three ♪',
      '♪ Placeholder lyric line four ♪',
    ],
    correctAnswer: correct,
    options,
  };
}

export default function MazeGame({ user, artists, onGameOver }) {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const sceneRef = useRef(null);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing | quiz | paused | gameOver
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [penalty, setPenalty] = useState(false);

  // Stable refs so the Phaser scene can always read latest React state
  const stateRef = useRef({ gameState: 'playing', combo: 0, score: 0 });
  useEffect(() => {
    stateRef.current = { gameState, combo, score };
  }, [gameState, combo, score]);

  // ---- Quiz trigger timer ----
  const quizTimerRef = useRef(null);

  const scheduleQuiz = useCallback(() => {
    clearTimeout(quizTimerRef.current);
    const delay = getRandomInterval(QUIZ_MIN_INTERVAL, QUIZ_MAX_INTERVAL) * 1000;
    quizTimerRef.current = setTimeout(async () => {
      if (stateRef.current.gameState !== 'playing') {
        scheduleQuiz();
        return;
      }

      let question;
      try {
        const artist = artists[Math.floor(Math.random() * artists.length)];
        const res = await fetchQuizQuestion(artist);
        question = res.data;
      } catch {
        question = makePlaceholderQuestion();
      }
      setQuizQuestion(question);
      setGameState('quiz');
    }, delay);
  }, [artists]);

  // ---- Handle quiz answer ----
  const handleQuizAnswer = useCallback(
    (result) => {
      if (result.correct) {
        const newCombo = updateCombo(combo, true);
        const points = calculateScore(100, newCombo);
        setCombo(newCombo);
        setScore((s) => s + points);
      } else {
        setCombo(updateCombo(combo, false));

        // Push player back via the Phaser scene
        if (sceneRef.current) {
          const maze = sceneRef.current.mazeData;
          const curPos = sceneRef.current.playerGridPos;
          const newPos = pushBack(maze.grid, curPos, PUSHBACK_STEPS);
          sceneRef.current.movePlayerTo(newPos.x, newPos.y);
          setPlayerPos(newPos);
        }

        // Visual penalty flash
        setPenalty(true);
        setTimeout(() => setPenalty(false), 600);
      }

      setQuizQuestion(null);
      setGameState('playing');
      scheduleQuiz();
    },
    [combo, scheduleQuiz]
  );

  // ---- Phaser lifecycle ----
  useEffect(() => {
    if (phaserGameRef.current) return;

    const mazeData = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);

    class MazeScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MazeScene' });
        this.mazeData = mazeData;
        this.playerGridPos = { ...mazeData.start };
        this.moveDelay = 0;
      }

      create() {
        this.graphics = this.add.graphics();
        this.drawMaze();

        // Player square
        this.player = this.add.rectangle(
          this.playerGridPos.x * TILE_SIZE + TILE_SIZE / 2,
          this.playerGridPos.y * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE - 4,
          TILE_SIZE - 4,
          0x00ffff
        );

        // End-goal marker
        this.add.rectangle(
          mazeData.end.x * TILE_SIZE + TILE_SIZE / 2,
          mazeData.end.y * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE - 4,
          TILE_SIZE - 4,
          0x00ff66
        ).setAlpha(0.6);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Penalty flash overlay
        this.penaltyOverlay = this.add.rectangle(
          (mazeData.grid[0].length * TILE_SIZE) / 2,
          (mazeData.grid.length * TILE_SIZE) / 2,
          mazeData.grid[0].length * TILE_SIZE,
          mazeData.grid.length * TILE_SIZE,
          0xff0000
        ).setAlpha(0).setDepth(10);
      }

      drawMaze() {
        const { grid } = this.mazeData;
        for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[0].length; col++) {
            const color = grid[row][col] === 1 ? 0x1a1a2e : 0x16213e;
            this.graphics.fillStyle(color, 1);
            this.graphics.fillRect(
              col * TILE_SIZE,
              row * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          }
        }
      }

      update(time) {
        if (stateRef.current.gameState !== 'playing') return;

        if (time < this.moveDelay) return;

        let direction = null;
        if (this.cursors.up.isDown) direction = 'up';
        else if (this.cursors.down.isDown) direction = 'down';
        else if (this.cursors.left.isDown) direction = 'left';
        else if (this.cursors.right.isDown) direction = 'right';

        if (direction && canMove(this.mazeData.grid, this.playerGridPos, direction)) {
          const newPos = getNewPosition(this.playerGridPos, direction);
          this.playerGridPos = newPos;
          this.player.setPosition(
            newPos.x * TILE_SIZE + TILE_SIZE / 2,
            newPos.y * TILE_SIZE + TILE_SIZE / 2
          );
          setPlayerPos(newPos);
          this.moveDelay = time + 120;

          // Check win condition
          if (
            newPos.x === this.mazeData.end.x &&
            newPos.y === this.mazeData.end.y
          ) {
            this.handleWin();
          }
        }
      }

      handleWin() {
        setGameState('gameOver');
        clearTimeout(quizTimerRef.current);

        const finalScore = stateRef.current.score + 500; // bonus for finishing
        setScore(finalScore);

        try {
          saveScore({
            userId: user?.uid ?? 'anonymous',
            playerName: user?.email ?? 'Anonymous',
            score: finalScore,
            correctAnswers: stateRef.current.combo,
          });
        } catch {
          // best-effort save
        }

        setTimeout(() => onGameOver(), 2000);
      }

      movePlayerTo(gx, gy) {
        this.playerGridPos = { x: gx, y: gy };
        this.player.setPosition(
          gx * TILE_SIZE + TILE_SIZE / 2,
          gy * TILE_SIZE + TILE_SIZE / 2
        );

        // Flash penalty overlay
        this.penaltyOverlay.setAlpha(0.4);
        this.tweens.add({
          targets: this.penaltyOverlay,
          alpha: 0,
          duration: 600,
          ease: 'Power2',
        });
      }

      flashPenalty() {
        this.penaltyOverlay.setAlpha(0.4);
        this.tweens.add({
          targets: this.penaltyOverlay,
          alpha: 0,
          duration: 600,
          ease: 'Power2',
        });
      }
    }

    const canvasWidth = mazeData.grid[0].length * TILE_SIZE;
    const canvasHeight = mazeData.grid.length * TILE_SIZE;

    const config = {
      type: Phaser.AUTO,
      width: canvasWidth,
      height: canvasHeight,
      parent: gameContainerRef.current,
      backgroundColor: '#0a0a0a',
      scene: MazeScene,
      physics: { default: 'arcade' },
      input: { keyboard: true },
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    // Store a reference to the scene once it's ready
    game.events.on('ready', () => {
      sceneRef.current = game.scene.getScene('MazeScene');
    });

    scheduleQuiz();

    return () => {
      clearTimeout(quizTimerRef.current);
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty – Phaser must only initialise once per mount.
  // State is read via stateRef so the scene always sees latest values.

  return (
    <div className={`maze-game-wrapper ${penalty ? 'penalty-flash' : ''}`}>
      {/* HUD */}
      <div className="maze-hud">
        <span className="hud-item">Score: {score}</span>
        <span className="hud-item combo">
          Combo: x{combo}{combo >= 3 ? ' 🔥' : ''}
        </span>
        <span className="hud-item">
          Pos: ({playerPos.x}, {playerPos.y})
        </span>
      </div>

      {/* Phaser canvas container */}
      <div ref={gameContainerRef} className="maze-canvas-container" />

      {/* Quiz overlay */}
      {gameState === 'quiz' && quizQuestion && (
        <LyricQuiz question={quizQuestion} onAnswer={handleQuizAnswer} />
      )}

      {/* Game-over overlay */}
      {gameState === 'gameOver' && (
        <div className="game-over-overlay">
          <h2>🎉 You escaped the maze! 🎉</h2>
          <p>Final Score: {score}</p>
        </div>
      )}
    </div>
  );
}
