# Security

The plugin starts the published pbiplint CLI at a pinned version through `npx`, as `pbiplint mcp`, for the MCP server; its skill has Claude run pbiplint from its terminal. pbiplint reads the Power BI project files it is pointed at, writes nothing, and makes no network request; the only request is npm's download of the pinned package on first use. The MCP Bundle in the releases carries the same CLI and downloads nothing.

The MCP server's tools carry MCP's read-only annotation. None of them writes a file or runs a command.

Report a vulnerability privately through GitHub:
[open a draft advisory](https://github.com/pbiplint/claude-plugin/security/advisories/new). Anything in the linter itself belongs in the main repository's advisories at
https://github.com/pbiplint/pbiplint/security.
