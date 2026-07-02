#!/usr/bin/env node
/**
 * Suggest the next Prodige command from repository state.
 * No external dependencies; safe to call from MCP or directly.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../..');
const AI_DIR = path.join(ROOT_DIR, '.ai');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readText(filePath, fallback = '') {
  try {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : fallback;
  } catch {
    return fallback;
  }
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT_DIR, stdio: 'pipe' }).toString().replace(/\s+$/, '');
  } catch {
    return '';
  }
}

function commandExists(command) {
  const registry = readJson(path.join(AI_DIR, 'commands/registry.json'), { commands: {} });
  return Boolean(registry.commands && registry.commands[command]);
}

function recommendation(command, reason, confidence, next = []) {
  return { command, reason, confidence, next };
}

function suggestNextAction(options = {}) {
  const userIntent = String(options.intent || '').toLowerCase();
  const status = runGit(['status', '--porcelain=v1']);
  const changedFiles = status
    ? status.split('\n').map(line => {
      const match = line.match(/^.. (.+)$/);
      return match ? match[1] : line.trim();
    }).filter(Boolean)
    : [];
  const hasSourceChanges = changedFiles.some(file => /\.(js|jsx|ts|tsx|py|go|rs|java|cs|php|rb|swift|kt|sql)$/i.test(file));
  const hasTestChanges = changedFiles.some(file => /(^|[\\/])(test|tests|spec|__tests__)([\\/]|$)|\.(test|spec)\./i.test(file));
  const activeContext = readText(path.join(AI_DIR, 'memory/activeContext.md'));
  const contextUninitialized = /\[[^\]]+\]/.test(readText(path.join(AI_DIR, 'context/manifest.json'))) ||
    /\[Project Name\]|\[Active\/Planning\/Archived\]/.test(readText(path.join(AI_DIR, 'memory/projectContext.md')));

  let rec;
  if (userIntent.includes('start') || userIntent.includes('resume')) {
    rec = recommendation('/session-start', 'Load memory, context, boundaries, and command routing before work begins.', 0.95, ['/status']);
  } else if (userIntent.includes('bug') || userIntent.includes('fix') || userIntent.includes('broken')) {
    rec = recommendation('/fix', 'The request describes a defect; systematic debugging should precede edits.', 0.9, ['/verify', '/review']);
  } else if (userIntent.includes('audit') || userIntent.includes('security') || userIntent.includes('debt')) {
    rec = recommendation('/audit', 'The request is risk/debt/security oriented.', 0.9, ['/review', '/docs']);
  } else if (userIntent.includes('release') || userIntent.includes('ship')) {
    rec = recommendation('/ship-check', 'Use the release-readiness workflow; Prodige prepares handoff but does not execute production deploys.', 0.88, ['/verify', '/release']);
  } else if (contextUninitialized || userIntent.includes('new project') || userIntent.includes('initialize')) {
    rec = recommendation('/init', 'Project brain/context still looks uninitialized or the request is a new-project setup.', 0.88, ['/design', '/sync']);
  } else if (hasSourceChanges && !hasTestChanges) {
    rec = recommendation('/test', 'Source files changed without matching test changes; run the TDD gate before claiming completion.', 0.84, ['/verify']);
  } else if (changedFiles.length > 0) {
    rec = recommendation('/verify', 'There are repository changes; verify tests, lint, types, and build before completion.', 0.82, ['/review', '/session-end']);
  } else if (!activeContext || activeContext.includes('[Current active task')) {
    rec = recommendation('/session-start', 'No active task context is present; orient before planning or editing.', 0.78, ['/magic <task>']);
  } else {
    rec = recommendation('/magic <task>', 'Use the main router for normal feature/design/fix/doc work.', 0.74, ['/verify', '/session-end']);
  }

  return {
    recommendation: rec,
    changedFiles,
    dirty: changedFiles.length > 0,
    available: commandExists(rec.command.split(' ')[0])
  };
}

if (require.main === module) {
  const intent = process.argv.slice(2).join(' ');
  console.log(JSON.stringify(suggestNextAction({ intent }), null, 2));
}

module.exports = { suggestNextAction };
