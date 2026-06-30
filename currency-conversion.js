// Google Phone Screen - Currency Conversion
// (Same idea as LeetCode 399 "Evaluate Division")
//
// You are given:
//   - rates: a list of facts like ["USD", "GBP", 0.77]  meaning  1 USD = 0.77 GBP
//   - a query: [from, to]                                e.g.    ["GBP", "AUD"]
// Return the conversion rate from `from` to `to`, or -1 if there is no path.
//
// Idea (how I'd explain it in the interview):
//   1. Build a graph. Each currency is a node. Each fact is an edge with a rate.
//      If 1 USD = 0.77 GBP, then also 1 GBP = 1 / 0.77 USD, so add BOTH directions.
//   2. To answer a query, walk the graph from `from` to `to` with DFS. Start
//      with rate 1 and multiply by each edge's rate as we step along the path.
//      Use a visited set so we never loop forever.

// Step 1: build currency -> list of { neighbor, rate }
function buildGraph(rates) {
  const graph = {};

  for (const rate of rates) {
    const from = rate[0];
    const to = rate[1];
    const value = rate[2];

    if (!graph[from]) {
      graph[from] = [];
    }
    if (!graph[to]) {
      graph[to] = [];
    }

    graph[from].push({ neighbor: to, rate: value }); // 1 from = value to
    graph[to].push({ neighbor: from, rate: 1 / value }); // 1 to = (1/value) from
  }

  return graph;
}

// Step 2: DFS from `from` to `to`, multiplying rates along the way.
function getRate(rates, from, to) {
  const graph = buildGraph(rates);

  // If either currency was never seen, there is no answer.
  if (!graph[from] || !graph[to]) {
    return -1;
  }

  const visited = new Set();

  // Walk the graph carrying the rate it took to reach `currency`.
  function dfs(currency, rateSoFar) {
    // Reached the target: the accumulated rate is the answer.
    if (currency === to) {
      return rateSoFar;
    }

    visited.add(currency);

    for (const edge of graph[currency]) {
      if (!visited.has(edge.neighbor)) {
        const result = dfs(edge.neighbor, rateSoFar * edge.rate);
        if (result !== -1) {
          return result; // found a path, pass it back up
        }
      }
    }

    return -1; // dead end on this branch
  }

  return dfs(from, 1);
}

// ---------- Test: the exact example from the post ----------
const rates = [
  ["USD", "JPY", 110],
  ["USD", "AUD", 1.45],
  ["JPY", "GBP", 0.007],
];

console.log(getRate(rates, "GBP", "AUD")); // ~1.88 (GBP -> JPY -> USD -> AUD)
console.log(getRate(rates, "USD", "JPY")); // 110 (direct edge)
console.log(getRate(rates, "JPY", "USD")); // ~0.0091 (reverse edge)
console.log(getRate(rates, "USD", "EUR")); // -1 (EUR is unknown)
