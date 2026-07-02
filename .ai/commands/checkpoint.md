# /checkpoint

Create a named safe point you can return to later.

## What This Does

Creates a checkpoint without staging or committing user files automatically:

1. Creates an annotated git tag at the current `HEAD`: `checkpoint-<name>`.
2. Snapshots Prodige memory/state files into `.ai/runtime/cache/checkpoints/<name>/`.
3. Saves current working-tree/staged diffs as patch metadata when the tree is dirty.
4. Records checkpoint metadata and audit log.

## Usage

```bash
/checkpoint pre-refactor
/checkpoint

# CLI equivalent
node .ai/scripts/prodige-cli.js checkpoint pre-refactor
```

## Safety Rules

- Never run `git add .`.
- Never commit uncommitted user changes automatically.
- Dirty worktrees are allowed, but diffs are saved as metadata only.
- Use `/rollback <name>` or `node .ai/scripts/prodige-cli.js rollback <name> --yes`
  after reviewing the rollback preview.

## When to Create Checkpoints

- Before major refactoring
- Before experiments
- Before architecture changes
- Before risky operations
- After a known-good verified state
