# Release Readiness and Handoff

Prodige prepares a change set for release. It does **not** execute production
deployment, trigger production pipelines, apply infrastructure, or manage
production secrets. Production deployment remains a human/CD responsibility as
defined in `.ai/boundaries/no-production-deploys.md`.

## Use This When

- A feature or milestone is complete.
- You need verification evidence before a release cut.
- You need release notes, rollback notes, migration notes, or a handoff checklist.

## Commands

```text
/ship-check          # Release readiness check
/release             # Advanced release preparation workflow
/verify              # Hard quality gate
```

There is no Prodige command that deploys to production.

## Release Readiness Checklist

- [ ] `/verify` passed with command output captured.
- [ ] Critical review/audit findings are resolved or explicitly accepted.
- [ ] Changelog/release notes are updated.
- [ ] Migration plan is documented when data/schema changes exist.
- [ ] Rollback plan is documented.
- [ ] Human approval is recorded.
- [ ] CD/operator handoff instructions are clear.

## What Prodige May Do

- Run tests, lint, type checks, builds, and audits.
- Prepare release notes.
- Create or suggest tags after approval.
- Prepare deployment handoff documentation.
- Document rollback and monitoring steps.

## What Prodige Must Not Do

- Execute production deployment commands.
- Trigger production CD pipelines.
- Apply infrastructure changes.
- Manage production secrets.
- Monitor or mutate live production systems.

## Output Format

```markdown
## Release Handoff

Status: READY / BLOCKED
Version:
Verification Evidence:
Risks:
Rollback Plan:
Migration Notes:
Human Approval:
Next Owner: Human/CD pipeline

Prodige did not deploy this change.
```
