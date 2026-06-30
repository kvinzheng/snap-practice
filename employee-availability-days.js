// - Days = 10
// - Vacations =[(2,4) (3,6), (7,9)] -> 2
// - How many days are all employees available if each Tuple is an employee
//
// Each tuple (start, end) is one employee's vacation, inclusive. A day counts as
// "all available" only if NO employee is on vacation that day. So we count the
// days in 1..Days that are not covered by any interval.

function daysAllAvailable(days, vacations) {
  // Step 1: make a list that tracks, for each day, whether someone is on vacation.
  // We use index 1..days, so the array has length days + 1.
  const onVacation = new Array(days + 1).fill(false);

  // Step 2: for every employee's vacation, mark each day they are away.
  for (const vacation of vacations) {
    const start = vacation[0];
    const end = vacation[1];

    for (let day = start; day <= end; day++) {
      // Only mark days that are inside our 1..days range.
      if (day >= 1 && day <= days) {
        onVacation[day] = true;
      }
    }
  }

  // Step 3: count the days where nobody is on vacation.
  let availableDays = 0;
  for (let day = 1; day <= days; day++) {
    if (onVacation[day] === false) {
      availableDays = availableDays + 1;
    }
  }

  return availableDays;
}

// ---------- Quick test ----------
const days = 10;
const vacations = [
  [2, 4],
  [3, 6],
  [7, 9],
];

console.log(daysAllAvailable(days, vacations)); // -> 2  (days 1 and 10)