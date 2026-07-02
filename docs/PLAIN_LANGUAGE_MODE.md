# Plain-Language Mode

Prodige is not split by user type. There is one senior engineering workflow.
This guide explains how to run it in plain language.

The goal is simple: a user can describe the product outcome they want, while the
agent applies senior engineering discipline behind the scenes: context loading,
planning, tradeoff explanation, HITL gates, TDD, verification, review, memory,
and release-readiness handoff.

## Core Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/start` | Alias for `/session-start`; load project context | `/start` |
| `/magic ...` | Main command for building, fixing, auditing, or documenting | `/magic add user login` |
| `/ship-check` | Check release readiness without deploying to production | `/ship-check` |

`/make ...` is accepted only as a compatibility alias for `/magic ...`.

## How the Agent Should Speak

For every important step, the agent should explain:

- What it understood.
- What it will change.
- Why the change matters.
- What risks or tradeoffs exist.
- What requires approval.
- What command or action comes next.

The agent should use precise engineering judgment without forcing the user to
learn implementation jargon before they can make a decision.

## Example

```text
User: /magic add email notifications when a task is due

Agent:
I understand you want users to receive an email reminder when a task is due.

Plan:
1. Check the current task and user model.
2. Design notification preferences and email scheduling.
3. Add tests before implementation.
4. Implement the smallest working version.
5. Run verification.

Tradeoff:
- Daily email is simpler and cheaper than real-time scheduling.
- Real-time scheduling can be added later if users need it.

Approval needed:
Should reminders be daily at a fixed time first?
```

## When the Agent Must Stop

The agent must ask for approval before:

- Architecture changes.
- Database migrations.
- Authentication, payment, or permission changes.
- Data deletion.
- New paid services.
- High-impact dependency changes.
- Release handoff.

## Release Boundary

Use `/ship-check` when work appears ready. Prodige prepares verification
evidence, release notes, rollback notes, and human/CD handoff instructions. It
does not execute production deployment.

## User Prompts That Work Well

```text
/magic build a task tracker where teams can assign work and comment
/magic fix login not redirecting after password reset
/magic audit whether this app is ready for enterprise customers
/magic explain the safest way to add payments
```

## Summary

Use `/start`, then `/magic <what you want>`, then `/ship-check` when the work is
ready for release review. The workflow remains senior-engineering-grade; the
communication stays plain enough for any user to operate.
