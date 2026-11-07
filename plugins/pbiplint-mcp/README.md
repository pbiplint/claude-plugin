# pbiplint MCP server

[pbiplint](https://pbiplint.com) lints Power BI projects (PBIP): the semantic model's TMDL and the report's PBIR, against more than a hundred best-practice rules. This plugin gives Claude pbiplint's read-only lint tools as a local MCP server, on your own machine. Nothing you lint is uploaded, as the [pbiplint Privacy Promise](https://pbiplint.com/privacy/) says.

## Install

In Claude Code 2.1.275 or later:

```
/plugin install pbiplint-mcp --marketplace pbiplint/claude-plugin
```

## Its tools

- `lint` lints a project folder, or each project in a folder that holds several, and returns the findings.
- `explain_rule` gives a rule's guidance: why it matters, how to fix it, and when to ignore it.
- `list_rules` lists every rule with its severity.

Each is read-only: no tool writes a file, runs a command, or takes a URL.

## What it runs, reads, and sends

- **Runs:** `npx -y pbiplint@0.3.2 mcp`, pinned to one version of the [pbiplint package on npm](https://www.npmjs.com/package/pbiplint). The first run downloads that package from the npm registry; the request carries nothing from your projects.
- **Reads:** the project files a tool is pointed at.
- **Writes:** nothing.
- **Sends:** nothing. pbiplint makes no network request, sends no telemetry, and has no account. What the tools return goes to Claude, which sends it to Anthropic with the rest of the conversation; the findings name your tables, columns, and measures.

## Where it works

In Claude Code, and in Cowork when the session runs on your computer. It needs Node.js 20.19 or later. Claude's chat does not run a plugin's local servers: for Claude Desktop's chat, install the one-click MCP Bundle from the [repository's releases](https://github.com/pbiplint/claude-plugin/releases) instead.

Install it beside the `pbiplint` plugin, the skill that has Claude lint after every change it makes. [PERMISSIONS.md](https://github.com/pbiplint/claude-plugin/blob/main/PERMISSIONS.md) lists everything each plugin runs, reads, writes, and sends.

## License

This plugin's files are MIT licensed ([LICENSE](LICENSE)). pbiplint itself, which `npx` runs, is AGPL-3.0-or-later. The pbiplint name and logo, including the plugin's icon, are trademarks of McKinley Consulting and are not covered by either license.
