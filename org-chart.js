// A company maintains a list of employees, where each element contains three strings: the employee's unique ID, their direct manager's ID, and their name. The CEO is the only employee whose manager ID equals their own ID.

// Your task is to generate the organisation chart as a hierarchical text structure. The output string should place each employee's name on a separate line, with a line break ('\n') after each name except for the last employee. Every direct report must be indented by four dashes ('-') more than their manager.

// Constraints:

// There is exactly one CEO in the company.
// Every other employee reports to exactly one manager.
// All IDs are unique, and the input order may be arbitrary.
// 1 ≤ employees.length ≤ 104
// Example 1:

// Input: employees = [["8", "8", "Alice"], ["2", "8", "Bob"], ["3", "2", "Charlie"], ["4", "3", "David"], ["5", "4", "Eva"], ["6", "3", "Frank"], ["7", "8", "Grace"]]
// Output: "Alice\n----Bob\n--------Charlie\n----------------David\n----------------Eva\n------------Frank\n----Grace"
// Explanation: Alice is the CEO. Bob and Grace report directly to Alice. Bob manages Charlie, who manages David and Frank. David manages Eva. Each deeper level is indented by four dashes. The org chart is shown below:

// Alice
// ----Bob
// --------Charlie
// ------------David
// ----------------Eva
// ------------Frank
// ----Grace
// Example 2:

// Input: employees = [["1", "1", "Alice"], ["2", "1", "Bob"], ["3", "2", "Charlie"]]
// Output: "Alice\n----Bob\n--------Charlie"
// Explanation: The org chart is shown below:

// Alice
// ----Bob
// --------Charlie
// Example 3:

// Input: employees = [["1", "1", "CEO"], ["2", "1", "Manager1"], ["3", "1", "Manager2"]]
// Output: "CEO\n----Manager1\n----Manager2"
// Explanation: The org chart is shown below:

// CEO
// ----Manager1
// ----Manager2

function employeeChart(list) {
  const graph = {};
  for (const [from, to, name] of list) {
    if (from === to) continue; // skip CEO self-loop
    if (!graph[to]) {
      graph[to] = [];
    }
    graph[to].push([from, name]); // manager -> [reportId, reportName]
  }
  //   console.log("graph", graph);
  const [reportFrom, reportTo, ceoName] = list.find(
    ([from, to]) => from === to,
  );
  function dfs(id, name, depth) {
    let res = "-".repeat(depth) + name;
    // console.log("res", res);
    if (graph[id]) {
      for (const item of graph[id]) {
        // console.log("item", item);
       res += "\n" + dfs(item[0], item[1], depth + 4);
        // if (graph[item[0]]) {
        //   for (const skip of graph[item[0]]) {
        //     dfs(skip[0], skip[1], depth + 1);
        //   }
        // }
        // return res
      }
    }
    return res;
  }
  return dfs(reportTo, ceoName, 0);
}

// Mock data: [id, managerId, name]; CEO's managerId === id
const employees = [
  ["8", "8", "Alice"],
  ["2", "8", "Bob"],
  ["3", "2", "Charlie"],
  ["4", "3", "David"],
  ["5", "4", "Eva"],
  ["6", "3", "Frank"],
  ["7", "8", "Grace"],
];

console.log(employeeChart(employees));



// Phone Screen:
// Tell me about a time you took initiative on something
// Given an employee array with objects that contains info about the employee, print sideways tree of employees

// example:
// input: 
// [{id: 8, managerId: 8, name: "Mary"},
// {id: 3, managerId: 8, name: "Bob"},
// {id: 2, managerId: 4, name: "Employee3"},
// {id: 0, managerId: 2, name: "Employee4"},
// {id: 1, managerId: 2, name: "Employee5"},
// {id: 4, managerId: 8, name: "Employee6"},
// {id: 12, managerId: 2, name: "Employee7"}]

// output:

// Mary
//  Employee6
//  Employee3
//  Employee4
//  Employee5
//  Employee7
//  Bob


// Follow-up:
// What if I want the output to be this:

// Mary
//  | _ Employee6
//  | |_Employee3
//  | |_Employee4
//  | | |_Employee5
//  | |_Employee7
//  | _Bob

// In this case, the most left pipe going down shows that Employee6 and Bob are on the same level and both direct employees of Mary. Likewise, we can see Employee3 is the only direct employee of Employee6. Employee 4 and 7 can be shown to be direct employees of Employee4 and employee 5 is a direct employee of Employee4

// ---------- Setup: build the hierarchy from managerId ----------
const employeesObj = [
  { id: 8, managerId: 8, name: "Mary" },
  { id: 3, managerId: 8, name: "Bob" },
  { id: 2, managerId: 4, name: "Employee3" },
  { id: 0, managerId: 2, name: "Employee4" },
  { id: 1, managerId: 2, name: "Employee5" },
  { id: 4, managerId: 8, name: "Employee6" },
  { id: 12, managerId: 2, name: "Employee7" },
];

// managerId -> array of direct reports (employee objects)
function buildChildren(list) {
  const children = {};
  let ceo = null;

  for (const emp of list) {
    if (emp.id === emp.managerId) {
      ceo = emp; // CEO reports to themselves
      continue;
    }
    if (!children[emp.managerId]) {
      children[emp.managerId] = [];
    }
    children[emp.managerId].push(emp);
  }

  return { children, ceo };
}

// ---------- Basic version: indent each level ----------
function printOrgChart(list) {
  const { children, ceo } = buildChildren(list);
  const lines = [];

  function dfs(emp, depth) {
    lines.push(" ".repeat(depth) + emp.name);

    const reports = children[emp.id] || [];
    for (const report of reports) {
      dfs(report, depth + 1);
    }
  }

  dfs(ceo, 0);
  return lines.join("\n");
}

console.log("---- basic ----");
console.log(printOrgChart(employeesObj));

// ---------- Follow-up: sideways tree with pipes ----------
// Standard tree drawing. The PARENT draws each child:
//   line   = prefix + "|_ " + childName
//   prefix = columns inherited from ancestors. When recursing into a child we
//            append "|  " if more siblings follow that child (keep the vertical
//            line), or "   " if it was the last child (blank column).
function printOrgTree(list) {
  const { children, ceo } = buildChildren(list);
  const lines = [];

  lines.push(ceo.name); // CEO on its own line, no connector

  function dfs(emp, prefix) {
    const reports = children[emp.id] || [];

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const isLast = i === reports.length - 1;

      lines.push(prefix + "|_ " + report.name);

      const extension = isLast ? "   " : "|  ";
      dfs(report, prefix + extension);
    }
  }

  dfs(ceo, "");
  return lines.join("\n");
}

console.log("---- tree ----");
console.log(printOrgTree(employeesObj));

// ---------- Extra dataset that EXERCISES the "|  " pipe column ----------
// Employee4 (a non-last child of Employee3) now has a report, so the deeper
// line must keep Employee3's vertical pipe alive next to Employee5/Employee7.
const employeesObjWithPipe = [
  { id: 8, managerId: 8, name: "Mary" },
  { id: 3, managerId: 8, name: "Bob" },
  { id: 2, managerId: 4, name: "Employee3" },
  { id: 0, managerId: 2, name: "Employee4" },
  { id: 1, managerId: 2, name: "Employee5" },
  { id: 4, managerId: 8, name: "Employee6" },
  { id: 12, managerId: 2, name: "Employee7" },
  { id: 99, managerId: 0, name: "Employee8" }, // reports to Employee4
];

console.log("---- tree (pipe case) ----");
console.log(printOrgTree(employeesObjWithPipe));
