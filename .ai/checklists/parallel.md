# Parallel Workflow Checklist

Gunakan checklist ini saat menjalankan parallel build untuk koordinasi multi-agent development.

## Pre-Build Checklist

- [ ] **Snapshot Created**: Ambil snapshot state saat ini untuk rollback safety
  - Command: `/parallel build <feature-name>`
  - Verifikasi snapshot ID tersimpan

- [ ] **Sessions Created**: Pastikan session terpisah untuk setiap agent
  - Backend session: `checkout-backend`
  - Frontend session: `checkout-frontend`
  - QA session: `checkout-qa`
  - Docs session: `checkout-docs`

- [ ] **Locks Created**: File locks aktif untuk mencegah konflik
  - Periksa `state/LOCKS.md` untuk file assignments
  - Pastikan tidak ada overlap antar agent

- [ ] **Handoffs Assigned**: Setiap agent tahu task dan dependencies mereka
  - Review `state/HANDOFFS.md`
  - Konfirmasi setiap agent memiliki context yang cukup

- [ ] **Reviewer Assigned**: Reviewer session siap untuk final integration
  - Session: `checkout-review`
  - Reviewer memiliki akses ke semua agent outputs

## Post-Build Checklist

- [ ] **Agent Tasks Complete**: Semua agent menyelesaikan assigned tasks
- [ ] **Tests Passing**: Unit dan integration tests sukses di setiap session
- [ ] **Conflicts Resolved**: Tidak ada merge conflicts atau dependency issues
- [ ] **Review Complete**: Reviewer approve semua changes
- [ ] **Merge Executed**: Jalankan `/parallel merge <feature-name>` untuk integrasi final
