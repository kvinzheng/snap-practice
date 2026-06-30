// (This question is a variation of the LeetCode question 200. Number of Islands. If you haven't completed that question yet, it is recommended to solve it first.)

// You are given a 2D binary grid of size m × n, where each cell is either '0'(water) or '1'(land). An island is defined as a group of connected land cells (1s) where connection is only possible through vertical or horizontal neighbors.

// For each island in the grid, compute:

// The area: the total number of land cells in the island.
// The number of distinct water cells horizontally or vertically adjacent to the island (the water boundary count). A water cell is counted at most once for each island, even if it touches multiple sides of the island. Do not count grid boundaries as water cells.
// Return a list of pairs, where each pair contains the area and the water boundary count for an island. The order of the pairs in the output list does not matter.

// Constraints:

// 1 ≤ m, n ≤ 100
// Each grid[i][j] is either '0' or '1'.
// Example 1:

// Input: grid = [[0, 1, 0], [1, 1, 0], [0, 0, 0]]
// Output: [[3, 5]]
// Explanation: The single island consists of three land cells. The five distinct water cells adjacent to it are located at: (0, 0), (0, 2), (1, 2), (2, 0), and (2, 1). The grid is shown below:

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let island = 0;
  let area = 0;
  const results = [];
  const visited = Array.from({ length: grid.length }, () =>
    Array.from({ length: grid[0].length }, () => null),
  );

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const water = {};
        results.push(dfs(i, j, water));
      }
    }
  }

  function dfs(i, j, water) {
    let result = 0;
    let waterArea = 0;
    let p = 0;
    if (
      i < 0 ||
      j < 0 ||
      i >= grid.length ||
      j >= grid[0].length ||
      visited[i][j]
    ) {
      return [result, waterArea, p];
    }
    if (grid[i][j] === 0) {
      if (!water[`${i}-${j}`]) {
        waterArea += 1;
        water[`${i}-${j}`] = true;
      }

      return [result, waterArea, p];
    }
    visited[i][j] = true;
    result += 1;

    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [x, y] of dirs) {
      let [a, b, c] = dfs(x + i, y + j, water);

      if (
        x + i < 0 ||
        y + j < 0 ||
        x + i >= grid.length ||
        y + j >= grid[0].length ||
        grid[x + i][y + j] === 0
      ) {
        c += 1;
      }
      result += a;
      waterArea += b;
      p += c;
    }
    return [result, waterArea, p];
  }
  return results;
};

const grid1 = [
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 0],
];

const grid2 = [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
];
console.log(numIslands(grid1));
