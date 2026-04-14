/**
 * Core game-logic helpers.
 */

export function calculateScore(basePoints, comboMultiplier) {
  return Math.round(basePoints * Math.max(comboMultiplier, 1));
}

export function updateCombo(currentCombo, isCorrect) {
  return isCorrect ? currentCombo + 1 : 0;
}

export function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Fisher-Yates shuffle (returns a new array). */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a set of quiz options containing the correct answer and
 * (numOptions - 1) randomly selected wrong answers.
 */
export function generateQuizOptions(correctSong, allSongs, numOptions = 4) {
  const wrong = allSongs.filter((s) => s !== correctSong);
  const shuffled = shuffleArray(wrong);
  const options = [correctSong, ...shuffled.slice(0, numOptions - 1)];
  return shuffleArray(options);
}
