# Quickstart Validation: Tailwind CSS Integration

**Feature**: Tailwind CSS integration for the CIIT Virtual Campus Tour
**Date**: 2026-10-26
**Plan**: [plan.md](./plan.md) | **UI contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

This guide validates the feature end to end. It describes commands and expected outcomes, not implementation code.

## Prerequisites

- Node.js LTS and npm.
- Repository at `F:\web-projects\ciit-virtual-campus-tour`.
- Frontend dependencies installed.
- Maintainer approval to add `tailwindcss` and `@tailwindcss/vite`, recorded in `docs/tech_stack.md`.
- A modern browser with developer tools for viewport, network, motion, zoom, and forced-colors checks.
- A camera or screenshot method to capture the visual baseline before implementation.

The backend is not required for styling validation. The tour is designed to remain usable from the frontend's static catalog.

## 1. Capture the Baseline Before Implementation

Run from the repository root:

```powershell
npm run lint
npm run build
```

Record the production CSS sizes. The expected pre-change baseline is:

```text
apps/frontend/dist/assets/index-*.css             ~8.17 kB raw / ~2.56 kB gzip
apps/frontend/dist/assets/PanoramaViewer-*.css    ~0.95 kB raw / ~0.48 kB gzip
Total                                             ~9.12 kB raw / ~3.04 kB gzip
```

Capture screenshots of every surface at:

- 1440x900 desktop
- 1024x768 desktop threshold
- 700x800 narrow
- 560x800 tiny
- 375x667 mobile
- 320x568 minimum width

Include sidebar open and closed, gallery open, narration collapsed and expanded, loading, panorama-unavailable, tour error, and fatal-error states. Keep these as the visual baseline.

Also record the baseline test status:

```powershell
npm run test
```

Expected current result: failure because Vitest is not installed and the test tooling is deferred. This is a pre-existing condition. Do not install deferred test packages without a separate approval.

## 2. Install the Approved Tailwind Toolchain

After updating `docs/tech_stack.md`, run:

```powershell
npm install --prefix apps/frontend --save-dev tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
```

Expected outcome:

- `apps/frontend/package.json` lists both packages under `devDependencies`.
- `apps/frontend/package-lock.json` is updated.
- No backend package changes.

Run an audit check per the constitution:

```powershell
npm audit --prefix apps/frontend
```

Do not run `npm audit fix` if it would introduce unapproved package upgrades; report findings first.

## 3. Start the Application

Frontend only:

```powershell
npm run dev --prefix apps/frontend
```

Or the documented full application, if the backend environment is configured:

```powershell
npm run dev
```

Open the local Vite URL. The tour should load and the header, sidebar, panorama area, narration panel, and gallery should be styled from the first meaningful paint.

## 4. Validate the Build and Stylesheet Boundary

```powershell
npm run lint
npm run build
```

Expected outcomes:

- Lint passes with zero errors.
- The production build succeeds.
- `apps/frontend/dist/assets/` contains the application CSS.
- No component CSS chunk remains.
- The production CSS contains the conditional classes used by the UI, including current-location, disabled, open/closed, and responsive states.
- No source file under `apps/frontend/src` imports a component `.css` file, and `apps/frontend/src/App.css` no longer exists.

Inspect the generated CSS:

```powershell
Get-ChildItem "apps/frontend\dist\assets\*.css" | Select-Object Name, Length
Select-String -Path "apps/frontend\src\**\*.jsx" -Pattern "\.css"
```

Expected: only `src/index.css` is imported from `src/main.jsx`; no component imports remain.

## 5. Measure the Compressed CSS Budget

Use Node to measure gzip output:

```powershell
node -e "const fs=require('fs'),z=require('zlib'),p='apps/frontend/dist/assets';let t=0;for(const f of fs.readdirSync(p).filter(f=>f.endsWith('.css'))){const b=fs.readFileSync(p+'/'+f);const g=z.gzipSync(b,{level:9}).length;t+=g;console.log(f,'raw='+b.length,'gzip='+g)}console.log('total gzip='+t)"
```

Expected outcome depends on the SC-009 decision:

- If SC-009 remains at a 10 percent cap, the maximum is 3,339 bytes gzip. The research measurement shows this is infeasible for a utility-first migration.
- If the recommended revision is approved, the maximum is 6,000 bytes gzip and the implementation target is 5,000 bytes gzip.

Measured result: **20,901 bytes raw / 4,671 bytes gzip**. This is within the
recommended 5,000-byte target and 6,000-byte maximum, but it does not meet the
original 3,339-byte SC-009 cap. Do not mark the feature complete until the
SC-009 decision is recorded.

## 6. Validate the Visual Baseline

Compare each surface against the captured baseline.

### Desktop

- 1440x900: header, brand, current location, sidebar rail, panorama, narration, and gallery match the baseline.
- 1024x768: desktop layout remains intact at the `lg` threshold.
- Sidebar open/closed transitions do not shift the tour body unexpectedly.
- Gallery opens centered with the backdrop; the image grid and captions match.
- Narration panel remains bottom-centered with the transcript scroll area.

### Mobile and narrow viewports

- 700x800: sidebar is a drawer; the backdrop appears; panorama instructions move to the bottom; narration spans the bottom edge.
- 560x800: brand name hides; toolbar compacts; gallery becomes full-screen.
- 375x667: no horizontal scrolling; every control is reachable; long location names truncate.
- 320x568: minimum width; no overlap or clipping.
- Landscape phone: header, drawer, panorama, and narration remain usable.

### Loading and error states

- Loading shows the spinner and status message with the baseline styling.
- A missing panorama shows the centered unavailable panel.
- A failed catalog shows the tour error state and retry action.
- An unexpected render error shows the fatal-error surface and reload action.

## 7. Validate Keyboard and Assistive Behavior

1. Press Tab from the top of the page. The skip link appears first.
2. Continue tabbing. Every control shows a visible focus indicator.
3. Open the sidebar with the menu button. Press Escape; the sidebar closes.
4. Focus the panorama and use the arrow keys, plus, and minus. The view rotates and zooms.
5. Open the gallery. Focus moves to the close button. Press Escape; focus returns to the trigger.
6. Open and close the transcript. The button's `aria-expanded` state matches the transcript visibility.
7. Trigger blocked or failed narration. The appropriate notice appears and the status live region announces the state.
8. Confirm the accessible names of all controls are unchanged from the baseline.

## 8. Validate Accessibility Preferences

- Emulate `prefers-reduced-motion: reduce`. Non-essential transitions and the spinner animation are effectively removed.
- Zoom the browser to 200 percent. Content does not overlap or become unreachable.
- Emulate forced-colors mode. Text, borders, focus indicators, and controls remain distinguishable.
- Confirm text and controls meet readable contrast against their surfaces.

## 9. Validate the Panorama After Load

- Load a featured location and wait for the panorama to finish.
- Confirm the canvas fills the viewer and is not clipped.
- Drag with the mouse and swipe on a touch viewport. The view rotates.
- Confirm the instruction overlay does not block interaction.
- Switch locations and confirm the previous viewer is destroyed and the new scene loads.
- Stop the backend and reload the frontend. The tour remains styled and the static content remains usable.

Current result: the viewer canvas fills its section and no runtime errors occur,
but the bundled placeholder panorama tiles are missing, so the viewer renders
black and visible rotation/zoom cannot be confirmed. This is the same content
gap reported by `verify:content`.

## 10. Run Repository Content and Ignore Checks

```powershell
npm run verify:content
npm run verify:ignore
```

Expected: both pass. No tour content, media, secrets, environment values, or backend configuration changes are part of this feature.

Current result: `verify:ignore` passes. `verify:content` fails because the
catalog's panorama tile template matches no file and
`/panoramas/placeholder/narration.wav` is missing. These are pre-existing content
gaps; no content or media was changed by this feature.

## 11. Known Blockers and Decisions

| Item | Current state | Required action |
|------|---------------|-----------------|
| SC-009 10 percent CSS cap | Measured 4,671 bytes gzip; the original 3,339-byte cap is not met, but the recommended 5,000-byte target and 6,000-byte maximum are met | Approve the recommended revision or accept a documented deviation |
| Frontend test execution | `npm run test` fails because Vitest is not installed and the tooling is deferred | Approve the deferred test stack separately, or accept lint, build, and manual verification for this styling change |
| Tour content assets | `verify:content` fails on a missing panorama tile asset and narration audio | Add the assets or update the catalog in a separate content task |
| Visual regression tooling | No approved visual-regression tool | Use the captured screenshot baseline and the manual matrix in this guide |
| Small-viewport screenshots | Chrome headless `--window-size` can clamp viewports below ~500px | Capture 320/375 screenshots through DevTools device metrics instead |

## 12. Completion Checklist

- [x] Both packages are declared and documented.
- [x] The Vite plugin is registered.
- [x] `src/index.css` contains Tailwind imports, tokens, and the curated base layer.
- [x] All components use utilities and all component CSS files are deleted.
- [x] `docs/styling.md` is complete.
- [x] Lint and build pass.
- [x] Tests pass or the pre-existing blocker is recorded. (Recorded as blocked.)
- [x] Desktop, mobile, keyboard, reduced-motion, zoom, forced-colors, and offline checks pass.
- [ ] The panorama remains interactive. (Canvas sizing and handlers verified; visible rotation is blocked by missing tiles.)
- [ ] The CSS budget is approved and met. (Recommended budget met; SC-009 approval pending.)
- [ ] `verify:content` and `verify:ignore` pass. (`verify:ignore` passes; `verify:content` has pre-existing missing assets.)
