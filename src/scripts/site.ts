// Small site-wide behaviours: theme toggle, email reveal, copy-to-clipboard, back to top.

const root = document.documentElement;

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  sync();
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: theme lasts for this page only */
    }
    sync();
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });
});

document.querySelectorAll<HTMLElement>('.email[data-u][data-d]').forEach((el) => {
  const addr = `${el.dataset.u}@${el.dataset.d}`;
  const a = document.createElement('a');
  a.href = `mailto:${addr}`;
  a.textContent = el.dataset.label || addr;
  el.replaceChildren(a);
});

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const original = btn.textContent;
  btn.addEventListener('click', async () => {
    const src = document.getElementById(btn.dataset.copy!);
    if (!src) return;
    try {
      await navigator.clipboard.writeText(src.textContent ?? '');
      btn.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(src);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      btn.textContent = 'Selected: press Ctrl+C';
    }
    setTimeout(() => (btn.textContent = original), 1800);
  });
});

const toTop = document.querySelector<HTMLButtonElement>('[data-to-top]');
if (toTop) {
  toTop.hidden = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    toTop.style.setProperty('--p', max > 0 ? String(Math.min(1, scrollY / max)) : '0');
    toTop.toggleAttribute('data-show', scrollY > innerHeight * 1.2);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
  toTop.addEventListener('click', () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
  });
}
