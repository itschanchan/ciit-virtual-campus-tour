# Research: Floor Gallery Placeholder Images

**Feature**: `016-gallery-placeholder-images`
**Date**: 2026-11-10

## Purpose

Resolve the implementation choices for giving every accessible floor three placeholder gallery images so the existing left and right controls can be tested. All specification clarifications are already resolved; this document records decisions and rejected alternatives.

## Findings Summary

- The per-floor gallery loader `apps/frontend/src/lib/floorGallery.js` reads files from `apps/frontend/src/assets/gallery/<floor>/`. All of those folders currently contain only `.gitkeep`.
- `apps/frontend/src/pages/Panorama.jsx` prefers floor-gallery files and falls back to `currentLocation.gallery` from `catalog.json`.
- Each catalog location currently has one gallery image, so the Gallery renders no controls in the real tour.
- `apps/frontend/src/components/RoomGallery.jsx` already implements the previous and next buttons, wrap-around, ArrowLeft/ArrowRight navigation, the `current / total` counter, accessible control names, and the single-image hidden state.
- `apps/frontend/src/tests/RoomGallery.test.jsx` already covers the controls with a three-image fixture.
- Baseline during planning: `npm --prefix apps/frontend run test` passes with 8 files and 85 tests.

## Decision 1: Source of the placeholder content

**Decision**: Put the placeholders in the static catalog as three gallery entries per location, referencing three shared SVG files under `apps/frontend/public/panoramas/placeholder/`.

**Rationale**:

- `catalog.json` is the project's documented gallery content source, and the existing Gallery already reads it.
- The alternative gallery loader is empty and is intended to override catalog content when real floor images arrive, so leaving it untouched preserves that override path.
- Media stays under `apps/frontend/public/panoramas/`, matching the repository's documented media location.
- No code change is required to render the new images, so the feature stays small and low risk.

**Alternatives considered**:

- *Add three images to each `src/assets/gallery/<floor>/` folder (27 files).* Rejected because the existing loader glob excludes SVG, so it would require a code change, and it would place media outside the documented `public/panoramas/` location.
- *Generate three placeholder entries in `floorGallery.js` at runtime.* Rejected because it creates implicit content that is not visible in the catalog and makes the gallery behavior harder to reason about and test.
- *Reuse the existing `equirect.svg` three times.* Rejected because the three images would look identical, making swap testing ambiguous and failing the distinguishability requirement.

## Decision 2: Placeholder asset format and design

**Decision**: Create three 16:10 SVG placeholders with distinct color palettes, large numerals 1/2/3, and accessible `<title>`/`<desc>` elements.

**Rationale**:

- SVG is already used for the panorama placeholder, so no new asset tooling or dependency is needed.
- Vector assets are small and render crisply at every viewport.
- Distinct color and a large numeral make image changes obvious even in a small Gallery.
- The 16:10 ratio matches the Gallery's `aspect-16/10` presentation in `RoomGallery.jsx`.

**Alternatives considered**:

- *Raster images.* Rejected because no source photos exist and binary assets cannot be reviewed or edited as text in this repository.
- *One shared image with different captions only.* Rejected because the image itself must visibly change for a swap test.

## Decision 3: Left and right controls

**Decision**: Retain the existing controls and add coverage rather than reimplement them.

**Rationale**:

- Both controls already exist, are placed on the left and right of the active image, and are hidden for single-image galleries.
- Wrap-around, keyboard navigation, the counter, and accessible labels are already implemented.
- Duplicating the controls would violate the specification's requirement to retain existing behavior and would create two sources of truth.

**Alternatives considered**:

- *Create a new carousel component.* Rejected as unnecessary scope and duplication.

## Decision 4: Data shape and validation

**Decision**: Use three catalog gallery entries with `order` values 0, 1, and 2 per location, each with a non-empty `src`, `alt`, and `caption`.

**Rationale**:

- The existing validator requires unique non-negative integer orders and non-empty source and alternative text.
- Contiguous orders produce a predictable `1 / 3`, `2 / 3`, `3 / 3` sequence.
- Floor-specific alt text and captions satisfy the accessibility requirement without changing the shared image files.

**Alternatives considered**:

- *Add a catalog schema field for placeholder status.* Rejected because it would expand scope and the schema. Captions and alt text already communicate that the content is a placeholder.

## Decision 5: Test strategy

**Decision**: Add one catalog content test and one Gallery integration test, and leave the existing `RoomGallery` tests in place.

**Rationale**:

- The catalog test locks the "three images on every floor" invariant.
- The integration test proves that real tour data produces a working three-image swap through the existing trigger and controls.
- Existing component tests already cover wrap-around, arrow keys, counter, single-image hiding, and focus behavior, so duplicating them adds no value.

**Alternatives considered**:

- *Only add component tests.* Rejected because they use fixtures and would not catch a floor missing placeholder content.
- *Only add catalog tests.* Rejected because they would not prove the controls wire up to the real content end to end.

## Known Pre-existing Issue

`npm run verify:content` currently fails before any content check because `scripts/verify-content.mjs` expects `specs/001-campus-tour-foundation/contracts/content-schema.json`, which does not exist in this checkout. This feature does not change that script or the missing schema. Verification will rely on the frontend test suite, lint, build, and manual checks, and the blocker will be reported as pre-existing.
