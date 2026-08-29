# Aman Baid — Portfolio

Personal portfolio site. Static HTML/CSS, no build step, no dependencies.

**Live:** https://amanbaid99.github.io/AmanBaidPortfolio/

---

## Before you go live — 2 things to swap in

### 1. The resume PDF

`assets/resume/aman-baid-resume.pdf` is currently a **placeholder**. Replace that
file with the real resume, keeping the exact same path and filename — every
"Resume" link on the site already points at it, so no HTML needs editing.

### 2. PostHog analytics (optional)

Analytics is wired up but switched off. Open `assets/js/analytics.js` and set:

```js
var POSTHOG_KEY = "phc_your_key_here";   // PostHog > Settings > Project > Project API Key
var POSTHOG_HOST = "https://us.i.posthog.com";   // or https://eu.i.posthog.com
```

Until the key is filled in the file does nothing and loads no third-party
script, so the site stays fast and cookie-free by default.

---

## Deployment

The site publishes from **Settings → Pages → Deploy from a branch**, pointed at
branch `claude/aman-baid-portfolio-f1z4g5`, folder `/ (root)`.

There is no build step — the repo root *is* the site, and `.nojekyll` tells
GitHub to serve the files as-is rather than running them through Jekyll. Push to
that branch and the site republishes in about a minute.

**Live:** https://amanbaid99.github.io/AmanBaidPortfolio/

### When you merge this work into `master`

Branch-deploy keeps publishing from whatever branch is selected, so after a merge
the site would still be served from the old feature branch. Repoint it:
**Settings → Pages → Branch → `master`**.

### Optional: switching to an Actions-based deploy

`.github/workflows/deploy-pages.yml` is set to **manual trigger only**
(`workflow_dispatch`) and does nothing on its own. It exists for the day you'd
rather deploy through Actions than from a branch. To switch:

1. **Settings → Pages → Source → GitHub Actions**
2. Add a push trigger to the workflow (the file has the snippet in a comment)

Order matters: `actions/deploy-pages` only works when Source is "GitHub Actions".
Running it while Source is "Deploy from a branch" fails every time.

Note that GitHub restricts the `github-pages` *environment* to the repo's default
branch, so an Actions deploy only works from `master` — that is why this branch
publishes via branch-deploy instead, which has no such restriction.

## Structure

```
index.html                                  Home — hero, about, experience, projects, contact
projects/swaswasthya/index.html             Case study
projects/cluckin/index.html                 Case study
projects/fitness-coaching-platform/         Case study
assets/css/style.css                        All styling (design tokens at the top)
assets/js/main.js                           Reveals, metric count-up, nav scroll-spy, footer year
assets/js/analytics.js                      PostHog loader (inert until keyed)
assets/img/og-image.jpg                     1200×630 LinkedIn/social preview card
assets/img/aman-baid.jpg|.webp              Hero portrait (@2x variants alongside)
assets/img/favicon.svg                      AB monogram, matches the header mark
assets/resume/aman-baid-resume.pdf          ← replace this
404.html                                    Styled not-found page Pages serves automatically
robots.txt, sitemap.xml, .nojekyll
.github/workflows/deploy-pages.yml          Optional Actions deploy; manual trigger only
```

## Editing content

Everything is hardcoded in the HTML — there's no CMS and nothing to rebuild.
Edit the file, commit, push; Pages redeploys in about a minute.

Colours, fonts and spacing are CSS custom properties at the top of
`assets/css/style.css`. Changing `--accent` there recolours the whole site.

## Local preview

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Use a server rather than opening `index.html`
directly, so the `/projects/<name>/` clean URLs resolve.

## If you move to a custom domain

1. Add a `CNAME` file at the repo root containing just the domain, e.g. `amanbaid.com`
2. Point the domain's DNS at GitHub Pages
3. Find-and-replace `https://amanbaid99.github.io/AmanBaidPortfolio` with the new
   origin across the four page HTML files, `robots.txt` and `sitemap.xml` — those
   are the canonical, Open Graph and sitemap URLs, which must be absolute
4. In `404.html`, replace the `/AmanBaidPortfolio/` path prefix with `/`. A custom
   domain serves the site from the root, not from a repo subpath

Ordinary internal links are relative, so navigation keeps working either way.
`404.html` is the exception: GitHub serves it for a missing URL at any depth, so
relative paths in it would resolve against the wrong directory.

## Design notes

- No card/panel containers: sections are separated by hairline rules and
  whitespace rather than bordered boxes. Projects are a numbered editorial
  list, contact details are hairline rows, skills are plain wrapped text.
- Icons are one inline SVG sprite per page (`<symbol>` + `<use>`) — no icon
  library, no extra request. To add one, add a `<symbol>` to the sprite block at
  the top of `<body>` and reference it with
  `<svg class="icon"><use href="#i-name"></use></svg>`.
- Animation is JS-gated: `main.js` adds a `js` class to `<html>`, and every
  hidden-then-revealed rule is scoped to `.js`. With JS off nothing is ever
  hidden. Two independent safety nets force content visible if an animation
  fails to run, so the page can never be left blank.
- `prefers-reduced-motion` disables all of it, and the metric counters render
  their final values straight from the HTML.

## Notes

- No dark mode (light only, by choice)
- Fully responsive; the nav collapses to name + Resume on small screens
- Works with JavaScript disabled — JS only adds scroll reveals and the footer year
- Metrics on the site match the resume exactly; current title is stated as
  Associate Product Manager
