---
description: "Task list for Floor Gallery Placeholder Images"
---

# Tasks: Floor Gallery Placeholder Images

**Input**: Design documents from `specs/016-gallery-placeholder-images/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Required by spec FR-026 and SC-008/SC-012, and by the project constitution's test-first gate. Write the new tests before the content change and confirm they fail first.

**Organization**: Tasks are grouped by user story. User Story 1 delivers the three-image content; User Story 2 verifies the button swap; User Story 3 verifies keyboard swap.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `apps/frontend/src/`, `apps/frontend/public/`
- Tests: `apps/frontend/src/tests/`
- Feature docs: `specs/016-gallery-placeholder-images/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing project state before changing content.

- [X] T001 Run `npm --prefix apps/frontend run test` using `apps/frontend/vitest.config.js` and record the baseline result in the implementation notes (expected: 8 test files and 85 tests pass)
- [X] T002 [P] Confirm the placeholder asset directory `apps/frontend/public/panoramas/placeholder/` exists and currently contains `equirect.svg`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the three shared placeholder assets needed by every user story.

**⚠️ CRITICAL**: The catalog content and the swap validation both depend on these assets.

- [X] T003 [P] Create the 16:10 SVG placeholder with a blue/teal palette, a large "1", and `<title>`/`<desc>` elements in `apps/frontend/public/panoramas/placeholder/gallery-1.svg`
- [X] T004 [P] Create the 16:10 SVG placeholder with an amber/orange palette, a large "2", and `<title>`/`<desc>` elements in `apps/frontend/public/panoramas/placeholder/gallery-2.svg`
- [X] T005 [P] Create the 16:10 SVG placeholder with a violet/pink palette, a large "3", and `<title>`/`<desc>` elements in `apps/frontend/public/panoramas/placeholder/gallery-3.svg`

**Checkpoint**: The three assets exist and are visually distinct.

---

## Phase 3: User Story 1 - Browse Three Placeholder Images on Every Floor (Priority: P1) 🎯 MVP

**Goal**: Every accessible floor's Gallery contains exactly three distinguishable placeholder images with floor-specific alternative text and captions.

**Independent Test**: Open the Gallery from each accessible floor and confirm three images, the first image shown, and a `1 / 3` counter.

### Tests for User Story 1

- [X] T006 [P] [US1] Add a failing test in `apps/frontend/src/tests/catalog.test.js` asserting every location has exactly three gallery entries with orders `0, 1, 2`, non-empty `alt` and `caption`, and distinct `src` values; run it and confirm it fails

### Implementation for User Story 1

- [X] T007 [US1] Replace each of the nine location `gallery` arrays in `apps/frontend/src/lib/catalog.json` with three entries referencing `gallery-1.svg`, `gallery-2.svg`, and `gallery-3.svg`, using floor-specific `alt` and `caption` text (depends on T003, T004, T005, T006)
- [X] T008 [US1] Run `npm --prefix apps/frontend run test -- src/tests/catalog.test.js` and confirm the new test now passes

**Checkpoint**: User Story 1 is complete. Every accessible floor has three images, and the existing controls appear automatically because the image count is greater than one.

---

## Phase 4: User Story 2 - Swap Images With Left and Right Controls (Priority: P1)

**Goal**: The existing left and right controls swap through the real three-image floor content and wrap at both ends.

**Independent Test**: Open the Gallery on a floor with three images, activate "Next image" and "Previous image" repeatedly, and confirm the image and counter change correctly and wrap.

### Tests for User Story 2

- [X] T009 [US2] Add an integration test in `apps/frontend/src/tests/Layout.test.jsx` that opens the Gallery for the default location, confirms `1 / 3`, advances to `2 / 3` and `3 / 3`, wraps to `1 / 3`, and goes back to `3 / 3` with "Previous image" (depends on T007)
- [X] T010 [US2] Confirm the existing control coverage in `apps/frontend/src/tests/RoomGallery.test.jsx` still passes and covers button navigation, wrap-around, and single-image hiding

### Implementation for User Story 2

- [X] T011 [US2] Verify the "Previous image" and "Next image" controls in `apps/frontend/src/components/RoomGallery.jsx` satisfy the UI contract (placement, accessible names, hidden when `imageCount <= 1`, synchronized caption and counter); patch only a verified gap, otherwise leave the component unchanged

**Checkpoint**: User Story 2 is complete. Button swapping works against the real three-image content.

---

## Phase 5: User Story 3 - Swap Images With the Keyboard (Priority: P2)

**Goal**: ArrowLeft and ArrowRight navigate the three placeholder images while the Gallery is open.

**Independent Test**: Open the Gallery with the keyboard, press the arrow keys, and confirm the image and counter update without leaving the Gallery.

### Tests for User Story 3

- [X] T012 [US3] Add an integration test in `apps/frontend/src/tests/Layout.test.jsx` that opens the Gallery and uses ArrowRight and ArrowLeft to change the image and counter (depends on T009 because both edit the same file)

### Implementation for User Story 3

- [X] T013 [US3] Verify the keyboard handler in `apps/frontend/src/components/RoomGallery.jsx` navigates only when more than one image exists and keeps focus inside the Gallery; patch only a verified gap, otherwise leave the component unchanged

**Checkpoint**: User Story 3 is complete. Button and keyboard swapping behave consistently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature and report gate status honestly.

- [X] T014 [P] Run `npm run lint` using `apps/frontend/eslint.config.js` and confirm there are no errors
- [X] T015 [P] Run `npm run build` using `apps/frontend/vite.config.js` and confirm the production build succeeds
- [X] T016 Run the `specs/016-gallery-placeholder-images/quickstart.md` manual matrix across LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, and 9F, including mobile, tablet, and desktop widths
- [X] T017 Record in the implementation notes that `npm run verify:content` remains blocked by the pre-existing missing `specs/001-campus-tour-foundation/contracts/content-schema.json`; do not claim it passed
- [X] T018 Review `git diff` for `apps/frontend` and confirm only the three new assets, `apps/frontend/src/lib/catalog.json`, and the two test files changed; confirm no backend, dependency, or unrelated component changes were introduced

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; runs first.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers the content for US2 and US3.
- **User Story 2 (Phase 4)**: Depends on US1 for its real-content integration test; its component-level checks are otherwise independent.
- **User Story 3 (Phase 5)**: Depends on US1 for its real-content integration test and on US2 because T009 and T012 edit the same test file.
- **Polish (Phase 6)**: Depends on all desired user stories.

### Task Dependencies

- T003, T004, T005 are independent of each other and can run in parallel.
- T006 is independent of the asset tasks and can run in parallel with T003-T005.
- T007 depends on T003, T004, T005, and T006.
- T008 depends on T007.
- T009 depends on T007.
- T010 is independent of content and can run after Setup.
- T011 has no code dependency but should follow T009 and T010 verification.
- T012 depends on T009 because both modify `Layout.test.jsx`.
- T013 can run alongside T012.
- T014 and T015 are independent of each other.
- T016, T017, and T018 follow the code and test work.

### Within Each User Story

- Write and run the failing test before changing content.
- Create assets before referencing them in `catalog.json`.
- Verify existing controls before changing them; prefer no component change.
- Re-run the affected test suite after each story.

---

## Parallel Opportunities

```bash
# Foundational assets (T003, T004, T005) can be created together:
Task: "Create gallery-1.svg in apps/frontend/public/panoramas/placeholder/"
Task: "Create gallery-2.svg in apps/frontend/public/panoramas/placeholder/"
Task: "Create gallery-3.svg in apps/frontend/public/panoramas/placeholder/"

# The failing catalog test can be written while the assets are created:
Task: "Add three-image-per-location test in apps/frontend/src/tests/catalog.test.js"

# Final quality gates:
Task: "Run npm run lint"
Task: "Run npm run build"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational assets.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Open the Gallery from several floors and confirm three images with the `1 / 3` counter. The existing controls should now be visible.
5. Deploy or demo if ready.

### Incremental Delivery

1. Setup + Foundational → assets ready.
2. User Story 1 → three images per floor → validate the visible content (MVP).
3. User Story 2 → verify real-content button swapping → validate.
4. User Story 3 → verify keyboard swapping → validate.
5. Polish → lint, build, responsive matrix, honest gate reporting.

### Notes

- `[P]` marks tasks that touch different files and have no unfinished dependency.
- `[US1]`, `[US2]`, and `[US3]` map directly to the three user stories in `spec.md`.
- No new dependency, backend change, or catalog schema change is expected.
- `RoomGallery.jsx` already implements the controls, wrap-around, arrow keys, counter, and single-image hiding; only patch a verified gap.
- Do not report `npm run verify:content` as passing while the pre-existing missing schema file remains.

---

## Implementation Notes

- **Baseline**: 8 test files and 85 tests passed before implementation.
- **Final tests**: 8 test files and 88 tests passed after adding the catalog and gallery integration tests.
- **Content**: All nine accessible locations now have exactly three gallery entries using the three new placeholder SVGs.
- **Automated viewport matrix**: Headless Edge validation passed 27/27 combinations: LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, and 9F at 320, 768, and 1440 CSS pixels. Each combination verified the `1 / 3` counter, image source changes, left/right control placement, controls within the viewport, no horizontal overflow, button wrap-around, keyboard wrap-around, and focus remaining on the Gallery close control.
- **Screenshots**: Mobile, tablet, and desktop screenshots were captured under `C:\Users\sodab\AppData\Local\Temp\opencode\gallery-shots`; they are temporary validation artifacts and are not committed.
- **Quality gates**: `npm run lint` and `npm run build` passed.
- **Known blocked gate**: `npm run verify:content` still fails before validating anything because the pre-existing `specs/001-campus-tour-foundation/contracts/content-schema.json` file is missing. This is not caused by feature 016 and must not be reported as passing.
- **Diff scope**: Feature 016 added `gallery-1.svg`, `gallery-2.svg`, `gallery-3.svg`, and updated `catalog.json`, `catalog.test.js`, and `Layout.test.jsx`. Other working-tree changes were already present from earlier features and were not introduced by this feature.
