#!/bin/sh
# Builds pbiplint-<version>.mcpb, the MCP Bundle for Claude Desktop's chat, from the published
# pbiplint package at the version mcpb/manifest.json names. Run from the repository root:
#   sh scripts/build-mcpb.sh
# The version must match .claude-plugin/plugin.json's and be on npm.
# The bundle holds the CLI's single-file build, its LICENSE and NOTICE, and the manifest.
set -eu
version=$(node -p 'require("./mcpb/manifest.json").version')
plugin=$(node -p 'require("./.claude-plugin/plugin.json").version')
[ "$version" = "$plugin" ] || { echo "mcpb/manifest.json says $version, plugin.json says $plugin" >&2; exit 1; }
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
npm pack "pbiplint@$version" --pack-destination "$stage" >/dev/null
tar -xzf "$stage/pbiplint-$version.tgz" -C "$stage"
mkdir -p "$stage/bundle/server"
cp "$stage/package/dist/pbiplint.mjs" "$stage/bundle/server/"
cp "$stage/package/LICENSE" "$stage/package/NOTICE" "$stage/bundle/"
cp mcpb/manifest.json "$stage/bundle/"
npx -y @anthropic-ai/mcpb@2.1.2 validate "$stage/bundle/manifest.json"
npx -y @anthropic-ai/mcpb@2.1.2 pack "$stage/bundle" "pbiplint-$version.mcpb"
echo "wrote pbiplint-$version.mcpb"
