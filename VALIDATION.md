# Website validation — 2026-10-22

## v0.4.1 release download update — 2026-10-23

- After publishing the native v0.4.1 GitHub Release and verifying all four public assets plus the Latest appcast endpoint, ran `npm run release:sync`. Primary buttons now use the 7,790,487-byte universal DMG; ZIP, release notes and checksums point to the same immutable v0.4.1 tag. The earlier 晦明 rebrand and v0.4.1 screenshots are included in this push.
- Targeted download-metadata test: 1 passed. Production project-path build and both language routes/14 local routes/assets passed. Logs: `artifacts/release-0.4.1/tests.log`, `build.log`, `paths.log`.
- Four local Chrome combinations (zh-CN/en × light/dark) passed: new brand and slogan, v0.4.1/7.8 MB release text, both primary DMG links, matching localized gallery assets/zoom, language switching, and no overflow at 320/390/1440px. No page errors or local HTTP failures. Evidence: `artifacts/release-0.4.1/browser-local.json`.
- Deployed commit `7cdcfe4a4e221f0372b0a32cdf541f34e9e49b34` through GitHub Pages run [39894985752](https://github.com/frank-yf/auralim-site/actions/runs/39894985752); build and deploy both succeeded. The preceding 晦明 rebrand commit `fd4dfd6` is included.
- Live verification at https://frank-yf.github.io/auralim-site/ and `/en/` passed the same four language/theme cases, including both primary v0.4.1 DMG links, v0.4.1/7.8 MB version text, gallery localization/zoom, language switching and responsive widths. No page exceptions or local-origin HTTP failures. Evidence: `artifacts/release-0.4.1/browser-live.json`.
- All 11 published PNG assets (icons, social card, eight localized light/dark menu/settings captures) returned HTTP 200 and matched local SHA-256. Evidence: `artifacts/release-0.4.1/live-assets.json`. No unrelated global regression tests were run.

## Chinese rebrand to 晦明 / native v0.4.1 — 2026-10-23

- Updated the Chinese name to 晦明 in the header, hero demo, page/OG title, image descriptions, FAQ, download copy and footer. Chinese slogan: 晦明变化，循日而行。 English name and slogan remain Auralim / Between light and dark.
- Replaced the eight previous v0.3.1 menu/settings screenshots with real v0.4.1 light/dark captures in Simplified Chinese and English. Source: native commit `e259bc3b84c86f01c935afd49b45b151d5a38600`, build 29. Temporary preferences, fixed example dates, mock appearance/location/login services and an unstarted updater prevent user data or permission/network side effects. The screenshot captions and metadata now identify v0.4.1.
- Updated both SVG source and PNG social card. Public download metadata remains v0.3.2; this change does not publish a v0.4.1 installer or Release.
- `npm run check`: 0 errors, warnings or hints. `SITE_BASE=/auralim-site npm run build` succeeds; `node scripts/check-built-site.mjs /auralim-site/` verifies both language routes and 14 unique local routes/assets. Logs: `artifacts/branding-0.4.1/build.log`, `paths.log`.
- Targeted Chrome checks on the existing local preview passed four locale/theme combinations (zh-CN/en × light/dark): new names and exact slogans/titles, localized v0.4.1 gallery assets and dimensions, zoom, language navigation, unchanged public download links, and no horizontal overflow at 320/390/1440px. No page exceptions or local HTTP errors. Evidence: `artifacts/branding-0.4.1/browser.json` and corresponding hero/gallery screenshots.
- Visually inspected the new Chinese hero and social card, along with the native Simplified Chinese light and Traditional Chinese dark settings captures. No unrelated offset or animation regression suite was run. This is a local source/build update; no push, GitHub Pages deployment or live-site verification was performed.

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


### Artwork, theme icons and DMG live verification

- [Pages run 39777893668](https://github.com/frank-yf/auralim-site/actions/runs/39777893668) built and deployed `06e133d79eae9e71cd499ac9c0f0524b802e5f93` successfully.
- Public Chinese/English checks passed for system and saved Light/Dark preferences: Sun/Moon icon state, mouse/keyboard/reload, both primary DMG URLs and ZIP fallback, full-resolution icon sizing, square zoom/original link, Escape/focus restoration, screenshot preview isolation and mobile no-overflow layouts. The public artwork hash matches the original native artwork; there were no page/resource errors.
- Evidence: ignored `artifacts/icon-dmg-live.json` and showcase/zoom screenshots. The DMG and updated checksum manifest were also downloaded publicly and compared byte-for-byte with verified local artifacts. This documentation-only update does not redeploy Pages.


## Moon animation edge fix — 2026-10-22

- Replaced the overlapping even-odd circles and outer circular clip with one continuous crescent contour, matching the native app fix. The moon glow, orbit, timing and theme-switch behavior remain unchanged.
- Type check, production build, bilingual resource validation and the scoped sun/moon orbit test passed.
- Chrome pixel regression compared the old and new contours at radii 10, 39.52 and 52 CSS pixels, each at 1x and 2x. The old contour produced 19–257 residual cutout pixels; the new contour produced zero in all six cases, with the crescent body retained.
- Local production-browser verification passed for Chinese/English and light/dark modes: theme animation drawing and direction, rapid replacement/cleanup, keyboard activation, reduced motion, saved theme reload, gallery synchronization and mobile widths. Unrelated app tests were not run.


## Native offset symbols — 2026-10-22

- Matched the “Make a little adjustment / 试着调一调” controls to native OffsetControl: `sunrise.fill` and `sunset.fill` in 28px rounded badges, with the exact DuskStyle gold/blue light and dark palettes. Direction hints now use `sun.max.fill` and `moon.fill`.
- Exported transparent 4x SF Symbol masks with `swift scripts/export-native-symbols.swift`; the shared NativeSymbol component applies theme-aware colors and preserves the GitHub Pages base path. Other website icons were left unchanged.
- Type check, production build and bilingual resource checks passed. Chrome verified both locales and themes, symbol names, exact colors, 28px badges, all mask asset responses, 320px layout, minute entry and reset. Reviewed light/dark screenshots under `artifacts/offset-symbols-*`. Native application code was unchanged.


## v0.3.2 release synchronization — 2026-10-22

- Published native v0.3.2 (build 27, commit `0214be995bd111c5924907920e3e0e6ac35babfb`) as GitHub Latest with universal DMG (7,782,140 bytes), Sparkle ZIP (7,709,416 bytes), signed appcast.xml and SHA256SUMS.txt. DMG contents were mounted and compared to the ZIP; both app architectures, code signatures and Sparkle EdDSA signatures passed.
- Downloaded all four public assets and matched their hashes against the local artifacts. Verified the stable Latest appcast endpoint advertises 0.3.2/build 27 and the immutable v0.3.2 ZIP URL.
- Ran release:sync against the published Latest release. Chinese and English pages now advertise v0.3.2, with the DMG as the main download and updated ZIP, release-note and checksum links. The screenshot captions retain their actual capture version.
- The scoped release metadata test, type check, production build and bilingual route/resource checks passed. This publication reused the 23 passing native tests recorded for the unchanged release commit; no full regression or update-installation test was run.

## v0.5.1 release and sky transition — 2026-10-29

- Synced download metadata to the published native v0.5.1 Release. Both primary downloads use the standard universal DMG; the standard ZIP and checksum links remain available. The release also contains a separate debug archive. Exact filename and release-path selection prevents that archive from becoming the normal website download.
- The website completes the 3.2-second transition before committing its theme. Feathered night/day sky, glowing sun and moon, cached blur masks and enlarged desktop coverage are included. Mobile uses full-width coverage over the lower two-thirds of the viewport and horizontal side entry/exit. Existing screenshots retain their actual v0.4.1 capture labels.
- Three targeted release-selection tests and the current-download metadata test passed. Four scoped orbit/body/download tests passed; Astro check reported zero errors, warnings or hints. The production-prefix build and bilingual route/resource checks passed (14 unique routes/assets).
- Deployment and live verification are performed after pushing this commit. No full website or unrelated native regression was run. Release evidence is retained in ignored artifacts/release-0.5.1/ directories in the two repositories.

## v0.5.2 offset direction and release — 2026-10-30

- Published native v0.5.2/build 31 from `02544664d3dfaec97eee6f782f3e2420433fe0f0`. The standard universal DMG/ZIP, signed appcast, SHA-256 manifest and separate universal debug ZIP/checksum are publicly available. All six public downloads and the Latest appcast match the locally verified release. Both architectures, minimum macOS 13 target, strict signatures, DMG/ZIP contents and Sparkle EdDSA signatures passed packaging checks; the packages remain ad-hoc signed and not notarized.
- Corrected both example sliders to earlier on the left and later on the right, matching the native signed minute fields and switch times. Sunrise's sun side means later; sunset's sun side means earlier. Direction hints show only Earlier / Later, with sun/moon icons using native endpoint colors in light and dark themes. The FAQ explains that manual Light/Dark choices bypass the countdown, while automatic schedules retain it.
- Replaced the active gallery captures with eight v0.5.2 native SwiftUI renders: Simplified Chinese/English, light/dark settings and menu. These use temporary example preferences, Shanghai and fixed dates, with fake appearance/location/login services. Capture metadata records the exact native source commit; user preferences and global appearance were not changed.
- Six scoped offset/input/gradient/copy tests, four download/standard-asset-selection checks, Astro type checking (zero errors/warnings/hints), the production-prefix build and bilingual local route/resource checks passed.
- Eight local Chrome cases passed across both languages/themes and desktop/mobile: real slider mouse drags, keyboard/Option-arrow steps, signed input previews and commit, adjusted switch times, reset, concise hints, exact endpoint icon colors, current download links and v0.5.2 gallery language/theme matching. No page/resource errors or horizontal overflow. Evidence: ignored artifacts/release-0.5.2/ in both repositories. No full regression, actual upgrade installation, Apple silicon/minimum-OS hardware or Safari/device tests were performed.
- GitHub Pages deployment and live checks follow this commit; their results are recorded in the ignored live-browser/live-resources artifacts after deployment.


## Current-source product documentation — 2026-10-30

- Reorganized the native English and Chinese READMEs around current product behavior, installation, offsets, animation/countdown triggers, location/privacy, updates and development. Website copy now reflects manual Light/Auto/Dark countdown bypass, the one-second animation hold, manual-by-default updates, five-second location acquisition, cache-first display and bounded network recovery. The Chinese slogan uses the Ouyang Xiu quotation.
- Replaced all eight active menu/settings screenshots with renders from native v0.5.3/build 32, commit `4c855f26440e887696b217056bcd2f9d5523b691`. The standalone capture uses isolated preferences, fixed Shanghai example dates and mocked appearance/location/login services; the updater is not started. Settings content is 600 × 640 and menu content is 320 × 188. Capture sources and evidence remain in ignored `artifacts/current-features-0.5.3/`.
- Both language routes explicitly distinguish the unreleased v0.5.3 source preview from public v0.5.2 downloads. `release.json`, normal DMG/ZIP URLs and release assets were not changed. Gallery provenance records the actual source independently of public download metadata.
- Astro checking reported zero errors/warnings/hints. Website logic/content checks and the production-prefix build passed; the static checker verified both routes and 14 unique local routes/assets under `/auralim-site/`. Local README file links and both Git patches passed validation. Preview commands now pass the same `SITE_BASE` used for building.
- Twelve local Chrome cases passed: Chinese/English × light/dark × 1440/390/320px. Checked new copy/version context, standard v0.5.2 download URLs, all eight locale/theme screenshots and their dimensions, initial and subsequent gallery/theme synchronization, zoom/Escape and horizontal overflow. Reviewed rendered native captures and the responsive page. No page/resource errors occurred. The longer Chinese hero quotation was resized to fit its column.
- This is a local documentation/site update. No native behavior changed, no native regression was run, and nothing was committed, pushed, published or deployed. Browser verification does not constitute Safari, device or public-site validation.


## v0.5.3 release and product refresh — 2026-10-30

- Published native v0.5.3 / build 32 with tag `v0.5.3` at `2156a15`, including the previously committed implementation and reorganized bilingual READMEs. Standard universal DMG/ZIP, signed appcast, standard checksums and separate universal debug ZIP/checksums are public. All six anonymous downloads match the verified local hashes; the Latest signed feed advertises v0.5.3 / build 32 and the standard archive.
- Synchronized `release.json` only after that public verification. Both primary downloads now select the standard v0.5.3 DMG (8,147,834 bytes); ZIP, notes and checksums match the same release. Converted the source-preview labels to current product/interface descriptions. The version-context note is absent because the public release and native captures both use 0.5.3; the mechanism remains for future mismatches.
- Published content includes the Chinese Ouyang Xiu slogan, cached location with a five-second deadline and bounded network recovery, manual mode selections bypassing countdowns, animation final-frame hold and manual-by-default software updates. The eight locale/theme captures retain their verified implementation provenance from native commit `4c855f2`; the release adds documentation without changing that implementation.
- Seven focused content/download-selection checks passed. Astro checking reported no errors, warnings or hints; the production-prefix build and bilingual route/resource checker passed. Twelve local Chrome cases passed across Chinese/English, light/dark and 1440/390/320px: release labels and URLs, all gallery languages/themes and dimensions, theme synchronization, zoom/Escape and overflow. No page or resource errors. Evidence is in ignored `artifacts/release-0.5.3/`.
- This commit triggers the existing GitHub Pages workflow. Deployment and live results are recorded in ignored `deployment.json` and `live-browser.json` once completed; local results alone are not public-site evidence. No unrelated native regression, real upgrade installation, Apple silicon/minimum-OS hardware, Safari or device tests were repeated. Native packages remain ad-hoc signed and not Apple notarized.
