import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localServerIdentity } from './scripts/local-server.mjs';
export default defineConfig({ base: './', plugins: [react(), localServerIdentity()], build:{rollupOptions:{input:{app:'index.html',display:'display.html'}}} });
