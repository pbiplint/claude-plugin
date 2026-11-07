# pbiplint

[pbiplint](https://pbiplint.com) lints Power BI projects (PBIP): the semantic model's TMDL and the report's PBIR, against more than a hundred best-practice rules. This plugin is a skill that has Claude lint its own work, on your own machine. Nothing you lint is uploaded, as the [pbiplint Privacy Promise](https://pbiplint.com/privacy/) says.

## Install

In Claude Code 2.1.275 or later:

```
/plugin install pbiplint --marketplace pbiplint/claude-plugin
```

## What it does

The skill tells Claude to run pbiplint after every change to a project's TMDL or PBIR files, however the change was made (a script, an edit, an MCP server, or you in Power BI Desktop). Claude reads the short summary first and fixes errors first, looks up a rule's guidance with `pbiplint explain` before fixing it, lints again after each fix, and leaves choices such as ignoring a finding to you. It is the same skill `pbiplint skill` prints, at the plugin's pinned version.

## What it runs, reads, and sends

- **Runs:** nothing by itself. The skill tells Claude to run pbiplint in its terminal, as `npx pbiplint` or an installed `pbiplint`, with `--quiet`, `--rule`, and `explain`. `npx` fetches the [pbiplint package on npm](https://www.npmjs.com/package/pbiplint) the first time; the request carries nothing from your projects. The skill was written for pbiplint 0.3.2, and its guidance comes from whichever version runs.
- **Reads:** the project files Claude points pbiplint at.
- **Writes:** nothing.
- **Sends:** nothing. pbiplint makes no network request, sends no telemetry, and has no account. Claude sends what pbiplint prints to Anthropic with the rest of the conversation, as it does everything it reads; the findings name your tables, columns, and measures.

## Where it works

In Claude Code, and in Cowork when the session runs on your computer, where Claude has a terminal. It needs Node.js 20.19 or later, since `npx` runs pbiplint. In chat, with no terminal, the skill has nothing to run.

## pbiplint's lint tools

pbiplint's read-only lint tools, a local MCP server, are a separate plugin in the same marketplace, `pbiplint-mcp`. With both installed, Claude uses the tools in place of the terminal. See the [pbiplint for Claude repository](https://github.com/pbiplint/claude-plugin) to install it, and [PERMISSIONS.md](https://github.com/pbiplint/claude-plugin/blob/main/PERMISSIONS.md) for everything each plugin runs, reads, writes, and sends.

## License

This plugin's files are MIT licensed ([LICENSE](LICENSE)), the skill included. pbiplint itself, which the skill has Claude run, is AGPL-3.0-or-later. The pbiplint name and logo, including the plugin's icon, are trademarks of McKinley Consulting and are not covered by either license.
