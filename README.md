# Aman Baid — Portfolio

Personal portfolio site. Static HTML/CSS, no build step, no dependencies.

**Live:** https://amanbaid99.github.io/AmanBaidPortfolio/ (`/pm/` and `/finances/` for the two sections)

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

**Live:** https://amanbaid99.github.io/AmanBaidPortfolio/ (`/pm/` and `/finances/` for the two sections)

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

Three sections, all static HTML:

```
index.html                    Personal hub — who I am, routes into the two sections
pm/index.html                 Product management portfolio
pm/projects/<slug>/           One case study per project (3)
finances/index.html           Mutual fund distribution
404.html                      Styled not-found page Pages serves automatically

assets/css/style.css          All styling (design tokens at the top)
assets/js/main.js             Reveals, metric count-up, nav scroll-spy, footer year
assets/js/analytics.js        PostHog loader (inert until keyed)
assets/img/                   Portrait (webp + jpg, @2x), OG card, favicon
assets/resume/                ← replace the placeholder PDF here
robots.txt, sitemap.xml, .nojekyll
.github/workflows/            Optional Actions deploy; manual trigger only
```

URLs are lowercase (`/pm/`, not `/PM`). GitHub Pages is case-sensitive and a
static site cannot redirect between the two, so mixed casing would be a
permanent 404.

Each page carries its own copy of the header, footer and icon sprite — there is
no build step and no templating. **If you change the nav or footer, change it in
all seven HTML files.**

## Before the finance page goes public

`finances/index.html` is written for someone who is *not yet* registered. It says
so on the page, and the disclosures block has placeholders marked in accent
colour with a dashed underline (`.todo`). Before it is public:

1. Fill in your **ARN number** in the Disclosures section and remove
   "(registration in progress)" and the `todo` spans
2. Remove the "Launching soon" chip and the notice paragraph in the hero
3. Re-read the disclosures against current AMFI/SEBI guidance — the wording
   there is a reasonable starting point, not legal advice, and requirements
   change

The page deliberately makes no return promises and states plainly that you are a
distributor paid by commission, not a SEBI-registered investment adviser. Keep it
that way.

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

## The finance page is standalone

`finances/` is written to be linked to directly and read on its own. The
wordmark in its header is **not** a link, there is no "back to Aman Baid" CTA,
and its footer carries no cross-section navigation — the only links out are the
stylesheet and favicon. If you ever want it rejoined to the rest of the site,
re-link `.site-header__name` and restore the `site-footer__nav` block.

### Calculator

`assets/js/calculator.js` powers two tabs. It is dependency-free and the rest of
the page works without it (there is a `<noscript>` note).

The maths is a month-by-month projection with the contribution at the start of
each month; it reproduces the closed-form SIP formula exactly.

The comparison tab is deliberately **contribution-neutral**: both columns pay in
the same amount and assume the same expected return, so the gap shown is
behaviour (stopping during a fall, switching between schemes) and not one side
investing more. The step-up figure is reported *separately*, with its own
paid-in number, because it works by putting in more money — folding it into the
head-to-head would have made planning look far better than it is. Keep it that
way: an implied return promise is exactly what an MFD must not publish.

Chart colours (`#2a8560` / `#b4552f`) were validated for colour-blind separation.
They land in the WARN band, which is only permissible with secondary encoding —
hence the dashed second line, the legend, direct end-labels and the table view.
If you change either colour, re-check it before shipping.

## Design notes

- **Warm cream ground, terracotta accent.** Serif display (Instrument Serif) for
  the name and section headings, Archivo for sub-headings, Inter for body. All
  three arrive in one Google Fonts request.
- **The finance section runs green.** `finances/index.html` has
  `class="theme-finance"` on `<body>`, which overrides `--accent` and its two
  tints. Everything else — icons, numerals, highlights, tags — picks that up
  automatically. To re-tint either side, change those variables and nothing else.
- **Two-tone section headings**: the second line is wrapped in
  `<span class="tt">` and takes the accent.
- **Section labels are numbered pills** with an accent dot. They are the only
  rounded element in an otherwise square system, deliberately — so they read as
  a marker rather than a change of language. The number lives in
  `<span class="section__num">` and is per-page, so renumber if you add or
  reorder a section.
- **The portrait is a circle on an offset accent disc.** The references use
  cut-out PNGs; with a rectangular photo the disc would be completely hidden, so
  the photo is clipped to a circle and the disc offset behind it leaves a
  crescent. The photo is greyscale, returning to colour on hover.
- **The seal** is CSS-rotated text on an SVG `textPath`. It is hidden below
  62rem, where it covered a third of the face and duplicated the status chip
  directly beneath it.
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
