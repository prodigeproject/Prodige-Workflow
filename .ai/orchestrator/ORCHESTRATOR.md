# Orchestrator

> **File**: `.ai/orchestrator/ORCHESTRATOR.md`  
> **Purpose**: Command routing and workflow coordination  
> **Related**: [SOUL](../SOUL.md), [Runtime](../runtime/README.md), [Skills](../skills/), [Agents](../agents/)

---

## Overview

The orchestrator maps simple user commands to workflows, skills, agents, cache, and review gates.

**Key Principle**: Users should not manually invoke skills. The orchestrator handles all skill selection automatically based on command intent.

---

## Responsibilities

- Interpret command intent
- Select workflow
- Select skills
- Select agent roles
- Decide whether HITL is required
- Decide whether task can run in parallel
- Manage snapshots
- Manage cache
- Manage locks
- Require handoffs
- Enforce quality gates
- Trigger context sync

## Command Routing

The orchestrator recognizes the following commands:

| Command | Workflow | Purpose |
|---------|----------|---------|
| `/init` | Initialization | Set up project structure and environment |
| `/design` | Design | Create architecture and design documents |
| `/build` | Build | Implement features and components |
| `/fix` | Bugfix | Diagnose and fix issues |
| `/review` | Code Review | Review code quality and standards |
| `/audit` | Audit | Security, dependency, and technical debt analysis |
| `/refactor` | Refactor | Improve code structure without changing behavior |
| `/docs` | Documentation | Generate or update documentation |
| `/release` | Release | Prepare and execute releases |
| `/sync` | Context Sync | Update runtime context and cache |
| `/parallel` | Multi-Agent Planning | Coordinate parallel work across agents |
| `/cache` | Cache Management | Manage token-saving summaries |
| `/status` | Status Check | Report current project state |
| `/agent` | Worker Session | Direct agent work session |

---

## Automatic Skill Selection

## Automatic Skill Selection

The orchestrator automatically loads appropriate skills based on command context. This ensures consistency and reduces cognitive overhead.

### Example: `/build login`

**Auto-loaded skills:**
- `repomap` - Navigate codebase structure
- `ripgrep` - Fast code search
- `reuse-rebuild` - Check for reusable components
- `rtk` - Redux Toolkit patterns (if applicable)
- `clean-code` - Code quality standards
- `roastme` - Self-review before submission
- `context-sync` - Keep context current

### Example: `/audit repo`

**Auto-loaded skills:**
- `repomap` - Map repository structure
- `ripgrep` - Search for patterns
- `roastme` - Critical analysis
- `security-review` - Security vulnerability detection
- `dependency-review` - Dependency audit
- `debt-detection` - Technical debt identification
- `context-sync` - Context synchronization

### Example: `/parallel build checkout`

**Auto-loaded skills:**
- `parallel-planner` - Plan parallel work
- `snapshot-manager` - Create stable snapshots
- `cache-manager` - Manage shared cache
- `lock-manager` - Prevent conflicts
- `handoff-manager` - Coordinate handoffs
- `repomap` - Repository navigation
- `clean-code` - Quality standards
- `review-gate` - Quality gates before merge

---

## Integration

The orchestrator integrates with:
- **Runtime**: Uses [runtime system](../runtime/README.md) for sessions, locks, and handoffs
- **Cache**: Leverages [cached summaries](../runtime/cache/) to save tokens
- **Agents**: Coordinates [specialized agents](../agents/) for different roles
- **Skills**: Dynamically loads [skills](../skills/) based on task needs

---

## Quality Gates

Before completing workflows, the orchestrator enforces:
1. **Code quality checks**: Linting, formatting, standards compliance
2. **Test coverage**: Required tests pass
3. **Review requirements**: Human-in-the-loop (HITL) for critical changes
4. **Context sync**: Runtime state is up-to-date
5. **Handoff completion**: All worker notes are captured
