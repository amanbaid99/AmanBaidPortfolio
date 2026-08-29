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

## Enabling GitHub Pages

Repo **Settings → Pages → Build and deployment**:

- **Source:** Deploy from a branch
- **Branch:** `master` (or whichever branch holds this code), folder `/ (root)`

Save, wait a minute, and the site is live at the URL above. There's no build
step — GitHub serves these files directly. `.nojekyll` stops GitHub from running
the files through Jekyll first.

## Structure

```
index.html                                  Home — hero, about, experience, projects, contact
projects/swaswasthya/index.html             Case study
projects/cluckin/index.html                 Case study
projects/fitness-coaching-platform/         Case study
assets/css/style.css                        All styling (design tokens at the top)
assets/js/main.js                           Scroll reveals, sticky-header hairline, footer year
assets/js/analytics.js                      PostHog loader (inert until keyed)
assets/img/og-image.png                     1200×630 LinkedIn/social preview card
assets/img/favicon.svg
assets/resume/aman-baid-resume.pdf          ← replace this
robots.txt, sitemap.xml, .nojekyll
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
   origin across the four HTML files, `robots.txt` and `sitemap.xml` — those are
   the canonical, Open Graph and sitemap URLs, which must be absolute

All internal links are relative, so navigation keeps working either way.

## Notes

- No dark mode (light only, by choice)
- Fully responsive; the nav collapses to name + Resume on small screens
- Works with JavaScript disabled — JS only adds scroll reveals and the footer year
- Metrics on the site match the resume exactly; current title is stated as
  Associate Product Manager
