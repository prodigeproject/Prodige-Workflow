# Cache Strategy

## Overview

The cache system reduces token usage and speeds up multi-agent workflows by storing frequently accessed project information. Instead of re-reading large codebases, AI agents can load cached summaries.

## Benefits

- **Faster responses**: Agents load summaries instead of scanning entire codebases
- **Lower costs**: Reduced token usage across multiple AI sessions
- **Consistency**: All agents work from the same project understanding
- **Better context management**: Prevents context window overflow

---

## What Gets Cached?

The system caches high-level project information:

| Item | Purpose | File |
|------|---------|------|
| **Repo map** | Directory structure and file organization | `repomap.json` |
| **Architecture summary** | System design and patterns | `architecture-summary.md` |
| **Module summaries** | Individual module documentation | `modules/*.md` |
| **Dependencies** | Third-party libraries and versions | `dependencies.json` |
| **Routes/APIs** | Endpoint definitions and contracts | `routes.md` |
| **Database schema** | Tables, columns, relationships | `database.md` |
| **Test map** | Test files and coverage areas | `tests.md` |
| **Known issues** | Current bugs and technical debt | `known-issues.md` |
| **Design decisions** | ADRs and architectural choices | `decisions.md` |

---

## Cache Location

All cache files are stored in:

```text
.ai/runtime/cache/
```

Example structure:

```text
.ai/runtime/cache/
├── repomap.json
├── architecture-summary.md
├── dependencies.json
├── routes.md
├── database.md
├── tests.md
├── known-issues.md
├── decisions.md
└── modules/
    ├── auth.md
    ├── payment.md
    └── user-management.md
```

---

## When to Use Cache

### For AI Agents

Agents should **load cache before reading large files**:

1. Check if cache exists
2. Load relevant cache files
3. Use cached info for context
4. Only read source files if details needed

### For Users

Use cache when:
- Starting new AI sessions
- Switching between features
- Working with multiple AI windows
- Reviewing project status

---

## When to Invalidate Cache

Cache should be refreshed when significant changes occur:

### Automatic Invalidation Triggers

- ✅ Major architecture changes
- ✅ Dependency additions/updates
- ✅ Database schema migrations
- ✅ Route/API endpoint changes
- ✅ Authentication system changes
- ✅ Folder structure reorganization
- ✅ Module refactoring
- ✅ Configuration changes

### Manual Invalidation

Invalidate specific caches when you know they're outdated:

```text
/cache invalidate auth          # Invalidate auth module cache
/cache invalidate database      # Invalidate database schema cache
/cache invalidate all           # Clear entire cache
```

---

## Commands

### Update Cache

Refresh all or specific cache entries:

```bash
/cache update                   # Update all cache files
/cache update architecture      # Update only architecture summary
/cache update database          # Update only database schema
```

### Check Cache Status

View cache freshness and coverage:

```bash
/cache status                   # Show cache age and completeness
```

### Invalidate Cache

Remove outdated cache entries:

```bash
/cache invalidate auth          # Remove auth cache
/cache invalidate all           # Clear all cache
```

### View Cache

Read specific cache contents:

```bash
/cache show repomap            # Display repo map
/cache show architecture       # Display architecture summary
```

---

## Best Practices

### For Non-Technical Users

1. **Let AI manage cache**: The AI should handle cache automatically
2. **Run `/cache update` after big changes**: New features, refactors, migrations
3. **Use `/cache status` when unsure**: Check if cache is fresh

### For Technical Users

1. **Update cache after PRs**: Keep cache in sync with main branch
2. **Invalidate before major changes**: Prevent working from stale info
3. **Review cache in multi-window work**: Ensure all windows use same snapshot

### Cache Hygiene

- Update cache weekly for active projects
- Invalidate cache before starting new features
- Check cache status if AI seems confused about project structure
- Commit cache files to `.gitignore` (they're runtime artifacts)

---

## Troubleshooting

### Cache is Outdated

**Problem**: AI refers to removed modules or old architecture

**Solution**:
```bash
/cache invalidate all
/cache update
```

### Cache Missing

**Problem**: AI reads entire codebase every time

**Solution**:
```bash
/cache update
```

### Cache Too Large

**Problem**: Cache files are huge and slow to load

**Solution**: Cache should store summaries, not full files. If cache is over 100KB per file, regenerate with more concise summaries.

---

## Technical Notes

### Cache Format

- **JSON files**: Machine-readable data (repomap, dependencies)
- **Markdown files**: Human-readable summaries (architecture, routes)
- **Module files**: One file per major module in `modules/` subfolder

### Cache Versioning

Cache files should include a version stamp:

```json
{
  "version": "1.0",
  "generated": "2025-01-15T10:30:00Z",
  "data": { ... }
}
```

This helps detect outdated caches automatically.
