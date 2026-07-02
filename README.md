# Prodige Workflow

**Prompt-level AI workflow orchestration for safer software engineering.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Workflow_Hardening-yellow.svg)]()
[![MCP](https://img.shields.io/badge/MCP-Enabled-orange.svg)]()

![Prodige Workflow Diagram](docs/prodige_workflow_diagram.png)

Prodige standardizes how AI coding agents plan, build, verify, remember context,
coordinate parallel work, and prepare release handoffs. It is tool-agnostic:
`AGENTS.md` plus the `.ai/` directory are the source of truth.

## Quick Start

One senior workflow, written so any user can run it:

```bash
/start
/magic <what you want>
/ship-check
```

Equivalent explicit session form:

```bash
/session-start
/magic <what you want>
/verify
/session-end
```

`/ship-check` and `/release` prepare release readiness and handoff artifacts.
Prodige does not execute production deployments.

## What Prodige Provides

- Senior engineering workflow with plain-language explanations.
- Command routing through `.ai/commands/registry.json`.
- TDD, verification, review, audit, and HITL gates.
- Memory Bank for cross-session context.
- Safe checkpoint and preview-first rollback.
- MCP tools for context, locks, gates, command registry, next-action suggestions,
  and outcome recording.
- Adapter pointers for tools such as Claude, Gemini, Copilot, Cursor, Cline,
  Windsurf, Devin, and custom agent frameworks.

## Setup

Many tools can read `AGENTS.md` directly. For tools that prefer their own rule
files, generate pointers:

```bash
./install.sh all
powershell -ExecutionPolicy Bypass -File install.ps1 -Tools all
```

MCP-enabled hosts can run:

```bash
node .ai/scripts/prodige-mcp.js
```

Exposed MCP tools include `get_active_context`, `suggest_next_action`,
`get_command_registry`, `get_quality_gates`, lock lifecycle tools, and
`record_outcome`.

## Safety CLI

```bash
node .ai/scripts/prodige-cli.js status
node .ai/scripts/prodige-cli.js checkpoint before-refactor
node .ai/scripts/prodige-cli.js rollback before-refactor
node .ai/scripts/prodige-cli.js rollback before-refactor --yes
```

Checkpoint creates a tag and memory/state snapshot. It never stages or commits
user files automatically. Rollback previews first and requires explicit `--yes`.

## Optional Git Hook

Install a pre-commit template for your stack:

```bash
bash .ai/scripts/install-hook.sh node
powershell -ExecutionPolicy Bypass -File .ai/scripts/install-hook.ps1 -Stack node
```

Hooks are optional local gates, not a replacement for CI.

## Core Commands

| Command | Purpose |
|---------|---------|
| `/start` | Alias for `/session-start` |
| `/magic <task>` | Main path for apps, features, fixes, docs, and audits |
| `/make <task>` | Alias for `/magic <task>` kept for compatibility |
| `/ship-check` | Release-readiness check without production deployment |
| `/session-start` | Load memory and context |
| `/verify` | Run tests, lint, types, build, and available checks |
| `/checkpoint` | Create a safe save point |
| `/rollback` | Preview and restore to a checkpoint |
| `/session-end` | Save memory and outcome context |

See [PRODIGE.md](./PRODIGE.md), [QUICK_REFERENCE.md](./QUICK_REFERENCE.md),
[docs/SETUP.md](./docs/SETUP.md), and
[docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md).

## Repository Layout

```text
.ai/
  agents/        Agent role definitions
  boot/          Mandatory startup sequence
  boundaries/    What Prodige must not do
  commands/      Command specs and registry
  context/       Project documentation templates
  governance/    Rules, quality gates, review gates, debt
  hooks/         Optional pre-commit templates
  memory/        Cross-session Memory Bank
  orchestrator/  Command routing and skill selection
  scripts/       CLI, MCP, lint, review, hook helpers
  skills/        Skill registry and instructions
  workflows/     Workflow definitions
```

## Boundary

Prodige can prepare release notes, rollback notes, migration notes, verification
evidence, and CD handoff instructions. It must not execute production deployment
commands, trigger production pipelines, apply infrastructure, manage production
secrets, or mutate live production systems.
