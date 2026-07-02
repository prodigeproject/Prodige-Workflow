# /ship-check

Check whether the current work is ready for release handoff.

## Usage

```text
/ship-check
/ship-check v1.2.0
```

## Workflow

Runs `workflows/ship-check.md`.

## Boundary

This command does **not** deploy to production. It prepares release-readiness
evidence, release notes, rollback guidance, and human/CD handoff instructions.
