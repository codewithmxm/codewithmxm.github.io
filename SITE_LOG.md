# Site log

## 2026-11-10: first release

Built from the plan in `16_Personal_Website_Plan_and_Master_Prompt.md`.

### Decisions

- Astro 7 static site, GitHub Pages through Actions, Pages CMS for editing. No third-party CDN at run time (fonts self-hosted), so the site loads in mainland China.
- This repository is the user site, served at the root `https://syednafizreja.github.io/`. The canopy prototype stays a project site at `/parametric-canopy-carbon-optimization/`, served from its own repository. GitHub serves project sites under the user domain, so both work; this repository must never contain a top-level folder or route with that name.
- three.js loads only on pages with the shell viewer. Other pages ship well under 50 KB of JavaScript.
- The viewer shows one real ShellForm design cell (`tools/extract_shellform_cell.py`). In that cell no node drops (height change 0 to 349 mm), and the caption says so. A still render is the fallback without WebGL.
- The former employer is not named; the CV page says "precision manufacturing" and omits process details.
- References on the CV page read "Available on request". No phone numbers or street addresses anywhere.
- Email is assembled in the browser from two parts, with a plain "name [at] domain" fallback.
- Filters on `/work/` use `aria-current` (not `aria-pressed`, which is invalid on links).
- Back-to-top button with a scroll-progress ring appears after one and a fifth screens of scrolling; it respects reduced motion and is hidden in print.
- The CV PDF is printed from `/cv/` (A4, 14 mm margins) with links rewritten to the live domain.

### Checks at release

- `astro check`: 0 errors, 0 warnings, 0 hints.
- Internal links (linkinator): all OK.
- Playwright and axe (WCAG 2.1 A and AA) on 10 pages in light and dark themes, plus behaviour tests: all pass.

### Checked by Claude, author to confirm

- All CV facts on `/about/` and `/cv/` were copied from `CV_Syed_Nafiz_Reja_Hasib.pdf` (Nov 2026).
- Publication [5] (PaveCarbon paper) is shown as "in preparation, submission planned November 2026", as in the CV. Update when submitted.
- ShellBench test count: the CV says 114, the repository reported 238 passed on 10 Nov 2026. The CV page gives no count; the project page uses the repository figure.

### TODO(syed)

- Install the Pages CMS GitHub app on this repository (https://app.pagescms.org) to use the dashboard.
- Add a headshot if wanted (none was taken from local folders on purpose). Place it in `src/assets/media/` and add it to the About page.
- Two projects from the plan are not on the site yet: stress-trajectory ribs and diaphragm flexibility. Add them when there is material to show.
- Add `https://syednafizreja.github.io` to the CV PDF source, LinkedIn, ORCID and the GitHub profile.
