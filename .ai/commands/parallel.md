# /parallel

Mempersiapkan dan mengelola eksekusi multi-window agent untuk pekerjaan paralel yang kompleks dengan koordinasi, snapshot, dan merge yang aman.

## Syntax

```
/parallel <action> <workspace-name>
```

## Actions

### 1. `build` - Persiapan Parallel Workspace
Membuat snapshot dan menyiapkan multiple agent sessions.

```bash
/parallel build <workspace-name>
```

**Process:**
1. Create state snapshot
2. Create isolated sessions
3. Assign agent roles
4. Create file locks (jika diperlukan)
5. Generate handoff templates
6. Initialize merge tracking

**Output:**
```
.ai/runtime/parallel/<workspace-name>/
├── snapshot/
│   ├── state.json
│   └── files.json
├── sessions/
│   ├── session-1/
│   ├── session-2/
│   └── session-3/
├── locks.json
├── roles.json
└── handoff-templates/
```

### 2. `merge` - Merge Parallel Work
Menggabungkan output dari parallel sessions.

```bash
/parallel merge <workspace-name>
```

**Process:**
1. Verify all handoffs received
2. Check for conflicts
3. Merge non-conflicting changes
4. Flag conflicts for review
5. Run validation
6. Update main state

**Safety Checks:**
- All agents completed handoff?
- No lock violations?
- Tests passing?
- No merge conflicts?

### 3. `resolve` - Resolve Conflicts
Menyelesaikan conflicts dari parallel merge.

```bash
/parallel resolve <workspace-name>
```

**Interactive Process:**
1. Show conflict list
2. Present resolution options
3. Apply selected resolution
4. Re-run tests
5. Complete merge

### 4. `status` - Check Parallel Status
Melihat status parallel workspace.

```bash
/parallel status <workspace-name>
```

**Output:**
- Active sessions count
- Completion status per session
- Lock status
- Pending handoffs
- Conflict summary

### 5. `abort` - Cancel Parallel Work
Membatalkan parallel workspace dan rollback.

```bash
/parallel abort <workspace-name>
```

**Warning:** This will discard all parallel work!

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `action` | Yes | Operation: `build`, `merge`, `resolve`, `status`, `abort` | `build` |
| `workspace-name` | Yes | Unique identifier untuk parallel workspace | `feature-auth` |

## Rules & Constraints

### Core Rules

1. **Create Snapshot**
   - Capture complete state sebelum parallel work
   - Include: code, state, cache, dependencies
   - Store in isolated location

2. **Create Sessions**
   - One session per parallel agent
   - Isolated working directory
   - Independent cache per session

3. **Assign Roles**
   - Clear agent responsibilities
   - No overlapping file ownership
   - Defined interfaces between agents

4. **Create Locks**
   - Lock files being modified
   - Prevent concurrent edits
   - Track lock ownership

5. **Require Handoff**
   - Every agent must complete handoff
   - Handoff includes: changes, tests, documentation
   - No merge without complete handoffs

6. **Reviewer Merges**
   - Designated reviewer agent
   - Validates all changes
   - Resolves conflicts
   - Final approval before merge

### Lock Rules

```yaml
lock_rules:
  - exclusive_write: true
  - shared_read: true
  - lock_timeout: 30m
  - force_unlock_requires_approval: true
```

### Handoff Requirements

```yaml
handoff_required:
  - changes_list: yes
  - tests_passed: yes
  - documentation_updated: yes
  - peer_review: optional
  - integration_notes: yes
```

## Examples

### Basic Parallel Workflow

```bash
# 1. Build parallel workspace
/parallel build feature-payment

# Output:
# ✓ Snapshot created
# ✓ 3 sessions initialized
# ✓ Roles assigned:
#   - Session 1: Frontend (components/payment/)
#   - Session 2: Backend (api/payment/)
#   - Session 3: Tests (tests/payment/)
# ✓ Locks created
# ✓ Ready for parallel work

# 2. Agents work independently in separate windows
# Window 1: Frontend agent works
# Window 2: Backend agent works
# Window 3: QA agent writes tests

# 3. Check status
/parallel status feature-payment

# Output:
# Session 1: ✓ Complete (handoff received)
# Session 2: ⏳ In progress
# Session 3: ✓ Complete (handoff received)
# Locks: 2/3 released
# Conflicts: None detected

# 4. Merge when all complete
/parallel merge feature-payment

# Output:
# ✓ All handoffs verified
# ✓ No conflicts detected
# ✓ Tests passed
# ✓ Merge complete
# ✓ Locks released
```

### Complex Multi-Agent Scenario

```bash
# Large feature requiring 5 agents
/parallel build checkout-system

# Assigned roles:
# 1. Frontend Agent: UI components
# 2. Backend Agent: API endpoints
# 3. Database Agent: Schema & migrations
# 4. Integration Agent: Payment gateway
# 5. QA Agent: E2E tests

# Agents work in parallel...

# Check progress
/parallel status checkout-system

# When conflicts detected
/parallel merge checkout-system
# Output: ⚠ 3 conflicts detected

# Resolve conflicts
/parallel resolve checkout-system

# Interactive resolution UI:
# Conflict 1: payment.service.ts
#   Session 2: Added method processPayment()
#   Session 4: Added method handlePayment()
# Resolution options:
#   1. Keep Session 2
#   2. Keep Session 4
#   3. Keep both (rename one)
#   4. Manual merge
# > Choice: 3

# Complete merge
/parallel merge checkout-system
# ✓ Merge complete with resolved conflicts
```

### Emergency Abort

```bash
# Something went wrong
/parallel abort feature-broken

# Confirmation prompt:
# ⚠ WARNING: This will discard all parallel work!
# Continue? (yes/no): yes

# Output:
# ✓ Parallel sessions terminated
# ✓ Locks released
# ✓ State rolled back to snapshot
# ✓ Workspace cleaned
```

## Handoff Process

### Agent Handoff Template

Each agent must complete handoff dengan format:

```markdown
# Handoff Report - [Agent Name] - [Workspace]

## Changes Made
- File1: Added feature X
- File2: Fixed bug Y
- File3: Updated documentation

## Tests
- Unit tests: ✓ 15/15 passing
- Integration tests: ✓ 3/3 passing
- Manual testing: ✓ Complete

## Documentation
- README updated: Yes
- API docs updated: Yes
- Comments added: Yes

## Integration Notes
- Depends on: Session 2 (backend API)
- Provides: Payment UI components
- Breaking changes: None

## Reviewer Notes
- Edge case handling: Verified
- Error handling: Comprehensive
- Performance: Acceptable (< 100ms)

## Status
✓ Ready for merge
```

### Handoff Verification

System verifies:
1. All required sections present
2. Tests passed
3. No lock violations
4. Dependencies satisfied
5. Code quality checks passed

## Error Handling

### Incomplete Handoffs
**Error:** `Cannot merge: Missing handoffs from Session 2, Session 4`

**Solution:**
```bash
# Check which sessions incomplete
/parallel status workspace-name

# Wait for agents to complete
# Or abort if blocked
/parallel abort workspace-name
```

### Merge Conflicts
**Error:** `Merge failed: 5 conflicts detected`

**Solution:**
```bash
# Enter conflict resolution mode
/parallel resolve workspace-name

# Follow interactive prompts
# Or abort and redo manually
```

### Lock Timeout
**Warning:** `Lock timeout: payment.service.ts held by Session 2 for 35min`

**Solution:**
```bash
# Contact Session 2 agent
# Or force unlock (requires approval)
/parallel status workspace-name --force-unlock payment.service.ts
```

### Snapshot Corruption
**Error:** `Snapshot corrupted or missing`

**Solution:**
```bash
# Cannot recover, abort parallel work
/parallel abort workspace-name

# Restore from git
git reset --hard HEAD

# Retry from scratch
/parallel build workspace-name
```

## Best Practices

### 1. Clear Role Assignment
```bash
# Define clear boundaries
/parallel build feature-x

# Roles should be:
# - Non-overlapping file ownership
# - Clear interfaces between agents
# - Defined dependencies
```

### 2. Regular Status Checks
```bash
# Check status every 15-30 minutes
/parallel status workspace-name

# Catch issues early
# Adjust if agent blocked
```

### 3. Incremental Handoffs
```bash
# Don't wait until end
# Agent should handoff incrementally
# Reduces merge conflicts
```

### 4. Test Before Handoff
```bash
# Each agent runs tests before handoff
# Ensures quality
# Reduces merge issues
```

### 5. Communication Protocol
```bash
# Agents should log:
# - Starting work
# - Blocking issues
# - Completing milestones
# - Ready for handoff

# In .ai/runtime/parallel/<workspace>/communication.log
```

### 6. Snapshot Validation
```bash
# Before starting parallel work
/sync                          # Ensure clean state
/parallel build workspace-name # Create snapshot

# Snapshot is your rollback point
```

## Performance Considerations

### Optimal Session Count
- **2-3 sessions:** Sweet spot untuk most tasks
- **4-5 sessions:** Large features, careful coordination
- **6+ sessions:** Rare, high coordination overhead

### Session Duration
- **Short (< 1h):** Ideal, low conflict risk
- **Medium (1-3h):** Acceptable, monitor closely
- **Long (> 3h):** Risky, consider breaking down

### Lock Granularity
```bash
# Fine-grained locks (file-level)
lock: src/payment/service.ts

# Coarse-grained locks (directory-level)
lock: src/payment/

# Recommendation: File-level untuk most cases
```

## Conflict Resolution Strategies

### 1. Automatic Resolution
```bash
# For non-conflicting changes
/parallel merge workspace-name --auto-resolve

# Applies safe merges automatically
```

### 2. Manual Resolution
```bash
# For complex conflicts
/parallel resolve workspace-name

# Interactive 3-way merge tool
# Shows: base, session-1, session-2
# Choose or combine
```

### 3. Agent Negotiation
```bash
# Let agents resolve together
/parallel resolve workspace-name --negotiate

# Agents discuss and propose resolution
# Reviewer approves
```

## Integration with Other Commands

### With /sync
```bash
# Before parallel work
/sync                          # Verify clean state
/parallel build workspace

# After merge
/parallel merge workspace
/sync                          # Verify consistency
```

### With /cache
```bash
# Parallel work may invalidate cache
/parallel merge workspace
/cache clear                   # Clear stale cache
/cache update                  # Rebuild
```

### With /init
```bash
# New feature planning
/init from idea: Complex checkout flow
# Brain suggests parallel decomposition

/parallel build checkout-flow
# Execute parallel work
```

## Troubleshooting

### Parallel Work Stuck
**Symptom:** Sessions not progressing

**Diagnosis:**
```bash
/parallel status workspace-name --verbose

# Check:
# - Lock contentions
# - Agent errors
# - Dependency blocking
```

**Solution:**
- Release blocking locks
- Resolve dependencies
- Or abort and redesign

### Merge Taking Too Long
**Symptom:** Merge process slow

**Cause:** Too many conflicts or large changesets

**Solution:**
```bash
# Abort current attempt
/parallel abort workspace-name

# Break into smaller parallel chunks
/parallel build workspace-part1
/parallel build workspace-part2
```

### Lost Handoff
**Symptom:** Agent completed but handoff missing

**Solution:**
```bash
# Check handoff directory
ls .ai/runtime/parallel/workspace/handoffs/

# Regenerate from session log
# Manual recovery if needed
```

## Advanced Features

### Custom Merge Strategies
```bash
# Specify merge strategy
/parallel merge workspace --strategy=ours
/parallel merge workspace --strategy=theirs
/parallel merge workspace --strategy=interactive
```

### Partial Merge
```bash
# Merge specific sessions only
/parallel merge workspace --sessions=1,3

# Leave session 2 for later
```

### Rollback After Merge
```bash
# If merged result problematic
/parallel rollback workspace

# Restores to pre-merge snapshot
# Requires snapshot still exists
```

## Related Commands

- `/sync` - Verify state before/after parallel work
- `/cache` - Update cache after parallel merge
- `agents/orchestrator.md` - Coordinates parallel agents
- `agents/reviewer.md` - Reviews and merges parallel work

## Safety Checklist

Before `/parallel build`:
- [ ] State is clean (`/sync`)
- [ ] Tests passing
- [ ] Clear role definition
- [ ] Estimated duration reasonable

Before `/parallel merge`:
- [ ] All handoffs received
- [ ] All tests passed per session
- [ ] Conflicts reviewed
- [ ] Backup/snapshot exists

After `/parallel merge`:
- [ ] Tests still passing
- [ ] `/sync` shows clean state
- [ ] Cache updated
- [ ] Documentation updated
