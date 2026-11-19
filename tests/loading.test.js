import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { localServerIdentity, projectId, healthPath } from '../scripts/local-server.mjs';

for (const entry of ['index.html', 'display.html']) {
  const html = readFileSync(new URL(`../${entry}`, import.meta.url), 'utf8');
  const boot = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  const loader = html.match(/<script type="module">\s*([\s\S]*?)<\/script>/)[1];
  function harness(protocol) {
    const heading = { textContent: 'Open Little Tree with the local launcher' };
    const description = { textContent: 'Local server instructions' };
    const help = { hidden: false };
    const message = { isConnected: true, querySelector: selector => selector === 'h1' ? heading : selector.includes('description') ? description : help };
    const state = { heading, description, help, timers: [], icons: [] };
    const context = { location: { protocol }, window: {}, document: { getElementById: () => message, createElement: () => ({}), head: { appendChild: icon => state.icons.push(icon) } }, setTimeout: fn => state.timers.push(fn) };
    runInNewContext(boot, context);
    return { context, state, message };
  }
  test(`${entry}: direct-file startup retains instructions without loading modules`, async () => {
    assert.match(html, /Double-click <strong>Start Little Tree.cmd/);
    assert.ok(!html.includes('<script type="module" src="/src/'));
    const { context, state } = harness('file:');
    let imports = 0;
    context.loadEntry = () => { imports++; return Promise.resolve(); };
    await runInNewContext(loader.replace('import(', 'loadEntry('), context);
    assert.equal(imports, 0);
    assert.equal(state.help.hidden, false);
    assert.match(state.heading.textContent, /local launcher/);
    assert.equal(state.timers.length, 0);
    assert.equal(state.icons.length, 0);
  });
  test(`${entry}: HTTP startup loads the entry and reports failed imports`, async () => {
    const { context, state } = harness('http:');
    context.console = { error() {} };
    let imported;
    context.loadEntry = path => { imported = path; return Promise.reject(new Error('Missing bundle')); };
    await runInNewContext(loader.replace('import(', 'loadEntry('), context);
    assert.match(imported, /^\.\/src\/.*\.jsx$/);
    assert.equal(state.help.hidden, false);
    assert.match(state.heading.textContent, /could not finish loading/);
    assert.match(state.description.textContent, /not been reset/);
  });
  test(`${entry}: slow startup recovers but never replaces a mounted app`, () => {
    const { state, message } = harness('http:');
    assert.equal(state.help.hidden, true);
    message.isConnected = false;
    state.timers[0]();
    assert.equal(state.help.hidden, true);
    message.isConnected = true;
    state.timers[0]();
    assert.equal(state.help.hidden, false);
  });
}

test('server identity registers middleware without returning a Vite post-hook', () => {
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    let middleware, payload, nextCalled = false;
    const server = { middlewares: { use: fn => { middleware = fn; return () => { throw new Error('Must not become a post-hook'); }; } } };
    assert.equal(localServerIdentity()[hook](server), undefined);
    middleware({ url: healthPath }, { setHeader() {}, end: text => { payload = JSON.parse(text); } }, () => {});
    assert.equal(payload.app, 'little-tree');
    assert.equal(payload.projectId, projectId);
    middleware({ url: '/display.html' }, {}, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  }
});
