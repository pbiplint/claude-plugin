# Setting up pbiplint for Claude and ChatGPT

## Claude Code

This repository is its own plugin marketplace, with two plugins: `pbiplint`, the skill, and `pbiplint-mcp`, the MCP server. In Claude Code, add the marketplace and install both:

```
/plugin marketplace add pbiplint/claude-plugin
/plugin install pbiplint@pbiplint
/plugin install pbiplint-mcp@pbiplint
```

From a shell, the same is `claude plugin marketplace add pbiplint/claude-plugin`, then `claude plugin install pbiplint@pbiplint` and `claude plugin install pbiplint-mcp@pbiplint`. Updates arrive with `/plugin marketplace update pbiplint`. Through version 0.2.5 the two were one plugin, `pbiplint`; if you installed that, install `pbiplint-mcp` as well to keep the tools. To try a clone for one session instead, run `claude --plugin-dir <path-to-clone>/plugins/pbiplint --plugin-dir <path-to-clone>/plugins/pbiplint-mcp`.

The skill and the MCP server load the next time Claude Code starts. Ask Claude to lint a Power BI project, or to change one: the skill has it lint after each change and fix what it broke before it reports back.

### What counts as a failure

Claude reads pbiplint's results as the command line gives them: errors first, then warnings and info as suggestions. A project's `pbiplint.config.json` turns rules off, changes their severity, and sets `failOn`, as for the command line and CI:

```json
{ "failOn": "warning" }
```

A finding you want to keep can be switched off in the same file, or with a `pbiplint.ignore` annotation; see [pbiplint.com/cli](https://pbiplint.com/cli/). The skill tells Claude to ask you before it does either.

## Cowork

In Claude Desktop, open **Customize > Plugins**, add the marketplace from GitHub (`pbiplint/claude-plugin`), and install both plugins from it, `pbiplint` and `pbiplint-mcp`. The skill loads in every Cowork session, and the MCP server runs when the session runs on your computer.

## Claude Desktop's chat

Chat does not run a plugin's local MCP servers, so install the MCP Bundle instead:

1. Download `pbiplint-0.3.2.mcpb` from this repository's [releases](https://github.com/pbiplint/claude-plugin/releases).
2. Open it. Claude Desktop shows an install dialog; select **Install**.

The bundle carries pbiplint itself and runs on Claude Desktop's own Node, so it downloads nothing. Then ask Claude to lint a project and give it the project folder's full path.

To set it up by hand instead, add this to Claude Desktop's `claude_desktop_config.json` (Settings > Developer > Edit Config), with Node.js installed:

```json
{
  "mcpServers": {
    "pbiplint": { "command": "npx", "args": ["-y", "pbiplint@0.3.2", "mcp"] }
  }
}
```

## The ChatGPT desktop app (Codex and Work)

OpenAI's new ChatGPT desktop app has two views, ChatGPT (with Chat and Work) and Codex: ["Choose ChatGPT or Codex. In ChatGPT, use the toggle above the composer to select Chat or Work."](https://learn.chatgpt.com/docs/app) It takes the place of the separate Codex app. The previous ChatGPT app, now called ChatGPT Classic, has neither Work nor Codex; see OpenAI's [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) and [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex).

The app reads this repository's marketplace as it is: it [reads "a legacy-compatible marketplace at `$REPO_ROOT/.claude-plugin/marketplace.json`"](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work). Install both plugins, as for Claude.

1. Clone this repository and open the clone as a project in the ChatGPT desktop app.
2. Quit and reopen the app. Open **Plugins**, choose the `pbiplint` marketplace, and install `pbiplint` and `pbiplint-mcp` with the plus button.
3. Start a new chat in the Codex view, or in Work, and ask it to lint a Power BI project by its folder's full path. Type `@` to call the plugin or its skill by name.

To update, pull the clone and restart the app. With the Codex CLI, [`codex plugin marketplace add pbiplint/claude-plugin`](https://developers.openai.com/plugins/build/plugins#add-a-marketplace-from-the-cli) adds the marketplace without a clone, and `codex plugin marketplace upgrade pbiplint` updates it. The plugins run only in a thread on your computer, so ChatGPT Classic, ChatGPT on the web, and ChatGPT on a phone cannot use them.

## Other assistants

`pbiplint mcp` is a standard MCP server over stdio, so any assistant that runs local MCP servers (VS Code with GitHub Copilot, Cursor, Gemini CLI) can start it with the same command, `npx -y pbiplint@0.3.2 mcp`. For a coding assistant's skill, run `npx pbiplint@0.3.2 skill --install <assistant>` (`claude`, `copilot`, `codex`, or `gemini`) in the project's folder.
