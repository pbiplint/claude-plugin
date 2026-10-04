# Setting up pbiplint for Claude

## Claude Code

This repository is its own plugin marketplace. In Claude Code, add it and install the plugin:

```
/plugin marketplace add pbiplint/claude-plugin
/plugin install pbiplint@pbiplint
```

From a shell, the same is `claude plugin marketplace add pbiplint/claude-plugin` and `claude plugin install pbiplint@pbiplint`. Updates arrive with `/plugin marketplace update pbiplint`. To try a clone for one session instead, run `claude --plugin-dir <path-to-clone>`.

The skill and the MCP server load the next time Claude Code starts. Ask Claude to lint a Power BI project, or to change one: the skill has it lint after each change and fix what it broke before it reports back.

### What counts as a failure

Claude reads pbiplint's results as the command line gives them: errors first, then warnings and info as suggestions. A project's `pbiplint.config.json` turns rules off, changes their severity, and sets `failOn`, as for the command line and CI:

```json
{ "failOn": "warning" }
```

A finding you want to keep can be switched off in the same file, or with a `pbiplint.ignore` annotation; see [pbiplint.com/cli](https://pbiplint.com/cli/). The skill tells Claude to ask you before it does either.

## Cowork

In Claude Desktop, open **Customize > Plugins**, add the marketplace from GitHub (`pbiplint/claude-plugin`), and install pbiplint from it. The skill loads in every Cowork session, and the MCP server runs when the session runs on your computer.

## Claude Desktop's chat

Chat does not run a plugin's local MCP servers, so install the MCP Bundle instead:

1. Download `pbiplint-0.2.5.mcpb` from this repository's [releases](https://github.com/pbiplint/claude-plugin/releases).
2. Open it. Claude Desktop shows an install dialog; select **Install**.

The bundle carries pbiplint itself and runs on Claude Desktop's own Node, so it downloads nothing. Then ask Claude to lint a project and give it the project folder's full path.

To set it up by hand instead, add this to Claude Desktop's `claude_desktop_config.json` (Settings > Developer > Edit Config), with Node.js installed:

```json
{
  "mcpServers": {
    "pbiplint": { "command": "npx", "args": ["-y", "pbiplint@0.2.5", "mcp"] }
  }
}
```

## Other assistants

`pbiplint mcp` is a standard MCP server over stdio, so any assistant that runs local MCP servers (VS Code with GitHub Copilot, Cursor, Codex, Gemini CLI) can start it with the same command, `npx -y pbiplint@0.2.5 mcp`. For a coding assistant's skill, run `npx pbiplint@0.2.5 skill --install <assistant>` (`claude`, `copilot`, `codex`, or `gemini`) in the project's folder.
