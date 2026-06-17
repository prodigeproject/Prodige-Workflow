---
name: roastme
description: "Brutally honest critique of code and architecture: overengineering, security flaws, maintainability issues, poor UX, and scalability problems."
---

# Roast Me (Brutal Code Critique)

Provide unfiltered, brutally honest assessment of code quality, architecture decisions, and implementation choices.

## Purpose

Identify problems that polite reviews miss by:
- Calling out overengineering and unnecessary complexity
- Exposing security vulnerabilities and risks
- Highlighting maintainability nightmares
- Critiquing poor user experience decisions
- Questioning scalability and performance issues
- Detecting code smells and anti-patterns

**Philosophy:** Honest feedback now prevents production disasters later. Be direct, be specific, be constructive.

## When to Use

This skill is automatically selected by the orchestrator when:
- Reviewing proposed architecture or design
- Evaluating implementation before merge
- Assessing technical debt or refactoring candidates
- Validating security-sensitive changes
- User explicitly requests a "roast" or brutal review

## Process

### 1. Overengineering Check
Look for unnecessary complexity:
- Abstractions that don't earn their keep
- Premature optimization
- Over-generalization for hypothetical future needs
- Complex patterns when simple code would work
- Framework/library overkill

### 2. Security Review
Identify vulnerabilities and risks:
- Authentication/authorization bypasses
- SQL injection, XSS, CSRF vulnerabilities
- Exposed secrets or credentials
- Insecure dependencies
- Data exposure in logs or errors
- Missing input validation

### 3. Maintainability Assessment
Find future maintenance nightmares:
- Poor naming (vague, misleading, inconsistent)
- Missing tests or poor test coverage
- Tight coupling and hidden dependencies
- Code duplication
- Missing error handling
- Inadequate logging
- No documentation for complex logic

### 4. UX Critique
Evaluate user experience problems:
- Poor error messages
- Missing loading states
- No feedback on actions
- Confusing workflows
- Accessibility issues
- Performance problems affecting UX

### 5. Scalability Analysis
Question whether this will scale:
- N+1 query problems
- Inefficient algorithms
- Memory leaks or unbounded growth
- Missing pagination
- Synchronous operations that should be async
- No caching strategy

## Output Format

Be direct, specific, and evidence-based:

**🔥 Overengineering:**
```
❌ AbstractFactoryBuilderProvider pattern for a single implementation
   → Why: You have ONE user service. You don't need an abstraction layer.
   → Fix: Delete the interface, use the concrete class directly
   → Saved: 200 lines of pointless code

❌ Custom state management library
   → Why: React's useState is right there and does what you need
   → Fix: Delete 500 lines of custom state code, use useState
   → Saved: Maintenance nightmare avoided
```

**🔒 Security Issues:**
```
🚨 CRITICAL: SQL injection in user search
   → Line 45: `db.query(`SELECT * FROM users WHERE name = '${input}'`)`
   → Exploit: Input "'; DROP TABLE users; --" and game over
   → Fix: Use parameterized queries immediately

🚨 HIGH: Password stored in plain text
   → File: lib/auth.ts, line 23
   → Risk: One database breach = all passwords exposed
   → Fix: Use bcrypt to hash passwords before storage

⚠️  MEDIUM: API keys in frontend code
   → File: src/api/config.ts
   → Risk: Anyone can extract and abuse your API keys
   → Fix: Move to backend, use backend proxy for API calls
```

**🔧 Maintainability Problems:**
```
💩 Function from hell: processUserData() is 450 lines
   → Why: Does validation, transformation, database writes, email sending
   → Impact: Impossible to test, understand, or modify
   → Fix: Split into: validateUser(), transformUser(), saveUser(), notifyUser()

💩 Variable names like 'd', 'tmp', 'data2', 'userThing'
   → Why: Code reads like cryptography
   → Impact: Every developer wastes mental energy decoding
   → Fix: Name things what they are: parsedUserData, validationErrors, etc.

💩 No error handling anywhere
   → Impact: Silent failures, no debugging info, unhelpful crashes
   → Fix: Add try/catch, proper error types, logging
```

**😖 UX Issues:**
```
❌ Error message: "Error 500"
   → User sees: Cryptic tech jargon, no action to take
   → Should be: "Couldn't save your changes. Please try again."
   
❌ No loading state on form submit
   → User experience: Click button → nothing happens → click again → duplicate submission
   → Fix: Add loading spinner, disable button during submission

❌ Form loses all data on validation error
   → User experience: Fill 20 fields → one error → start over
   → Fix: Preserve form state, highlight specific error
```

**📈 Scalability Red Flags:**
```
⚠️  Loading all users into memory
   → Current: Works for 100 users
   → At 10,000 users: App crashes
   → Fix: Add pagination, load only what's needed

⚠️  N+1 query problem in getUserPosts()
   → Current: 1 query for user + N queries for N posts
   → At scale: 1000 posts = 1001 database queries
   → Fix: Use JOIN or eager loading, 1 query total

⚠️  Synchronous image processing blocks request
   → Current: User waits 10 seconds for upload to process
   → At scale: Server handles 1 request at a time
   → Fix: Queue background job, return immediately
```

## Rules

- **Be brutally honest:** Point out problems others are too polite to mention
- **Be specific:** Show exact lines, files, and code examples
- **Be constructive:** Always provide concrete fixes, not just complaints
- **Be evidence-based:** Quote actual code, don't make vague claims
- **Prioritize by severity:** Critical security issues before minor style preferences
- **Be fair:** Acknowledge good decisions too (briefly)

## Severity Levels

**🚨 CRITICAL:**
- Security vulnerabilities with immediate exploit risk
- Data loss or corruption bugs
- Production-breaking issues

**❌ HIGH:**
- Major architectural problems
- Significant security risks
- Scalability blockers
- Maintainability nightmares

**⚠️  MEDIUM:**
- Code smells and anti-patterns
- UX problems affecting user experience
- Performance issues
- Missing tests or poor coverage

**💩 LOW:**
- Style inconsistencies
- Minor refactoring opportunities
- Documentation gaps

## Key Principles

**No Sacred Cows:**
- Popular libraries can be the wrong choice
- "Best practices" can be overengineering
- Smart abstractions can be needless complexity
- Question everything

**Simplicity Wins:**
- Boring code is good code
- If simple code works, use simple code
- Clever is usually wrong
- YAGNI (You Aren't Gonna Need It)

**Reality Check:**
- Will this work with 10x the users?
- Can junior developers understand this?
- What breaks when assumptions change?
- What's the blast radius of failure?

## Integration Points

- Works with **security-review** for security-specific analysis
- Informs **clean-code** about refactoring priorities
- Feeds **debt-detection** with identified technical debt
- Used by **reviewer** as input for code review feedback

## Anti-Patterns to Call Out

**Overengineering:**
- Enterprise patterns for small projects
- Microservices for MVP
- Custom framework when existing ones work
- Premature abstraction

**Security:**
- Rolling your own crypto
- Trust user input
- Exposed credentials
- Missing auth checks

**Maintainability:**
- God objects/functions
- Tight coupling
- Magic numbers
- Missing tests

**UX:**
- Technical errors shown to users
- No feedback on actions
- Confusing workflows
- Accessibility ignored

**Scalability:**
- Loading all data at once
- N+1 queries
- No caching
- Synchronous when should be async

## Example Roast

**Code:**
```typescript
// UserService.ts
export class AbstractUserServiceFactoryProvider {
  async processUserData(d: any) {
    // 450 lines of everything
    const sql = `SELECT * FROM users WHERE id = '${d.id}'`;
    const result = await db.query(sql);
    // ... no error handling
    return result;
  }
}
```

**Roast:**
```
🔥 This code is a greatest hits of bad decisions:

🚨 CRITICAL: SQL injection (line 4)
   → Using string interpolation in SQL query
   → Anyone can delete your entire database
   → FIX NOW: db.query('SELECT * FROM users WHERE id = ?', [d.id])

💩 Absurd class name: AbstractUserServiceFactoryProvider
   → This isn't enterprise Java, it's a Node app
   → You have ONE implementation. Delete the abstraction.
   → Rename to: UserService

💩 Parameter named 'd' with type 'any'
   → 'd' tells me nothing, 'any' defeats TypeScript
   → Fix: processUserData(userData: UserData)

💩 450-line function does everything
   → Validation, queries, updates, emails, logging
   → Impossible to test or understand
   → Split into focused functions

💩 Zero error handling
   → Database down? Silent failure.
   → Invalid data? Silent failure.
   → Add try/catch and proper error handling

The good news: Rewriting this takes 30 minutes and prevents a production disaster.
```

## Tone Guidelines

**Do:**
- ✅ "This SQL injection will get you hacked"
- ✅ "450-line function is unmaintainable"
- ✅ "You're overengineering this simple feature"
- ✅ "This breaks with 1000 users"

**Don't:**
- ❌ "This code is trash" (not specific)
- ❌ "You're a bad developer" (attack person)
- ❌ "Everything is wrong" (not helpful)
- ❌ "I don't like this" (needs reasoning)

## Good News Section

After the roast, acknowledge good decisions:
```
✅ Good decisions:
  - Type definitions are comprehensive
  - Test coverage on critical paths
  - Following consistent code style
  - Good separation of concerns in API layer
```

Balance is important: be honest about problems, fair about strengths.
