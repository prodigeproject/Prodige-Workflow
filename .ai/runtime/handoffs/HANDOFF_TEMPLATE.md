# Agent Handoff Template

> **File**: `.ai/runtime/handoffs/HANDOFF_TEMPLATE.md`  
> **Purpose**: Standard format for worker-to-reviewer handoffs  
> **Related**: [Runtime README](../README.md), [ORCHESTRATOR](../../orchestrator/ORCHESTRATOR.md)

---

## Overview

This template ensures consistent communication when an agent completes work and hands off to a reviewer or next agent. Complete all sections thoroughly.

---

## Handoff Metadata

**Session ID**: `[unique session identifier]`  
**Agent Role**: `[e.g., backend, frontend, architect]`  
**Snapshot Reference**: `[snapshot ID if applicable]`  
**Date**: `[YYYY-MM-DD]`  
**Time Spent**: `[approximate duration]`

---

## Goal

**Original Task**:
```
[Describe the original task or command that initiated this work]
```

**Scope**:
- [What was in scope]
- [What was explicitly out of scope]

---

## Completed Work

### Tasks Completed

- [ ] [Specific task 1]
- [ ] [Specific task 2]
- [ ] [Specific task 3]

### Implementation Summary

[Provide a brief narrative of what was built, fixed, or changed]

---

## Files Changed

| File Path | Change Type | Summary |
|-----------|-------------|---------|
| `path/to/file1.js` | Modified | [What changed and why] |
| `path/to/file2.js` | Created | [Purpose of new file] |
| `path/to/file3.js` | Deleted | [Reason for deletion] |

**Total Files Changed**: [number]

---

## Decisions Made

### Technical Decisions

1. **[Decision Topic]**
   - **Choice**: [What was chosen]
   - **Alternatives Considered**: [Other options]
   - **Rationale**: [Why this choice was made]
   - **Impact**: [What this affects]

### Deferred Decisions

1. **[Topic]**: [Why deferred and who should decide]

---

## Risks / Known Issues

### Critical Issues

- **[Issue]**: [Description and recommended action]

### Medium Issues

- **[Issue]**: [Description]

### Minor Issues

- **[Issue]**: [Description]

### Technical Debt Introduced

- **[Debt]**: [Why it was necessary and how to address later]

---

## Tests Run

### Automated Tests

```bash
[Commands run and results]
```

**Results**:
- Tests Passed: [number]
- Tests Failed: [number]
- Coverage: [percentage if known]

### Manual Testing

- [ ] [Test scenario 1]
- [ ] [Test scenario 2]

**Notes**: [Any issues found or edge cases discovered]

---

## Needs Reviewer Attention

### High Priority

1. **[Item]**: [Why this needs careful review]

### Questions for Reviewer

1. **[Question]**: [Context for the question]

### Approval Required

- [ ] [Specific decision that needs sign-off]

---

## Context Updates Needed

### Documentation Updates

- [ ] `[file/path]`: [What needs to be documented]

### Cache Updates

- [ ] Architecture summary
- [ ] API documentation
- [ ] [Other cache files]

### Related Work

**Blocked By**: [List any dependencies]  
**Blocks**: [What is waiting on this work]  
**Related Handoffs**: [Links to related handoff documents]

---

## Next Steps

### Immediate Actions

1. [Action required by reviewer or next agent]
2. [Follow-up task]

### Future Improvements

- [Enhancement idea]
- [Refactoring opportunity]

---

## Notes

[Any additional context, observations, or information that doesn't fit above categories]

---

## Handoff Checklist

Before submitting this handoff, ensure:

- [ ] All sections are completed
- [ ] Files changed are accurate and complete
- [ ] Critical risks are clearly flagged
- [ ] Tests were run and results documented
- [ ] Questions are clearly articulated
- [ ] Next steps are actionable
- [ ] Related documentation is referenced

---

**Handoff Submitted By**: [Agent role/name]  
**Handoff Date**: [YYYY-MM-DD HH:MM]  
**Status**: [Draft | Ready for Review | Approved]
