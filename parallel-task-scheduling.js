// (This question is a variation of the LeetCode question 210. Course Schedule II. If you haven't completed that question yet, it is recommended to solve it first.)

// A company is asked to efficiently schedule a set of tasks, each identified by a unique, non-empty lowercase string. Tasks have dependencies: each dependency is a pair [fromTask, toTask], meaning fromTask must finish before toTask can begin.

// The company has unlimited machines available, so at any given time, all tasks that are ready (no unmet dependencies) can be run in parallel. Your job is to determine the schedule by grouping tasks that can be executed together at each time step. The schedule should be a list of groups, where:

// Each group contains all tasks that start at the same time.
// The order of groups reflects the overall execution order (earlier groups must finish before later groups can begin).
// Within each group, tasks must be ordered in lexicographic order.
// Return an empty list if it's not possible to finish all tasks.

// Constraints:

// 1 ≤ dependencies.length ≤ 104
// Each dependency is a pair of two non-empty lowercase strings.
// Task names are unique across all dependencies.
// Example 1:

// Input: dependencies = [["a", "b"], ["c", "d"], ["e", "f"]]
// Output: [["a", "c", "e"], ["b", "d", "f"]]
// Explanation: Tasks "a", "c", and "e" do not depend on any other task, so they can all start at the same time in the first group. "b" depends on "a", "d" depends on "c", and "f" depends on "e", so all three can only be started after their respective prerequisites have completed. They form the second group and can be run together.

// Example 2:

// Input: dependencies = [["a", "b"], ["c", "b"]]
// Output: [["a", "c"], ["b"]]

// Example 3:

// Input: dependencies = [["a", "b"], ["b", "a"]]
// Output: []

/**
 * @param {string[][]} dependencies - each [fromTask, toTask]: fromTask before toTask
 * @return {string[][]} groups of tasks runnable together, [] if cycle
 */
function scheduleTasks(dependencies) {
  const graph = {};
  const inDegree = {};
  for (const [from, to] of dependencies) {
    if (!graph[from]) {
      graph[from] = [];
    }
    graph[from].push(to);
    if (inDegree[to] === undefined) {
      inDegree[to] = 0;
    }
    if (inDegree[from] === undefined) {
      inDegree[from] = 0;
    }
    inDegree[to]++;
  }

  const queue = [];
  const result = [];
  for (const task in inDegree) {
    if (inDegree[task] === 0) {
      queue.push(task);
    }
  }
  while (queue.length) {
    const size = queue.length;
    const group = [];
    for (let i = 0; i < size; i++) {
      const item = queue.shift();

      group.push(item);
      if (graph[item]) {
        for (const next of graph[item]) {
          inDegree[next]--;
          if (inDegree[next] === 0) {
            queue.push(next);
          }
        }
      }
    }
    result.push(group.sort());
  }
  return result
}

console.log(
  scheduleTasks([
    ["a", "b"],
    ["c", "d"],
    ["e", "f"],
  ]),
); // [["a","c","e"],["b","d","f"]]
console.log(
  scheduleTasks([
    ["a", "b"],
    ["c", "b"],
  ]),
); // [["a","c"],["b"]]
console.log(
  scheduleTasks([
    ["a", "b"],
    ["b", "a"],
  ]),
); // []
