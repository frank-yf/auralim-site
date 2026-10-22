# Website validation — 2026-10-22

Initial local-only scope: the new `auralim-site` website. No native application code was changed or globally retested. At that stage no remote deployment, GitHub Pages configuration, push, Site registration or DNS change was performed. The subsequent GitHub Pages deployment is recorded below.

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

## GitHub Pages deployment — 2026-10-22

- Enabled GitHub Pages in custom workflow mode, with HTTPS and no custom domain.
- Deployed commit: `ced77d81802a3729a2e2a70a1b7f0dccb31ce37b`.
- [Actions run 39764670665](https://github.com/frank-yf/auralim-site/actions/runs/39764670665): build and deploy jobs succeeded, including Node.js 24, locked dependency installation, type checking, static build and project-prefix resource validation.
- 中文: https://frank-yf.github.io/auralim-site/ — HTTP 200, `lang=zh-CN`, correct canonical URL.
- English: https://frank-yf.github.io/auralim-site/en/ — HTTP 200, `lang=en`, correct canonical URL.
- Verified 10 unique deployed routes/assets, including both pages, CSS, JavaScript, icon, share image, and both menu/settings light/dark screenshots. All returned HTTP 200 with expected content types. All 6 PNG response hashes matched the local public assets exactly.
- Real public-site Chrome checks passed in both languages: prefixed language links, loaded JavaScript controlling the demo, both gallery images following light/dark selection, and menu-image zoom using the current appearance. Both pages fit a 390px viewport; no page errors or local-site resource errors occurred.
- Source is built with `/auralim-site/` from the configure-pages output; local development retains `/`. The workflow checks both routes and all referenced local files before upload. Readme/validation-only commits do not redeploy.
- Scope was publishing, bilingual pages and asset loading, plus affected live interactions. No unrelated native app or full website regression was run.
- Ignored evidence: `artifacts/pages-live-result.json`, `artifacts/pages-live-check.mjs`, `artifacts/pages-live-desktop.png`, mobile captures, and `artifacts/auralim-pages-*.log`.

## Localized gallery and website-theme defaults — 2026-10-22

- Replaced mismatched settings examples with paired native v0.2.5 menu/settings captures in Simplified Chinese and English, both light and dark. Captures were generated from the isolated committed source with temporary example preferences and a fake appearance service; the working native app and system appearance were not changed.
- English pages select `menu-en-*.png` / `settings-en-*.png`; Chinese pages select the matching Chinese assets. Captions identify the captured version and sample data.
- The gallery initializes from the website theme, honoring the initial system preference and any saved website-theme selection. The website theme button resynchronizes both images and the selected gallery tab. Manual gallery preview remains independent until the website theme changes or the page reloads.
- Initial images stay hidden until the matching theme assets decode, preventing a default-light flash on a dark site. Rapid initial selections use a generation check before revealing images.
- Scoped local Chrome checks passed for both languages: system light/dark, saved dark over a light system, saved light over a dark system, global toggle, manual preview, keyboard selection, both zoom views, reload, language navigation with a saved dark website theme, 390px width, and a deliberately delayed first dark image. No browser errors occurred.
- Astro checks: zero errors / warnings / hints. GitHub project-path build passed with 13 unique referenced routes/assets. Build validation now also checks that each route uses its language-specific image sources.
- Only the gallery language/theme change and related build paths were checked. No full native app or website regression was run.
- Evidence is retained under ignored artifacts: `gallery-language-theme-local.json`, `gallery-language-theme-check.mjs`, `gallery-en-site-dark.png`, `gallery-zh-CN-site-dark.png`, capture source/log and related type/build logs.
