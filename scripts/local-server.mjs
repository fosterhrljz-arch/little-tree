import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const projectId = createHash('sha256').update(projectRoot.toLowerCase()).digest('hex').slice(0, 16);
export const healthPath = '/__little_tree_health';

// Identifies an existing Little Tree server without exposing school records.
export function localServerIdentity() {
  const install = (server, mode) => { server.middlewares.use((req, res, next) => {
    if (req.url !== healthPath) return next();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({ app: 'little-tree', projectId, mode }));
  }); };
  return {
    name: 'little-tree-local-identity',
    configureServer: server => install(server, 'development'),
    configurePreviewServer: server => install(server, 'production'),
  };
}
