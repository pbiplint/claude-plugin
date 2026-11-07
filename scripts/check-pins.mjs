#!/usr/bin/env node
// Fails unless every file that names the pbiplint version names the same one: both plugins'
// plugin.json, the MCP server's launcher in plugins/pbiplint-mcp/.mcp.json, the MCP Bundle's
// manifest, the bundled skill's version lines, and each `pbiplint@<version>` and
// `pbiplint-<version>.mcpb` in the Markdown files that name one. Run from the repository root:
// node scripts/check-pins.mjs
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const SKILL = "plugins/pbiplint";
const TOOLS = "plugins/pbiplint-mcp";
const version = json(`${SKILL}/.claude-plugin/plugin.json`).version;
const problems = [];
const expect = (where, found) => {
  if (found !== version) problems.push(`${where} says ${found ?? "nothing"}, ${SKILL}'s plugin.json says ${version}`);
};

expect(`${TOOLS}'s plugin.json`, json(`${TOOLS}/.claude-plugin/plugin.json`).version);
const args = json(`${TOOLS}/.mcp.json`).mcpServers?.pbiplint?.args ?? [];
expect(`${TOOLS}/.mcp.json's launcher`, args.find((a) => a.startsWith("pbiplint@"))?.slice("pbiplint@".length));
expect("mcpb/manifest.json", json("mcpb/manifest.json").version);

const skill = read(`${SKILL}/skills/pbiplint/SKILL.md`);
expect("the skill's metadata.version", /^\s+version: "([^"]+)"$/m.exec(skill)?.[1]);
expect("the skill's description", /^description: .* pbiplint (\d[^\s]*)\.$/m.exec(skill)?.[1]);

for (const doc of ["README.md", "SETUP.md", "PERMISSIONS.md", `${SKILL}/README.md`, `${TOOLS}/README.md`])
  for (const m of read(doc).matchAll(/pbiplint(?:@|-)(\d+\.\d+\.\d+)(?:\.mcpb)?/g))
    expect(`${doc}'s ${m[0]}`, m[1]);

for (const p of problems) console.error(p);
if (problems.length) process.exit(1);
console.log(`every pin says ${version}`);
