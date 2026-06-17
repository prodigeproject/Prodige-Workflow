# Review Gates

Review gates adalah checkpoint kualitas di setiap fase untuk memastikan output memenuhi standar sebelum melanjutkan ke fase berikutnya.

## Gate 1: PRD Gate
**Trigger**: Setelah PRD draft complete  
**Required Before**: Architecture design dimulai

### Checklist
- [ ] Problem statement jelas dan tervalidasi
- [ ] User stories lengkap dengan acceptance criteria
- [ ] Success metrics terdefinisi
- [ ] Constraints dan assumptions documented
- [ ] Stakeholder approval obtained

### Reviewer
- Product Owner atau Architect
- Minimal 1 peer review

### Outputs
- Approved PRD document
- Go/No-go decision untuk architecture phase

---

## Gate 2: Architecture Gate
**Trigger**: Setelah architecture design complete  
**Required Before**: Implementation plan dimulai

### Checklist
- [ ] System design diagram complete
- [ ] Component boundaries jelas
- [ ] Data flow documented
- [ ] Technology stack justified
- [ ] Scalability considerations addressed
- [ ] Security considerations documented
- [ ] Integration points identified
- [ ] Trade-offs explicitly stated

### Reviewer
- Tech Lead atau Senior Architect
- Security review (jika applicable)

### Outputs
- Approved architecture document
- Technical specifications
- Risk assessment

---

## Gate 3: Implementation Gate
**Trigger**: Setelah implementation plan complete  
**Required Before**: Build/coding dimulai

### Checklist
- [ ] Tasks breakdown complete dan realistic
- [ ] Dependencies identified
- [ ] Timeline estimated
- [ ] Resource allocation clear
- [ ] Testing strategy defined
- [ ] Rollback plan documented
- [ ] Monitoring strategy planned

### Reviewer
- Development Lead
- QA Lead (untuk testing strategy)

### Outputs
- Approved implementation plan
- Task assignments
- Sprint/iteration plan

---

## Gate 4: Code Review Gate
**Trigger**: Sebelum merge ke main branch  
**Required Before**: Code merge

### Checklist
- [ ] Code follows style guide
- [ ] Tests written dan passing
- [ ] Documentation updated
- [ ] No critical security issues
- [ ] Performance acceptable
- [ ] Error handling proper
- [ ] Backwards compatibility checked
- [ ] No hardcoded secrets

### Reviewer
- Minimal 1 senior developer
- Automated checks passing

### Outputs
- Approved PR
- Merge to main branch

---

## Gate 5: Release Gate
**Trigger**: Sebelum production deployment  
**Required Before**: Release to production

### Checklist
- [ ] All tests passing (unit, integration, e2e)
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Documentation complete dan updated
- [ ] Release notes prepared
- [ ] Rollback plan verified
- [ ] Monitoring dashboards ready
- [ ] Stakeholder notification sent

### Reviewer
- Release Manager
- Tech Lead approval
- Product Owner approval (untuk feature releases)

### Outputs
- Production deployment
- Release announcement
- Post-release monitoring plan

---

## Emergency Bypass

Dalam situasi emergency (production down, critical security fix):

1. **Document**: Catat alasan bypass
2. **Notify**: Inform stakeholders
3. **Fast-track**: Minimal 1 reviewer approval
4. **Follow-up**: Complete full review post-deployment

### Emergency Checklist
- [ ] Incident documented
- [ ] Quick review completed
- [ ] Deployment plan clear
- [ ] Rollback tested
- [ ] Post-mortem scheduled

---

## Gate Metrics

Track untuk continuous improvement:
- Average time at each gate
- Gate rejection rate
- Issues found at each gate
- Bypass frequency dan reasons

## Best Practices

1. **Early Feedback**: Involve reviewers early, jangan tunggu gate
2. **Async Reviews**: Use async communication untuk efisiensi
3. **Clear Criteria**: Semua checklist items harus objective
4. **Learn**: Update gates berdasarkan lessons learned
