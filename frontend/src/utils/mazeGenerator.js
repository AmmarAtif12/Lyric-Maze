/**
 * Maze generation using recursive backtracking.
 *
 * The grid uses a cell+wall representation where odd-indexed rows/columns are
 * cells and even-indexed rows/columns are walls.  This gives a (2*w+1) × (2*h+1)
 * output grid where 0 = path and 1 = wall.
 */

export function generateMaze(width, height) {
  const rows = 2 * height + 1;
  const cols = 2 * width + 1;

  // Initialise grid – everything is a wall
  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Helper to mark a cell as path
  const carve = (cx, cy) => {
    grid[cy][cx] = 0;
  };

  // Directions: dx, dy pairs (in cell-space, 1 step = 2 grid positions)
  const directions = [
    [0, -2], // up
    [0, 2],  // down
    [-2, 0], // left
    [2, 0],  // right
  ];

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function recurse(cx, cy) {
    visited[cy][cx] = true;
    carve(cx, cy);

    const dirs = shuffle([...directions]);
    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx > 0 && nx < cols && ny > 0 && ny < rows && !visited[ny][nx]) {
        // Remove wall between current cell and neighbour
        const wallX = cx + dx / 2;
        const wallY = cy + dy / 2;
        grid[wallY][wallX] = 0;

        recurse(nx, ny);
      }
    }
  }

  // Start carving from the top-left cell (1,1)
  recurse(1, 1);

  // Ensure start and end are open paths
  const start = { x: 1, y: 1 };
  const end = { x: cols - 2, y: rows - 2 };
  grid[start.y][start.x] = 0;
  grid[end.y][end.x] = 0;

  return { grid, start, end };
}
