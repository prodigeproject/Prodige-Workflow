# Prodige Workflow - Quick Reference

## Default Path

```bash
/start
/magic <what you want>
/ship-check
```

## Explicit Session Form

```bash
/session-start
/magic <what you want>
/verify
/session-end
```

## Commands

| Command | Use |
|---------|-----|
| `/start` | Alias for `/session-start` |
| `/ship-check` | Check release readiness; no production deployment |
| `/session-start` | Load Memory Bank |
| `/magic <task>` | Main senior workflow, explained in plain language |
| `/make <task>` | Alias for `/magic <task>` kept for compatibility |
| `/design` | Plan feature/product/architecture changes |
| `/build` | Implement approved design |
| `/fix` | Debug and fix an issue |
| `/review` | Review code quality |
| `/audit` | Audit security, dependencies, performance, accessibility, and debt |
| `/verify` | Run quality gates |
| `/checkpoint <name>` | Create a safe save point |
| `/rollback <name>` | Preview and restore a checkpoint |
| `/session-end` | Save memory and outcome context |

## Safety

```bash
node .ai/scripts/prodige-cli.js checkpoint before-risky-change
node .ai/scripts/prodige-cli.js rollback before-risky-change
node .ai/scripts/prodige-cli.js rollback before-risky-change --yes
```

Checkpoint never stages or commits user files automatically. Rollback previews
first and requires explicit confirmation.

## Daily Loop

```bash
/session-start
/magic add invoice export
/verify
/session-end
```

## Release Loop

```bash
/verify
/review
/ship-check
```

Prodige prepares handoff artifacts. Human/CD systems own production deployment.

## Help

- Full guide: [PRODIGE.md](./PRODIGE.md)
- Setup: [docs/SETUP.md](./docs/SETUP.md)
- Compatibility: [docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md)
