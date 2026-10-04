#!/usr/bin/env node
// Fails unless every file that names the pbiplint version names the same one: plugin.json, the MCP
// server's launcher in .mcp.json, the MCP Bundle's manifest, the bundled skill's version lines, and
// each `pbiplint@<version>` and `pbiplint-<version>.mcpb` in README.md, SETUP.md, and
// PERMISSIONS.md. Run from the repository root: node scripts/check-pins.mjs
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const version = json(".claude-plugin/plugin.json").version;
const problems = [];
const expect = (where, found) => {
  if (found !== version) problems.push(`${where} says ${found ?? "nothing"}, plugin.json says ${version}`);
};

const args = json(".mcp.json").mcpServers?.pbiplint?.args ?? [];
expect(".mcp.json's launcher", args.find((a) => a.startsWith("pbiplint@"))?.slice("pbiplint@".length));
expect("mcpb/manifest.json", json("mcpb/manifest.json").version);

const skill = read("skills/pbiplint/SKILL.md");
expect("the skill's metadata.version", /^\s+version: "([^"]+)"$/m.exec(skill)?.[1]);
expect("the skill's description", /^description: .* pbiplint (\d[^\s]*)\.$/m.exec(skill)?.[1]);

for (const doc of ["README.md", "SETUP.md", "PERMISSIONS.md"])
  for (const m of read(doc).matchAll(/pbiplint(?:@|-)(\d+\.\d+\.\d+)(?:\.mcpb)?/g))
    expect(`${doc}'s ${m[0]}`, m[1]);

for (const p of problems) console.error(p);
if (problems.length) process.exit(1);
console.log(`every pin says ${version}`);
