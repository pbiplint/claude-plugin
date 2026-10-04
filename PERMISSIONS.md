# What the pbiplint plugin can do

A full list of what the plugin runs, reads, writes, and sends, for anyone deciding whether to install it or reviewing it. It holds for version 0.2.5 of the plugin, which pins pbiplint 0.2.5.

## What it contains

| Component | File | What it is |
| --- | --- | --- |
| A skill | `skills/pbiplint/SKILL.md` | Instructions for Claude: when to run pbiplint, how to read its results, and what to leave to you. It is the file `pbiplint skill` prints, copied from the pbiplint package at 0.2.5. |
| An MCP server | `.mcp.json` | One local server, started as below. |

It has no hooks, no commands, no agents, no executables, and no remote MCP server. It asks for no credentials and no settings.

## The process it starts

- **Command:** `npx -y pbiplint@0.2.5 mcp`, with no other arguments and no environment variables of its own.
- **Package:** [`pbiplint`](https://www.npmjs.com/package/pbiplint) on npm at exactly 0.2.5. It has no runtime dependencies: the MCP SDK and the linter are bundled into one file, `dist/pbiplint.mjs`. Each version is published from its GitHub release tag with npm provenance, so `npm audit signatures` verifies it.
- **Runs as:** your user, with Node.js, in the folder the app starts it in. It talks to the app over stdin and stdout and opens no port. It stops when the app closes its input.

## Its tools

Each tool carries MCP's annotations `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, and `openWorldHint: false`.

| Tool | Input | What it does |
| --- | --- | --- |
| `lint` | `path`, and optionally `quiet`, `rules`, `failOn` | Lints the Power BI project at `path` and returns the findings as JSON, or a short summary with `quiet`. |
| `explain_rule` | `ruleId` | Returns one rule's guidance from the pages bundled in the package. |
| `list_rules` | none | Returns every rule with its severity. |

No tool writes a file, runs a command, or takes a URL.

## What it reads

- **For `lint`:** the files that describe the project under `path`. These are the `.pbip` file, the model's `.tmdl` files, the report's `definition.pbir`, `.platform`, and JSON files, the report or model folder that a `.pbip` or `definition.pbir` points to, and the nearest `pbiplint.config.json` above the project. It lists folders to find those files and opens nothing else. It never enters `.pbi` (Power BI Desktop's local data cache), `.git`, `node_modules`, `StaticResources`, or `CustomVisuals`, and it does not follow a symbolic link below `path`. A project's data is not in these files, so pbiplint never sees it.
- **For `explain_rule` and `list_rules`:** only the package's own files.

## What it writes

Nothing. Its only output is the MCP messages it writes to stdout for the app.

## Network

- **pbiplint:** no network request of any kind. That means no telemetry, no update check, and no account. A check in its repository fails the build if the bundle imports a network module or refers to a network API ([check-network.mjs](https://github.com/pbiplint/pbiplint/blob/main/packages/cli/scripts/check-network.mjs)).
- **npx:** before it starts pbiplint, npx asks the npm registry (`registry.npmjs.org`) for the package, and downloads it on first use. That request names the package and version and carries nothing from your projects. Your npm configuration, a mirror for instance, applies as usual. The plugin ships no `.npmrc` or other package-source settings.
- **The skill:** it tells Claude to run `npx pbiplint` (or an installed `pbiplint`) in its terminal, with `--quiet`, `--rule`, and `explain`. That is the same package, under the same rules. It also tells Claude to read a rule's guidance from `pbiplint explain` rather than fetch the rule's web page.

## Where the findings go

To Claude, and nowhere else. Claude sends what a tool returns, as it does everything it reads, to Anthropic with the rest of the conversation. The findings name the project's tables, columns, measures, pages, and visuals, and its file paths. They hold no data from the model.

## Data handling, in short

| Question | Answer |
| --- | --- |
| Does it read or store personal data? | It reads Power BI project definition files you point it at, which hold object names and file paths, not the model's data. It stores nothing. |
| Does it send data to services other than its declared connectors? | No. It has no connector and makes no network request. npx's package download carries nothing from your projects. |
| How long does it keep data? | It keeps nothing: each call reads, answers, and holds nothing afterwards. |
| Is it intended for people under 18? | It is a developer tool for Power BI projects, not aimed at under-18s. |
