# Development Guide

## Purpose

This guide provides comprehensive best practices, workflows, and standards for developing software in this project. It covers everything from local setup to code quality standards, ensuring consistent and efficient development across the team.

### How to Use This Guide

1. **New developers**: Read the entire guide before contributing
2. **Reference**: Use specific sections as needed during development
3. **Update**: Keep this guide current as processes evolve
4. **Customize**: Adapt sections to fit your project's specific needs

---

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Version Control Workflow](#version-control-workflow)
- [Testing Strategy](#testing-strategy)
- [Debugging Practices](#debugging-practices)
- [Code Review Guidelines](#code-review-guidelines)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)
- [Documentation Standards](#documentation-standards)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Development Tools](#development-tools)

---

## Development Environment Setup

### Prerequisites

Before starting development, ensure you have:

#### Required Software
- **Runtime**: Node.js 18+, Python 3.10+, or [your language]
- **Package Manager**: npm, yarn, pip, or [your package manager]
- **Version Control**: Git 2.30+
- **IDE/Editor**: VS Code, IntelliJ, or [recommended editor]
- **Database**: PostgreSQL 14+, MySQL 8+, or [your database]
- **Container Runtime** (optional): Docker 20+, Docker Compose 2+

#### Development Tools
- **Linter**: ESLint, Pylint, or [your linter]
- **Formatter**: Prettier, Black, or [your formatter]
- **API Client**: Postman, Insomnia, or curl/httpie
- **Database Client**: pgAdmin, DBeaver, or CLI tools

### Local Setup Instructions

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/your-project.git
cd your-project

# Create development branch
git checkout -b dev/your-name
```

#### 2. Install Dependencies

**Node.js/JavaScript:**
```bash
npm install
# or
yarn install
```

**Python:**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

**Other Languages:**
```bash
# Add your language-specific setup here
```

#### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local settings
# Required variables:
# - DATABASE_URL=postgresql://localhost:5432/myapp_dev
# - API_KEY=your_dev_api_key
# - LOG_LEVEL=debug
# - PORT=3000
```

**Important Environment Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@localhost:5432/db` |
| `API_KEY` | Third-party API key | `dev_key_123456` |
| `SECRET_KEY` | Application secret | `generated-secret-key` |
| `LOG_LEVEL` | Logging verbosity | `debug`, `info`, `error` |
| `PORT` | Application port | `3000` |

#### 4. Database Setup

```bash
# Create database
createdb myapp_dev

# Run migrations
npm run migrate
# or
python manage.py migrate

# Seed with sample data (optional)
npm run seed
# or
python manage.py seed
```

#### 5. Start Development Server

```bash
# Start in development mode with hot reload
npm run dev
# or
python manage.py runserver
# or
make dev
```

#### 6. Verify Setup

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status": "ok", "version": "1.0.0"}
```

### IDE Configuration

#### VS Code Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/.venv": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black"
}
```

---

## Project Architecture

### Directory Structure

```
project-root/
├── src/                      # Source code
│   ├── api/                  # API routes/controllers
│   ├── services/             # Business logic
│   ├── models/               # Data models
│   ├── utils/                # Utility functions
│   ├── middleware/           # Middleware functions
│   └── config/               # Configuration files
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
├── docs/                     # Documentation
├── scripts/                  # Build/deployment scripts
├── migrations/               # Database migrations
├── public/                   # Static assets
└── .ai/                      # AI workflow files
```

### Architecture Principles

1. **Separation of Concerns**: Keep business logic separate from routing and data access
2. **DRY (Don't Repeat Yourself)**: Extract common functionality into utilities
3. **SOLID Principles**: Follow object-oriented design principles
4. **Dependency Injection**: Pass dependencies explicitly for testability
5. **Configuration over Convention**: Make behavior explicit through configuration

### Module Organization

**Good Example:**
```
src/
  users/
    ├── user.model.js         # Data model
    ├── user.service.js       # Business logic
    ├── user.controller.js    # Request handling
    ├── user.validation.js    # Input validation
    └── user.test.js          # Tests
```

**Bad Example:**
```
src/
  ├── models.js              # All models in one file
  ├── controllers.js         # All controllers in one file
  └── services.js            # All services in one file
```

---

## Coding Standards

### General Principles

1. **Readability**: Code is read more than written - prioritize clarity
2. **Simplicity**: Prefer simple solutions over clever ones
3. **Consistency**: Follow existing patterns in the codebase
4. **Maintainability**: Write code that's easy to change
5. **Performance**: Optimize when necessary, not prematurely

### Naming Conventions

#### Variables and Functions

**Good:**
```javascript
const userAge = 25;
const isAuthenticated = true;
const userList = [];

function calculateTotalPrice(items) { }
function getUserById(id) { }
```

**Bad:**
```javascript
const x = 25;
const auth = true;
const arr = [];

function calc(items) { }
function get(id) { }
```

#### Classes and Components

**Good:**
```javascript
class UserService { }
class PaymentProcessor { }
class DatabaseConnection { }
```

**Bad:**
```javascript
class user { }
class payment_proc { }
class DB { }
```

#### Constants

**Good:**
```javascript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

#### Files and Directories

- Use kebab-case for files: `user-service.js`, `payment-controller.js`
- Use PascalCase for class files: `UserService.js`, `PaymentProcessor.js`
- Use singular for models: `user.model.js`, not `users.model.js`
- Use plural for collections: `users/`, `products/`

### Code Formatting

**Use automated formatters** - don't manually format:

```bash
# Format code
npm run format
# or
black .
```

**Configuration:**

`.prettierrc` (JavaScript):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

`pyproject.toml` (Python):
```toml
[tool.black]
line-length = 100
target-version = ['py310']
```

### Comments and Documentation

#### When to Comment

**DO comment:**
- Complex algorithms or business logic
- Non-obvious workarounds
- API contracts and interfaces
- TODOs and FIXMEs with context

**DON'T comment:**
- Obvious code that explains itself
- What the code does (code shows this)
- Redundant information

**Good:**
```javascript
// Calculate compound interest using the formula A = P(1 + r/n)^(nt)
// where P = principal, r = rate, n = compounds per year, t = years
function calculateCompoundInterest(principal, rate, compounds, years) {
  return principal * Math.pow(1 + rate / compounds, compounds * years);
}

// FIXME: This causes a race condition when multiple users
// update the same resource. Need to implement optimistic locking.
async function updateResource(id, data) { }
```

**Bad:**
```javascript
// This function adds two numbers
function add(a, b) {
  return a + b;  // Return the sum
}
```

#### Documentation Comments

**JavaScript (JSDoc):**
```javascript
/**
 * Retrieves a user by their unique identifier
 * @param {number} id - The user's ID
 * @param {Object} options - Query options
 * @param {boolean} options.includeDeleted - Include soft-deleted users
 * @returns {Promise<User|null>} The user object or null if not found
 * @throws {ValidationError} If ID is invalid
 */
async function getUserById(id, options = {}) {
  // Implementation
}
```

**Python (Docstrings):**
```python
def get_user_by_id(id: int, include_deleted: bool = False) -> Optional[User]:
    """
    Retrieves a user by their unique identifier.
    
    Args:
        id: The user's ID
        include_deleted: Whether to include soft-deleted users
    
    Returns:
        The user object or None if not found
    
    Raises:
        ValidationError: If ID is invalid
    """
    pass
```

### Error Handling

#### Use Specific Exceptions

**Good:**
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

if (!email.includes('@')) {
  throw new ValidationError('Invalid email format', 'email');
}
```

**Bad:**
```javascript
if (!email.includes('@')) {
  throw new Error('Invalid email');  // Generic error
}
```

#### Handle Errors Gracefully

**Good:**
```javascript
try {
  const data = await fetchUserData(userId);
  return processData(data);
} catch (error) {
  if (error instanceof NotFoundError) {
    logger.warn(`User ${userId} not found`);
    return null;
  }
  if (error instanceof NetworkError) {
    logger.error('Network error fetching user', { userId, error });
    throw new ServiceUnavailableError('Unable to fetch user data');
  }
  throw error;  // Re-throw unknown errors
}
```

**Bad:**
```javascript
try {
  const data = await fetchUserData(userId);
  return processData(data);
} catch (error) {
  console.log('Error:', error);  // Swallow error
  return null;
}
```

---

## Version Control Workflow

### Branch Strategy

We use **Git Flow** for branch management:

```
main            # Production-ready code
  ↓
develop         # Integration branch
  ↓
feature/        # New features
bugfix/         # Bug fixes
hotfix/         # Critical production fixes
release/        # Release preparation
```

### Branch Naming Conventions

```bash
# Features
feature/user-authentication
feature/payment-integration

# Bug fixes
bugfix/login-error
bugfix/api-timeout

# Hotfixes
hotfix/security-vulnerability
hotfix/crash-on-checkout

# Releases
release/v1.2.0
```

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring (no behavior change)
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh to improve user experience.
Tokens now refresh 5 minutes before expiration.

Closes #123
```

```bash
fix(api): handle null values in user profile

Previously, null values caused 500 errors. Now returns
appropriate default values.

Fixes #456
```

### Pull Request Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature develop
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat(feature): implement my feature"
   ```

3. **Keep Branch Updated**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/my-feature
   # Create PR via GitHub/GitLab UI
   ```

5. **Address Review Comments**
   ```bash
   # Make changes
   git add .
   git commit --amend  # Or new commit
   git push --force-with-lease
   ```

6. **Merge After Approval**
   - Squash commits if multiple small commits
   - Use merge commit for significant features
   - Delete branch after merge

### Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guide
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated (README, API docs, etc.)
- [ ] No commented-out code or debug statements
- [ ] No sensitive data (API keys, passwords)
- [ ] No merge conflicts with target branch
- [ ] PR description explains what and why
- [ ] Screenshots included for UI changes

---

## Testing Strategy

### Testing Pyramid

```
       /\
      /  \    E2E Tests (Few)
     /____\   
    /      \  Integration Tests (Some)
   /________\ 
  /          \ Unit Tests (Many)
 /____________\
```

### Test Coverage Goals

- **Overall**: 80%+ code coverage
- **Critical paths**: 100% coverage (auth, payments, data integrity)
- **Utilities**: 90%+ coverage
- **UI components**: 70%+ coverage

### Unit Tests

Test individual functions/methods in isolation.

**Example (JavaScript - Jest):**
```javascript
// user.service.test.js
describe('UserService', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should handle null input', () => {
      expect(validateEmail(null)).toBe(false);
    });
  });
});
```

**Example (Python - pytest):**
```python
# test_user_service.py
def test_validate_email_valid():
    assert validate_email('test@example.com') is True

def test_validate_email_invalid():
    assert validate_email('invalid-email') is False

def test_validate_email_null():
    assert validate_email(None) is False
```

### Integration Tests

Test interactions between components.

**Example:**
```javascript
describe('User API Integration', () => {
  it('should create user and store in database', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' });
    
    expect(response.status).toBe(201);
    
    const userInDb = await db.users.findOne({ email: 'john@example.com' });
    expect(userInDb).toBeDefined();
    expect(userInDb.name).toBe('John');
  });
});
```

### End-to-End Tests

Test complete user workflows.

**Example (Cypress):**
```javascript
describe('User Registration Flow', () => {
  it('should register new user', () => {
    cy.visit('/register');
    cy.get('[name="email"]').type('newuser@example.com');
    cy.get('[name="password"]').type('SecurePass123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, newuser@example.com');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test user.test.js

# Run tests in watch mode
npm run test:watch

# Run only integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

---

## Debugging Practices

### Logging

Use structured logging with appropriate levels:

**Levels:**
- `DEBUG`: Detailed diagnostic information
- `INFO`: General informational messages
- `WARN`: Warning messages (potential issues)
- `ERROR`: Error messages (requires attention)
- `FATAL`: Critical errors (application crash)

**Example:**
```javascript
const logger = require('./logger');

// Good
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', { error: err.message, host: dbHost });

// Bad
console.log('User logged in');  // Unstructured
console.log(err);  // No context
```

### Debugging Tools

#### Browser DevTools (Frontend)
- **Console**: Log messages and inspect objects
- **Network**: Monitor API calls
- **Sources**: Set breakpoints in JavaScript
- **Performance**: Profile performance issues

#### IDE Debugger
- Set breakpoints
- Inspect variables
- Step through code
- Watch expressions

#### Node.js Debugger
```bash
# Start with inspector
node --inspect-brk index.js

# In Chrome, navigate to:
chrome://inspect
```

#### Python Debugger (pdb)
```python
import pdb

def problematic_function():
    # ... code ...
    pdb.set_trace()  # Execution pauses here
    # ... more code ...
```

### Common Debugging Techniques

1. **Binary Search**: Comment out half the code to isolate issue
2. **Print Debugging**: Strategic logging at key points
3. **Rubber Duck Debugging**: Explain the problem out loud
4. **Git Bisect**: Find the commit that introduced a bug
5. **Reproduce Minimally**: Create minimal reproduction case

---

## Code Review Guidelines

### As a Reviewer

#### What to Look For

1. **Correctness**: Does the code work as intended?
2. **Clarity**: Is it easy to understand?
3. **Maintainability**: Will it be easy to modify later?
4. **Performance**: Are there obvious performance issues?
5. **Security**: Are there security vulnerabilities?
6. **Tests**: Are there adequate tests?
7. **Documentation**: Is it properly documented?

#### How to Provide Feedback

**Good:**
```
Suggestion: Consider using Array.map() instead of forEach for better readability:

const userNames = users.map(u => u.name);

This makes the transformation explicit and returns the result.
```

**Bad:**
```
This is wrong. Use map instead.
```

#### Review Turnaround

- **Small PRs (<200 lines)**: Review within 4 hours
- **Medium PRs (200-500 lines)**: Review within 1 day
- **Large PRs (>500 lines)**: Request PR split or review within 2 days

### As a PR Author

#### PR Description Template

```markdown
## What
Brief description of changes

## Why
Reason for the changes

## How
Technical approach

## Testing
How to test the changes

## Screenshots (if UI changes)
[Attach screenshots]

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

#### Responding to Feedback

- Be respectful and professional
- Ask clarifying questions if feedback is unclear
- Explain your reasoning when disagreeing
- Mark conversations as resolved after addressing

---

## Performance Optimization

### Performance Principles

1. **Measure First**: Use profiling before optimizing
2. **Optimize Critical Paths**: Focus on hot code paths
3. **Balance Tradeoffs**: Consider readability vs performance
4. **Cache Strategically**: Cache expensive operations
5. **Lazy Load**: Load resources only when needed

### Database Optimization

**Add Indexes:**
```sql
-- Slow query
SELECT * FROM users WHERE email = 'user@example.com';

-- Add index
CREATE INDEX idx_users_email ON users(email);
```

**Use Query Optimization:**
```javascript
// Bad: N+1 query problem
const users = await User.findAll();
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } });
}

// Good: Use eager loading
const users = await User.findAll({
  include: [{ model: Post }]
});
```

### Caching Strategies

```javascript
const cache = require('./cache');

async function getUserById(id) {
  const cacheKey = `user:${id}`;
  
  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const user = await db.users.findById(id);
  
  // Cache for 5 minutes
  await cache.set(cacheKey, user, 300);
  
  return user;
}
```

### Frontend Performance

- **Code Splitting**: Split bundles to reduce initial load
- **Lazy Loading**: Load components/images on demand
- **Memoization**: Cache expensive computations
- **Debouncing**: Limit function call frequency
- **Virtual Scrolling**: Render only visible items

---

## Security Best Practices

### Input Validation

**Always validate user input:**
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(0).max(150)
});

const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

### SQL Injection Prevention

**Use parameterized queries:**
```javascript
// Bad: Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// Good: Parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
const result = await db.query(query, [email]);
```

### XSS Prevention

**Escape user input:**
```javascript
// Bad: Directly inserting user input
document.innerHTML = userInput;

// Good: Use text content or sanitize
document.textContent = userInput;
// or
const sanitized = DOMPurify.sanitize(userInput);
```

### Authentication & Authorization

```javascript
// Verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Check user permissions
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

### Secrets Management

**Never commit secrets:**
```bash
# Use environment variables
DATABASE_PASSWORD=<from-env-var>
API_KEY=<from-secret-manager>

# Use .gitignore
.env
.env.local
secrets.json
```

---

## Documentation Standards

### README Files

Every module/package should have a README:

```markdown
# Module Name

Brief description of what this module does.

## Installation

\`\`\`bash
npm install module-name
\`\`\`

## Usage

\`\`\`javascript
const module = require('module-name');
module.doSomething();
\`\`\`

## API

### function()
Description of function

## Contributing

See CONTRIBUTING.md

## License

MIT
```

### Inline Documentation

Document complex logic:
```javascript
/**
 * Implements the Luhn algorithm for credit card validation.
 * Steps:
 * 1. Reverse the card number
 * 2. Double every second digit
 * 3. If result > 9, subtract 9
 * 4. Sum all digits
 * 5. Check if sum % 10 === 0
 */
function validateCreditCard(cardNumber) {
  // Implementation
}
```

---

## Troubleshooting Common Issues

### Database Connection Issues

```bash
# Check if database is running
pg_isready -h localhost -p 5432

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for Python
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

---

## Development Tools

### Recommended Tools

#### Code Quality
- **Linter**: ESLint, Pylint
- **Formatter**: Prettier, Black
- **Type Checker**: TypeScript, mypy

#### Testing
- **Unit Testing**: Jest, pytest
- **E2E Testing**: Cypress, Playwright
- **API Testing**: Postman, Insomnia

#### Database
- **GUI**: DBeaver, pgAdmin, MongoDB Compass
- **CLI**: psql, mysql, mongosh

#### Monitoring
- **Logs**: Papertrail, Loggly
- **Performance**: New Relic, Datadog
- **Errors**: Sentry, Rollbar

---

## Related Documentation

- [API Documentation](./API.md) - API endpoints and integration
- [Deployment Guide](./DEPLOYMENT.md) - Deployment procedures
- [Testing Strategy](./TESTING.md) - Comprehensive testing guide
- [Architecture Overview](./.ai/context/ARCHITECTURE.md) - System architecture

---

## Continuous Improvement

This guide is a living document. If you find:
- Missing information
- Outdated practices
- Better approaches

Please submit a PR to update this guide!
