# PRODIGE Workflow Guide

Prodige is a prompt-level AI workflow system for building software with planning,
verification, memory, safety, and release-readiness gates.

## Start Here

Default path:

```bash
/start
/magic <what you want>
/ship-check
```

Explicit session form:

```bash
/session-start
/magic <what you want>
/verify
/session-end
```

Prodige recommends the next safe command and asks for approval at gated steps.

## How It Works

1. `AGENTS.md` boots the workflow.
2. `.ai/boot/BOOT.md` loads memory, boundaries, context, orchestrator, and skills.
3. `/commands` route through `.ai/commands/registry.json`.
4. Workflows load the required skills from `.ai/skills/skill-selection-matrix.json`.
5. Verification evidence is required before claiming completion.
6. Session-end records memory and outcome data for continuous improvement.

## Main Commands

| Command | Purpose |
|---------|---------|
| `/start` | Alias for `/session-start` |
| `/ship-check` | Check release readiness without deploying |
| `/magic <task>` | Main senior workflow router, explained in plain language |
| `/make <task>` | Alias for `/magic <task>` kept for compatibility |
| `/design` | Produce or update PRD, architecture, and implementation plan |
| `/build` | Implement an approved design with TDD |
| `/fix` | Diagnose and fix a bug systematically |
| `/review` | Review recent or proposed changes |
| `/audit` | Security, dependency, performance, accessibility, and debt review |
| `/verify` | Run automated quality gates |
| `/checkpoint` | Create a safe save point |
| `/rollback` | Preview and restore a checkpoint |
| `/session-end` | Save Memory Bank and outcome context |

## Safety Model

- No production deployment execution.
- HITL approval for high-impact work.
- TDD required for production code changes.
- Checkpoint never stages or commits files automatically.
- Rollback previews first and requires explicit confirmation.
- Hooks and CI are used for hard enforcement where available.

## Tool Compatibility

Prodige is tool-agnostic. Use `AGENTS.md` directly where supported, or generate
thin pointers:

```bash
./install.sh all
powershell -ExecutionPolicy Bypass -File install.ps1 -Tools all
```

MCP-enabled tools can run:

```bash
node .ai/scripts/prodige-mcp.js
```

See [docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md).

## Memory Bank

The Memory Bank stores active context, decisions, conventions, progress,
session history, and review-learning patterns. Use `/start` or `/session-start`
before work and `/session-end` after work.

## Release Boundary

Prodige prepares release-readiness evidence and handoff notes. It does not run
production deployment commands, trigger production pipelines, apply
infrastructure, manage production secrets, or mutate live production systems.

## Documentation

- [README.md](./README.md) - project overview
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - daily cheat sheet
- [docs/SETUP.md](./docs/SETUP.md) - installation and setup
- [docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md) - AI tool integration
- [docs/PLAIN_LANGUAGE_MODE.md](./docs/PLAIN_LANGUAGE_MODE.md) - plain-language usage of the same senior workflow
- [docs/RELEASE.md](./docs/RELEASE.md) - release-readiness handoff
