const packageName = "circular-dependency-example";
const packageJson = {
  name: "circular-dependency-example",
  version: "1.0.0",
  dependencies: {
    "package-a": "^1.0.0",
    "package-b": "^1.0.0",
  },
  devDependencies: {
    "package-c": "^1.0.0",
  },
  "package-a": {
    name: "package-a",
    version: "1.0.0",
    dependencies: {
      "package-b": "^1.0.0",
    },
  },
  "package-b": {
    name: "package-b",
    version: "1.0.0",
    dependencies: {
      "package-c": "^1.0.0",
    },
  },
  "package-c": {
    name: "package-c",
    version: "1.0.0",
    dependencies: {
      "package-a": "^1.0.0",
    },
  },
};

function collectUniquePackages(root) {
  const uniquePackages = new Set();

  function dfs(pkg) {
    if (!pkg || !pkg.name || uniquePackages.has(pkg.name)) return;

    uniquePackages.add(pkg.name);

    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    for (const depName of Object.keys(deps)) {
      dfs(root[depName]); // recurse into each dependency
    }
  }

  dfs(root);
  return uniquePackages;
}

const uniquePackages = collectUniquePackages(packageJson);
console.log([...uniquePackages]); // Output: ["circular-dependency-example", "package-a", "package-b", "package-c"]
