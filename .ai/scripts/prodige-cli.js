#!/usr/bin/env node
/**
 * Prodige Workflow CLI Helper.
 *
 * Safety model:
 * - checkpoint creates a git tag at HEAD and snapshots Prodige memory/state.
 * - it never stages or commits user files automatically.
 * - rollback previews first and requires --yes before any reset.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../..');
const AI_DIR = path.resolve(ROOT_DIR, '.ai');
const MEM_DIR = path.resolve(AI_DIR, 'memory');
const STATE_DIR = path.resolve(AI_DIR, 'state');
const STATE_FILE = path.resolve(AI_DIR, 'runtime/state.json');
const LOCKS_DIR = path.resolve(AI_DIR, 'runtime/locks');
const CP_CACHE_DIR = path.resolve(AI_DIR, 'runtime/cache/checkpoints');
const RB_BACKUP_DIR = path.resolve(AI_DIR, 'runtime/cache/rollback-backups');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bgBlue: '\x1b[44m',
  bgBlack: '\x1b[40m'
};

for (const dir of [CP_CACHE_DIR, RB_BACKUP_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function logError(msg) {
  const logDir = path.resolve(AI_DIR, 'runtime');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(path.join(logDir, 'mcp-error.log'), `[${new Date().toISOString()}] CLI-ERROR: ${msg}\n`);
}

function logAudit(action, details) {
  const auditLogPath = path.resolve(AI_DIR, 'runtime/audit.log');
  const logDir = path.dirname(auditLogPath);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(auditLogPath, `[${new Date().toISOString()}] ACTION: ${action} | DETAILS: ${JSON.stringify(details)}\n`);
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT_DIR, stdio: 'pipe' }).toString().trim();
  } catch {
    return null;
  }
}

function checkpointSlug(name) {
  const slug = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('Checkpoint name must contain letters or numbers.');
  return slug;
}

function getGitStatus() {
  return runGit(['status', '--porcelain=v1']) || '';
}

function writeIfNotEmpty(filePath, content) {
  if (content && content.trim()) fs.writeFileSync(filePath, content + '\n');
}

function readStateSafely() {
  const bakPath = STATE_FILE + '.bak';
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      logError(`state.json is corrupted. Attempting backup recovery. Error: ${e.message}`);
      if (fs.existsSync(bakPath)) {
        try {
          const bakData = JSON.parse(fs.readFileSync(bakPath, 'utf8'));
          fs.copyFileSync(bakPath, STATE_FILE);
          logAudit('STATE_RESTORE_FROM_BACKUP', { success: true });
          return bakData;
        } catch (bakError) {
          logError(`Backup file is also corrupted: ${bakError.message}`);
        }
      }
    }
  }
  return null;
}

function copyFlatFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach(fileName => {
    const src = path.join(srcDir, fileName);
    if (fs.statSync(src).isFile()) fs.copyFileSync(src, path.join(destDir, fileName));
  });
}

function listCheckpoints() {
  if (!fs.existsSync(CP_CACHE_DIR)) return [];
  return fs.readdirSync(CP_CACHE_DIR)
    .map(name => {
      const metaPath = path.join(CP_CACHE_DIR, name, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;
      try {
        return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

function handleDashboard() {
  console.clear();
  console.log(`${colors.bgBlue}${colors.bright}  === PRODIGE WORKFLOW COCKPIT ===  ${colors.reset}\n`);

  let activeFocus = 'No active task.';
  const stateData = readStateSafely();
  if (stateData && stateData.session && stateData.session.active_focus) {
    activeFocus = stateData.session.active_focus;
  } else {
    const activeContextPath = path.join(MEM_DIR, 'activeContext.md');
    if (fs.existsSync(activeContextPath)) {
      const content = fs.readFileSync(activeContextPath, 'utf8');
      const match = content.match(/#\s+Active\s+Context[^\n]*\n+([\s\S]*?)(?=\n#|$)/i);
      if (match && match[1]) activeFocus = match[1].trim().split('\n')[0];
    }
  }
  console.log(`${colors.bright}${colors.cyan}[FOCUS]${colors.reset} ${activeFocus}`);

  const taskPath = fs.existsSync(path.join(ROOT_DIR, 'task.md'))
    ? path.join(ROOT_DIR, 'task.md')
    : path.join(AI_DIR, 'task.md');
  const taskLines = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8').split('\n') : [];
  const listItems = [];
  let totalTasks = 0;
  let completedTasks = 0;

  taskLines.forEach(line => {
    if (line.match(/^\s*-\s*\[([\s xX/])\]/)) {
      totalTasks++;
      const isDone = line.includes('[x]') || line.includes('[X]');
      const isProgress = line.includes('[/]');
      if (isDone) completedTasks++;
      const statusStr = isDone ? `${colors.green}[x]${colors.reset}` : isProgress ? `${colors.yellow}[/]${colors.reset}` : '[ ]';
      listItems.push(`  ${statusStr} ${line.replace(/^\s*-\s*\[.\]\s*/, '').trim()}`);
    }
  });

  console.log(`\n${colors.bright}${colors.cyan}[TASKS]${colors.reset}`);
  if (totalTasks > 0) {
    console.log(`  ${completedTasks}/${totalTasks} completed`);
    console.log(listItems.slice(0, 10).join('\n'));
    if (listItems.length > 10) console.log(`  ...and ${listItems.length - 10} other tasks.`);
  } else {
    console.log(`  ${colors.yellow}No active checklist tasks in task.md.${colors.reset}`);
  }

  console.log(`\n${colors.bright}${colors.cyan}[ACTIVE LOCKS]${colors.reset}`);
  if (fs.existsSync(LOCKS_DIR)) {
    const locks = fs.readdirSync(LOCKS_DIR).filter(f => f.endsWith('.lock'));
    if (locks.length) {
      locks.forEach(fileName => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(LOCKS_DIR, fileName), 'utf8'));
          console.log(`  locked -> ${data.resource} (agent: ${data.agent_id || 'n/a'})`);
        } catch {
          console.log(`  locked -> ${fileName} (invalid format)`);
        }
      });
    } else {
      console.log(`  ${colors.green}All clear - no locked files.${colors.reset}`);
    }
  }

  console.log(`\n${colors.bright}${colors.cyan}[CHECKPOINTS]${colors.reset}`);
  const checkpoints = listCheckpoints();
  if (checkpoints.length) {
    checkpoints.slice(0, 10).forEach(cp => {
      console.log(`  ${cp.name} (${cp.timestamp}) - ${cp.commitSha.slice(0, 7)}${cp.dirty ? ' [dirty metadata]' : ''}`);
    });
  } else {
    console.log(`  No checkpoints. Create one with: node .ai/scripts/prodige-cli.js checkpoint <name>`);
  }

  console.log(`\n${colors.bright}${colors.cyan}[GIT STATUS]${colors.reset}`);
  const gitStatus = runGit(['status', '--short']);
  if (gitStatus) console.log(gitStatus.split('\n').map(line => `  ${line}`).join('\n'));
  else if (gitStatus === '') console.log(`  ${colors.green}Clean - no staged/unstaged changes.${colors.reset}`);
  else console.log(`  ${colors.red}Not a Git repository or Git is not installed in PATH.${colors.reset}`);

  console.log(`\n${colors.bgBlack} Commands: checkpoint <name> | rollback <name> --yes | status ${colors.reset}\n`);
}

function handleCheckpoint(name) {
  const safeName = checkpointSlug(name || `checkpoint-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  const tagName = `checkpoint-${safeName}`;

  console.log(`\nCreating safe checkpoint '${safeName}'...`);
  if (!runGit(['--version'])) {
    console.error(`${colors.red}[ERROR] Git is not found in PATH. Checkpoint requires Git.${colors.reset}`);
    process.exit(1);
  }

  const commitSha = runGit(['rev-parse', 'HEAD']);
  if (!commitSha) {
    console.error(`${colors.red}[ERROR] Failed to retrieve Git commit SHA.${colors.reset}`);
    process.exit(1);
  }

  if (runGit(['rev-parse', '--verify', '--quiet', `refs/tags/${tagName}`])) {
    console.error(`${colors.red}[ERROR] Checkpoint tag '${tagName}' already exists. Choose a different name.${colors.reset}`);
    process.exit(1);
  }

  const cpDir = path.join(CP_CACHE_DIR, safeName);
  const cpMemDir = path.join(cpDir, 'memory');
  const cpStateDir = path.join(cpDir, 'state');
  fs.mkdirSync(cpMemDir, { recursive: true });
  fs.mkdirSync(cpStateDir, { recursive: true });

  const status = getGitStatus();
  writeIfNotEmpty(path.join(cpDir, 'working-tree.patch'), runGit(['diff', '--binary']));
  writeIfNotEmpty(path.join(cpDir, 'staged.patch'), runGit(['diff', '--cached', '--binary']));
  writeIfNotEmpty(path.join(cpDir, 'untracked-files.txt'), runGit(['ls-files', '--others', '--exclude-standard']));

  if (runGit(['tag', '-a', tagName, commitSha, '-m', `Prodige checkpoint: ${safeName}`]) === null) {
    console.error(`${colors.red}[ERROR] Failed to create git tag '${tagName}'.${colors.reset}`);
    process.exit(1);
  }

  copyFlatFiles(MEM_DIR, cpMemDir);
  copyFlatFiles(STATE_DIR, cpStateDir);

  const meta = {
    name: safeName,
    tagName,
    timestamp: new Date().toISOString(),
    commitSha,
    dirty: Boolean(status),
    status: status.split('\n').filter(Boolean),
    safetyNote: 'Checkpoint tags HEAD only. Uncommitted diffs are saved as patch metadata; no files are staged or committed automatically.'
  };
  fs.writeFileSync(path.join(cpDir, 'meta.json'), JSON.stringify(meta, null, 2));
  logAudit('CREATE_CHECKPOINT', { name: safeName, tagName, commitSha, dirty: meta.dirty });

  console.log(`${colors.green}[SUCCESS] Checkpoint '${safeName}' created at ${commitSha.slice(0, 7)}.${colors.reset}`);
  if (meta.dirty) {
    console.log(`${colors.yellow}[WARN] Working tree was dirty. Diffs were saved under ${path.relative(ROOT_DIR, cpDir)}; no files were committed.${colors.reset}`);
  }
}

function handleRollback(name, options = {}) {
  if (!name) {
    const checkpoints = listCheckpoints();
    if (!checkpoints.length) {
      console.log('No checkpoints found.');
      return;
    }
    console.log('Available checkpoints:');
    checkpoints.forEach(cp => {
      console.log(`  - ${cp.name} (${cp.timestamp}) -> ${cp.commitSha.slice(0, 7)}${cp.dirty ? ' [dirty snapshot metadata]' : ''}`);
    });
    console.log('\nRollback requires explicit confirmation: node .ai/scripts/prodige-cli.js rollback <name> --yes');
    process.exit(1);
  }

  const safeName = checkpointSlug(name);
  const cpDir = path.join(CP_CACHE_DIR, safeName);
  const metaPath = path.join(cpDir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error(`${colors.red}[ERROR] Checkpoint '${safeName}' not found.${colors.reset}`);
    process.exit(1);
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const currentSha = runGit(['rev-parse', 'HEAD']);
  const status = getGitStatus();
  const preview = runGit(['diff', '--stat', `${meta.commitSha}..HEAD`]) || 'No committed file diff from checkpoint to HEAD.';

  console.log(`\nRollback preview for '${safeName}'`);
  console.log(`  Target: ${meta.commitSha.slice(0, 7)} (${meta.tagName || 'legacy checkpoint'})`);
  console.log(`  Current: ${currentSha ? currentSha.slice(0, 7) : 'unknown'}`);
  console.log(`\nCommitted diff summary:\n${preview}`);
  if (status) console.log(`\n${colors.yellow}[WARN] Uncommitted changes exist. A safety patch will be written before rollback.${colors.reset}`);
  if (!options.yes) {
    console.log(`\n${colors.red}[STOP] Rollback not executed.${colors.reset}`);
    console.log(`Run again with --yes after reviewing the preview: node .ai/scripts/prodige-cli.js rollback ${safeName} --yes`);
    process.exit(2);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPatch = path.join(RB_BACKUP_DIR, `${safeName}-${stamp}.patch`);
  fs.writeFileSync(backupPatch, [
    '# Prodige rollback safety patch',
    `# checkpoint=${safeName}`,
    `# before=${currentSha || 'unknown'}`,
    '',
    runGit(['diff', '--binary']) || '',
    runGit(['diff', '--cached', '--binary']) || ''
  ].join('\n'));

  console.log(`  - Performing confirmed Git reset to ${meta.commitSha.slice(0, 7)}...`);
  if (runGit(['reset', '--hard', meta.commitSha]) === null) {
    console.error(`${colors.red}[ERROR] Git reset failed. Safety patch: ${backupPatch}${colors.reset}`);
    process.exit(1);
  }

  copyFlatFiles(path.join(cpDir, 'memory'), MEM_DIR);
  copyFlatFiles(path.join(cpDir, 'state'), STATE_DIR);
  logAudit('ROLLBACK_SYSTEM', { name: safeName, commitSha: meta.commitSha, backupPatch });
  console.log(`${colors.green}[SUCCESS] System restored to checkpoint '${safeName}'. Safety patch: ${backupPatch}${colors.reset}`);
}

const args = process.argv.slice(2);
const command = args[0] || 'dashboard';
const flags = new Set(args.slice(1).filter(arg => arg.startsWith('--')));

switch (command.toLowerCase()) {
  case 'dashboard':
  case 'status':
    handleDashboard();
    break;
  case 'checkpoint':
    handleCheckpoint(args[1]);
    break;
  case 'rollback':
    handleRollback(args[1], { yes: flags.has('--yes') });
    break;
  default:
    console.log(`
Prodige CLI Helper

Usage:
  node .ai/scripts/prodige-cli.js [command] [options]

Commands:
  dashboard / status      Show cockpit dashboard
  checkpoint [name]       Create safe checkpoint tag + memory snapshot
  rollback [name] --yes   Preview first; restore code and memory after explicit confirmation
`);
}
