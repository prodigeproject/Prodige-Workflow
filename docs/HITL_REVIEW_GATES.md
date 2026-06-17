# Human-in-the-Loop (HITL) Review Gates

## Overview

AI should not jump from idea directly to code. This workflow enforces **5 mandatory review gates** where human approval is required before proceeding.

These gates prevent:
- ❌ Unnecessary rewrites
- ❌ Architectural mistakes
- ❌ Scope creep
- ❌ Production incidents
- ❌ Technical debt

---

## The 5 Required Gates

```text
Idea → [PRD Gate] → [Architecture Gate] → [Implementation Gate] → [Review Gate] → [Release Gate] → Production
         ↑              ↑                     ↑                      ↑                ↑
      Human OK       Human OK              Human OK             Human OK         Human OK
```

Each gate requires **explicit human approval** before moving forward.

---

## Gate 1: PRD Gate (Product Requirements)

### Purpose
Ensure the problem is well-defined before any design work begins.

### Checklist

**Must Have**:
- [ ] Problem statement is clear and specific
- [ ] User flow is documented (who does what, when)
- [ ] Acceptance criteria are measurable
- [ ] Scope is defined (what's included)
- [ ] Non-goals are explicit (what's excluded)
- [ ] Success metrics are defined

**Good Example**:
```text
Problem: Users cannot save draft forms, losing data on accidental page refresh
User Flow: User fills form → clicks "Save Draft" → sees confirmation → can resume later
Acceptance Criteria:
  - Draft saves automatically every 30 seconds
  - Draft persists for 7 days
  - User can have max 10 drafts
Scope: Form autosave for logged-in users
Non-Goals: Anonymous user drafts, version history
Success: <5% form abandonment rate
```

**Bad Example**:
```text
Problem: Forms are bad
Solution: Make forms better
```

### AI Must Ask
- "What specific problem are users facing?"
- "What does success look like?"
- "What should I NOT build?"

---

## Gate 2: Architecture Gate

### Purpose
Validate technical approach before implementation planning.

### Checklist

**Must Have**:
- [ ] Data flow diagram exists
- [ ] Affected systems/modules are identified
- [ ] Dependencies (internal/external) are listed
- [ ] Risks and mitigations are documented
- [ ] Alternative approaches were considered
- [ ] Performance/scale implications noted
- [ ] Security implications reviewed

**Good Example**:
```text
Data Flow:
  Frontend form → API endpoint → Validation layer → Database → Cache update

Affected Systems:
  - Form component (frontend)
  - Draft API (backend)
  - PostgreSQL drafts table
  - Redis cache

Dependencies:
  - New database table: drafts
  - New Redis cache key pattern: draft:{userId}:{formId}

Risks:
  - Database growth (mitigation: 7-day TTL + cleanup job)
  - Cache invalidation (mitigation: write-through pattern)

Alternatives Considered:
  1. LocalStorage only (rejected: no cross-device sync)
  2. NoSQL store (rejected: overkill for this use case)

Performance: +10ms API latency, +500KB DB growth/day
Security: Drafts must be user-scoped, no IDOR vulnerabilities
```

### AI Must Ask
- "What systems will this affect?"
- "What are the risks?"
- "Did we consider simpler alternatives?"

---

## Gate 3: Implementation Gate

### Purpose
Ensure implementation is planned before writing code.

### Checklist

**Must Have**:
- [ ] File plan exists (which files to create/modify)
- [ ] Work is split into small modules/PRs
- [ ] Tests are planned (unit, integration, e2e)
- [ ] Rollback plan exists
- [ ] Migration plan exists (if needed)
- [ ] Estimated effort is realistic

**Good Example**:
```text
Files to Create:
  - backend/api/drafts.ts (new)
  - backend/models/Draft.ts (new)
  - frontend/components/DraftSaver.tsx (new)

Files to Modify:
  - backend/database/schema.sql (add drafts table)
  - frontend/components/FormContainer.tsx (integrate DraftSaver)

Test Plan:
  - Unit: Draft model validation
  - Integration: Draft API endpoints
  - E2E: Full save/restore flow

Rollback:
  - Feature flag: ENABLE_DRAFTS (default: false)
  - No breaking changes to existing form logic

Migration:
  - Add drafts table (backward compatible)
  - No data migration needed (new feature)

Effort: 3 PRs, ~8 hours total
```

### AI Must Ask
- "Should this be one PR or multiple?"
- "How do we roll back if this breaks?"
- "What migrations are needed?"

---

## Gate 4: Review Gate

### Purpose
Validate implementation quality before merging.

### Checklist

**Must Have**:
- [ ] Code works as specified
- [ ] All tests pass (unit, integration, e2e)
- [ ] No critical security issues
- [ ] No unnecessary rewrites of working code
- [ ] Documentation is updated
- [ ] Context files are synced
- [ ] Performance is acceptable
- [ ] Error handling is robust

**Security Checks**:
- SQL injection prevention
- XSS prevention
- Authentication/authorization
- Input validation
- Sensitive data handling

**Code Quality**:
- Follows project conventions
- No dead code
- Reasonable complexity
- Clear variable names

### AI Must Report
```text
✅ All tests pass (15 unit, 5 integration, 2 e2e)
✅ No security issues found
✅ Performance: Draft save <50ms
✅ Docs updated: API.md, USER_GUIDE.md
⚠️  Warning: Draft cleanup job needs cron setup
```

---

## Gate 5: Release Gate

### Purpose
Ensure production readiness before deployment.

### Checklist

**Must Have**:
- [ ] Changelog is updated
- [ ] Known issues are documented
- [ ] Deployment notes are ready
- [ ] Rollback path is clear
- [ ] Monitoring/alerts are configured
- [ ] Stakeholders are notified
- [ ] Feature flags are configured (if used)

**Good Example**:
```text
Changelog Entry:
  [Feature] Form draft autosave
  - Users can now save form progress
  - Drafts persist for 7 days
  - Max 10 drafts per user

Known Issues:
  - Draft cleanup job requires manual cron setup (see DEPLOY.md)

Deployment Notes:
  1. Run migration: npm run migrate
  2. Set ENABLE_DRAFTS=true in production env
  3. Setup cron: 0 2 * * * npm run cleanup-drafts

Rollback:
  - Set ENABLE_DRAFTS=false
  - No data loss (existing drafts remain in DB)

Monitoring:
  - Track: draft_save_success_rate
  - Alert: draft_save_latency > 500ms
```

### AI Must Ask
- "Is this safe to deploy to production?"
- "What happens if we need to roll back?"
- "Who needs to know about this release?"

---

## For Non-Technical Users

You don't need to understand all technical details. Just ensure AI **stops and explains** at each gate:

1. **PRD Gate**: "Here's what I understood. Is this correct?"
2. **Architecture Gate**: "Here's how I'll build it. Does this make sense?"
3. **Implementation Gate**: "Here's my plan. Should I proceed?"
4. **Review Gate**: "Here's what I built. Does it work correctly?"
5. **Release Gate**: "Here's how we'll release. Ready to deploy?"

**Always say "wait" if you're unsure.** It's better to ask questions than to approve blindly.

---

## For Technical Users

### Command Integration

```bash
# AI should pause at each gate
/design [feature]          # Stops at PRD Gate and Architecture Gate
/build approved [feature]  # Requires Gate 1-3 passed
/review [PR]               # Review Gate
/release prepare           # Release Gate
```

### Gate Override (Use Carefully)

```bash
/skip-gate prd            # Skip PRD gate (not recommended)
/force-build              # Skip to implementation (risky)
```

**Warning**: Skipping gates increases risk of rework and production issues.

---

## Troubleshooting

### AI Skips Gates

**Problem**: AI jumps straight to code without asking

**Solution**: Add to prompt:
```text
Use HITL gates. Stop at each gate for approval.
```

### Too Many Questions

**Problem**: AI asks too many trivial questions

**Solution**: Pre-approve low-risk changes:
```text
Auto-approve: bug fixes, tests, docs, refactors that don't change behavior
```

### Unclear What to Approve

**Problem**: AI's gate summary is too technical

**Solution**: Ask AI:
```text
Explain this in simple terms. What changes, what risks, what's the impact?
```

---

## Benefits

### For Solo Developers
- Fewer bugs in production
- Less rework from bad assumptions
- Better documentation
- Clear rollback paths

### For Teams
- Shared understanding of changes
- Audit trail of decisions
- Reduced "why did we build it this way?" questions
- Safer deployments

### For Non-Technical Stakeholders
- Clear visibility into what's being built
- Ability to course-correct early
- Confidence in AI-generated code
- Reduced surprise production issues
