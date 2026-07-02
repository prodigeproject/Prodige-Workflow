#!/usr/bin/env node
/**
 * Prodige MCP Server.
 *
 * Minimal JSON-RPC stdio server with context, lock coordination, command routing,
 * quality-gate discovery, next-action recommendations, and outcome recording.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { suggestNextAction } = require('./suggest-next-action');

const ROOT_DIR = path.resolve(__dirname, '../..');
const AI_DIR = path.resolve(ROOT_DIR, '.ai');
const STATE_FILE = path.resolve(AI_DIR, 'runtime/state.json');
const LOCKS_DIR = path.resolve(AI_DIR, 'runtime/locks');
const MEM_DIR = path.resolve(AI_DIR, 'memory');
const OUTCOMES_FILE = path.resolve(AI_DIR, 'runtime/outcomes.jsonl');
const DEFAULT_LOCK_TTL_MS = 2 * 60 * 60 * 1000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function logError(msg) {
  ensureDir(path.resolve(AI_DIR, 'runtime'));
  fs.appendFileSync(path.join(AI_DIR, 'runtime/mcp-error.log'), `[${new Date().toISOString()}] ${msg}\n`);
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    logError(`Failed to read JSON ${filePath}: ${e.message}`);
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

function lockPathFor(resource) {
  const safeName = Buffer.from(String(resource)).toString('base64url') + '.lock';
  return path.join(LOCKS_DIR, safeName);
}

function parseLock(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function isStale(lock, now = Date.now()) {
  const created = Date.parse(lock.updated_at || lock.timestamp || 0);
  const ttlMs = Number(lock.ttl_ms || DEFAULT_LOCK_TTL_MS);
  return !created || now - created > ttlMs;
}

function getActiveContext() {
  const state = readJson(STATE_FILE);
  if (state) return state;

  const activeContextPath = path.join(MEM_DIR, 'activeContext.md');
  const content = readText(activeContextPath);
  const match = content.match(/#\s+Active\s+Context[^\n]*\n+([\s\S]*?)(?=\n#|$)/i);
  return {
    focus: match && match[1] ? match[1].trim().split('\n')[0] : 'No active task.',
    allowed_files: [],
    tasks: []
  };
}

function acquireLock(resource, agentId, ttlMs) {
  ensureDir(LOCKS_DIR);
  const lockPath = lockPathFor(resource);
  const existing = fs.existsSync(lockPath) ? parseLock(lockPath) : null;
  if (existing && !isStale(existing)) {
    return { success: false, message: `Resource '${resource}' is locked.`, lock: existing };
  }

  const lock = {
    resource,
    agent_id: agentId || 'unknown-mcp-agent',
    pid: process.pid,
    timestamp: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ttl_ms: Number(ttlMs || DEFAULT_LOCK_TTL_MS)
  };
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2));
  return { success: true, message: `Lock acquired for '${resource}'.`, lock };
}

function renewLock(resource, agentId, ttlMs) {
  const lockPath = lockPathFor(resource);
  const lock = fs.existsSync(lockPath) ? parseLock(lockPath) : null;
  if (!lock) return { success: false, message: `No lock exists for '${resource}'.` };
  if (lock.agent_id !== (agentId || lock.agent_id)) return { success: false, message: 'Lock owner mismatch.', lock };
  lock.updated_at = new Date().toISOString();
  if (ttlMs) lock.ttl_ms = Number(ttlMs);
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2));
  return { success: true, lock };
}

function releaseLock(resource, agentId) {
  const lockPath = lockPathFor(resource);
  const lock = fs.existsSync(lockPath) ? parseLock(lockPath) : null;
  if (!lock) return { success: true, message: `No lock exists for '${resource}'.` };
  if (agentId && lock.agent_id !== agentId) return { success: false, message: 'Lock owner mismatch.', lock };
  fs.unlinkSync(lockPath);
  return { success: true, message: `Lock released for '${resource}'.` };
}

function listLocks(includeStale = true) {
  ensureDir(LOCKS_DIR);
  return fs.readdirSync(LOCKS_DIR)
    .filter(file => file.endsWith('.lock'))
    .map(file => parseLock(path.join(LOCKS_DIR, file)))
    .filter(Boolean)
    .map(lock => ({ ...lock, stale: isStale(lock) }))
    .filter(lock => includeStale || !lock.stale);
}

function getCommandRegistry() {
  return readJson(path.join(AI_DIR, 'commands/registry.json'), { commands: {}, categories: {} });
}

function getQualityGates() {
  return {
    rules: readText(path.join(AI_DIR, 'governance/rules.md')),
    qualityGates: readText(path.join(AI_DIR, 'governance/quality-gates.md')),
    reviewGates: readText(path.join(AI_DIR, 'governance/review-gates.md')),
    boundaries: {
      noProductionDeploys: readText(path.join(AI_DIR, 'boundaries/no-production-deploys.md')),
      humanApprovalGates: readText(path.join(AI_DIR, 'boundaries/human-approval-gates.md'))
    }
  };
}

function recordOutcome(outcome) {
  ensureDir(path.dirname(OUTCOMES_FILE));
  const entry = {
    timestamp: new Date().toISOString(),
    command: outcome.command || null,
    status: outcome.status || 'unknown',
    summary: outcome.summary || '',
    evidence: outcome.evidence || []
  };
  fs.appendFileSync(OUTCOMES_FILE, JSON.stringify(entry) + '\n');
  return { success: true, entry };
}

const tools = [
  { name: 'get_active_context', description: 'Get active Prodige state/context.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'acquire_lock',
    description: 'Acquire a resource lock for parallel agent coordination.',
    inputSchema: { type: 'object', properties: { resource: { type: 'string' }, agentId: { type: 'string' }, ttlMs: { type: 'number' } }, required: ['resource'] }
  },
  {
    name: 'renew_lock',
    description: 'Renew a lock owned by an agent.',
    inputSchema: { type: 'object', properties: { resource: { type: 'string' }, agentId: { type: 'string' }, ttlMs: { type: 'number' } }, required: ['resource'] }
  },
  {
    name: 'release_lock',
    description: 'Release a resource lock.',
    inputSchema: { type: 'object', properties: { resource: { type: 'string' }, agentId: { type: 'string' } }, required: ['resource'] }
  },
  { name: 'list_locks', description: 'List active/stale locks.', inputSchema: { type: 'object', properties: { includeStale: { type: 'boolean' } } } },
  { name: 'get_command_registry', description: 'Return Prodige command registry.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_quality_gates', description: 'Return governance, review gates, and boundaries.', inputSchema: { type: 'object', properties: {} } },
  { name: 'suggest_next_action', description: 'Recommend the next Prodige command from state and intent.', inputSchema: { type: 'object', properties: { intent: { type: 'string' } } } },
  {
    name: 'record_outcome',
    description: 'Record a command/workflow outcome for the improvement loop.',
    inputSchema: { type: 'object', properties: { command: { type: 'string' }, status: { type: 'string' }, summary: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } } } }
  }
];

function toolResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}

function callTool(name, args = {}) {
  switch (name) {
    case 'get_active_context': return getActiveContext();
    case 'acquire_lock': return acquireLock(args.resource, args.agentId, args.ttlMs);
    case 'renew_lock': return renewLock(args.resource, args.agentId, args.ttlMs);
    case 'release_lock': return releaseLock(args.resource, args.agentId);
    case 'list_locks': return listLocks(args.includeStale !== false);
    case 'get_command_registry': return getCommandRegistry();
    case 'get_quality_gates': return getQualityGates();
    case 'suggest_next_action': return suggestNextAction({ intent: args.intent || '' });
    case 'record_outcome': return recordOutcome(args);
    default: throw new Error(`Unknown tool '${name}'.`);
  }
}

rl.on('line', line => {
  try {
    if (!line.trim()) return;
    const request = JSON.parse(line);

    if (request.method === 'initialize') {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'prodige-mcp-server', version: '1.1.0' }
        }
      }));
      return;
    }

    if (request.method === 'tools/list') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { tools } }));
      return;
    }

    if (request.method === 'tools/call') {
      const { name, arguments: args } = request.params || {};
      console.log(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: toolResult(callTool(name, args || {})) }));
      return;
    }

    if (request.id) {
      console.log(JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: `Method '${request.method}' not found.` } }));
    }
  } catch (err) {
    logError(`RPC error: ${err.message} | Line: ${line}`);
    try {
      const request = JSON.parse(line);
      if (request.id) console.log(JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32603, message: err.message } }));
    } catch {
      // Ignore malformed requests without id.
    }
  }
});
