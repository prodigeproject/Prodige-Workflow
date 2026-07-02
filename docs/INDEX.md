# Prodige Workflow Documentation Index

Documentation organized around one idea: Prodige is a senior engineering
workflow explained in plain language.

## Start Here

| Document | Purpose |
|----------|---------|
| [SETUP.md](./SETUP.md) | Install Prodige and wire AI tools |
| [PLAIN_LANGUAGE_MODE.md](./PLAIN_LANGUAGE_MODE.md) | Run the same senior workflow in plain language |
| [COMPATIBILITY.md](./COMPATIBILITY.md) | Tool and agent integration |
| [USAGE.md](./USAGE.md) | Full workflow walkthrough |
| [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) | Daily command cheat sheet |

Recommended path:

1. Read [SETUP.md](./SETUP.md).
2. Run `/start` (`/session-start` alias).
3. Use `/magic <what you want>`.
4. Run `/verify`.
5. Use `/ship-check` when ready for release handoff.

## Engineering Workflow

| Document | Purpose |
|----------|---------|
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development practices and patterns |
| [HITL_REVIEW_GATES.md](./HITL_REVIEW_GATES.md) | Human approval gates |
| [MULTI_WINDOW_AGENT_GUIDE.md](./MULTI_WINDOW_AGENT_GUIDE.md) | Parallel agent coordination |
| [CACHE_STRATEGY.md](./CACHE_STRATEGY.md) | Token/cache strategy |
| [API.md](./API.md) | API documentation template |

## Release And Operations

| Document | Purpose |
|----------|---------|
| [RELEASE.md](./RELEASE.md) | Release-readiness handoff |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Human/CD deployment template |

Prodige may prepare release and deployment handoff material. It must not execute
production deployment commands, trigger production pipelines, apply
infrastructure, manage production secrets, or mutate live production systems.

## Maintenance

| Area | Files |
|------|-------|
| Boot | `AGENTS.md`, `.ai/boot/BOOT.md` |
| Commands | `.ai/commands/registry.json`, `.ai/commands/*.md` |
| Workflows | `.ai/workflows/*.md` |
| Skills | `.ai/skills/manifest.json`, `.ai/skills/skill-selection-matrix.json` |
| Runtime | `.ai/scripts/*.js`, `.ai/scripts/*.ps1`, `.ai/scripts/*.sh` |
| Governance | `.ai/governance/`, `.ai/boundaries/` |

## Validation

Run these after changing Prodige itself:

```bash
powershell -ExecutionPolicy Bypass -File .ai/scripts/lint-commands.ps1
powershell -ExecutionPolicy Bypass -File .ai/scripts/lint-skills.ps1
powershell -ExecutionPolicy Bypass -File .ai/scripts/lint-runtime.ps1
powershell -ExecutionPolicy Bypass -File .ai/scripts/lint-context.ps1
powershell -ExecutionPolicy Bypass -File .ai/scripts/lint-memory.ps1
node --check .ai/scripts/prodige-cli.js
node --check .ai/scripts/prodige-mcp.js
node --check .ai/scripts/suggest-next-action.js
```
