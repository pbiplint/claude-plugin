# Releasing the plugin

Each plugin release pins one pbiplint version: the MCP server runs `npx -y pbiplint@<version> mcp`, the bundled skill is that version's, and the MCP Bundle carries that version's CLI. So a plugin release follows a pbiplint release on npm, and takes its number: plugin v0.2.5 pins pbiplint 0.2.5.

## After a pbiplint release

Once `npm view pbiplint@<version> version` prints the new version:

1. **Pin the version.** On a branch from main, set the new version in each file that names it:
   - `.claude-plugin/plugin.json`: `version`.
   - `.mcp.json`: the `pbiplint@<version>` argument.
   - `mcpb/manifest.json`: `version`.
   - README.md, SETUP.md, and PERMISSIONS.md: every `pbiplint@<version>` and `pbiplint-<version>.mcpb`.

   `.claude-plugin/marketplace.json` names no version, so `plugin.json`'s is the one users see.
2. **Refresh the skill** from the published package, from the repository root:

   ```bash
   npx -y pbiplint@<version> skill > skills/pbiplint/SKILL.md
   ```

   Its description ends `pbiplint <version>.`, and `metadata.version` names the same version.
3. **Check the pins:** `node scripts/check-pins.mjs` fails on any file that names another version.
4. **Build the MCP Bundle** from the published package:

   ```bash
   sh scripts/build-mcpb.sh
   ```

   It refuses to build when `mcpb/manifest.json` and `plugin.json` disagree. It writes `pbiplint-<version>.mcpb` at the root, which git ignores. Note its sha256 (`shasum -a 256 pbiplint-<version>.mcpb`) for the release notes.
5. **Pull request.** Commit as `chore: release v<version>`, open a pull request, and let CI pass. CI validates both manifests and the MCP Bundle's manifest, and checks the pins. Merge.
6. **Tag.** The maintainer tags the merge commit and pushes the tag:

   ```bash
   git fetch origin main && git tag -a v<version> -m "pbiplint for Claude <version>" origin/main && git push origin v<version>
   ```

7. **GitHub release.** Create the release on the tag, with `pbiplint-<version>.mcpb` attached:

   ```bash
   gh release create v<version> --repo pbiplint/claude-plugin --title "pbiplint for Claude <version>" --notes-file <notes> --verify-tag pbiplint-<version>.mcpb
   ```

   The notes say what changed, give the two install routes, link pbiplint's release of the same version, and end with the bundle's sha256. v0.2.5's notes are the model.
8. **Verify from GitHub,** in a clean Claude Code configuration so nothing of yours is touched:

   ```bash
   export CLAUDE_CONFIG_DIR=$(mktemp -d)
   claude plugin marketplace add pbiplint/claude-plugin
   claude plugin install pbiplint@pbiplint
   claude plugin list            # pbiplint@pbiplint, the new version, enabled
   unset CLAUDE_CONFIG_DIR
   ```

   Download the release's `.mcpb` and check that its sha256 matches the one in the notes.

Users who added the marketplace get the new version with `/plugin marketplace update pbiplint`, and Claude Desktop's chat users install the new `.mcpb` over the old one.

## The directory listing (optional)

The plugin does not need Anthropic's directory: the repository is its own marketplace. A listing, if there is one, is submitted at claude.ai/directory/manage as a plugin bundle from this repository, and follows the tracked branch or tag after that (the directory's [Update a published plugin](https://claude.com/docs/plugins/submit#update-a-published-plugin)). How a new version reaches a listing here, and whether each one is held for a reviewer, is unconfirmed until we have done it once. Write down what happened here then.

`plugin.json` already carries the fields a listing reads (`author`, `homepage`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`), and PERMISSIONS.md is the inventory a submission asks for.

## Pinned versions

- **GitHub's own actions** (`actions/checkout`, `actions/setup-node`) are pinned by major, as in the main repository and pbiplint/action, and Dependabot proposes the bumps.
- **The validators** in `.github/workflows/ci.yml`, `@anthropic-ai/claude-code` and `@anthropic-ai/mcpb`, are pinned by hand, since the plugin keeps no `package.json` (a lockfile at a plugin's root makes Claude Code install its packages for every user). Move them now and then, and when a validator's rules change.
