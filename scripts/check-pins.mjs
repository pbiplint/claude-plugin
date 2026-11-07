#!/usr/bin/env node
// Fails unless every file that names the pbiplint version names the same one: both plugins'
// plugin.json, the MCP server's launcher in plugins/pbiplint-mcp/.mcp.json, the MCP Bundle's
// manifest, the bundled skill's version lines, and each `pbiplint@<version>` and
// `pbiplint-<version>.mcpb` in the Markdown files that name one. Also fails unless the MCP server
// plugin's plugin.json names its server file in `mcpServers` (Codex and the ChatGPT desktop app
// read the field; Claude finds the file without it) and the skill plugin declares no MCP server.
// Each plugin's .codex-plugin/plugin.json, which Codex and the ChatGPT desktop app read in place of
// the Claude manifest, must match it in name and version and carry what Codex then needs on its own:
// the skills folder and `requires_local_executor` for the skill plugin, `mcpServers` for the MCP
// server plugin, and icon files that exist.
// Run from the repository root: node scripts/check-pins.mjs
import { existsSync, readFileSync } from "node:fs";

const read = (p) => readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const SKILL = "plugins/pbiplint";
const TOOLS = "plugins/pbiplint-mcp";
const version = json(`${SKILL}/.claude-plugin/plugin.json`).version;
const problems = [];
const expect = (where, found) => {
  if (found !== version) problems.push(`${where} says ${found ?? "nothing"}, ${SKILL}'s plugin.json says ${version}`);
};

const tools = json(`${TOOLS}/.claude-plugin/plugin.json`);
expect(`${TOOLS}'s plugin.json`, tools.version);
if (tools.mcpServers !== "./.mcp.json")
  problems.push(`${TOOLS}'s plugin.json must say "mcpServers": "./.mcp.json" (found ${JSON.stringify(tools.mcpServers)})`);
if ("mcpServers" in json(`${SKILL}/.claude-plugin/plugin.json`))
  problems.push(`${SKILL}'s plugin.json must not declare an MCP server; the server lives in ${TOOLS}`);
const want = (where, ok, what) => {
  if (!ok) problems.push(`${where} must ${what}`);
};
for (const [dir, codexNeeds] of [
  [SKILL, (m) => [["say \"skills\": \"./skills/\"", m.skills === "./skills/"],
                  ["say \"requires_local_executor\": true", m.requires_local_executor === true],
                  ["not declare an MCP server", !("mcpServers" in m)]]],
  [TOOLS, (m) => [["say \"mcpServers\": \"./.mcp.json\"", m.mcpServers === "./.mcp.json"]]],
]) {
  const where = `${dir}/.codex-plugin/plugin.json`;
  const codex = json(where);
  expect(where, codex.version);
  want(where, codex.name === json(`${dir}/.claude-plugin/plugin.json`).name, "use the Claude manifest's name");
  for (const [what, ok] of codexNeeds(codex)) want(where, ok, what);
  for (const field of ["composerIcon", "logo"]) {
    const icon = codex.interface?.[field];
    want(where, typeof icon === "string" && icon.startsWith("./") && existsSync(`${dir}/${icon}`), `name an existing file in interface.${field}`);
  }
}
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
console.log(`every pin says ${version}, and the Claude and Codex manifests agree`);
