# Documentation Debt

Tracking missing atau outdated documentation.

## How to Use

1. **Identify**: Catat documentation gaps saat discovered
2. **Prioritize**: Determine urgency based on audience dan impact
3. **Assign**: Allocate ownership
4. **Complete**: Write atau update documentation
5. **Review**: Ensure quality dan accuracy

## Debt Template

```markdown
### DD-XXX: [Documentation Gap Title]
**Date Logged**: YYYY-MM-DD
**Type**: [API/Code/Architecture/User Guide/Onboarding/Process]
**Audience**: [Developers/Users/Stakeholders/New Team Members]
**Priority**: [Critical/High/Medium/Low]
**Effort**: [Small/Medium/Large]

**What's Missing**:
[Describe the gap]

**Impact**:
- [Impact 1]
- [Impact 2]

**Proposed Content**:
[Outline what should be documented]

**Owner**: [Name]
**Target Date**: YYYY-MM-DD
**Status**: [Open/In Progress/Resolved]
```

---

## Open Documentation Debt

### Critical (Blocking Work)

> No critical documentation debt currently

### High (Frequently Needed)

> No high-priority documentation debt currently

### Medium (Occasionally Needed)

> No medium-priority documentation debt currently

### Low (Nice to Have)

> No low-priority documentation debt currently

---

## Resolved Documentation Debt

### Recently Resolved (Last 30 Days)

> No recently resolved documentation debt

### Historical

> Archive older resolved items here

---

## Documentation Types

### API Documentation
- Endpoint descriptions
- Request/response schemas
- Authentication methods
- Error codes
- Rate limits
- Examples dan use cases

### Code Documentation
- Function/method comments
- Class descriptions
- Module overviews
- Complex algorithm explanations
- Architecture decisions (ADRs)
- Inline comments for tricky code

### Architecture Documentation
- System design diagrams
- Component interactions
- Data flow diagrams
- Infrastructure setup
- Deployment architecture
- Security architecture

### User Documentation
- User guides
- Tutorial walkthrough
- FAQ
- Troubleshooting guides
- Feature documentation
- Video tutorials

### Process Documentation
- Development workflow
- Deployment process
- Incident response playbook
- Code review guidelines
- Testing strategy
- Release process

### Onboarding Documentation
- Setup guides
- Codebase overview
- Team practices
- Tools dan access
- First task guide
- Common pitfalls

---

## Priority Guidelines

### Critical
- No documentation exists for critical system
- Blocking new team members
- External API without docs
- Security procedures undocumented

**Action**: Document immediately

### High
- Frequently asked questions
- Common tasks without guides
- Recently changed features
- Public APIs

**Action**: Document within 1 week

### Medium
- Occasionally needed information
- Internal APIs
- Standard procedures
- Architecture decisions

**Action**: Document within 1 month

### Low
- Rarely needed information
- Self-explanatory features
- Internal tools
- Nice-to-have context

**Action**: Document when capacity available

---

## Effort Estimation

- **Small**: <2 hours (simple doc, 1-2 pages)
- **Medium**: 2-8 hours (moderate doc, 5-10 pages)
- **Large**: >8 hours (comprehensive doc, 20+ pages, diagrams)

---

## Documentation Standards

### Structure
1. **Title**: Clear dan descriptive
2. **Overview**: What is this about
3. **Prerequisites**: What user needs to know
4. **Content**: Main information
5. **Examples**: Practical examples
6. **References**: Links to related docs

### Best Practices
- Write for your audience (technical level)
- Use clear, simple language
- Include code examples
- Add diagrams where helpful
- Keep up-to-date
- Review regularly
- Link related documentation

### Templates
Create reusable templates untuk:
- API endpoint documentation
- Feature documentation
- Runbook templates
- ADR templates
- User guide templates

---

## Documentation Metrics

```markdown
## Current Metrics

**Total Documentation Debt**: 0
- Critical: 0
- High: 0
- Medium: 0
- Low: 0

**By Type**:
- API: 0
- Code: 0
- Architecture: 0
- User Guide: 0
- Process: 0
- Onboarding: 0

**This Month**:
- Debt Added: 0
- Debt Resolved: 0
- Net Change: 0

**Average Age of Open Debt**: N/A
```

---

## Maintenance Schedule

### Weekly
- Review newly merged code for documentation needs
- Update API docs for endpoint changes

### Monthly
- Review documentation debt list
- Update priority based on usage
- Archive outdated docs

### Quarterly
- Complete documentation audit
- Update architecture diagrams
- Refresh onboarding materials
- Review dan update process docs

### Annually
- Comprehensive documentation review
- Update all outdated content
- Reorganize if needed
- Survey users for gaps

---

## Prevention Strategies

1. **Definition of Done**: Documentation required untuk features
2. **Code Review**: Check for missing comments
3. **PR Template**: Include documentation checklist
4. **Documentation Sprint**: Dedicated time each quarter
5. **Champions**: Assign documentation advocates
6. **Tools**: Use doc generation tools (JSDoc, Swagger, etc.)
7. **Feedback Loop**: Easy way to report doc issues

---

## Example Debt Entry

### DD-001: Missing API Authentication Guide
**Date Logged**: 2024-01-15
**Type**: API Documentation
**Audience**: External Developers
**Priority**: Critical
**Effort**: Medium

**What's Missing**:
No documentation untuk how to authenticate dengan API. Developers tidak tahu:
- How to obtain API keys
- How to include auth headers
- Token refresh mechanism
- Error handling for auth failures
- Rate limiting details

**Impact**:
- Support tickets increase (20+ per week)
- Developer frustration
- Slow API adoption
- Poor developer experience
- Wasted engineering time pada support

**Proposed Content**:
1. **Overview** (1 page)
   - Authentication methods available
   - When to use each method

2. **Getting Started** (2 pages)
   - How to generate API keys
   - Quick start example
   - Testing authentication

3. **Authentication Methods** (3 pages)
   - API Key authentication
   - OAuth 2.0 flow
   - JWT tokens
   - Code examples in 3 languages

4. **Best Practices** (1 page)
   - Key rotation
   - Secure storage
   - Error handling
   - Rate limiting

5. **Troubleshooting** (1 page)
   - Common errors
   - Solutions
   - Support contact

**Owner**: API Team Lead
**Target Date**: 2024-01-25
**Status**: In Progress

**Updates**:
- 2024-01-18: Outline approved, started writing
- 2024-01-22: Draft complete, in review
- 2024-01-25: Published, support tickets dropped by 60%
