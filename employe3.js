// Round 3:
// Tell me about a time you had to approach a problem without a clear solution
//
// Make a "most frequently bought with" component for an e-commerce website (top-k items)
//
// Idea: given purchase history (each order is a list of productIds), for a target
// product return the top-k OTHER products most frequently bought in the same order.

// ---------- Core algorithm ----------

// orders: Array<Array<productId>>  (each inner array = items in one order)
// target: productId we want recommendations for
// k: how many recommendations to return
function frequentlyBoughtWith(orders, target, k) {
  const counts = new Map(); // co-product -> times bought with target

  for (const order of orders) {
    if (!order.includes(target)) continue; // only orders containing the target

    for (const item of order) {
      if (item === target) continue; // don't recommend the item itself
      counts.set(item, (counts.get(item) || 0) + 1);
    }
  }

  // Sort by count desc, then id asc for stable/deterministic ties.
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, k)
    .map(([item, count]) => ({ item, count }));
}

// ---------- Quick test ----------
const orders = [
  ["milk", "bread", "eggs"],
  ["milk", "bread", "butter"],
  ["milk", "eggs"],
  ["bread", "butter"],
  ["milk", "bread", "jam"],
];

console.log(frequentlyBoughtWith(orders, "milk", 2));
// "milk" appears with: bread x3, eggs x2, butter x1, jam x1
// => [ { item: 'bread', count: 3 }, { item: 'eggs', count: 2 } ]

// ---------- React component ----------
//
// import { useMemo } from "react";
//
// function FrequentlyBoughtWith({ orders, productId, k = 3, onAdd }) {
//   const recommendations = useMemo(
//     () => frequentlyBoughtWith(orders, productId, k),
//     [orders, productId, k]
//   );
//
//   if (recommendations.length === 0) return null;
//
//   return (
//     <section className="fbw">
//       <h3>Frequently bought with</h3>
//       <ul>
//         {recommendations.map(({ item, count }) => (
//           <li key={item}>
//             <span>{item}</span>
//             <small>{count} orders</small>
//             <button onClick={() => onAdd?.(item)}>Add</button>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }
//
// export default FrequentlyBoughtWith;