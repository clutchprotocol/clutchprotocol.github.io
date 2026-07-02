# clutchprotocol.github.io — Marketing Site

Static single-page marketing site for clutchprotocol.io. Plain HTML/CSS/JS — **no build step, no
dependencies to install, no framework**. Everything lives at the repo root: `index.html`,
`styles.css`, `script.js`. See the parent `../CLAUDE.md` for the multi-repo workspace overview.

Preview locally with any static server (e.g. `python -m http.server 8000` or `npx serve .`).

## Page Map (index.html, single page)

Order on page (nav order differs slightly — nav lists Try Stage before Features):

| Section | id / class | Content |
|---|---|---|
| Alpha banner | `.alpha-banner` (fixed, top) | "Alpha software" notice + docs link |
| Navbar | `.navbar` (fixed, below banner) | Anchor links + external Docs link, hamburger on mobile |
| Hero | `#home` `.hero` | Title, description, 3 stats, CTA buttons, animated blocks |
| Try Stage | `#try-stage` `.try-stage` | Quick-start steps + stage endpoint links |
| Features | `#features` `.features` | 6 `.feature-card`s ("What exists today") |
| Stack | `.architecture` (**no id** — not nav-linked) | 6 `.arch-component` cards, one per repo |
| CLT economics | `#tokenomics` `.tokenomics` | Fee bars (10 CLT example) + app-developer callout |
| Roadmap | `#roadmap` `.roadmap` | Cards with `.done` / `.planned` status pills |
| FAQ | `#faq` `.faq` | Native `<details>/<summary>` accordion — no JS |
| Team | `#team` `.team` | Single member card |
| Community | `#community` `.community` | GitHub / Discussions / Docs cards |
| Footer | `.footer` | Link columns, copyright year (hardcoded) |

`<head>` also carries JSON-LD structured data (Organization + WebSite).

## CSS (styles.css)

- **No CSS variables** — the palette is repeated literally. Primary `#667eea`, secondary `#764ba2`
  (gradient `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`), headings `#1a1a1a`, body text
  `#666`/`#333`, alt section bg `#f8f9fa`. When changing colors, search-and-replace all occurrences.
- Font: Inter (Google Fonts, weights 300–700); icons: Font Awesome 6 (cdnjs). Both loaded via
  CDN `<link>`s with `preconnect` — the only external deps.
- Organized top-to-bottom by section, matching page order, each under a `/* ... Section */` comment.
- Sections alternate `background: #fff` / `#f8f9fa` and use `padding: 100px 0`; content wraps in
  `.container` (max-width 1200px). Grids use `repeat(auto-fit, minmax(...))`.
- Breakpoints: `768px` (mobile nav slides in, single columns) and `480px` (full-width buttons,
  tighter cards). Plus a `prefers-reduced-motion` block that kills all animations/transitions.
- Fixed-header math: banner is ~36px, navbar `top: 36px` height 70px, so anchor targets get
  `scroll-margin-top: 110px` and hero `padding-top: 106px`. Changing banner/nav height means
  updating all of these together (also `.nav-menu { top: 106px }` in the 768px media query).

## JS (script.js)

One `DOMContentLoaded` handler; ~180 lines, no modules. Behaviors:
- Mobile hamburger toggle (`.nav-toggle` ↔ `.nav-menu.active`, syncs `aria-expanded`, animates bars).
- Navbar background/shadow swap past 50px scroll.
- IntersectionObserver scroll-reveal on cards (skipped under `prefers-reduced-motion`).
- Stat counter animation for numeric `.stat-number`s; hero parallax; block hover effects.
- Konami-code easter egg (hue-rotate filter).
- Smooth scrolling is **CSS-only** (`scroll-behavior: smooth` + `scroll-margin-top`); FAQ accordion
  is native `<details>` — do not add JS for either.

## SEO — keep in sync when content changes

- Title/description live in **four places**: `<title>` + `<meta name="description">`, the `og:*`
  tags, the `twitter:*` tags, and the JSON-LD block. Update all when messaging changes.
- Social image: `assets/og-image.jpg` (1200x630, referenced by absolute URL in og/twitter tags).
- `sitemap.xml` has only the root URL; `robots.txt` allows all and points at the sitemap. Add
  entries only if new pages are ever added.
- Canonical URL is `https://clutchprotocol.io/`.

## Deploy

Push to `main` → GitHub Pages publishes automatically (no Actions workflow — `.github/` is empty;
Pages serves the branch directly). `CNAME` contains `clutchprotocol.io`; `.nojekyll` disables
Jekyll processing. Don't delete either file. There is no staging — main is production.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, ...) — copy/content tweaks use `docs:`.
- New section: `<section id="x" class="x">` inside `<main>`, with `.container` >
  `h2.section-title` + `p.section-subtitle` + a grid; append a matching `/* X Section */` CSS block
  in page order; add a nav link and mobile fallbacks in the 768px media query if needed.
- Icons: Font Awesome `<i class="fas fa-..." aria-hidden="true">`; external links get
  `target="_blank" rel="noopener"`; keep ARIA labels on icon-only links.
- Copy is deliberately honest "alpha" messaging (what exists vs. planned) — don't inflate claims;
  governance/mainnet are explicitly marked as not implemented.
- Footer copyright year is hardcoded (`© 2026`).
