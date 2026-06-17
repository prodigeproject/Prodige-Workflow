# Runtime System

> **File**: `.ai/runtime/README.md`  
> **Purpose**: Parallel AI agent coordination infrastructure  
> **Related**: [ORCHESTRATOR](../orchestrator/ORCHESTRATOR.md), [SOUL](../SOUL.md)

---

## Overview

The runtime system provides the infrastructure to support parallel AI agent work. It manages sessions, prevents conflicts, coordinates handoffs, and optimizes token usage through caching.

---

## Directory Structure

### `sessions/`
**Purpose**: Track active AI agent windows

Each file represents one active agent session with:
- Session ID
- Agent role
- Current task
- Start time
- Status

### `snapshots/`
**Purpose**: Stable context copies for consistency

Snapshots provide:
- Point-in-time codebase state
- Consistent context across parallel agents
- Rollback capability if needed

### `locks/`
**Purpose**: Prevent conflicting edits

Lock files ensure:
- Only one agent edits a file at a time
- Changes are serialized when needed
- Race conditions are prevented

### `handoffs/`
**Purpose**: Worker-to-reviewer communication

Handoff documents contain:
- Work completed
- Files changed
- Decisions made
- Risks identified
- Review requirements

See: [HANDOFF_TEMPLATE.md](./handoffs/HANDOFF_TEMPLATE.md)

### `queue/`
**Purpose**: Task queue for work distribution

Queue manages:
- Pending tasks
- Task priority
- Task dependencies
- Agent assignment

### `cache/`
**Purpose**: Token-saving summaries

Cache stores:
- Architecture summaries
- API documentation
- Common patterns
- Frequently used context

See: [architecture-summary.md](./cache/architecture-summary.md)

---

## Workflow Integration

The runtime system is used by:
1. **Orchestrator**: Routes commands and manages workflows
2. **Agents**: Execute tasks with consistent context
3. **Skills**: Access cached knowledge
4. **Reviews**: Handoffs trigger review processes

---

## Usage

Runtime operations are managed automatically by the [orchestrator](../orchestrator/ORCHESTRATOR.md). Direct manipulation is not recommended.

**Common commands**:
- `/sync` - Update runtime context
- `/cache update` - Refresh cache
- `/status` - Check runtime state
- `/parallel` - Coordinate parallel work
