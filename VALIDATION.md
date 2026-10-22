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
- App screenshots use captured SwiftUI UI and temporary example preferences. Menu and settings captures are explicitly labeled v0.2.5. Each website language now uses its corresponding native app language, in both light and dark.
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

### Live verification of localized gallery and theme defaults

- Published source commit `2bcdea2987b8a465d9bc45bd9bc2fdc98b5f6a22`; [Pages run 39766460586](https://github.com/frank-yf/auralim-site/actions/runs/39766460586) completed successfully.
- Repeated the scoped gallery checks on the actual public Chinese and English pages: all 13 checks passed, including initial system/saved website themes, global theme changes, manual preview, keyboard, both zoom views, reload, language changes, mobile width and delayed initial dark-image loading. No page or asset-loading errors occurred.
- All 8 public native menu/settings PNGs returned HTTP 200, had image/png content type, and matched local screenshot SHA-256 values exactly.
- Evidence: `artifacts/gallery-language-theme-live.json`, `artifacts/gallery-published-assets.json`, and related `auralim-site-gallery-*.log`. Unrelated interactions were not retested.


## v0.3.1 release and twelve-language support — 2026-10-22

- Synced public release metadata from GitHub Latest: v0.3.1, universal ZIP (7,703,817 bytes), and SHA256SUMS.txt. The release has no DMG; the sync script accepts that case and both primary download buttons use the ZIP. Installation instructions now describe extracting the archive.
- Both website languages list all 12 app locales with native names: en, zh-Hans, ja, zh-Hant, de, fr, es, pt-BR, ko, it, ru, nl. The language list explains immediate switching, system matching and English fallback. Website navigation remains bilingual.
- Location improvements are labeled as included in the current release, with the version read from release metadata. Existing v0.2.5 screenshot captions remain accurate to their original captures.
- `npm run check`: 0 errors, warnings or hints. Scoped `tests/content.test.mjs`: 3 tests passed. Production-prefix build and generated-page verification passed for both routes and 13 local routes/assets; generated pages verify both primary download URLs and all twelve locale entries.
- Scoped Chrome checks passed on Chinese/English pages in light/dark themes at 320, 390 and 1440px: current release and size, both ZIP download buttons, complete locale list, no document or list-item overflow, and no page/resource errors. Representative language-list screenshots were inspected. Evidence: ignored `artifacts/release-031-local.json` and `artifacts/languages-031-*.png`.
- No native app changes or full website interaction regression were performed. Publication and live verification are recorded below.


### v0.3.1 live publication

- Deployed website source `ecd08d5d98aa8c703184b8f64bad5950f6b3b7ce` through [Pages run 39769255192](https://github.com/frank-yf/auralim-site/actions/runs/39769255192). Both build and deploy jobs succeeded.
- Direct public-site Chrome checks passed at `/auralim-site/` and `/auralim-site/en/` in both light/dark themes: v0.3.1 and 7.7 MB, ZIP primary downloads, all 12 locale entries, unchanged bilingual website navigation, and no stale v0.2.2/development-release messages. Both pages and language-list items fit 320/390/1440px viewports without overflow. No page or website-resource errors were observed.
- Live evidence: ignored `artifacts/release-031-live.json` and language-card screenshots. This documentation-only update does not trigger a new Pages deployment.


## v0.3.1 gallery, native offset UI and transition preview — 2026-10-22

- Captured all 8 menu/settings images from released native source `1c6d1358ef125d20d70be046dbd990a4947ec017` (v0.3.1, build 26), in English/Simplified Chinese and light/dark. An isolated capture entry point uses actual production SwiftUI views, temporary Shanghai example preferences, fake appearance/location/login services and an unstarted update controller. The capture app uses a separate bundle ID and the v0.3.1 bundle metadata; the settings footer visibly includes 0.3.1 and the updater. Source app files, user preferences, location permission and system appearance were not changed.
- New versioned PNG filenames prevent stale image caches. Both localized captions, gallery theme selection and zoom dialogs reference the new images. Replaced the website language-switch label 简中 with 中文.
- Offset UI follows native SolarOffset / OffsetControl / AppearanceSliderCell semantics: ±120 whole minutes, negative earlier/positive later, physical left later/right earlier, immediate local draft summary/gradient, commit on slider release/Return/field blur, preserved applied times on invalid input, Unicode minus, signed normalized text and independent reset. The neutral track, direction-dependent warm/cool fill, square-root tint strength and ring thumb use the native color formulas. Pointer, one-minute keyboard and Option/Alt ten-minute steps were checked.
- Added an optional 3.2-second canvas transition inside the web desktop. It uses native east-to-west rising/setting arcs, centered 80% × 62.5% bounds and translucent feathered sky/horizon. The switch starts off. Actual demo appearance changes animate when enabled; explicit sunrise/sunset buttons allow replay. Replacing, disabling, page hiding or Reduce Motion cancels the animation and releases its frame loop. No operating-system appearance is controlled.
- `npm run check`: 0 errors, warnings or hints. `npm test`: 10 passed, including signed integer parsing, gradient direction and orbit invariants. Production-prefix build and generated bilingual resource checks passed (13 unique routes/assets).
- Scoped Chrome verification passed for both languages × light/dark: correct versioned images and zoom, draft versus applied time, invalid/empty/fractional input, clamping, Unicode minus, independent reset, real pointer dragging, arrow/Alt-arrow input, all four gradient directions, drawn canvas pixels, rapid replacement, explicit replay, stop-on-disable, timed cleanup, no animation on unchanged appearance and live Reduce Motion cancellation. Layouts at 320/390/768/1440px had no horizontal overflow; there were no page/resource errors. All 8 served PNG hashes matched source assets.
- Evidence under ignored artifacts: `native-demo-v031-local.json`, `native-demo-v031-check.mjs`, `native-capture-v031.json`, `WebsiteCapture-v031.swift`, and `v031-*.png`. Representative native captures, gradients, animation frames and mobile layouts were visually inspected.
- This was scoped website verification and native capture only, not a native app regression. Safari and physical mobile-device testing were not performed. Publication is verified separately below.


### Native UI demo live verification

- [Pages run 39771871464](https://github.com/frank-yf/auralim-site/actions/runs/39771871464) built and deployed source `d2f3a91ef00779dac66489b22c8a477d676778ef` successfully.
- Repeated the scoped browser checks against the actual public Chinese/English pages in light/dark themes: all new image paths and zoom views, 中文 switch text, native offset draft/commit and validation, pointer/keyboard controls, gradient directions, animation drawing/replacement/replay/cancellation/reduced motion, and 320–1440px layouts passed. All eight public screenshot hashes matched committed assets; no browser or website resource errors occurred.
- Live evidence: ignored `artifacts/native-demo-v031-live.json`. Native app source remained at `1c6d135` with a clean worktree. This documentation-only commit is excluded from the Pages deployment trigger.


## Website theme-switch animation — 2026-10-22

- Moved the sun/moon canvas from the interactive desktop to a fixed viewport overlay. The website header theme button now plays sunrise when switching to Light and sunset when switching to Dark. Initial load and saved-theme restoration do not animate. The overlay retains the centered 80% × 62.5% geometry and pointer passthrough; rapid clicks replace the prior animation, and Reduce Motion/page hiding cancels it.
- Removed the demo animation toggle, replay buttons, helper copy and scene-change triggers. Demo appearance and timeline controls no longer start the sun/moon animation. Theme persistence and gallery/offset color synchronization remain active.
- Type check: zero errors/warnings/hints. Two scoped content/orbit tests passed. Production-prefix build and bilingual generated-resource checks passed.
- Scoped Chrome checks passed on both languages with initial Light/Dark: absence of demo controls/effect, header click and keyboard activation, correct direction and drawn pixels, fixed half-area bounds while scrolling, pointer passthrough, rapid replacement and timed cleanup, gallery synchronization, live Reduce Motion cancellation, saved-theme reload without playback and 320/390/1440px layout. No page/resource errors. Screenshots were inspected. Evidence: ignored `artifacts/theme-animation-local.json`, `theme-animation-check.mjs` and `theme-animation-*.png`.
- No full website or native-app regression was run. Deployment verification follows below.


### Theme animation live verification

- [Pages run 39772918802](https://github.com/frank-yf/auralim-site/actions/runs/39772918802) built and deployed `dec2ceaf5a56fe9436f93342d3fc6661ba7e8375` successfully.
- Public-site checks passed in Chinese/English and initial Light/Dark: theme-only playback, removed demo controls/trigger, global fixed overlay and drawn pixels, rapid replacement/cleanup, keyboard activation, gallery sync, Reduce Motion cancellation, saved-theme reload without animation, and mobile widths. No page/resource errors. Evidence: ignored `artifacts/theme-animation-live.json`.


## Theme icons, DMG download and large artwork — 2026-10-22

- Header theme icons follow the current theme through CSS: Sun in Light, Moon in Dark, including the inline initial system/saved preference before client initialization. Click, keyboard activation and reload keep them synchronized.
- Added the unchanged 1254 × 1254 native artwork as `app-icon-large.png`, rendered at 264px on desktop and 200px on small screens in the download section. It opens a square enlarged preview with a full-resolution artwork link. Preview closing restores focus; screenshot previews hide the original-art link. Both languages and themes were visually inspected.
- v0.3.1 previously supplied only the Sparkle ZIP. Generated `Auralim-0.3.1-macos-universal.dmg` (7,773,754 bytes) from the exact published ZIP, containing the app and an Applications link. `hdiutil verify`, read-only mounting, full mounted/extracted file-and-symlink comparison, strict code signature and arm64/x86_64 checks passed. The DMG contains 0.3.1 (build 26), without rebuilding or modifying native application code.
- Added the DMG to the existing Latest v0.3.1 Release and updated SHA256SUMS.txt to include DMG, ZIP and appcast. Existing signed ZIP and appcast asset IDs/digests were unchanged. Public DMG and checksum downloads matched local bytes; all three checksums passed. Evidence: ignored `artifacts/dmg-v031-verification.log` and `release-v031-dmg-assets.json`.
- Synced website release metadata: both primary download buttons now use DMG, the secondary ZIP link remains, download metadata identifies DMG/7.8 MB, and both installation answers explain DMG with ZIP as an alternative.
- Type check: zero errors/warnings/hints. Three scoped content/release tests passed. Production-prefix build and bilingual resource verification passed (14 routes/assets).
- Scoped Chrome checks passed in both languages: system and saved Light/Dark themes, theme icon click/keyboard/reload, primary DMG/backup ZIP URLs, full-resolution asset hash, desktop/mobile artwork sizing, zoom/original link/Escape/focus restoration, screenshot dialog isolation, and 320/390px no-overflow layouts. No browser or resource errors. Evidence: ignored `artifacts/icon-dmg-local.json`, `icon-dmg-check.mjs` and `icon-showcase-*.png`.
- No full website or native-app regression, actual installation, Apple notarization or Safari/physical-device testing was performed. Publication verification follows below.
