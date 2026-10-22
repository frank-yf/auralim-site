# Local first-version validation — 2026-10-22

Scope: the new `auralim-site` website only. No native application code was changed or globally retested. No remote deployment, GitHub Pages configuration, push, Site registration or DNS change was performed.

## Passed

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm test`: 6 tests passed, covering both languages, public release metadata, sunrise/sunset boundaries, manual mode override, offset directions, bounds and time formatting.
- `npm run build`: 2 static pages: Simplified Chinese `/` and English `/en/`.
- `SITE_BASE=/auralim-site npm run build`: all root-relative URLs in both pages include the project prefix and resolve to generated files. Restored a normal root-path build afterward.
- Headless Chrome using the existing installed Chrome executable with an isolated temporary profile: timeline changes at the exact example event times, Light / Auto / Dark and arrow-key navigation, both offset sliders and number inputs, ±120 clamping, time text, reset, screenshot tabs, zoom dialog and Escape focus restoration, website theme persistence and native FAQ expansion.
- Both languages at viewport widths 320, 360, 390, 768, 1024 and 1440: no document horizontal overflow. An initial English headline overflow at 360px was fixed and rechecked.
- Reduced-motion emulation: CSS transitions disabled.
- Final real-menu screenshot addition: checked both languages, image/caption selection, zoom/close, existing settings zoom and 320px layout.
- Production static build served temporarily on port 4322: both routes, loaded assets, time-slider JavaScript and dialog passed with no page errors or local HTTP errors. This temporary server was stopped.
- The requested development preview is retained at http://127.0.0.1:4321/ (loopback only).

## Content boundaries

- Demo solar times are explicitly fixed example data, not a real-time astronomical forecast. It never controls macOS appearance or requests browser location.
- App screenshots use captured SwiftUI UI and example coordinates. Menu captures are explicitly labeled v0.2.5; settings captures include unreleased development-build location changes. Screenshots retain the Simplified Chinese native app interface.
- Current public download metadata was verified against GitHub Releases: v0.2.2 universal DMG / ZIP / SHA256SUMS. The 0.2.5 location cache improvements are explicitly labeled as development-build features.
- No analytics, remote fonts, browser geolocation or runtime GitHub API request is included. Only the selected website theme is persisted locally.
- Browser checks were run in Chrome; Safari and physical mobile-device testing were not performed. GitHub Pages publication is intentionally unverified because deployment was not requested.

Ignored evidence under `artifacts/`: browser-check.json, screenshots, check/test/build logs, gallery/production logs and the exact local browser-check scripts. The browser runtime came from this workstation's bundled dependencies; project unit tests and builds require only the lockfile dependencies.

## Gallery appearance synchronization fix

- Both menu and settings screenshots now follow the same Light / Dark gallery selection. Their zoom views use the currently selected image; both tab panels update their accessible label.
- Replaced the single historical menu image with matching light/dark native-view captures from committed app source `1c47aae` (v0.2.5). Captured in a scratch package with temporary example preferences and a fake appearance service; no native app source or real system appearance was changed. Only the menu asset capture ran, with no native app regression suite.
- Scoped Chrome check passed in both website languages: light → dark → light selection, keyboard arrows, both thumbnails, both zoom images, image decoding and correct panel labels. No page errors or local asset errors. Visual check confirms genuinely dark text/control/background rendering for the dark menu asset.
- `npm run check`: zero errors / warnings / hints. Local static build passed. No unrelated website or native app interactions were retested; no deployment or push.
- Evidence: `artifacts/gallery-synced-dark.png`, `artifacts/gallery-sync-result.json`, `artifacts/auralim-site-gallery-sync-*.log`, and the isolated native capture test source/log retained under artifacts.
