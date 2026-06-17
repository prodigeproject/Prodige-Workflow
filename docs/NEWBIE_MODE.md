# Newbie Mode

## Overview

**Newbie Mode** is designed for non-technical "vibe coders" who want to build software with AI without needing to understand:
- Software architecture
- Agent workflows
- Caching strategies
- Session management
- File locking
- Development terminology

**Just use simple commands. AI handles the complexity.**

---

## Philosophy

You should focus on **what** you want, not **how** it's built.

The AI should:
1. Understand your intent
2. Explain what it will do in simple terms
3. Ask for approval before major changes
4. Show progress in plain language
5. Alert you to risks

---

## Minimum Commands You Need

These 8 commands cover 90% of use cases:

| Command | Purpose | Example |
|---------|---------|---------|
| `/init from idea: ...` | Start a new project from your idea | `/init from idea: recipe sharing app` |
| `/design ...` | Plan a new feature | `/design user login` |
| `/build approved ...` | Build after you approve the plan | `/build approved user login` |
| `/fix ...` | Fix bugs or issues | `/fix login button not working` |
| `/audit` | Check code quality and issues | `/audit` |
| `/review` | Review recent changes | `/review` |
| `/sync` | Update AI's understanding of the codebase | `/sync` |
| `/status` | Check project status | `/status` |

---

## Detailed Command Guide

### 1. `/init from idea: ...`

**Use when**: Starting a brand new project

**Example**:
```text
/init from idea: A task manager where users can create lists, add tasks, and share lists with friends
```

**What AI does**:
1. Creates project structure
2. Sets up configuration files
3. Asks clarifying questions:
   - "Should users need to create an account?"
   - "Should tasks have due dates?"
   - "What devices: web only, or mobile too?"

**What AI shows you**:
```text
I'll create a task manager with:
- User accounts (email/password login)
- Create/edit/delete task lists
- Add tasks to lists
- Share lists with other users
- Web application (mobile-friendly)

Tech stack:
- Frontend: React (modern web framework)
- Backend: Node.js (handles data and users)
- Database: PostgreSQL (stores tasks and users)

Is this what you want? [yes/no/modify]
```

**Your job**: Say yes, no, or explain what to change.

---

### 2. `/design ...`

**Use when**: Planning a new feature before building it

**Example**:
```text
/design email notifications when a task is due
```

**What AI does**:
1. Creates a plan document (PRD)
2. Explains how it will work
3. Lists what will change
4. Identifies risks

**What AI shows you**:
```text
Email Notifications Plan:

How it works:
- When a task has a due date, system checks daily at 9am
- If due date is today or overdue, sends email to task owner
- Email includes task name, list name, and link to task

What changes:
- Add email service (SendGrid - free tier available)
- Add daily background job
- Add "notification preferences" to user settings

Risks:
- Users might get too many emails (mitigation: add opt-out)
- Emails might go to spam (mitigation: use verified email service)

Estimated time: 4 hours
Cost: $0/month for <100 emails/day

Approve? [yes/no/ask questions]
```

**Your job**: Approve, reject, or ask questions like:
- "Can users choose notification time?"
- "What about SMS instead of email?"

---

### 3. `/build approved ...`

**Use when**: You've approved a design and want AI to build it

**Example**:
```text
/build approved email notifications
```

**What AI does**:
1. Writes code
2. Writes tests
3. Updates documentation
4. Shows progress

**What AI shows you**:
```text
Building email notifications...

✅ Created email service (backend/services/email.ts)
✅ Added daily notification job (backend/jobs/notifyTasks.ts)
✅ Updated user settings page (frontend/pages/Settings.tsx)
✅ Wrote 8 tests - all passing
✅ Updated user guide

Done! To test:
1. Create a task with today's due date
2. Check your email in ~1 minute (dev mode sends immediately)

Ready to release? [yes/review first]
```

**Your job**: Test it and confirm it works as expected.

---

### 4. `/fix ...`

**Use when**: Something is broken or not working as expected

**Example**:
```text
/fix login button doesn't work on mobile
```

**What AI does**:
1. Investigates the issue
2. Identifies root cause
3. Fixes it
4. Tests the fix

**What AI shows you**:
```text
Found the issue:
- Login button is too small on mobile screens
- Touch target is only 20px (should be 44px minimum)

Fix applied:
- Increased button size
- Improved spacing
- Tested on iPhone and Android simulators

✅ Login button now works on mobile

Changed files:
- frontend/components/LoginButton.tsx
- frontend/styles/button.css

Test it on your phone and confirm? [yes/still broken]
```

**Your job**: Test and confirm the fix works.

---

### 5. `/audit`

**Use when**: You want to check code quality, find issues, or identify technical debt

**Example**:
```text
/audit
```

**What AI does**:
1. Scans codebase
2. Identifies issues
3. Prioritizes by severity
4. Suggests fixes

**What AI shows you**:
```text
Audit Report:

🔴 Critical (fix now):
- User passwords stored in plain text (security risk)
  → Fix: Hash passwords with bcrypt

🟡 Warning (fix soon):
- No input validation on task names (users can create empty tasks)
  → Fix: Add validation
- Email service has no error handling (crashes if email fails)
  → Fix: Add try-catch and logging

🟢 Info (optional improvements):
- 3 duplicate code blocks in task components
  → Opportunity: Refactor to shared component

Want me to fix critical issues? [yes/no/show me how]
```

**Your job**: Decide what to fix now vs later.

---

### 6. `/review`

**Use when**: You want to see what changed recently

**Example**:
```text
/review
```

**What AI shows you**:
```text
Recent Changes (last 24 hours):

Added:
- Email notification system
- User notification preferences
- Daily notification job

Modified:
- User settings page (added notification toggle)
- Task model (added lastNotifiedAt field)

Tests:
- 8 new tests (all passing)

Impact:
- Users can now receive email reminders
- No breaking changes
- Performance impact: negligible

Security:
- No new vulnerabilities
- Email addresses not exposed

Ready to deploy? [yes/no/needs more work]
```

**Your job**: Review and approve or request changes.

---

### 7. `/sync`

**Use when**: AI seems confused about your codebase, or after major manual changes

**Example**:
```text
/sync
```

**What AI does**:
1. Re-scans codebase
2. Updates internal understanding
3. Refreshes cache
4. Reports changes found

**What AI shows you**:
```text
Syncing project understanding...

Detected changes:
- 12 files modified
- 3 new files
- 1 file deleted
- 2 new dependencies added

Updated:
- Architecture map
- API routes
- Database schema
- Test coverage

✅ Sync complete. I'm now up to date with the codebase.
```

**Your job**: Nothing, just wait for completion.

---

### 8. `/status`

**Use when**: You want a quick project overview

**Example**:
```text
/status
```

**What AI shows you**:
```text
Project Status:

Overall Health: ✅ Good

Features:
- ✅ User authentication (working)
- ✅ Task management (working)
- ✅ List sharing (working)
- 🚧 Email notifications (in development)

Quality:
- Tests: 45 total, 45 passing
- Code coverage: 82%
- Known issues: 2 minor bugs
- Security: No critical vulnerabilities

Performance:
- Page load: 1.2s (good)
- API response: 150ms (good)

Next Steps:
1. Finish email notifications
2. Fix 2 minor bugs
3. Add user profile pictures
```

**Your job**: Stay informed about project health.

---

## What AI Should Explain to You

For every important step, AI should clearly communicate:

### 1. What I Understood
```text
"You want users to be able to upload profile pictures, right?"
```

### 2. What I Will Change
```text
"I'll add an upload button to the profile page and store images in cloud storage."
```

### 3. Why This Matters
```text
"Profile pictures help users recognize each other when sharing lists."
```

### 4. What Risks Exist
```text
"Risk: Users could upload inappropriate images.
Mitigation: Add image moderation or admin review."
```

### 5. What Needs Your Approval
```text
"Should I use AWS S3 (costs ~$1/month) or free tier Cloudinary (limited to 100 uploads/day)?"
```

### 6. What Happens Next
```text
"After you approve, I'll build this in ~2 hours. You'll be able to test it before it goes live."
```

---

## When AI Must Stop and Ask

AI **must stop and ask for approval** before:

### Critical Changes
- ❌ Changing core architecture
- ❌ Replacing authentication system
- ❌ Switching databases
- ❌ Changing payment processing
- ❌ Modifying user data structures
- ❌ Deleting production data

### Expensive Changes
- ❌ Adding paid services (even cheap ones)
- ❌ Increasing infrastructure costs
- ❌ Changing hosting providers

### Risky Changes
- ❌ Removing security features
- ❌ Disabling error logging
- ❌ Making irreversible data migrations
- ❌ Changing production configuration

### Large Changes
- ❌ Rewriting entire modules
- ❌ Replacing major libraries
- ❌ Changing UI framework

**Example stop-and-ask**:
```text
⚠️ APPROVAL NEEDED

I need to change the database structure to add email notifications.

Current: User table has 5 columns
Proposed: Add 3 new columns (notificationsEnabled, notificationTime, lastNotifiedAt)

Impact:
- Existing users will have notifications ENABLED by default
- Can be reversed if needed
- Takes ~5 minutes

This is a database migration (can't be undone instantly).

Approve? [yes/no/explain more]
```

---

## Common Scenarios

### Scenario 1: "I don't understand the technical terms"

**Your response**:
```text
Explain this in simple terms without jargon
```

**AI should simplify**:
- ❌ "We'll implement JWT authentication with bcrypt hashing"
- ✅ "We'll add a secure login system so each user has a unique account"

---

### Scenario 2: "This seems too complex"

**Your response**:
```text
Is there a simpler way?
```

**AI should offer alternatives**:
```text
Simpler option:
- Use email-only login (no password) - click link to log in
- Pros: More secure, users don't forget passwords
- Cons: Users need email access to log in each time

Current option:
- Username + password login
- Pros: Faster login (no email needed)
- Cons: Users might forget passwords

Which do you prefer?
```

---

### Scenario 3: "I'm not sure if this is a good idea"

**Your response**:
```text
What are the pros and cons?
```

**AI should provide balanced view**:
```text
Feature: Dark mode

Pros:
- Users prefer it for night use
- Reduces eye strain
- Modern apps have it

Cons:
- Takes 3-4 hours to implement
- Needs testing on all screens
- Some colors might look bad

Recommendation: Add it if you have time, but not critical for launch.

Your call? [add it/skip for now]
```

---

## Troubleshooting

### Problem: AI is too technical

**Solution**:
```text
Explain like I'm not a developer
```

---

### Problem: AI makes changes without asking

**Solution**:
```text
Always ask before making changes. Use newbie mode.
```

---

### Problem: AI assumes I know things

**Solution**:
```text
Don't assume I know technical terms. Explain everything.
```

---

### Problem: I want to undo a change

**Solution**:
```text
/undo last change
```

AI should:
- Revert the change
- Explain what was undone
- Confirm the previous state is restored

---

## Best Practices for Non-Technical Users

### Do:
- ✅ Ask questions when unsure
- ✅ Request simpler explanations
- ✅ Take time to review plans before approving
- ✅ Test features after they're built
- ✅ Say "no" if something feels wrong

### Don't:
- ❌ Approve things you don't understand
- ❌ Skip testing
- ❌ Assume AI is always right
- ❌ Rush to production
- ❌ Ignore warnings about risks

---

## Example Workflow: Building a Feature (Non-Technical)

### Step 1: Describe what you want
```text
/design add a "mark as complete" checkbox for tasks
```

### Step 2: Review AI's plan
```text
AI explains:
- How it will work
- What will change
- Any risks
```

### Step 3: Approve or modify
```text
You: "Yes, but I also want completed tasks to be grayed out"
AI: "Got it, I'll add that too."
```

### Step 4: Build it
```text
/build approved task completion
```

### Step 5: Test it
```text
AI: "Done! Try checking the box next to a task."
You: [Tests it]
```

### Step 6: Confirm or fix
```text
You: "The gray color is too dark, make it lighter"
AI: [Adjusts color]
You: "Perfect!"
```

### Step 7: Release
```text
AI: "Ready to make this live for users?"
You: "Yes!"
AI: "Deployed! Users can now mark tasks complete."
```

---

## Getting Help

If you're stuck, just ask in plain language:

```text
"I want users to be able to add photos to tasks, how do I do that?"
"Something broke after the last change, how do I fix it?"
"Can you show me what changed in the last update?"
"Is it safe to deploy this?"
```

AI should respond in simple, clear language and guide you through next steps.

---

## Summary for Non-Technical Users

1. **Use simple commands** (`/design`, `/build approved`, `/fix`, etc.)
2. **AI explains everything** in plain language
3. **You approve major changes** before they happen
4. **Ask questions anytime** - there are no dumb questions
5. **Test before deploying** - make sure it works as expected
6. **You're in control** - AI is your assistant, not your boss

**Remember**: You don't need to understand the technical details. Just focus on **what** you want, and let AI figure out **how** to build it.
