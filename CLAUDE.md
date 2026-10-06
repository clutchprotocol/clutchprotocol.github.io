# clutchprotocol.github.io — Marketing Site

Static single-page marketing site for clutchprotocol.io. Plain HTML/CSS/JS — **no build step, no
dependencies to install, no framework**. Everything lives at the repo root: `index.html`,
`styles.css`, `script.js`. See the parent `../CLAUDE.md` for the multi-repo workspace overview.

Preview locally with any static server (e.g. `python -m http.server 8000` or `npx serve .`).

## Page Map (index.html, single page)

Order on page (nav order differs slightly — nav lists Try it before Features):

| Section | id / class | Content |
|---|---|---|
| Alpha banner | `.alpha-banner` (fixed, top) | "Alpha software" notice + docs link |
| Navbar | `.navbar` (fixed, below banner) | Anchor links + external Docs link, hamburger on mobile |
| Hero | `#home` `.hero` | Title, description, CTA buttons, and a ride receipt that prints in once on load |
| Reel | `#reel` `.reel` (not nav-linked) | "Clutch in 15 seconds": `assets/clutch-reel.mp4` (1080p60 H.264 + AAC, 15 MB) with poster `assets/clutch-reel-poster.jpg`. The only dark band. `preload="none"` and no autoplay, so the file costs nothing until someone presses play. It is rendered outside this repo; replace both files together, and keep the MP4 small, because every version stays in git history |
| What is Clutch | `#what-is-clutch` `.what-is` (not nav-linked) | The three-line project summary, same text as the org profile README: what it is, how apps use it, money and servers |
| Try it | `#try-stage` `.try-stage` | Two dark cards (`.try-stage-cards`): the mainnet pilot and the testnet quick start, then the endpoint links for both. The id stays `try-stage`, so old links keep working |
| Features | `#features` `.features` | Ruled two-column list ("What exists today") |
| Stack | `.architecture` (**no id** — not nav-linked) | One row per repo |
| CLT economics | `#tokenomics` `.tokenomics` | Fare slider (`#fare`) driving the fee bars, + app-developer callout |
| Roadmap | `#roadmap` `.roadmap` | Cards with `.done` / `.planned` status pills |
| FAQ | `#faq` `.faq` | Native `<details>/<summary>` accordion — no JS |
| Team | `#team` `.team` | Single member card |
| Community | `#community` `.community` | GitHub / Discussions / Docs cards |
| Footer | `.footer` | Link columns, copyright year (hardcoded) |

`<head>` also carries JSON-LD structured data (Organization + WebSite).

## CSS (styles.css)

- **Design tokens are CSS variables in `:root`** at the top of `styles.css`: the "road" palette
  (`--asphalt`, `--concrete`, `--paper`, `--sign` green, `--lane` yellow, `--caution`), the text
  colours (`--ink`, `--body`, `--muted`, `--line`), the three font stacks (`--font`,
  `--font-display`, `--font-receipt`), `--gutter` and `--section-y`. Use them rather than literal
  colours; the dark reel band and the footer still use a few literals.
- Fonts: Barlow, Barlow Condensed and IBM Plex Mono from Google Fonts, loaded with `preconnect`.
  That is the only external dependency; there are no icons.
- Organized top-to-bottom by section, matching page order, each under a `/* ... */` comment.
- Sections use `padding: var(--section-y) 0` (a `clamp()`, so it already shrinks on phones); content
  wraps in `.container`. A yellow dashed line marks the top of each section except the hero and reel.
- Breakpoints: `900px` (tablet), `768px` (mobile nav slides in, single columns), `600px` (banner
  detail hidden) and `480px` (full-width buttons). Plus a `prefers-reduced-motion` block.
- Fixed-header math: banner is ~36px, navbar `top: 36px` height 70px, so anchor targets get
  `scroll-margin-top: 110px` and the hero's `padding-top` starts at 106px. Changing banner/nav height
  means updating all of these together (also `.nav-menu`'s `top` in the 768px media query).

## JS (script.js)

One `DOMContentLoaded` handler, under 40 lines, no modules. Two behaviors:
- Mobile hamburger toggle (`.nav-toggle` ↔ `.nav-menu.active`, syncs `aria-expanded`; the bars
  animate from `aria-expanded` in CSS). Clicking a nav link closes the menu.
- The fare slider in CLT economics: the same split as the chain (each referrer 200 bps rounded down,
  the driver the exact remainder), written into `#fee-bars`.

Smooth scrolling is **CSS-only** (`scroll-behavior: smooth` + `scroll-margin-top`); the FAQ
accordion is native `<details>`; the hero receipt animates in CSS. Do not add JS for any of these.

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
- No icons; external links get
  `target="_blank" rel="noopener"`; keep ARIA labels on icon-only links.
- Copy is deliberately honest "alpha" messaging (what exists vs. planned) — don't inflate claims.
  Since 2026-10-05 the mainnet is live as a **capped pilot**, and the copy must keep saying so: small
  limits, real money, alpha, treasury keys on the server, withdrawals not open until the payout wallet
  is activated (change that line when it is). Audited crypto, independent validators, hardware-backed
  keys and higher limits stay marked as planned. Governance is not implemented.
- The three-line "What is Clutch?" summary is the same text in three places (the org profile README,
  this page, the docs homepage `src/pages/index.tsx`): change all three together.
- Footer copyright year is hardcoded (`© 2026`).
