---
name: security-review
description: "Comprehensive security assessment: checks for exposed secrets, authentication/authorization flaws, injection vulnerabilities, unsafe dependencies, and data exposure risks."
---

# Security Review

Systematically identify security vulnerabilities and risks in code, architecture, and implementation plans.

## Purpose

Prevent security incidents by checking for:
- **Secrets exposure:** API keys, passwords, tokens in code
- **Authentication issues:** Weak or missing authentication
- **Authorization flaws:** Insufficient access controls
- **Injection vulnerabilities:** SQL, XSS, command injection
- **Unsafe dependencies:** Vulnerable packages and libraries
- **Data exposure:** Sensitive data in logs, errors, responses

## When to Use

This skill is automatically selected by the orchestrator when:
- Reviewing code that handles authentication or authorization
- Implementing features that process user input
- Adding external dependencies
- Working with sensitive data (PII, credentials, payments)
- Deploying security-critical changes
- User explicitly requests security review

## Process

### 1. Secrets and Credentials Check
Search for exposed secrets:
- API keys, tokens, passwords in source code
- Credentials in configuration files committed to git
- Secrets in environment variables logged or exposed
- Private keys in repository
- Database credentials hardcoded

### 2. Authentication Review
Evaluate authentication mechanisms:
- Password storage (hashed with bcrypt/argon2?)
- Session management (secure, httpOnly cookies?)
- Token handling (JWT validation, expiration?)
- Password reset flow (secure tokens, expiration?)
- Multi-factor authentication (if required)

### 3. Authorization Assessment
Check access control implementation:
- Are protected routes actually protected?
- Can users access others' data? (IDOR - Insecure Direct Object Reference)
- Is role-based access control enforced?
- Are authorization checks on both frontend and backend?
- Can users escalate privileges?

### 4. Injection Vulnerability Scan
Look for injection attack vectors:
- **SQL Injection:** Unsafe query construction
- **XSS (Cross-Site Scripting):** Unescaped user input in HTML
- **Command Injection:** Unsanitized input in shell commands
- **Path Traversal:** User-controlled file paths
- **NoSQL Injection:** Unsafe database queries

### 5. Dependency Security
Evaluate third-party code:
- Known vulnerabilities in dependencies (npm audit, etc.)
- Outdated packages with security issues
- Suspicious or unmaintained dependencies
- Excessive permissions requested by packages

### 6. Data Exposure Check
Find sensitive data leaks:
- PII (Personally Identifiable Information) in logs
- Sensitive data in error messages
- Detailed error stack traces in production
- Sensitive data in URLs or query parameters
- Unencrypted sensitive data transmission

### 7. Common Vulnerability Patterns
Check for standard security issues:
- CSRF (Cross-Site Request Forgery) protection
- Insecure direct object references
- Security misconfiguration
- Insufficient rate limiting
- Missing security headers
- Insecure file uploads

## Output Format

Provide findings by severity with specific locations and fixes:

**🚨 CRITICAL (Immediate Action Required):**
```
🔴 SQL Injection in user search
   Location: src/api/users.ts:45
   Code: db.query(`SELECT * FROM users WHERE name = '${input}'`)
   Vulnerability: Attacker can inject SQL: '; DROP TABLE users; --
   Impact: Complete database compromise
   Fix: Use parameterized queries
        db.query('SELECT * FROM users WHERE name = ?', [input])

🔴 Hardcoded API key in source
   Location: src/config/api.ts:12
   Code: const API_KEY = "sk_live_abc123xyz..."
   Vulnerability: Key exposed in git history, anyone can use it
   Impact: Unauthorized API access, billing abuse
   Fix: 1. Revoke this key immediately
        2. Move to environment variable
        3. Add .env to .gitignore
        4. Rotate credentials

🔴 Password stored in plain text
   Location: lib/auth.ts:67
   Code: user.password = password
   Vulnerability: Database breach exposes all passwords
   Impact: Account takeover, credential stuffing
   Fix: Hash with bcrypt before storage
        import bcrypt from 'bcrypt';
        user.password = await bcrypt.hash(password, 10);
```

**🟠 HIGH (Fix Soon):**
```
🟠 Missing authentication on admin endpoint
   Location: app/api/admin/users/route.ts
   Code: export async function GET() { ... }
   Vulnerability: Anyone can access admin functions
   Impact: Unauthorized access to sensitive operations
   Fix: Add authentication middleware
        if (!session?.user?.isAdmin) {
          return new Response('Unauthorized', { status: 401 });
        }

🟠 XSS vulnerability in comment display
   Location: components/Comment.tsx:23
   Code: <div dangerouslySetInnerHTML={{ __html: comment }} />
   Vulnerability: User can inject malicious scripts
   Impact: Session hijacking, data theft
   Fix: Sanitize HTML or use text content
        <div>{comment}</div> // Safe, automatically escaped

🟠 Insecure direct object reference
   Location: app/api/documents/[id]/route.ts
   Code: const doc = await db.document.findUnique({ where: { id } })
   Vulnerability: No check if user owns this document
   Impact: Users can access others' documents
   Fix: Add ownership check
        const doc = await db.document.findFirst({
          where: { id, userId: session.user.id }
        })
```

**🟡 MEDIUM (Should Fix):**
```
🟡 Sensitive data in error messages
   Location: app/api/login/route.ts:34
   Code: throw new Error(`Login failed for ${email} with password ${password}`)
   Vulnerability: Credentials appear in logs and error tracking
   Impact: Credential exposure in logging systems
   Fix: Log generic errors, no sensitive data
        throw new Error('Login failed')

🟡 Missing rate limiting on login
   Location: app/api/login/route.ts
   Vulnerability: Allows brute-force password attacks
   Impact: Account compromise through password guessing
   Fix: Add rate limiting middleware
        import rateLimit from 'express-rate-limit';
        const limiter = rateLimit({ windowMs: 15*60*1000, max: 5 });

🟡 Vulnerable dependency
   Location: package.json
   Package: axios@0.21.1
   Vulnerability: CVE-2021-3749 (Server-Side Request Forgery)
   Impact: Potential SSRF attacks
   Fix: Update to axios@1.6.0 or later
        npm install axios@latest
```

**🟢 LOW (Nice to Have):**
```
🟢 Missing security headers
   Location: Server configuration
   Missing: Content-Security-Policy, X-Frame-Options
   Impact: Increased risk of XSS, clickjacking
   Fix: Add security headers in middleware/config

🟢 Weak session timeout
   Location: auth configuration
   Current: 30-day session timeout
   Risk: Long-lived sessions increase compromise window
   Recommendation: Reduce to 24 hours with refresh tokens
```

**✅ Security Checklist:**
```
Authentication:
  ✅ Passwords hashed with bcrypt
  ❌ No session expiration configured
  ✅ Login rate limiting implemented
  ❌ No MFA available

Authorization:
  ❌ Missing ownership checks on resources
  ✅ Role-based access control implemented
  ❌ Frontend shows admin UI before auth check

Input Validation:
  ❌ SQL injection vulnerabilities found
  ✅ XSS protection on most inputs
  ❌ No file upload validation

Data Protection:
  ❌ Secrets in source code
  ✅ HTTPS enforced
  ⚠️  Some PII in logs

Dependencies:
  ⚠️  3 packages with known vulnerabilities
  ✅ Regular dependency updates
```

## Rules

- **Prioritize by severity:** Critical issues first, nice-to-haves last
- **Be specific:** Show exact file, line, and vulnerable code
- **Provide fixes:** Don't just identify problems, show solutions
- **Check everything:** Frontend, backend, infrastructure, dependencies
- **Think like an attacker:** How would you exploit this?
- **Validate fixes:** Ensure proposed solutions actually work

## Common Vulnerabilities Checklist

**Injection:**
- [ ] SQL queries use parameterized queries
- [ ] User input is escaped before rendering in HTML
- [ ] Shell commands don't include unsanitized user input
- [ ] File paths are validated and sanitized

**Authentication:**
- [ ] Passwords hashed with strong algorithm (bcrypt, argon2)
- [ ] Sessions expire and use secure cookies
- [ ] Password reset tokens expire and are single-use
- [ ] Account lockout after failed attempts

**Authorization:**
- [ ] All protected routes check authentication
- [ ] Users can only access their own resources
- [ ] Admin functions require admin role
- [ ] Authorization checked on backend, not just frontend

**Data Exposure:**
- [ ] No secrets in source code or git history
- [ ] Sensitive data not in logs or error messages
- [ ] Production errors don't expose stack traces
- [ ] HTTPS enforced for all sensitive data

**Dependencies:**
- [ ] No known vulnerabilities (npm audit, etc.)
- [ ] Dependencies are actively maintained
- [ ] Minimal dependencies (reduce attack surface)

**Configuration:**
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] CORS configured restrictively
- [ ] Rate limiting on sensitive endpoints
- [ ] Error handling doesn't leak information

## Integration Points

- Works with **roastme** for comprehensive code critique
- Informs **implementation-planning** about security requirements
- Used by **reviewer** to validate security before merge
- Feeds **documentation** with security considerations

## Attack Scenarios to Consider

**Authentication Bypass:**
- Can I access protected pages without logging in?
- Can I forge or manipulate authentication tokens?
- Can I reset others' passwords?

**Authorization Bypass:**
- Can I view/edit others' data by changing IDs?
- Can I escalate my role to admin?
- Can I access admin endpoints directly?

**Injection Attacks:**
- Can I inject SQL through search/filter inputs?
- Can I inject scripts through comment/profile fields?
- Can I execute commands through file upload names?

**Data Exposure:**
- Do error messages reveal sensitive information?
- Are secrets accessible in frontend code?
- Can I enumerate users or resources?

## Security Review Questions

Before approving implementation:

1. **Where does user input go?** → Validate and sanitize
2. **What data is sensitive?** → Encrypt, don't log
3. **Who can access this?** → Enforce authorization
4. **What if this fails?** → Fail securely, don't leak info
5. **What external code are we using?** → Audit dependencies
6. **How is this deployed?** → Secure configuration

## Example Review

**Feature:** User profile page with image upload

**Security Review:**

```
🚨 CRITICAL:
- File upload accepts any file type
  → Risk: Executable files, malware
  → Fix: Whitelist image MIME types, scan uploads

🟠 HIGH:
- Uploaded images served from same domain
  → Risk: XSS if SVG with scripts uploaded
  → Fix: Serve from separate domain or sanitize SVGs

🟡 MEDIUM:
- No file size limit
  → Risk: DoS through large file uploads
  → Fix: Add 5MB size limit

- Profile data accessible without auth check
  → Risk: Information disclosure
  → Fix: Require authentication for profile access

🟢 LOW:
- Image URLs predictable (sequential IDs)
  → Risk: Enumeration of all user images
  → Recommendation: Use UUIDs instead of sequential IDs

✅ Good:
- Images processed server-side
- Proper CORS configuration
- Rate limiting on upload endpoint
```

## False Positive Awareness

Sometimes apparent vulnerabilities are not actual risks:
- **Sanitized input:** Input already validated by robust library
- **Internal APIs:** Not exposed to untrusted users
- **Test code:** Not deployed to production
- **Documented exceptions:** Intentional trade-offs

Always verify before flagging, and acknowledge mitigations already in place.
