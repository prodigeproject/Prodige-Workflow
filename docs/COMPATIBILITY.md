# Compatibility - Run Prodige in AI Tools

Prodige is a **prompt-level workflow**. Its source of truth is `AGENTS.md` plus
the `.ai/` directory. Native `AGENTS.md` support or pointer files make Prodige
easy to load, but they are not a hard runtime sandbox. Use hooks, CI, MCP tools,
and host policy features for enforcement.

## Install Pointers

```bash
./install.sh all
powershell -ExecutionPolicy Bypass -File install.ps1 -Tools all
```

Generated pointers are thin redirects to `AGENTS.md`; they are not second copies
of the workflow.

## Tool Matrix

| Tool / Assistant | Reads | Setup |
|------------------|-------|-------|
| OpenAI Codex / Codex CLI | `AGENTS.md` | Native |
| opencode | `AGENTS.md` | Native |
| Claude Code | `CLAUDE.md` | `install ... claude` |
| Gemini CLI | `GEMINI.md` | `install ... gemini` |
| GitHub Copilot | `.github/copilot-instructions.md`; agent environments may also read `AGENTS.md` | `install ... copilot` |
| Cursor | `.cursor/rules/prodige.mdc`, legacy `.cursorrules`, or `AGENTS.md` where supported | `install ... cursor` |
| Cline | `.clinerules/prodige.md` or `AGENTS.md` where supported | `install ... cline` |
| Windsurf | `.windsurf/rules/prodige.md`, legacy `.windsurfrules`, or `AGENTS.md` where supported | `install ... windsurf` |
| Devin | `.devin/rules/prodige.md` or `AGENTS.md` | `install ... devin` |
| RooCode | `AGENTS.md` where enabled | Usually native |
| Zed / Jules / Factory / custom agents | Depends on configured provider | Point system/project instructions at `AGENTS.md` |
| Hermes / OpenClaw / Pi / custom orchestrators | System prompt or instruction config | Load `AGENTS.md`; optionally connect `node .ai/scripts/prodige-mcp.js` |

## Commands Work Everywhere

Prodige commands are a convention. Once the agent has loaded `AGENTS.md`, a
message like `/magic add login` or `/verify` is resolved through
`.ai/commands/registry.json`, then the matching command spec and workflow are
loaded.

If a host intercepts leading slash commands, use plain language:

```text
prodige make add login
run the verify command
```

## MCP Integration

MCP-enabled hosts can run:

```bash
node .ai/scripts/prodige-mcp.js
```

This exposes context, command registry, quality gates, lock lifecycle tools,
next-action recommendations, and outcome recording.
