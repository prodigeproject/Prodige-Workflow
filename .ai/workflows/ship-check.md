# Workflow: Ship Check

## Purpose

Confirm release readiness without executing production deployment.

## Steps

1. Load `.ai/boundaries/no-production-deploys.md`.
2. Run `/verify` as a hard gate.
3. Run `/review` or `/audit` when the change is security-sensitive, large, or risky.
4. Prepare release notes, rollback notes, migration notes, and CD handoff steps.
5. Ask for human approval for the release cut.
6. Stop before any production deploy command or pipeline trigger.

## Output

- Verification evidence
- Known risks
- Human approval status
- Release handoff checklist
- Explicit statement: "Prodige did not deploy this change."
