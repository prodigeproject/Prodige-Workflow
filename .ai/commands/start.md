# /start

Compatibility alias for `/session-start`.

`/start` exists because it is easier to remember and type. It must not create a
separate session workflow. Treat it exactly as:

```text
/session-start
```

It loads Memory Bank, context, boundaries, state, orchestrator, and global
skills according to `.ai/boot/BOOT.md`.
