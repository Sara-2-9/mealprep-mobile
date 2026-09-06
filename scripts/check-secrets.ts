import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = join(import.meta.dir, "..");
const ignored = new Set([".git", ".expo", "blackboard-mobile-engineer-take-home", "coverage", "dist", "node_modules"]);
const textExtensions = new Set([".cjs", ".css", ".js", ".json", ".md", ".mjs", ".ts", ".tsx", ".yml", ".yaml"]);
const secretPatterns = [
  { name: "OpenAI API key", value: /sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/g },
  { name: "private key", value: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const output: string[] = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await files(path)));
    else if (textExtensions.has(extname(entry.name)) || entry.name === ".env.example") output.push(path);
  }
  return output;
}

const findings: string[] = [];
for (const path of await files(root)) {
  const content = await Bun.file(path).text();
  for (const pattern of secretPatterns) {
    pattern.value.lastIndex = 0;
    if (pattern.value.test(content)) findings.push(`${relative(root, path)}: ${pattern.name}`);
  }
}

if (findings.length > 0) {
  console.error(`Potential secrets found:\n${findings.join("\n")}`);
  process.exit(1);
}
console.log("No tracked-source secret patterns detected.");
