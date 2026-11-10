// Start `astro preview` on a free port and return { base, stop }. Run `npm run build` first.
import { spawn } from 'node:child_process';
export async function serve(port = 4329) {
  const proc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'preview', '--port', String(port)], { shell: process.platform === 'win32', stdio: 'pipe' });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base + '/')).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return { base, stop: () => (process.platform === 'win32' ? spawn('taskkill', ['/pid', String(proc.pid), '/T', '/F']) : proc.kill()) };
}
