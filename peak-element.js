// (This question is a variation of the LeetCode question 253. Meeting Rooms II. If you haven't completed that question yet, it is recommended to solve it first.)

// You are organizing an exclusive event where each guest's attendance is tracked by their entry and exit times. For every guest, you are given a pair [entry, exit), indicating that this guest is present at every integer time t such that entry ≤ t < exit.

// Given a list times representing the attendance intervals of all guests, your task is to find the earliest time at which the maximum number of guests are present simultaneously.

// Return the earliest time when this maximum attendance occurs.

// Constraints:

// 1 ≤ times.length ≤ 
// 10
// 5
// 10 
// 5
 
// 0 ≤ entry < exit ≤ 
// 10
// 9
// 10 
// 9
//   for every times[i]
// Example 1:

// Input: times = [[1, 3], [2, 4]]
// Output: 2
// Explanation:

// At time 1, guest 0 is present.
// At time 2, both guests are present (maximum of 2).
// At time 3, only guest 1 remains.
// Example 2:

// Input: times = [[1, 4], [2, 5], [9, 12], [5, 9]]
// Output: 2

// Example 3:

// Input: times = [[5, 10], [10, 15], [10, 20]]
// Output: 10

/**
 * @param {number[][]} times - each [entry, exit), present at t where entry <= t < exit
 * @return {number} earliest time with the maximum simultaneous guests
 */
function maxGuests(times) {
  const events = [];

  for(const [event1,event2] of times){
    const a = [event1, 1]
    const b = [event2, -1]
    events.push(a)
    events.push(b)
  }
  events.sort((a,b)=> a[0] - b[0] || a[1] - b[1] )
  let max = 0;
  let count = 0;
  let ans = 0;
  for(const [event, move] of events){
    count += move
    
    if(count > max) {
      max = count;
      ans = event
    }
  }
  return ans
}

console.log(maxGuests([[1, 3], [2, 4]]));                 // 2
console.log(maxGuests([[1, 4], [2, 5], [9, 12], [5, 9]])); // 2
console.log(maxGuests([[5, 10], [10, 15], [10, 20]]));     // 10
