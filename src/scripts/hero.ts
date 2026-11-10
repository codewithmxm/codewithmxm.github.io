// Home hero: the real ShellForm design cell drawn as a slowly turning wireframe on a 2D canvas.
// No three.js. Pauses off screen and in hidden tabs; one still frame under reduced motion.
import { nodes, n, dz_mm, dz_limit_mm, rise_ratio, span_m } from '../assets/models/shellform-cell.json';

const canvas = document.querySelector<HTMLCanvasElement>('[data-shell]');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  const N = n;
  const count = N * N;
  // centre and normalise: plan spans [-1, 1], height scaled by the true rise/span
  let zmax = 0;
  for (let k = 0; k < count; k++) zmax = Math.max(zmax, nodes[k * 3 + 2]);
  const half = span_m / 2;
  const P = new Float32Array(count * 3);
  for (let k = 0; k < count; k++) {
    P[k * 3] = nodes[k * 3] / half;
    P[k * 3 + 1] = nodes[k * 3 + 1] / half;
    P[k * 3 + 2] = (nodes[k * 3 + 2] / (zmax || 1)) * rise_ratio * 2 * 1.35; // slight vertical exaggeration
  }
  const zc = rise_ratio * 1.35;
  const S = new Float32Array(count * 3); // projected x, y, depth

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let w = 0, h = 0, dpr = 1;
  let c1 = '#22d3ee', c2 = '#a78bfa', ink = '#e8eef8';
  const readColours = () => {
    const cs = getComputedStyle(document.documentElement);
    c1 = cs.getPropertyValue('--accent').trim() || c1;
    c2 = cs.getPropertyValue('--accent-2').trim() || c2;
    ink = cs.getPropertyValue('--ink-3').trim() || ink;
  };
  readColours();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };

  let yaw = 0.6, tilt = 0.52, px = 0, py = 0, tx = 0, ty = 0;

  // one projection for the shell and its ground plan: yaw about z, tilt about x, mild perspective
  let ca = 1, sa = 0, ce = 1, se = 0, scale = 1;
  const view = () => {
    const a = yaw + px * 0.35, e = tilt + py * 0.12;
    ca = Math.cos(a); sa = Math.sin(a); ce = Math.cos(e); se = Math.sin(e);
    scale = Math.min(w, h) * 0.3;
  };
  const to2d = (x: number, y: number, z: number, out: Float32Array, o: number) => {
    const xr = x * ca - y * sa, yr = x * sa + y * ca;
    const up = z * ce + yr * se, depth = yr * ce - z * se;
    const f = 4.2 / (4.2 + depth);
    out[o] = w / 2 + xr * scale * f;
    out[o + 1] = h * 0.5 - up * scale * f;
    out[o + 2] = depth;
  };
  const project = () => {
    view();
    for (let k = 0; k < count; k++) to2d(P[k * 3], P[k * 3 + 1], P[k * 3 + 2] - zc, S, k * 3);
  };
  const G = new Float32Array(3);

  // Lines are grouped into a few depth bands, one path per band, so a frame is a handful of strokes.
  const BANDS = 6;
  const bandOf = (i: number, j: number) => {
    const t = Math.min(1, Math.max(0, 0.5 - (S[i * 3 + 2] + S[j * 3 + 2]) * 0.25)); // 1 = near
    return Math.min(BANDS - 1, Math.floor(t * BANDS));
  };
  const paths: Path2D[] = [];

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    project();
    const g = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);

    // ground plan: the square footprint, dashed, like a drawing's outline
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    const corners = [0, N - 1, count - 1, count - N];
    ctx.beginPath();
    corners.forEach((k, idx) => {
      to2d(P[k * 3], P[k * 3 + 1], -zc, G, 0);
      if (idx === 0) ctx.moveTo(G[0], G[1]); else ctx.lineTo(G[0], G[1]);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    for (let b = 0; b < BANDS; b++) paths[b] = new Path2D();
    const line = (i: number, j: number) => {
      const p = paths[bandOf(i, j)];
      p.moveTo(S[i * 3], S[i * 3 + 1]);
      p.lineTo(S[j * 3], S[j * 3 + 1]);
    };
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N - 1; j++) {
        line(i * N + j, i * N + j + 1);
        line(j * N + i, (j + 1) * N + i);
      }
    }
    for (let b = 0; b < BANDS; b++) {
      ctx.globalAlpha = 0.18 + (0.72 * (b + 0.5)) / BANDS;
      ctx.stroke(paths[b]);
    }
    // nodes that rise most in the seismic-aware form glow brightest (three brightness bands)
    ctx.fillStyle = c1;
    for (let b = 0; b < 3; b++) {
      const lo = 0.35 + (b * 0.65) / 3, hi = lo + 0.65 / 3;
      const dots = new Path2D();
      for (let k = 0; k < count; k++) {
        const v = dz_mm[k] / (dz_limit_mm || 1);
        if (v < lo || (v >= hi && b < 2)) continue;
        const r = 0.8 + 1.4 * v;
        dots.moveTo(S[k * 3] + r, S[k * 3 + 1]);
        dots.arc(S[k * 3], S[k * 3 + 1], r, 0, Math.PI * 2);
      }
      ctx.globalAlpha = 0.25 + 0.6 * (lo + hi) / 2;
      ctx.fill(dots);
    }
    // corner supports
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = ink;
    for (const k of corners) {
      const sx = S[k * 3], sy = S[k * 3 + 1];
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 5, sy + 8);
      ctx.lineTo(sx + 5, sy + 8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  let raf = 0, last = 0, visible = true;
  let ready = false;
  const loop = (t: number) => {
    raf = 0;
    if (last && t - last < 30) { start(); return; } // about 30 frames a second is plenty for a slow turn
    const dt = last ? Math.min(64, t - last) : 16;
    last = t;
    yaw += dt * 0.00012;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    draw();
    start();
  };
  const start = () => {
    if (ready && !raf && visible && !document.hidden && !reduce.matches) raf = requestAnimationFrame(loop);
  };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; };

  // The observer fires once on observe(), which sizes the canvas and draws the still frame
  // after first paint rather than during script evaluation.
  new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduce.addEventListener('change', () => { if (reduce.matches) { stop(); draw(); } else start(); });
  window.addEventListener('themechange', () => { readColours(); draw(); });
  window.addEventListener('pointermove', (ev) => {
    tx = (ev.clientX / innerWidth - 0.5) * 2;
    ty = (ev.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  // keep the main thread free while the page loads; the still frame above is already drawn
  const go = () => setTimeout(() => { ready = true; start(); }, 1200);
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
}
