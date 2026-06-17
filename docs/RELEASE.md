# Release Guide

## Overview

This guide explains how to safely release features to production using the Prodige Workflow.

**Key Principle**: Every release should be **safe, reversible, and well-documented**.

---

## Release Checklist

Before releasing any feature to production, ensure all items are complete:

### ✅ Pre-Release Checklist

- [ ] All **5 HITL Review Gates** passed (PRD → Architecture → Implementation → Review → Release)
- [ ] **Tests pass** (unit, integration, e2e)
- [ ] **Code reviewed** by human or AI reviewer
- [ ] **Documentation updated** (API docs, user guides, README)
- [ ] **Changelog entry** added
- [ ] **Known issues** documented
- [ ] **Rollback plan** exists
- [ ] **Database migrations** tested (if applicable)
- [ ] **Feature flags** configured (if using gradual rollout)
- [ ] **Monitoring/alerts** set up
- [ ] **Deployment notes** written
- [ ] **Stakeholders notified**

---

## Release Types

### 1. Hotfix Release (Critical Bug Fix)

**When**: Production is broken, users impacted

**Process**:
```bash
/fix [critical-bug]              # AI fixes the bug
/review                          # Quick review
/release hotfix [description]    # Deploy immediately
```

**Requirements**:
- Minimal changes (fix only, no refactoring)
- Tests pass
- Can be rolled back
- Deployed within 1 hour

**Example**:
```text
Hotfix: Login broken for users with special characters in email

Changed:
- backend/auth/validate.ts (fixed regex)

Tests: 3 new tests, all pass
Rollback: Revert commit abc123
Deploy: Immediately to production
```

---

### 2. Feature Release (New Functionality)

**When**: Adding new features

**Process**:
```bash
/design [feature]                # Plan feature
/build approved [feature]        # Build after approval
/review                          # Review implementation
/release feature [feature-name]  # Deploy to production
```

**Requirements**:
- All 5 HITL gates passed
- Full test coverage
- Documentation complete
- Gradual rollout (feature flags recommended)

**Example**:
```text
Feature: Email notifications for task due dates

Changed:
- 8 new files (email service, background job, settings UI)
- 3 modified files (user model, settings API, cron config)

Tests: 15 new tests, all pass
Docs: Updated USER_GUIDE.md, API.md
Rollback: Feature flag ENABLE_NOTIFICATIONS=false
Deploy: Staged rollout (10% → 50% → 100% over 3 days)
```

---

### 3. Refactor Release (Code Improvement)

**When**: Improving code quality without changing behavior

**Process**:
```bash
/refactor [module]               # Refactor code
/verify no-behavior-change       # Confirm behavior unchanged
/review                          # Review changes
/release refactor [module-name]  # Deploy to production
```

**Requirements**:
- No behavior changes
- All tests still pass
- Performance not degraded
- High test coverage

**Example**:
```text
Refactor: Extract shared validation logic into utils

Changed:
- 12 files modified (extracted duplicated code)
- 1 new file (validation-utils.ts)

Tests: All 45 existing tests pass, 5 new tests for utils
Behavior: Unchanged (verified by tests)
Performance: Same or better
Rollback: Revert commit def456
Deploy: Standard release (low risk)
```

---

### 4. Database Migration Release

**When**: Changing database schema

**Process**:
```bash
/design [feature-with-db-changes]     # Plan schema changes
/migration plan                       # Create migration plan
/migration test                       # Test on staging
/release migration [migration-name]   # Deploy to production
```

**Requirements**:
- Backward-compatible migrations (no data loss)
- Tested on staging environment
- Backup before migration
- Rollback plan includes data restoration

**Example**:
```text
Migration: Add notifications_enabled column to users table

Changes:
- Add column: notifications_enabled (boolean, default true)
- Add index: idx_users_notifications
- Backfill: All existing users get true

Migration plan:
1. Backup database
2. Run migration (estimated 2 minutes for 10k users)
3. Verify data integrity
4. Deploy code that uses new column

Rollback:
1. Deploy previous code version (ignores new column)
2. Optionally drop column in next maintenance window

Risk: Low (additive change, backward compatible)
Deploy: During low-traffic window (2am-4am)
```

---

## Release Commands

### Prepare Release

```bash
/release prepare [feature-name]
```

AI should:
1. Check all gates passed
2. Generate changelog entry
3. Create deployment notes
4. Identify risks
5. Suggest rollout strategy

**Output**:
```text
Release Preparation: Email Notifications

✅ All gates passed
✅ Tests: 60 pass, 0 fail
✅ Docs: Updated
✅ Migrations: 1 migration ready

Changelog entry:
---
## [1.2.0] - 2025-01-15
### Added
- Email notifications for task due dates
- User notification preferences in settings
- Daily notification job

### Changed
- User model: Added notificationsEnabled, notificationTime fields
---

Deployment notes:
1. Run migration: npm run migrate
2. Set env: ENABLE_NOTIFICATIONS=true
3. Configure cron: 0 9 * * * npm run notify-tasks

Risks:
- Medium: Email service dependency (mitigation: fallback to no-op if service down)
- Low: Performance (background job, no impact on requests)

Rollout strategy:
- Option A: Feature flag rollout (10% → 50% → 100%)
- Option B: Full release (lower risk feature)

Recommendation: Option B (full release)

Approve release? [yes/modify/cancel]
```

---

### Execute Release

```bash
/release deploy [feature-name]
```

AI should:
1. Run migrations (if any)
2. Deploy code
3. Verify deployment
4. Monitor for errors
5. Report status

**Output**:
```text
Deploying: Email Notifications

Step 1/5: Running migrations...
✅ Migration complete (1.8s)

Step 2/5: Deploying code...
✅ Code deployed to production

Step 3/5: Verifying deployment...
✅ Health check passed
✅ New endpoints responding

Step 4/5: Monitoring errors...
⏱️ Watching for 5 minutes...
✅ No errors detected

Step 5/5: Finalizing...
✅ Changelog updated
✅ Release notes published

Release complete! 🎉

Monitor: https://dashboard.example.com/monitoring
Logs: /var/log/app/production.log

Next steps:
- Monitor for 24 hours
- Gather user feedback
- Track email delivery rate
```

---

### Rollback Release

```bash
/release rollback [feature-name]
```

AI should:
1. Identify what was changed
2. Revert code deployment
3. Rollback migrations (if safe)
4. Verify rollback successful
5. Document incident

**Output**:
```text
Rolling back: Email Notifications

Reason: High email bounce rate (60%)

Step 1/4: Reverting code...
✅ Deployed previous version (v1.1.5)

Step 2/4: Checking migrations...
ℹ️  Migration is backward-compatible, leaving in place
ℹ️  New columns will be ignored by old code

Step 3/4: Verifying rollback...
✅ Health check passed
✅ Application stable

Step 4/4: Documenting...
✅ Incident report created: .ai/incidents/2025-01-15-email-rollback.md

Rollback complete.

Root cause: Email validation regex too strict
Fix required: Update validation logic
Re-deploy: After fix tested on staging
```

---

## Gradual Rollout with Feature Flags

For high-risk features, use gradual rollout:

### Step 1: Deploy with Flag Off

```bash
/release deploy [feature] --flag-off
```

Feature is deployed but disabled in production.

---

### Step 2: Enable for 10% of Users

```bash
/release flag [feature] --rollout 10%
```

AI monitors:
- Error rates
- Performance metrics
- User feedback

---

### Step 3: Increase to 50%

```bash
/release flag [feature] --rollout 50%
```

---

### Step 4: Full Rollout

```bash
/release flag [feature] --rollout 100%
```

---

### Rollback Anytime

```bash
/release flag [feature] --rollout 0%
```

Instantly disables feature without deploying code.

---

## Deployment Checklist by Environment

### Development
- ✅ Tests pass locally
- ✅ No lint errors
- ✅ Runs without errors

### Staging
- ✅ Tests pass on staging
- ✅ Manual testing complete
- ✅ Performance acceptable
- ✅ Database migrations tested
- ✅ Integration tests pass

### Production
- ✅ All staging checks passed
- ✅ Backup created
- ✅ Rollback plan ready
- ✅ Monitoring configured
- ✅ Team notified
- ✅ Low-traffic window (if risky)

---

## Post-Release Monitoring

After every release, monitor for:

### First 30 Minutes
- ⏱️ Error rates (should be normal)
- ⏱️ Response times (should be normal)
- ⏱️ User complaints (should be none)

### First 24 Hours
- 📊 Feature usage metrics
- 📊 Error logs
- 📊 Performance trends
- 📊 User feedback

### First Week
- 📈 Business metrics (conversions, engagement)
- 📈 Performance trends
- 📈 Bug reports
- 📈 User satisfaction

---

## Rollback Criteria

Rollback immediately if:
- 🔴 Critical functionality broken
- 🔴 Data loss occurring
- 🔴 Security vulnerability exposed
- 🔴 Error rate >5%
- 🔴 Performance degradation >50%

Consider rollback if:
- 🟡 Non-critical bugs affecting >20% users
- 🟡 Performance degradation >20%
- 🟡 Negative user feedback overwhelming
- 🟡 Feature causing confusion

---

## Best Practices

### For Non-Technical Users
1. **Always test on staging first** - Never skip this step
2. **Release during low-traffic hours** - Minimize impact if issues occur
3. **Have someone available for 1 hour post-release** - Quick response to issues
4. **Use feature flags for risky features** - Easy rollback without deployment

### For Technical Users
1. **Keep releases small** - Easier to review, test, and rollback
2. **Use semantic versioning** - Major.Minor.Patch (1.2.3)
3. **Tag releases in git** - `git tag v1.2.0`
4. **Write clear changelog entries** - What changed, why, and impact
5. **Monitor logs actively post-release** - First 30 minutes are critical
6. **Have rollback plan before deploying** - Know exactly how to undo

---

## Release Templates

### Changelog Template

```markdown
## [1.2.0] - 2025-01-15

### Added
- Feature X that does Y
- Feature Z that does W

### Changed
- Improved performance of module A
- Updated dependencies (library B to v2.0)

### Fixed
- Bug where X happened under Y conditions
- Issue with Z on mobile devices

### Deprecated
- Feature Q (will be removed in v2.0)

### Security
- Fixed XSS vulnerability in input field
```

---

### Deployment Notes Template

```markdown
## Deployment Notes: [Feature Name]

### Prerequisites
- [ ] Database backup created
- [ ] Migrations tested on staging
- [ ] Feature flag configured (if using)

### Steps
1. Run migrations: `npm run migrate`
2. Deploy code: `git pull && npm run build && pm2 restart app`
3. Set environment variables: `ENABLE_FEATURE=true`
4. Verify deployment: `curl /health`

### Rollback Steps
1. Set environment variables: `ENABLE_FEATURE=false`
2. Revert code: `git checkout v1.1.5 && npm run build && pm2 restart app`
3. Rollback migration (if needed): `npm run migrate:rollback`

### Monitoring
- Watch error logs: `tail -f /var/log/app/error.log`
- Monitor dashboard: https://dashboard.example.com
- Check Slack alerts: #production-alerts

### Expected Impact
- User-facing: New notifications feature visible
- Performance: +5ms average response time
- Database: +500KB/day storage growth

### Risk Level
Low - Feature is optional and can be disabled via flag
```

---

## Troubleshooting

### Problem: Deployment Failed

**Solution**:
```bash
/release diagnose [feature]
```

AI checks:
- Build errors
- Migration errors
- Configuration issues
- Dependency problems

---

### Problem: Need Emergency Rollback

**Solution**:
```bash
/release rollback [feature] --emergency
```

Fastest rollback path (may skip some validation steps).

---

### Problem: Unsure if Release is Safe

**Solution**:
```bash
/release risk-assessment [feature]
```

AI evaluates:
- Complexity of changes
- Test coverage
- Areas affected
- Rollback difficulty
- Recommends strategy

---

## Summary

**Release workflow**:
1. Prepare: `/release prepare [feature]` → Review checklist
2. Deploy: `/release deploy [feature]` → Monitor closely
3. Verify: Check metrics, logs, user feedback
4. Rollback if needed: `/release rollback [feature]`

**Key principles**:
- Small, frequent releases > large, rare releases
- Always have rollback plan
- Monitor actively post-release
- Use feature flags for risky changes
- Document everything

**Remember**: A good release is boring. No surprises, no emergencies, just smooth deployment.
