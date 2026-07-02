# /rollback

Preview and restore code plus Prodige memory/state to a previous checkpoint.

## Usage

```bash
/rollback
/rollback pre-refactor

# CLI equivalent. The CLI previews first; --yes is required to execute.
node .ai/scripts/prodige-cli.js rollback pre-refactor
node .ai/scripts/prodige-cli.js rollback pre-refactor --yes
```

## What This Does

1. Lists checkpoints when no name is provided.
2. Shows a committed diff preview from checkpoint to current `HEAD`.
3. Warns when uncommitted changes exist.
4. Requires explicit confirmation before reset.
5. Writes a rollback safety patch under `.ai/runtime/cache/rollback-backups/`.
6. Runs `git reset --hard <checkpoint-commit>` only after approval.
7. Restores Prodige memory/state snapshots.

## Safety Features

- Preview-first by default.
- Explicit confirmation required.
- Safety patch written before reset.
- Git reflog still preserves prior commits.
- No production deployment or external infra action is performed.

## Recovery

If rollback was a mistake:

```bash
git reflog
git reset --hard <previous-commit>

# If you had uncommitted changes, inspect the safety patch:
git apply --stat .ai/runtime/cache/rollback-backups/<file>.patch
```
