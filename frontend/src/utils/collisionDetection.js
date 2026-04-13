/**
 * Collision detection utilities for the maze grid.
 * Grid values: 0 = path, 1 = wall.
 */

const DIRECTION_MAP = {
  up:    { dx: 0,  dy: -1 },
  down:  { dx: 0,  dy: 1 },
  left:  { dx: -1, dy: 0 },
  right: { dx: 1,  dy: 0 },
};

export function isWall(grid, x, y) {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return true;
  return grid[y][x] === 1;
}

export function getNewPosition(currentPos, direction) {
  const delta = DIRECTION_MAP[direction];
  if (!delta) return { ...currentPos };
  return {
    x: currentPos.x + delta.dx,
    y: currentPos.y + delta.dy,
  };
}

export function canMove(grid, currentPos, direction) {
  const newPos = getNewPosition(currentPos, direction);
  return !isWall(grid, newPos.x, newPos.y);
}

/**
 * Push the player back `steps` cells.
 * Tries the opposite of `lastDirection` first, then falls back to any
 * walkable neighbour.  Stops early if completely boxed in by walls.
 */
export function pushBack(grid, currentPos, steps, lastDirection = 'right') {
  const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
  const opposite = opposites[lastDirection] ?? 'left';

  // Order: opposite of travel first, then remaining directions
  const fallbacks = ['up', 'left', 'down', 'right'].filter((d) => d !== opposite);
  const tryOrder = [opposite, ...fallbacks];

  let pos = { ...currentPos };

  for (let i = 0; i < steps; i++) {
    let moved = false;
    for (const dir of tryOrder) {
      if (canMove(grid, pos, dir)) {
        pos = getNewPosition(pos, dir);
        moved = true;
        break;
      }
    }
    if (!moved) break; // stuck against walls
  }
  return pos;
}
