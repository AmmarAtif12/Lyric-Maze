import React, { useState, useEffect, useCallback } from 'react';
import '../styles/LyricQuiz.css';

const TIMED_OUT = '__TIMED_OUT__';

export default function LyricQuiz({ question, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const handleAnswer = useCallback(
    (answer) => {
      if (showResult) return;
      const timedOut = answer === TIMED_OUT;
      setSelectedAnswer(timedOut ? null : answer);
      setShowResult(true);

      const isCorrect = !timedOut && answer === question.correctAnswer;

      setTimeout(() => {
        onAnswer({
          correct: isCorrect,
          selectedAnswer: timedOut ? null : answer,
          correctAnswer: question.correctAnswer,
        });
      }, 1500);
    },
    [showResult, question, onAnswer]
  );

  // Countdown timer – auto-submit wrong when time runs out
  useEffect(() => {
    if (showResult) return;

    if (timeLeft <= 0) {
      handleAnswer(TIMED_OUT);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, handleAnswer]);

  const getButtonClass = (option) => {
    if (!showResult) return 'quiz-option';
    if (option === question.correctAnswer) return 'quiz-option correct';
    if (option === selectedAnswer && option !== question.correctAnswer)
      return 'quiz-option wrong';
    return 'quiz-option';
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        <h3 className="quiz-heading">🎶 Name That Song! 🎶</h3>

        <div className="quiz-timer-bar">
          <div
            className="quiz-timer-fill"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>
        <p className="quiz-timer-text">{timeLeft}s</p>

        <div className="quiz-lyric-box">
          {question.lyrics.map((line, i) => (
            <p key={i} className="quiz-lyric-line">
              {line}
            </p>
          ))}
        </div>

        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option}
              className={getButtonClass(option)}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <p className="quiz-result">
            {selectedAnswer === question.correctAnswer
              ? '✅ Correct! Keep moving!'
              : selectedAnswer === null
                ? `⏰ Time's up! The answer was: ${question.correctAnswer}`
                : `❌ Wrong! The answer was: ${question.correctAnswer}`}
          </p>
        )}
      </div>
    </div>
  );
}
