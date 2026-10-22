# Auralim website / 晨昏产品官网

A bilingual product showcase for [Auralim](https://github.com/frank-yf/auralim-mac), built with Astro, TypeScript and CSS. 简体中文默认首页，英文 `/en/`。

## Local development

Requires Node.js **22.23.4 or newer** and npm.

```sh
npm ci
make dev
```

Open **http://127.0.0.1:4321/** or **http://127.0.0.1:4321/en/**. The server binds only to the local machine. Local development commands do not publish the site. Pushing to `main` runs the GitHub Pages workflow described below.

```sh
make check       # Astro / TypeScript
make test        # example timeline, offsets, translations and release metadata
make build       # static output in dist/
make preview     # serve the built output locally
```

The site includes an interactive day/night desktop, Light / Auto / Dark controls, independent ±120-minute offsets, real SwiftUI screenshots, download links and FAQs. Keyboard controls, narrow viewports, website light/dark themes and reduced motion are supported. No tracking, external fonts or browser geolocation is used. The website stores only your chosen website theme in localStorage.

## Content and assets

- `src/i18n/content.ts`: Simplified Chinese and English copy.
- `src/lib/demo.ts`: fixed example: sunrise 06:12, sunset 17:58. This is an illustration, not a live astronomical forecast or a port of the native app's solar engine. Moving either slider left delays its event; moving right advances it. Number inputs use negative values for earlier and positive for later.
- `src/data/languages.ts`: the native app’s 12 supported locales, displayed on both website routes. The website remains Simplified Chinese and English.
- `src/data/release.json`: verified public download metadata. Current public release is v0.3.1 (universal ZIP, signed appcast, SHA-256 checksums). Main download buttons prefer a DMG when supplied and otherwise use the ZIP. Location improvements are included in the current release.
- `public/images/app-icon.png`: from the native app's tracked icon resource.
- `public/images/settings-*.png`: native v0.2.5 settings captures using temporary example preferences. English pages use `settings-en-*.png`; Chinese pages use `settings-*.png`. No user location or account information is present.
- `public/images/menu-*.png`: matching light/dark captures of the v0.2.5 native menu view, rendered from the committed app source with temporary example preferences and a mock appearance service. English pages use `menu-en-*.png`; Chinese pages use `menu-*.png`. Both menu and settings images initially follow the website theme and resynchronize when that theme changes. Manual gallery preview and zoom remain available.
- `src/components/Landscape.astro`: original SVG desktop illustration.

Update download information explicitly, then rebuild:

```sh
make release-sync
make build
```

GitHub is queried only by the update script, never when a visitor opens the website. A failed request leaves the existing release data intact. Download files remain hosted in `auralim-mac` GitHub Releases.

## GitHub Pages

The GitHub Actions workflow `.github/workflows/pages.yml` builds and deploys `main`, or can be run manually. Changes only to `README.md` or `VALIDATION.md` do not trigger another deployment. Dependencies use the committed lockfile and Node.js 24. Build permissions are read-only; only the deploy job receives Pages and OIDC write permissions.

- 简体中文: https://frank-yf.github.io/auralim-site/
- English: https://frank-yf.github.io/auralim-site/en/

`actions/configure-pages` supplies the project base path to `SITE_BASE`. Both language routes, CSS/JS, images, language links, canonical URLs and share-image URLs use that prefix. A missing route or resource fails the build before deployment. No custom domain or DNS is configured.

To reproduce the production build locally without deploying:

```sh
SITE_BASE=/auralim-site npm run build
node scripts/check-built-site.mjs /auralim-site/
npm run preview -- --port 4322
# http://127.0.0.1:4322/auralim-site/
```

The default development preview still uses `/`. The share image is provided as PNG, with its original SVG source retained.
