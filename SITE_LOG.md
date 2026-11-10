# Site log

## 2026-11-10: first release

Built from the plan in `16_Personal_Website_Plan_and_Master_Prompt.md`.

### Decisions

- Astro 7 static site, GitHub Pages through Actions, Pages CMS for editing. No third-party CDN at run time (fonts self-hosted), so the site loads in mainland China.
- This repository is the user site, served at the root `https://syednafizreja.github.io/`. The canopy prototype stays a project site at `/parametric-canopy-carbon-optimization/`, served from its own repository. GitHub serves project sites under the user domain, so both work; this repository must never contain a top-level folder or route with that name.
- three.js loads only when a reader presses "Rotate in 3D" on the viewer; until then the page shows a still render of the same model. Loading it on scroll cost about 0.8 s of blocking time on mobile and captured touch scrolling. Pages ship about 2 KB of JavaScript before that.
- Newsreader uses the weight-only variable files (58 KB instead of 132 KB per style), and the 6 KB stylesheet is inlined, which removes the only render-blocking request.
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
- Playwright and axe (WCAG 2.1 A and AA) on 10 pages in light and dark themes, plus behaviour tests: all 27 pass.
- Lighthouse 12 (mobile, simulated throttling), live site, 10 Nov 2026: performance 100 on `/`, `/work/shellform/` and `/cv/`, 95 on `/publications/`. Accessibility, best practices and SEO scored 100 on the pages checked before the viewer change.
- External links: both Zenodo DOIs return 403 to link checkers (Zenodo blocks bots); the DOI handle API confirms both are registered.

### Checked by Claude, author to confirm

- All CV facts on `/about/` and `/cv/` were copied from `CV_Syed_Nafiz_Reja_Hasib.pdf` (Nov 2026).
- Publication [5] (PaveCarbon paper) is shown as "in preparation, submission planned November 2026", as in the CV. Confirmed by the author on 10 Nov 2026 ("approve all"). Update when submitted.
- ShellBench test count: the CV says 114, the repository reported 238 passed on 10 Nov 2026. The CV page gives no count; the project page uses the repository figure.

### Headshot (10 Nov 2026)

- The author supplied a portrait in `_inbox/`. It was cropped to 4:5 head and shoulders, EXIF stripped, saved as `src/assets/media/portrait.jpg`, and shown on `/about/` (AVIF and WebP, 320 and 640 px). A 640 px JPEG is the `image` in the Person JSON-LD.
- Playwright now serves on `127.0.0.1` with `--force`: the local sandbox refused connections to `astro preview` on `localhost`.

### TODO(syed)

- Install the Pages CMS GitHub app on this repository (https://app.pagescms.org) to use the dashboard.
- Two projects from the plan are not on the site yet: stress-trajectory ribs and diaphragm flexibility. Add them when there is material to show.
- Add `https://syednafizreja.github.io` to the CV PDF source, LinkedIn and ORCID. The repository homepage is set. The GitHub profile website field is not: the CLI token lacks the `user` scope. Set it at github.com/settings/profile, or run `gh auth refresh -h github.com -s user` once and ask Claude again.
