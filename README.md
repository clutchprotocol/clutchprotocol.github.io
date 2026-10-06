# Clutch Protocol Website

The site at [clutchprotocol.io](https://clutchprotocol.io): one static page for Clutch Protocol, an
open-source ride-sharing blockchain.

Alpha software: the mainnet is live as a capped pilot (small limits, real money), and the stage
testnet is for experiments. APIs may change.

- **Mainnet app (pilot)**: [app.clutchprotocol.io](https://app.clutchprotocol.io)
- **Testnet app**: [app-stage.clutchprotocol.io](https://app-stage.clutchprotocol.io)
- **Documentation**: [docs.clutchprotocol.io](https://docs.clutchprotocol.io)
- **Code**: [github.com/clutchprotocol](https://github.com/clutchprotocol)

## What is here

Plain HTML, CSS and JavaScript, with no build step and no dependencies to install.

```
index.html      the page, with its SEO tags and JSON-LD
styles.css      all styles; colours and fonts are variables in :root
script.js       the mobile menu and the fare slider
assets/         social image, the 15-second reel and its poster
robots.txt, sitemap.xml, favicon.ico
CNAME, .nojekyll   GitHub Pages settings: do not delete
```

Fonts are Barlow, Barlow Condensed and IBM Plex Mono from Google Fonts, the only external request.

## Run it locally

```bash
python -m http.server 8000   # or: npx serve .
```

## Deploy

A push to `main` publishes the site through GitHub Pages. There is no staging: `main` is production.

Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, ...).

## License

MIT, see [LICENSE](LICENSE).
