function shortestLandPath(grid) {
  const n = grid.length;
  const m = grid[0].length;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

  const queue = [];
  const visited = Array.from({ length: n }, () => new Array(m).fill(false));
  const parent = {}; // "r,c" -> [pr, pc] to backtrack the path

  // Multi-source: every land cell in the TOP row is a start
  for (let c = 0; c < m; c++) {
    if (grid[0][c] === 1) {
      queue.push([0, c]);
      visited[0][c] = true;
      parent[`0,${c}`] = null; // a start cell has no parent
    }
  }

  let head = 0;
  let endCell = null;

  while (head < queue.length) {
    const [r, c] = queue[head++];

    if (r === n - 1) {        // reached the bottom row → shortest (BFS)
      endCell = [r, c];
      break;
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < n && nc >= 0 && nc < m &&
        grid[nr][nc] === 1 && !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        parent[`${nr},${nc}`] = [r, c];   // remember how we got here
        queue.push([nr, nc]);
      }
    }
  }

  // Build the output grid (all zeros), then walk the parent chain back
  const output = Array.from({ length: n }, () => new Array(m).fill(0));
  if (!endCell) return output; // no path exists

  let cur = endCell;
  while (cur) {
    const [r, c] = cur;
    output[r][c] = 1;
    cur = parent[`${r},${c}`];
  }
  return output;
}

const show = (g) => g.map((r) => r.join(" ")).join("\n");

// Test 1: straight vertical path exists
const g1 = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];
console.log("Test 1:\n" + show(shortestLandPath(g1)) + "\n");

// Test 2: zig-zag — only connected land route reaches the bottom
const g2 = [
  [1, 1, 0],
  [0, 1, 0],
  [0, 1, 1],
];
console.log("Test 2:\n" + show(shortestLandPath(g2)) + "\n");

// Test 3: no path (bottom row unreachable) -> all zeros
const g3 = [
  [1, 0],
  [0, 0],
  [0, 1],
];
console.log("Test 3:\n" + show(shortestLandPath(g3)) + "\n");