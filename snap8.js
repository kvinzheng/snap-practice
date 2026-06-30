// Promise.all question
//
// Implement Promise.all yourself.
//
// 4 things to remember (say these out loud in the interview):
//   1. Return ONE new promise that wraps everything.
//   2. Keep input ORDER -> store each result at results[i], not by push order.
//   3. COUNT how many finished -> resolve only when count === length.
//   4. FAIL FAST -> first reject rejects the whole thing.

function myPromiseAll(promises) {
  return new Promise(function (resolve, reject) {
    const results = [];
    let count = 0;

    // Edge case: empty input resolves right away with [].
    if (promises.length === 0) {
      resolve(results);
      return;
    }

    for (let i = 0; i < promises.length; i++) {
      // Promise.resolve() also handles plain (non-promise) values.
      Promise.resolve(promises[i]).then(
        function (value) {
          results[i] = value; // (2) keep order
          count = count + 1; // (3) count finished

          if (count === promises.length) {
            resolve(results);
          }
        },
        function (error) {
          reject(error); // (4) fail fast on first error
        },
      );
    }
  });
}

// ---------- Tests ----------

// 1) All succeed -> results in INPUT order, even if they finish out of order.
const slow = new Promise(function (resolve) {
  setTimeout(function () {
    resolve("slow");
  }, 100);
});
const fast = new Promise(function (resolve) {
  setTimeout(function () {
    resolve("fast");
  }, 10);
});

myPromiseAll([slow, fast, "plain value"]).then(function (results) {
  console.log("success:", results); // ["slow", "fast", "plain value"]
});

// 2) One rejects -> whole thing rejects with that error.
myPromiseAll([Promise.resolve(1), Promise.reject("boom")]).then(
  function (results) {
    console.log("should not run:", results);
  },
  function (error) {
    console.log("error:", error); // "boom"
  },
);

// 3) Empty input -> resolves with [].
myPromiseAll([]).then(function (results) {
  console.log("empty:", results); // []
});