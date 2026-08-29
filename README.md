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

Deployment is automatic. `.github/workflows/deploy-pages.yml` publishes the site
to GitHub Pages on every push to `master`, and turns Pages on for the repo the
first time it runs — there is nothing to click in Settings.

There is no build step: the repo root *is* the site, so the workflow just uploads
it. A deploy takes about a minute; watch it under the repo's **Actions** tab.

The site publishes from **`master` only**. That isn't a preference — GitHub
creates the `github-pages` environment with a deployment branch rule limited to
the repo's default branch, and rejects a deploy from any other branch before it
even starts. So the site goes live when this work is merged to `master`, not
before.

To re-publish without pushing a commit: **Actions → Deploy to GitHub Pages →
Run workflow**, with `master` selected.

If you would rather not use Actions at all, this also works as a plain
branch deploy (**Settings → Pages → Deploy from a branch**, root folder) —
the `.nojekyll` file is what stops GitHub running the files through Jekyll in
that mode.

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
404.html                                    Styled not-found page Pages serves automatically
robots.txt, sitemap.xml, .nojekyll
.github/workflows/deploy-pages.yml          Publishes to GitHub Pages on push
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

## Notes

- No dark mode (light only, by choice)
- Fully responsive; the nav collapses to name + Resume on small screens
- Works with JavaScript disabled — JS only adds scroll reveals and the footer year
- Metrics on the site match the resume exactly; current title is stated as
  Associate Product Manager
