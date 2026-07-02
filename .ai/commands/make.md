# /make

Compatibility alias for `/magic`.

`/make <task>` exists only because some users naturally say "make this". It must
not create a separate simplified workflow. Treat it exactly as:

```text
/magic <task>
```

The same senior workflow applies: context loading, planning, HITL gates, TDD,
verification, review/audit when needed, memory update, and release boundaries.
