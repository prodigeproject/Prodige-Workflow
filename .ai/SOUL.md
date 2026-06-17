# SOUL

> **File**: `.ai/SOUL.md`  
> **Purpose**: Core engineering philosophy and principles  
> **Related**: [ORCHESTRATOR](./orchestrator/ORCHESTRATOR.md), [Runtime](./runtime/README.md)

The engineering philosophy of this project.

---

## Principles

1. Design before code.
2. Reuse before rebuild.
3. Simple beats clever.
4. Modular beats monolithic.
5. Context must match code.
6. Documentation is part of engineering.
7. No hidden decisions.
8. No silent architecture changes.
9. Human approval before irreversible changes.
10. Speed is good only if it does not create chaos.

---

## Coding Values

- **Small files**: Each file should have a single, clear purpose
- **Clear names**: Variables, functions, and files use descriptive names
- **Single responsibility**: One component does one thing well
- **Explicit data flow**: No hidden side effects or implicit dependencies
- **Minimal coupling**: Components interact through well-defined interfaces
- **No duplicate logic**: Reuse before rebuild
- **No hardcoded secrets**: Use environment variables or secure vaults
- **No magic behavior**: All special behavior must be documented

---

## Application

These principles guide:
- Code review processes
- Architecture decisions
- Workflow design
- Agent behavior
- Skill development

For implementation details, see:
- [Orchestrator](./orchestrator/ORCHESTRATOR.md) for workflow execution
- [Skills](./skills/) for reusable capabilities
- [Agents](./agents/) for role-specific behavior
