---
name: repomap
description: "Creates concise, hierarchical maps of repository structure showing entrypoints, modules, critical files, and their relationships."
---

# Repository Map

Generate clear, actionable maps of codebase structure to accelerate understanding and navigation.

## Purpose

Create concise repository maps that help agents and developers quickly understand:
- Project structure and organization patterns
- Entry points and main execution flows
- Module boundaries and relationships
- Critical files and their purposes
- Architecture and design patterns in use

## When to Use

This skill is automatically selected by the orchestrator when:
- Starting work on an unfamiliar codebase
- Onboarding new agents to a project
- Planning major refactoring or architecture changes
- Investigating how different parts of the system connect
- Documenting system architecture

## Process

### 1. Initial Discovery
- Identify project type (web app, library, CLI, monorepo, etc.)
- Detect framework and language ecosystem
- Find configuration files (package.json, tsconfig, etc.)
- Locate documentation and README files

### 2. Entry Point Analysis
- Identify main entry points (index, main, app, server)
- Map startup/initialization flows
- Find route definitions and API endpoints
- Locate test entry points

### 3. Module Mapping
- Discover top-level directories and their purposes
- Identify core modules and their responsibilities
- Map module dependencies and import patterns
- Find utility and shared code locations

### 4. Critical File Identification
- Locate configuration files
- Find type definitions and interfaces
- Identify database schemas and migrations
- Map authentication and authorization logic
- Locate deployment and build scripts

### 5. Relationship Analysis
- Create dependency graph between modules
- Identify circular dependencies
- Map data flow through the system
- Find integration points with external services

## Output Format

Provide a hierarchical, scannable map:

**Project Overview:**
```
Type: Full-stack web application
Framework: Next.js 14 (App Router)
Language: TypeScript
Database: PostgreSQL via Prisma
Deployment: Vercel
```

**Entry Points:**
```
📍 app/layout.tsx          - Root layout, auth provider
📍 app/page.tsx            - Home page
📍 app/api/*/route.ts      - API endpoints
📍 middleware.ts           - Auth middleware
📍 scripts/seed.ts         - Database seeding
```

**Core Modules:**
```
src/
├─ components/          - React components
│  ├─ ui/              - Shadcn/ui primitives
│  └─ features/        - Feature-specific components
├─ lib/                - Utilities and helpers
│  ├─ auth.ts          - Authentication logic
│  ├─ db.ts            - Database client
│  └─ api.ts           - API client utilities
├─ hooks/              - Custom React hooks
├─ types/              - TypeScript type definitions
└─ actions/            - Server actions
```

**Critical Files:**
```
⚙️  Configuration:
    - next.config.js       - Next.js config
    - tailwind.config.ts   - Styling config
    - .env.example         - Required environment variables

🗄️  Database:
    - prisma/schema.prisma - Database schema
    - prisma/migrations/   - Migration history

🔐 Security:
    - middleware.ts        - Route protection
    - lib/auth.ts          - Auth utilities
    - app/api/auth/        - Auth endpoints

🧪 Testing:
    - vitest.config.ts     - Test configuration
    - tests/integration/   - Integration tests
    - tests/unit/          - Unit tests
```

**Key Relationships:**
```
app/page.tsx
  → components/features/UserDashboard
    → hooks/useUser
      → lib/api.ts
        → app/api/users/route.ts
          → lib/db.ts
            → prisma/schema.prisma
```

**Architecture Patterns:**
- Server Components for data fetching
- Client Components for interactivity
- Server Actions for mutations
- API routes for external access
- Middleware for authentication

**Notes:**
- Auth uses NextAuth.js with JWT strategy
- Database access centralized through lib/db.ts
- API follows RESTful conventions
- Components use Radix UI primitives via Shadcn

## Rules

- **Be concise:** Focus on what helps navigate and understand, not exhaustive listing
- **Be hierarchical:** Show structure through indentation and grouping
- **Be purpose-driven:** Explain what things do, not just what they're named
- **Be relationship-aware:** Show how pieces connect and depend on each other
- **Be pattern-conscious:** Highlight architecture and design patterns in use
- **Be evidence-based:** Build map from actual code inspection, not assumptions

## Key Principles

**Clarity over Completeness:**
- Show the 20% of files that explain 80% of the system
- Include enough detail to orient, not overwhelm
- Use visual hierarchy (indentation, symbols, grouping)

**Actionable Information:**
- Help readers know where to start for different tasks
- Identify common modification points
- Highlight areas of technical debt or complexity

**Maintainable Documentation:**
- Keep map update-able as project evolves
- Focus on stable structure, not volatile details
- Store as markdown in docs/ for version control

## Integration Points

- Used by **brainstorming** to understand context before designing features
- Used by **implementation-planning** to identify affected areas
- Used by **parallel-planner** to understand module boundaries
- Used by **documentation** to create architecture guides
- Informs **reuse-rebuild** decisions about existing code

## Anti-Patterns

- ❌ Listing every file and directory (information overload)
- ❌ No context about what files do (just names)
- ❌ Flat structure with no hierarchy (hard to scan)
- ❌ Missing relationships and dependencies
- ❌ Outdated map that doesn't reflect current state
- ❌ No indication of entry points or critical paths

## Output Variations

**For New Codebases (First Time):**
- More comprehensive initial mapping
- Include quick wins and easy entry points
- Highlight unusual or unexpected patterns
- Note areas of confusion or technical debt

**For Familiar Codebases (Updates):**
- Focus on what changed since last map
- Highlight new modules or refactored areas
- Update dependency relationships
- Note deprecations or removed code

**For Specific Tasks:**
- Zoom in on relevant modules only
- Show detailed relationships for affected areas
- Include file-level detail where needed
- Omit unrelated parts of codebase

## Example Use Cases

**"I need to add a new API endpoint":**
→ Shows: API route structure, existing endpoints as examples, database access patterns, auth middleware

**"I want to add a new page":**
→ Shows: App router structure, layout hierarchy, component patterns, data fetching approaches

**"I need to understand the authentication system":**
→ Shows: Auth middleware, auth utilities, session management, protected routes, auth API endpoints

**"I'm refactoring the user module":**
→ Shows: All files that import from user module, user-related components, API endpoints, database schema
