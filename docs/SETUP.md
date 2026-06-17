# Setup Guide

## Overview

This guide walks you through setting up **Prodige Workflow** for your project, from initial installation to first productive use.

**Time Required**: 10-30 minutes depending on project size

---

## Who Is This For?

- **New projects**: Starting from scratch with AI assistance
- **Existing projects**: Adding Prodige Workflow to existing codebases
- **Team projects**: Setting up multi-developer AI workflows
- **Solo projects**: Individual developers using AI to accelerate development

---

## Prerequisites

### Required
- An AI coding assistant (Cursor, GitHub Copilot, Claude, ChatGPT, etc.)
- Git installed
- Project directory (existing or new)

### Optional
- Node.js / Python / Your language runtime (for code execution)
- Code editor / IDE
- Terminal access

---

## Setup Process

### Option 1: New Project from Idea

If you're starting from scratch:

```bash
/init from idea: [describe your project idea]
```

**Example**:
```bash
/init from idea: A recipe sharing website where users can post recipes, rate others' recipes, and create meal plans
```

**What AI does**:
1. Creates project structure
2. Initializes `.ai/` directory
3. Sets up configuration files
4. Creates initial documentation
5. Asks clarifying questions about tech stack and requirements

**AI will ask**:
```text
I'll set up a recipe sharing platform. A few questions:

1. User accounts: email/password, social login, or both?
2. Target devices: web only, or mobile apps too?
3. Preferred tech stack: React/Node, or something else?
4. Database: PostgreSQL, MySQL, or MongoDB?
5. Hosting: Cloud (AWS/GCP/Azure) or simple (Heroku/Vercel)?

What are your preferences?
```

**Your answers guide the setup.**

---

### Option 2: Existing Project

If you have an existing codebase:

```bash
/init from repo
```

**What AI does**:
1. Scans your repository
2. Detects tech stack (package.json, requirements.txt, etc.)
3. Maps directory structure
4. Identifies routes/APIs
5. Discovers database schema
6. Analyzes tests
7. Creates `.ai/` context directory

**AI will show**:
```text
Analyzing repository...

Detected:
- Language: TypeScript
- Framework: Next.js 14
- Database: PostgreSQL (via Prisma)
- Tests: Jest + React Testing Library
- API: REST endpoints in /pages/api
- Auth: NextAuth.js

I'll create context files based on this structure.

Proceed? [yes/customize]
```

---

## Directory Structure

After setup, your project will have:

```text
your-project/
├── .ai/                          # Prodige Workflow directory
│   ├── agents/                   # Agent definitions
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── qa.md
│   │   └── ...
│   ├── boot/                     # Initialization files
│   │   └── BOOT.md
│   ├── boundaries/               # Context constraints
│   │   └── context-size-limits.md
│   ├── commands/                 # Custom commands
│   │   └── common-commands.md
│   ├── context/                  # Project context
│   │   ├── architecture.md
│   │   ├── codebase.md
│   │   ├── conventions.md
│   │   ├── dependencies.md
│   │   ├── modules.md
│   │   ├── prd.md
│   │   └── ...
│   ├── handbooks/                # Workflow guides
│   │   └── default-workflow.md
│   ├── runtime/                  # Runtime data
│   │   ├── cache/                # Cached summaries
│   │   ├── handoffs/             # Agent completion reports
│   │   ├── locks/                # File locks for multi-window
│   │   ├── sessions/             # Multi-window sessions
│   │   └── snapshots/            # Context snapshots
│   └── skills/                   # Reusable capabilities
│       └── context-refresh.md
├── docs/                         # Documentation (optional)
├── src/                          # Your source code
└── ...                           # Other project files
```

---

## Configuration

### Basic Configuration

The AI will create `.ai/context/project.json`:

```json
{
  "name": "recipe-sharing-app",
  "type": "web-application",
  "language": "typescript",
  "framework": "nextjs",
  "database": "postgresql",
  "description": "A recipe sharing platform with meal planning",
  "version": "0.1.0"
}
```

**You can edit this manually** or use:

```bash
/config update language python
/config update framework django
```

---

### Agent Configuration

Agents are defined in `.ai/agents/`. Example `.ai/agents/backend.md`:

```markdown
# Backend Agent

## Role
Responsible for server-side logic, APIs, database, and business logic.

## Scope
- API endpoints
- Database models and migrations
- Business logic
- Authentication/authorization
- Background jobs
- Server configuration

## Constraints
- Must write tests for all endpoints
- Must validate all inputs
- Must handle errors gracefully
- Cannot change database schema without migration plan
- Cannot modify frontend code

## Skills
- RESTful API design
- Database optimization
- Security best practices
- Performance optimization
```

---

### Workflow Configuration

Default workflow is in `.ai/handbooks/default-workflow.md`. Customize it:

```bash
/config workflow set custom
```

Edit `.ai/handbooks/custom-workflow.md` to define your preferred process.

---

## First Steps After Setup

### 1. Verify Setup

```bash
/status
```

Should show:
```text
Project: recipe-sharing-app
Status: ✅ Ready

Setup:
- ✅ .ai/ directory created
- ✅ Context files initialized
- ✅ Agents configured
- ✅ Cache ready

Next steps:
1. Review context files in .ai/context/
2. Design your first feature: /design [feature]
3. Sync cache: /sync
```

---

### 2. Review Context Files

Check that AI understood your project correctly:

```bash
/show context architecture
```

Should display architecture summary. If incorrect:

```bash
/fix context architecture
```

AI will ask questions to correct the understanding.

---

### 3. Update Cache

```bash
/cache update
```

Creates initial cache for faster AI responses.

---

### 4. Test AI Understanding

Ask AI to explain your project:

```bash
/audit
```

AI should provide accurate summary of:
- Architecture
- Key modules
- Tech stack
- Current state
- Known issues

If AI seems confused, run:

```bash
/sync
```

---

## Setup for Different Project Types

### Web Application (React/Next.js/Vue)

```bash
/init from idea: [your web app idea]
```

AI will set up:
- Frontend structure
- API structure
- Database schema
- Authentication
- Deployment config

---

### API / Backend Service

```bash
/init from idea: [your API idea]
```

Tell AI:
```text
This is a backend API service (no frontend)
```

AI will focus on:
- API endpoints
- Database
- Authentication
- Documentation
- Testing

---

### Mobile App

```bash
/init from idea: [your mobile app idea]
```

Specify platform:
```text
React Native for iOS and Android
```
or
```text
Native iOS (Swift) app
```

---

### Data Science / ML Project

```bash
/init from idea: [your ML project idea]
```

AI will set up:
- Data processing pipelines
- Model training structure
- Experiment tracking
- Jupyter notebooks structure
- Documentation

---

### Microservices

For each service:

```bash
/init from idea: [service description]
```

Then link them:

```bash
/architecture add-service [service-name]
```

---

## Multi-Developer Setup

### Option A: Shared `.ai/` Directory (Recommended)

**Commit `.ai/` to Git**:

```bash
git add .ai/
git commit -m "Add Prodige Workflow setup"
git push
```

**Team members pull**:

```bash
git pull
```

Now everyone has the same AI context.

---

### Option B: Individual `.ai/` (Advanced)

Add to `.gitignore`:

```text
.ai/runtime/
.ai/sessions/
.ai/locks/
```

Commit only:
```text
.ai/agents/
.ai/context/
.ai/handbooks/
```

Each developer has personal runtime state but shared context.

---

## Environment Variables

Create `.env` for project-specific settings:

```bash
# Prodige Workflow Config
AI_WORKFLOW=default
AI_AUTO_SYNC=true
AI_CACHE_TTL=7d

# Project-specific
DATABASE_URL=postgresql://...
API_KEY=...
```

Add to `.gitignore`:
```text
.env
.env.local
```

---

## Customization

### Custom Commands

Add to `.ai/commands/custom.md`:

```markdown
# Custom Commands

## /deploy
Deploy to production after passing all checks.

## /test-all
Run all tests (unit, integration, e2e).

## /review-pr [number]
Review specific pull request.
```

Now you can use:
```bash
/deploy
/test-all
/review-pr 42
```

---

### Custom Agents

Create `.ai/agents/custom-agent.md`:

```markdown
# DevOps Agent

## Role
Manages infrastructure, CI/CD, and deployments.

## Scope
- Docker configuration
- CI/CD pipelines
- Deployment scripts
- Infrastructure as code
- Monitoring setup

## Constraints
- Cannot modify application code
- Must test deployments on staging first
- Must document all infrastructure changes
```

Use with:
```bash
/agent devops [task]
```

---

## Troubleshooting Setup

### Problem: AI doesn't recognize project structure

**Solution**:
```bash
/sync
```

If still issues:
```bash
/init from repo --force
```

---

### Problem: Missing dependencies

**Solution**:
```bash
npm install  # or pip install, etc.
/sync
```

---

### Problem: `.ai/` directory not created

**Solution**:
```bash
/init from repo
```

Or manually create:
```bash
mkdir -p .ai/{agents,boot,boundaries,commands,context,handbooks,runtime,skills}
```

---

### Problem: AI is too slow

**Solution**:
```bash
/cache update
```

Cache reduces repeated file scanning.

---

## Verification

After setup, verify everything works:

### 1. Check status
```bash
/status
```
Should show ✅ Ready

### 2. Test design command
```bash
/design add health check endpoint
```
AI should create a plan

### 3. Test audit
```bash
/audit
```
AI should analyze your codebase

### 4. Test sync
```bash
/sync
```
AI should refresh context

If all work, setup is complete! ✅

---

## Next Steps

After successful setup:

1. **Read the documentation**
   - `docs/USAGE.md` - How to use the system
   - `docs/NEWBIE_MODE.md` - Simple commands for non-technical users
   - `docs/HITL_REVIEW_GATES.md` - Understanding review gates

2. **Design your first feature**
   ```bash
   /design [feature-name]
   ```

3. **Build after approval**
   ```bash
   /build approved [feature-name]
   ```

4. **Sync regularly**
   ```bash
   /sync
   ```

5. **Use multi-window for complex features**
   ```bash
   /parallel build [feature-name]
   ```

---

## Best Practices

### For Non-Technical Users
- ✅ Start with `/init from idea` and let AI guide you
- ✅ Review generated context files to ensure AI understands your vision
- ✅ Use simple commands from NEWBIE_MODE.md
- ✅ Run `/sync` after any manual changes

### For Technical Users
- ✅ Review and customize agent definitions
- ✅ Set up CI/CD to validate AI-generated code
- ✅ Create custom commands for your workflow
- ✅ Keep context files updated manually when needed
- ✅ Use version control for `.ai/` directory

### For Teams
- ✅ Commit `.ai/context/` and `.ai/agents/` to Git
- ✅ Add `.ai/runtime/` to `.gitignore`
- ✅ Document team-specific workflows in `.ai/handbooks/`
- ✅ Regular context syncs (weekly or after major changes)

---

## Summary

**Quick setup**:
```bash
# New project
/init from idea: [your idea]

# Existing project
/init from repo

# Verify
/status

# First cache
/cache update

# You're ready!
/design [first-feature]
```

**Setup creates**:
- `.ai/` directory with context, agents, and workflows
- Cache for faster AI responses
- Project understanding for AI assistant

**Now you can**:
- Design features: `/design [feature]`
- Build code: `/build approved [feature]`
- Fix bugs: `/fix [issue]`
- Audit code: `/audit`
- Multi-window development: `/parallel build [feature]`

🎉 **Setup complete! Start building with AI assistance.**
