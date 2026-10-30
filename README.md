# Auralim website / 晦明产品官网

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

## Product content

The current product content, native screenshots and public downloads use **v0.5.3**. Download metadata is synchronized only after the native release and its assets are published and verified. Screenshot provenance remains independent: if a future source preview is ahead of the public release, both language routes show a visible version note. Download buttons always use the public standard package. Existing screenshot versions are not relabeled.

The site includes an interactive day/night desktop, Light / Auto / Dark controls, independent ±120-minute offsets, native SwiftUI screenshots, download links and FAQs. Feature copy covers city selection and cached automatic location, scheduled-only countdowns, manual Light / Auto / Dark selection without a countdown, animation completion and its one-second hold, wake recovery, launch at login and manual-by-default updates. Keyboard controls, narrow viewports, website light/dark themes and reduced motion are supported. No tracking, external fonts or browser geolocation is used. The website stores only your chosen website theme in localStorage. Offset controls mirror the native draft/commit, integer parsing, gradient and per-event reset behavior. The website theme button plays a sun/moon transition across the viewport and honors Reduce Motion. The interactive desktop has no animation controls or transition overlay.

## Content and assets

- `src/i18n/content.ts`: Simplified Chinese and English copy.
- `src/lib/transition.ts`: 3.2-second sun/moon animation that finishes before the website changes theme. A feathered sky shifts between night and day around the glowing sun and moon. Desktop uses a centered 96% × 84% overlay; mobile fills the width and lower two-thirds of the viewport, with bodies entering or leaving horizontally. Initial page load does not animate. Motion is canceled when hidden, replaced or reduced-motion preferences change.
- `src/lib/demo.ts`: fixed example: sunrise 06:12, sunset 17:58. This is an illustration, not a live astronomical forecast or a port of the native app's solar engine. Moving either slider left advances its event; moving right delays it. Hints show Earlier / Later and use the native endpoint colors for sun/moon icons. Number inputs use negative values for earlier and positive for later.
- `src/data/screenshots.ts`: captured app version, source commit, and versioned image filenames. Current captures come from native commit `4c855f26440e887696b217056bcd2f9d5523b691`. Gallery provenance is independent of public release metadata.
- `src/data/languages.ts`: the native app’s 12 supported locales, displayed on both website routes. The website remains Simplified Chinese and English.
- `src/data/release.json`: verified public download metadata. Current public release is v0.5.3 (universal DMG and ZIP, signed appcast, SHA-256 checksums, and a separate debug ZIP). Main download buttons prefer a DMG when supplied and otherwise use the ZIP. The main download always selects the standard application; the debug build is available separately on the release page.
- `public/images/app-icon.png`: small app icon from the native app’s tracked icon resource.
- `public/images/app-icon-large.png`: unchanged 1254px native icon artwork for the large download-section showcase, zoom dialog and original-image link.
- `public/images/settings-*.png`: native v0.5.3 settings captures using temporary example preferences. English pages use `settings-v0.5.3-en-*.png`; Chinese pages use `settings-v0.5.3-*.png`. The 600 × 640 content capture uses isolated example preferences and does not include user location or account information.
- `public/images/menu-*.png`: matching light/dark captures of the v0.5.3 native menu view, rendered from the committed app source with temporary example preferences and a mock appearance service. English pages use `menu-v0.5.3-en-*.png`; Chinese pages use `menu-v0.5.3-*.png`. Menu captures are 320 × 188. Appearance, location and login services are mocked; the updater is not started. Both menu and settings images initially follow the website theme and resynchronize when that theme changes. Manual gallery preview and zoom remain available.
- `src/components/Landscape.astro`: original SVG desktop illustration.

When refreshing native screenshots, render the committed source with its matching bundle version, isolated preferences and mocked system services. Capture both locales and appearances, update all eight images and `screenshots.ts` together, and verify the gallery before removing the superseded images. Capture tools and evidence stay in ignored `artifacts/`.

Update download information explicitly **after a public release**, then rebuild:

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
SITE_BASE=/auralim-site npm run preview -- --port 4322
# http://127.0.0.1:4322/auralim-site/
```

The default development preview still uses `/`. The share image is provided as PNG, with its original SVG source retained.
