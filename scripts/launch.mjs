import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { healthPath, projectId, projectRoot } from './local-server.mjs';

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const portIndex = args.indexOf('--port');
const port = portIndex < 0 ? 5173 : Number(args[portIndex + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error('Choose a port between 1024 and 65535.');
  process.exit(1);
}
const origin = `http://127.0.0.1:${port}`;

function openPages() {
  console.log(`\nPortal: ${origin}/\nPublic display: ${origin}/display.html`);
  console.log('Use both pages in the same browser profile. The portal supplies published TV content.');
  if (noOpen) return;
  if (process.platform !== 'win32') {
    console.log('Open the addresses above in your browser.');
    return;
  }
  const edge = [process.env['PROGRAMFILES(X86)'], process.env.PROGRAMFILES, process.env.LOCALAPPDATA]
    .filter(Boolean).map(base => join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'))
    .find(existsSync);
  if (!edge) {
    console.log('Microsoft Edge was not found automatically. Open the addresses above manually.');
    return;
  }
  // Fixed local URLs, passed as arguments rather than a shell command.
  const child = spawn(edge, [`${origin}/`, `${origin}/display.html`], { detached: true, stdio: 'ignore', windowsHide: true });
  child.on('error', error => console.error(`Open the addresses manually: ${error.message}`));
  child.unref();
}

async function run() {
  let response;
  try { response = await fetch(`${origin}${healthPath}`, { signal: AbortSignal.timeout(1500) }); }
  catch (error) {
    if (error.cause?.code !== 'ECONNREFUSED') {
      throw new Error(`Could not safely check port ${port}. Close its existing server or retry. ${error.message}`);
    }
  }
  if (response) {
    let identity;
    try { identity = await response.json(); } catch { /* A different app may return HTML. */ }
    if (identity?.app !== 'little-tree' || identity.projectId !== projectId) {
      throw new Error(`Port ${port} is used by a different application. No process was stopped. Close that application and try again.`);
    }
    console.log(`Little Tree is already running (${identity.mode}). Reusing its address and saved browser data.`);
    openPages();
    return;
  }
  let vite;
  try { vite = await import('vite'); }
  catch { throw new Error('Dependencies are missing. Open a terminal in this folder, run npm ci once, then launch again.'); }
  console.log('Preparing Little Tree from the current source. No browser records are changed.');
  await vite.build({ root: projectRoot });
  const server = await vite.preview({ root: projectRoot, preview: { host: '127.0.0.1', port, strictPort: true } });
  console.log('\nLittle Tree is ready. Keep this window open. Press Ctrl+C to stop the local server.');
  openPages();
  const stop = () => server.httpServer.close(() => process.exit(0));
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

run().catch(error => { console.error(`\nLittle Tree could not start: ${error.message}`); process.exitCode = 1; });
