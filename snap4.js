
// Create a secret Santa mapping of users with an input of names with complete randomness:
// input: ['ben', 'sarah', 'john', 'dave']
// output: {'ben': 'john', 'sarah:'dave', 'john': sarah, 'dave': 'ben'} (or any other random combination)

// Key constraint: nobody can be their own secret Santa (a "derangement").
// Trick: shuffle the names, then give each person the NEXT one in the shuffled
// order, wrapping the last back to the first. A single cycle like this can never
// map anyone to themselves, so it's always a valid assignment.

// Fisher–Yates shuffle (unbiased, in place on a copy).
// Front-to-back: finalize slot i, picking from the remaining range [i .. end].
function shuffle(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function secretSanta(names) {
  if (names.length < 2) {
    throw new Error("Need at least 2 people for secret Santa.");
  }

  const shuffled = shuffle(names);
  const mapping = {};

  // Each person gives to the next; the last person gives to the first.
  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i];
    let receiver;
    if (i + 1 < shuffled.length) {
      receiver = shuffled[i + 1]; // the next person
    } else {
      receiver = shuffled[0]; // last person wraps around to the first
    }
    mapping[giver] = receiver;
  }

  return mapping;
}

// ---------- Quick test ----------
const names = ["ben", "sarah", "john", "dave"];
const result = secretSanta(names);
console.log(result);

// Sanity checks: nobody gifts themselves, and everyone gives & receives exactly once.
const noSelf = Object.entries(result).every(([giver, receiver]) => giver !== receiver);
const receivers = new Set(Object.values(result));
const valid = noSelf && receivers.size === names.length;
console.log("valid:", valid);