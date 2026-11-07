# pbiplint for Claude

[pbiplint](https://pbiplint.com) lints Power BI projects (PBIP): the semantic model's TMDL and the report's PBIR, against more than a hundred best-practice rules. This repository brings it into Claude, on your own machine, as a plugin marketplace with two plugins. Nothing you lint is uploaded, as the [pbiplint Privacy Promise](https://pbiplint.com/privacy/) says.

## What it adds

- **`pbiplint`, a skill that has Claude lint its own work.** It tells Claude to run pbiplint after every change to a project's TMDL or PBIR files, however the change was made (a script, an edit, an MCP server), to read the short summary first and fix errors first, to look up a rule's guidance before fixing it, to lint again after each fix, and to leave choices such as ignoring a finding to you. It is the same skill `pbiplint skill` prints, at the plugin's pinned version.
- **`pbiplint-mcp`, an MCP server with three read-only tools.** `lint` lints a project folder and returns the findings, `explain_rule` gives a rule's guidance (why it matters, how to fix it, when to ignore it), and `list_rules` lists every rule. Claude can call them whenever you ask about a Power BI project on your disk.

Install both. They are separate so the skill can be listed in Claude's plugin directory, which for now lists plugins that run a program on your computer only from organizations Anthropic has verified. Through version 0.2.5 the two were one plugin, `pbiplint`; if you installed that, add `pbiplint-mcp` to keep the tools.

## What it runs, reads, and sends

- **Runs:** `npx -y pbiplint@0.3.2 mcp` for `pbiplint-mcp`'s server, pinned to one version of the [pbiplint package on npm](https://www.npmjs.com/package/pbiplint); the skill has Claude run pbiplint from its terminal. The first run downloads that package from the npm registry; the request carries nothing from your projects.
- **Reads:** the project files a tool or a command is pointed at.
- **Writes:** nothing.
- **Sends:** nothing. pbiplint makes no network request, sends no telemetry, and has no account. What the tools return goes to Claude, which sends it to Anthropic with the rest of the conversation, as it does everything Claude reads; the findings name your tables, columns, and measures.

## Where it works

| | `pbiplint` (skill) | `pbiplint-mcp` (MCP server) |
|---|---|---|
| Claude Code | Yes | Yes |
| Cowork, running on your computer | Yes | Yes |
| Chat in claude.ai or Claude Desktop | Yes, with no terminal to run pbiplint in | Not through the plugin: use the MCP Bundle in [SETUP.md](SETUP.md) |

Claude's chat ignores a plugin's local servers, so for Claude Desktop's chat, install the one-click MCP Bundle from this repository's releases.

## Requirements

Node.js 20.19 or later for Claude Code and Cowork, since `npx` runs pbiplint. The MCP Bundle needs nothing: it runs on Claude Desktop's own Node.

## Install

- **Claude Code:** this repository is its own plugin marketplace.

  ```
  /plugin marketplace add pbiplint/claude-plugin
  /plugin install pbiplint@pbiplint
  /plugin install pbiplint-mcp@pbiplint
  ```

- **Claude Desktop's chat:** download `pbiplint-0.3.2.mcpb` from this repository's [releases](https://github.com/pbiplint/claude-plugin/releases) and open it; Claude Desktop installs the MCP server in one click.

[SETUP.md](SETUP.md) has both in full, with Cowork and other assistants.

## Setup and help

- [SETUP.md](SETUP.md): installing the plugin and the MCP Bundle.
- [PERMISSIONS.md](PERMISSIONS.md): everything each plugin runs, reads, writes, and sends.
- [pbiplint.com](https://pbiplint.com): the rules, the command line, and the site that lints in your browser.
- Issues and questions: [github.com/pbiplint/pbiplint](https://github.com/pbiplint/pbiplint/issues).

## License

This repository's files are MIT licensed ([LICENSE](LICENSE)), the skill included. pbiplint itself, which `npx` runs and the MCP Bundle carries, is AGPL-3.0-or-later. The pbiplint name and logo, including the plugins' icon, are trademarks of McKinley Consulting and are not covered by either license.
