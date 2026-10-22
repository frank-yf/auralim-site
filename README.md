# Auralim website / 晨昏产品官网

A bilingual product showcase for [Auralim](https://github.com/frank-yf/auralim-mac), built with Astro, TypeScript and CSS. 简体中文默认首页，英文 `/en/`。

## Local development

Requires Node.js **22.23.4 or newer** and npm.

```sh
npm ci
make dev
```

Open **http://127.0.0.1:4321/** or **http://127.0.0.1:4321/en/**. The server binds only to the local machine. This repository has no automatic deployment workflow; running any command below does not publish the site.

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
- `src/data/release.json`: verified public download metadata. Current public release is v0.2.2; local native app development is v0.2.5. Unreleased location improvements are explicitly marked.
- `public/images/app-icon.png`: from the native app's tracked icon resource.
- `public/images/settings-*.png`: genuine captures of the native SwiftUI settings view, using injected example location data. These include development-build changes and are labeled accordingly. No user location or account information is present.
- `public/images/menu-*.png`: matching light/dark captures of the v0.2.5 native menu view, rendered from the committed app source with temporary example preferences and a mock appearance service. Both follow the gallery appearance selection, including the zoom view.
- `src/components/Landscape.astro`: original SVG desktop illustration.

Update download information explicitly, then rebuild:

```sh
make release-sync
make build
```

GitHub is queried only by the update script, never when a visitor opens the website. A failed request leaves the existing release data intact. Download files remain hosted in `auralim-mac` GitHub Releases.

## Future GitHub Pages preparation

The local preview uses `/`. A project-path build can be checked without deploying:

```sh
SITE_BASE=/auralim-site npm run build
npm run preview -- --port 4322
# http://127.0.0.1:4322/auralim-site/
```

No Site registration, publishing, GitHub Pages enablement or DNS changes have been performed. Add deployment only when authorized. The share image is provided as PNG, with its original SVG source retained.
