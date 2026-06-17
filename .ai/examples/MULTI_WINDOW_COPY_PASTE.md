# Multi-Window Copy Paste Example

Contoh praktis untuk menjalankan parallel development menggunakan multiple windows/tabs.

## Scenario: Build Fitur "Checkout"

### Step 1: Initialize Parallel Build (Main Window)

```text
/parallel build checkout
```

**Output yang diharapkan:**
- Snapshot state dibuat
- Sessions untuk setiap agent dibuat
- File locks diassign
- Handoff instructions digenerate

---

### Step 2: Start Agent Sessions (Worker Windows)

Buka 4 window/tab terpisah dan jalankan command berikut:

**Window 1 - Backend Agent:**
```text
/agent backend resume checkout-backend
```
*Task: Implement checkout API endpoints dan business logic*

**Window 2 - Frontend Agent:**
```text
/agent frontend resume checkout-frontend
```
*Task: Build checkout UI components dan state management*

**Window 3 - QA Agent:**
```text
/agent qa resume checkout-qa
```
*Task: Write tests dan verify integration*

**Window 4 - Docs Agent:**
```text
/agent docs resume checkout-docs
```
*Task: Generate API docs dan user guides*

---

### Step 3: Review Integration (Reviewer Window)

Setelah semua agent selesai, buka window reviewer:

```text
/agent reviewer resume checkout-review
```

**Reviewer tasks:**
- Verify semua agent outputs compatible
- Check for integration issues
- Approve atau request changes

---

### Step 4: Merge Results (Main Window)

Setelah review approve, kembali ke main window:

```text
/parallel merge checkout
```

**Final verification:**
- Run integration tests
- Verify no conflicts
- Confirm all changes integrated successfully

---

## Tips

- **Jangan tutup windows** sampai merge complete
- **Monitor progress** di setiap window
- **Gunakan reviewer** sebagai final checkpoint sebelum merge
- **Save handoff notes** jika perlu pause dan resume later
