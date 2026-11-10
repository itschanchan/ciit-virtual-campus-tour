# Quickstart: Floor Gallery Placeholder Images

**Feature**: `016-gallery-placeholder-images`
**Date**: 2026-11-10

## Prerequisites

- Node.js and npm installed.
- Dependencies installed from the repository root:
  - `npm install`
  - `npm run setup`
- Backend environment is not required for gallery validation, but the full app can be started with `npm run dev`.

## Run the application

From the repository root:

```bash
npm run dev
```

Open the frontend URL printed by Vite (typically `http://localhost:5173`). If the frontend alone is needed:

```bash
npm --prefix apps/frontend run dev
```

## Manual validation

### 1. Three images on every accessible floor

For each floor in the location menu — LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, and 9F:

1. Select the floor.
2. Activate "View gallery".
3. Confirm the Gallery opens with the first placeholder image and the counter reads `1 / 3`.
4. Confirm both a left ("Previous image") and a right ("Next image") control are visible.
5. Confirm the image, caption, and alt text identify the floor and the placeholder position.

Expected: every floor shows three distinct placeholder images. Locked floors (1F, 2F, 3F, 10F, 11F) are not expected to open a Gallery.

### 2. Swap with the buttons

With any floor's Gallery open:

1. Activate "Next image" once. Expected: second image and `2 / 3`.
2. Activate "Next image" again. Expected: third image and `3 / 3`.
3. Activate "Next image" again. Expected: wrap to the first image and `1 / 3`.
4. Activate "Previous image". Expected: wrap to the third image and `3 / 3`.
5. Continue with "Previous image" to reach the second and first images.

Expected: every activation changes the image, caption, and counter together with no mismatch.

### 3. Swap with the keyboard

1. Open the Gallery with the keyboard.
2. Press ArrowRight. Expected: same behavior as "Next image".
3. Press ArrowLeft. Expected: same behavior as "Previous image".
4. Press Tab and Shift+Tab. Expected: focus remains inside the Gallery and every control shows a visible focus indicator.

### 4. Responsive spot check

Run the checks at representative widths:

- Mobile: 320px and 375px, including landscape orientation.
- Tablet: around 768px.
- Desktop: 1024px and 1440px.

Expected:

- Both navigation controls remain visible and reachable.
- The controls do not cover the placeholder numeral or caption.
- No horizontal scrolling appears.
- Existing sidebar behavior on mobile still hides the Gallery while the sidebar is open.

### 5. Preserved behavior

1. Close the Gallery with the close control, the backdrop, and Escape.
2. Confirm focus returns to the "View gallery" trigger.
3. Change floors while the Gallery is open and confirm the Gallery closes and the new floor loads.
4. Confirm panorama drag, sidebar navigation, and narration still work.

## Automated validation

From the repository root:

```bash
npm --prefix apps/frontend run test
npm run lint
npm run build
```

Expected:

- The frontend test suite passes, including the new catalog test (three images per location) and the Gallery swap integration test.
- Lint reports no errors.
- The production build succeeds.

## Known pre-existing issue

`npm run verify:content` currently fails before checking content because `scripts/verify-content.mjs` expects `specs/001-campus-tour-foundation/contracts/content-schema.json`, which is absent from this checkout. This is not caused by this feature. Do not report content verification as passing; use the catalog test and manual asset checks instead.

## References

- Specification: `specs/016-gallery-placeholder-images/spec.md`
- Plan: `specs/016-gallery-placeholder-images/plan.md`
- Data model: `specs/016-gallery-placeholder-images/data-model.md`
- UI contract: `specs/016-gallery-placeholder-images/contracts/ui-contract.md`
