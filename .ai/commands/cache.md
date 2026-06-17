# /cache

Mengelola token-saving cache untuk optimasi penggunaan context window dan mengurangi biaya API.

## Syntax

```
/cache <action> [target]
```

## Actions

### `update`
Memperbarui cache dengan context terbaru dari repository.

```bash
/cache update
```

**Kapan digunakan:**
- Setelah perubahan signifikan pada kode
- Sebelum memulai task besar
- Ketika cache sudah outdated

### `status`
Menampilkan status cache saat ini.

```bash
/cache status
```

**Output:**
- Cache size
- Last updated timestamp
- Cached items count
- Hit rate statistics
- Memory usage

### `invalidate`
Menghapus item spesifik atau seluruh cache.

```bash
/cache invalidate <target>
/cache invalidate all
```

**Parameters:**
- `<target>` - Nama modul/namespace yang akan di-invalidate (contoh: `auth`, `api`, `frontend`)
- `all` - Invalidate seluruh cache

### `clear`
Menghapus seluruh cache (alias untuk `invalidate all`).

```bash
/cache clear
```

## Examples

### Basic Usage
```bash
# Update cache setelah pull dari repository
/cache update

# Cek status cache
/cache status

# Invalidate cache untuk modul auth
/cache invalidate auth

# Hapus seluruh cache
/cache clear
```

### Workflow Integration
```bash
# Sebelum mulai development session
/cache status
/cache update

# Setelah merge branch besar
/cache clear
/cache update

# Debugging cache issue
/cache status
/cache invalidate problematic-module
/cache update
```

## Error Handling

### Cache Update Failed
**Error:** `Failed to update cache: [reason]`

**Solutions:**
- Pastikan repository dalam state yang bersih
- Check file permissions
- Verify disk space availability
- Run `/cache clear` dan retry

### Cache Not Found
**Error:** `Cache not initialized`

**Solution:**
```bash
/cache update
```

### Invalid Target
**Error:** `Target 'xyz' not found in cache`

**Solution:**
- Run `/cache status` untuk melihat available targets
- Check spelling of target name

## Best Practices

### 1. Regular Updates
```bash
# Update cache di awal setiap development session
/cache update
```

### 2. Strategic Invalidation
```bash
# Invalidate hanya modul yang berubah, bukan seluruh cache
/cache invalidate modified-module
```

### 3. Monitor Cache Performance
```bash
# Periksa hit rate secara berkala
/cache status

# Jika hit rate < 60%, consider restructuring
```

### 4. Cleanup Routine
```bash
# Weekly cleanup untuk menghindari stale cache
/cache clear
/cache update
```

### 5. Pre-Deployment Check
```bash
# Pastikan cache sync sebelum deployment
/sync
/cache update
```

## Performance Tips

1. **Cache Warming:** Run `/cache update` setelah initialization
2. **Selective Invalidation:** Gunakan target spesifik daripada `clear all`
3. **Regular Maintenance:** Schedule weekly cache cleanup
4. **Monitor Size:** Keep cache size < 10MB untuk optimal performance
5. **Batch Updates:** Update cache setelah multiple changes, bukan per-change

## Integration dengan Commands Lain

```bash
# Workflow dengan /sync
/sync                  # Detect drift
/cache clear          # Clear outdated cache
/cache update         # Rebuild with latest state

# Workflow dengan /parallel
/parallel build checkout
/cache update         # Update cache setelah parallel work selesai

# Workflow dengan /init
/init from repo
/cache update         # Initialize cache untuk new project
```

## Cache Structure

Cache menyimpan:
- **Code Context:** Frequently accessed file contents
- **Dependency Graph:** Import/export relationships
- **Type Information:** Type definitions dan interfaces
- **Documentation:** README dan inline comments
- **State Snapshots:** Recent state dari `.ai/state/`

## Troubleshooting

### Cache Causing Stale Responses
```bash
/cache status          # Check last update time
/cache clear
/cache update
```

### High Memory Usage
```bash
/cache status          # Check cache size
/cache clear          # If > 15MB
/cache update
```

### Inconsistent Behavior
```bash
/sync                  # Verify system state
/cache clear
/cache update
```

## Related Commands

- `/sync` - Detect context drift (use before cache update)
- `/init` - Initialize project (automatically updates cache)
- `/parallel` - Parallel execution (may require cache sync after merge)
