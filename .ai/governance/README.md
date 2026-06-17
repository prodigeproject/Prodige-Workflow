# Governance

Governance keeps speed from becoming chaos.

## Purpose
Menyediakan framework untuk memastikan kualitas, keamanan, dan keberlanjutan dalam pengembangan AI-assisted workflow.

## Structure

### 1. Review Gates (`review-gates.md`)
Checkpoint kualitas di setiap fase pengembangan untuk memastikan output memenuhi standar sebelum melanjutkan ke fase berikutnya.

### 2. Risk Register (`risk-register.md`)
Tracking dan mitigasi risiko proyek secara proaktif untuk menghindari masalah yang dapat menghambat progress.

### 3. Debt Management (`debt/`)
Sistem tracking untuk berbagai jenis debt yang perlu dikelola:
- **Technical Debt**: Code quality issues, refactoring needs
- **Architecture Debt**: Design decisions yang perlu diperbaiki
- **Documentation Debt**: Missing atau outdated documentation
- **Knowledge Debt**: Knowledge gaps dalam tim atau sistem

## How to Use

### Daily Workflow
1. Sebelum memulai task baru, check review gates yang relevan
2. Saat menemukan debt, catat di file debt yang sesuai
3. Update risk register jika menemukan risiko baru

### Weekly Review
1. Review semua open debt items
2. Prioritaskan debt items untuk diselesaikan
3. Update status risk register

### Before Major Milestones
1. Ensure semua review gates terpenuhi
2. Resolve critical debt items
3. Mitigate high-priority risks

## Integration with Workflow

Governance terintegrasi dengan:
- **State Management**: Status tracking mengikuti governance checkpoints
- **Memory System**: Decisions dan learnings dari governance issues
- **Agent System**: Agents enforce governance rules secara otomatis

## Principles

1. **Preventive > Reactive**: Catch issues early
2. **Transparent**: All issues visible dan tracked
3. **Actionable**: Every item memiliki clear action plan
4. **Balanced**: Governance tidak menghambat velocity
