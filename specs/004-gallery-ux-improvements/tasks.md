---

description: "Task list for improving the Gallery button and popup"
---

# Tasks: Improve Gallery Button and Popup

**Input**: Design documents from `/specs/004-gallery-ux-improvements/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Required. The specification requires existing Gallery tests to keep passing and new behavior to be covered. The repository configures Vitest, Testing Library, jest-dom, and jsdom, but those dev dependencies are currently undeclared and uninstalled. Restore them only after maintainer approval. Do not add runtime dependencies.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when the task touches a different file and has no dependency on an incomplete task
- **[Story]**: User story label (US1, US2, US3); setup, foundational, and polish tasks have no story label
- Every task names the exact file or directory it touches

## Path Conventions

- Web application: `apps/frontend/`
- Feature artifacts: `specs/004-gallery-ux-improvements/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the approved scope and make the existing test configuration runnable before writing feature tests.

- [x] T001 [P] Review `specs/004-gallery-ux-improvements/spec.md`, `specs/004-gallery-ux-improvements/plan.md`, `specs/004-gallery-ux-improvements/research.md`, `specs/004-gallery-ux-improvements/contracts/ui-contract.md`, and `specs/004-gallery-ux-improvements/quickstart.md`; confirm the always-mounted dialog, 44 by 44 targets, native focus restoration with `#tour-main` fallback, and no backend/runtime dependency changes
- [ ] T002 Confirm maintainer approval for the already-configured dev-only test tooling. The repository uses npm, and the frontend lockfile is `apps/frontend/package-lock.json`. If approved, add compatible versions of `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` to `apps/frontend/package.json` and install with npm so `apps/frontend/package-lock.json` is updated alongside it; do not create a new lockfile, change package managers, or modify unrelated dependencies. If not approved, record the blocked verification and do not install or modify dependencies
- [x] T003 [P] Add a feature-detected `HTMLDialogElement.showModal`/`close` shim to `apps/frontend/src/tests/setup.js` if needed; `close()` must remove the `open` attribute and tests must not depend on the shim emulating native focus restoration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the test baseline and confirm the focus fallback target before user story work begins.

**CRITICAL**: Complete this phase before starting user story implementation.

- [x] T004 [P] Confirm `apps/frontend/src/components/Layout.jsx` provides `#tour-main` with `tabIndex={-1}` and that `RoomGallery` receives `open={galleryOpen}` and `onClose={() => setGalleryOpen(false)}`; record any deviation
- [ ] T005 Run the existing frontend test suite after T002 and record the baseline result; if the test tooling is still unapproved or unavailable, stop and record that automated verification is blocked

**Checkpoint**: The test baseline is known and the focus fallback target is confirmed.

---

## Phase 3: User Story 1 - Open, Browse, and Close the Gallery Reliably (Priority: P1) MVP

**Goal**: Keep the existing Gallery journey reliable while converting it to an always-mounted native dialog that opens, displays the current location's images, and closes through every supported path.

**Independent Test**: Open the tour, activate "View gallery", confirm the current location's images appear in catalog order, close through the close control, backdrop, and Escape, change location while open, and confirm the tour remains usable.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [x] T006 [US1] Extend `apps/frontend/src/tests/RoomGallery.test.jsx` with tests that the dialog remains mounted but closed when `open` is false, can reopen, closes through the close button, backdrop, and `cancel`, renders images in `order`, handles missing `images`, and renders the image-failure fallback
- [x] T007 [P] [US1] Add `apps/frontend/src/tests/Layout.test.jsx` coverage that the trigger opens the mounted Gallery, the dialog closes on each supported close path, and a location change closes the Gallery

### Implementation for User Story 1

- [x] T008 [US1] Update `apps/frontend/src/components/RoomGallery.jsx` to always render `<dialog id="room-gallery">`, keep it mounted while closed, drive `showModal()`/`close()` from the component `open` prop without setting the DOM `open` attribute, and keep the dialog non-visible when `open` is false
- [x] T009 [US1] Update `apps/frontend/src/components/RoomGallery.jsx` to handle close-button, backdrop, and `cancel` closure exactly once, include the accessible "Gallery" name, and render the existing empty state
- [x] T010 [US1] Update `apps/frontend/src/components/RoomGallery.jsx` to default `images` to `[]`, memoize `order` sorting, add `decoding="async"`, preserve alt text and captions, and render a per-image error fallback keyed by image order

**Checkpoint**: User Story 1 works independently: the Gallery opens, browses, and closes reliably while remaining mounted when closed.

---

## Phase 4: User Story 2 - Use the Gallery with a Keyboard or Assistive Technology (Priority: P1)

**Goal**: Make the open Gallery modal accessible, keep focus contained, resolve the trigger's controls reference, and restore focus without competing with native dialog behavior.

**Independent Test**: Using only the keyboard, open the Gallery, confirm the trigger's `aria-controls` resolves, verify Tab and Shift+Tab stay inside, close through the close control, Escape, and backdrop, and confirm focus returns to the trigger or `#tour-main` when the trigger is gone.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [x] T011 [US2] Extend `apps/frontend/src/tests/RoomGallery.test.jsx` with focus tests for opening, closing through the close button, Escape/cancel, and backdrop; include a case where the invoking trigger is removed before close and focus must fall back to `#tour-main`
- [x] T012 [P] [US2] Extend `apps/frontend/src/tests/Layout.test.jsx` to assert `aria-haspopup="dialog"`, `aria-expanded`, and that `aria-controls="room-gallery"` resolves to a mounted dialog even while closed; add Escape-precedence coverage with the sidebar and focus fallback after a location change

### Implementation for User Story 2

- [x] T013 [US2] Update `apps/frontend/src/components/RoomGallery.jsx` to capture the invoking element on open, focus the close control, and keep native dialog focus restoration as the primary mechanism without duplicating or unnecessarily overriding it. Add an idempotent fallback that restores focus to the invoking trigger when it remains connected to the DOM, or moves focus to `#tour-main` otherwise. Apply the same behavior to every supported close path: close button, Escape/cancel, backdrop, and location-driven closure
- [x] T014 [US2] Update `apps/frontend/src/components/Layout.jsx` to add `aria-haspopup="dialog"`, keep `aria-expanded` and `aria-controls="room-gallery"`, and guard the sidebar Escape handler with `!galleryOpen` including the effect dependency
- [ ] T015 [US2] Separate automated DOM accessibility assertions from real-browser accessibility verification. Add automated assertions in `apps/frontend/src/tests/RoomGallery.test.jsx` and, where appropriate, `apps/frontend/src/tests/Layout.test.jsx` for dialog semantics, `aria-modal`, the accessible name "Gallery", the close control name, and background inertness attributes that jsdom can verify. Perform real-browser verification for native focus containment, actual background inertness, and focus restoration; do not treat jsdom results as proof of native modal behavior. Adjust `apps/frontend/src/components/RoomGallery.jsx` only if verification reveals a real gap

**Checkpoint**: User Story 2 works independently: keyboard and assistive-technology users can open, navigate, close, and recover focus predictably.

---

## Phase 5: User Story 3 - Use the Gallery Comfortably on Mobile (Priority: P2)

**Goal**: Guarantee 44 by 44 activation areas at every breakpoint and keep the close control reachable while long mobile galleries scroll.

**Independent Test**: At 320x568, 375x667, 560x800, 700x800, landscape phone, and desktop widths, open a long Gallery, confirm both targets are at least 44 by 44, scroll to the end, and close without scrolling back to the top.

### Implementation for User Story 3

- [x] T016 [P] [US3] Update `apps/frontend/src/components/Layout.jsx` so the Gallery trigger has a minimum width and minimum height of 44px at all breakpoints, including `tiny`
- [x] T017 [US3] Update `apps/frontend/src/components/RoomGallery.jsx` so the close control has a minimum width and height of 44px, the header does not scroll, the image body owns scrolling with `overscroll-contain`, and full-screen mobile mode keeps safe-area insets and the close control visible
- [x] T018 [P] [US3] Add the element-level `dialog::backdrop` rule using existing canvas and gallery blur tokens in `apps/frontend/src/index.css`
- [ ] T019 [US3] Validate `specs/004-gallery-ux-improvements/quickstart.md` scenarios 5 and 6 with a temporary multi-image fixture; confirm no horizontal scrolling, no clipped controls, landscape usability, 200 percent zoom, forced-colors mode, and safe-area behavior. Record the manual responsive results, tested viewports, and any deviations in `specs/004-gallery-ux-improvements/quickstart.md`. Do not commit the temporary fixture

**Checkpoint**: User Story 3 works independently: mobile and narrow-viewport users can reach both controls and close a long Gallery.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run complete verification and confirm the change stays within the approved frontend-only scope.

- [ ] T020 [P] Run `npm --prefix apps/frontend run test` and confirm the Gallery tests, focus tests, Layout integration tests, TourContext tests, and existing regression suites pass
- [x] T021 [P] Run `npm run lint` and `npm run build`; confirm zero lint errors and a successful production build
- [x] T022 [P] Run `npm run verify:content` and record any pre-existing content failures separately from this feature
- [ ] T023 Run `specs/004-gallery-ux-improvements/quickstart.md` scenarios 1 through 9 and record deviations, including the exact closing methods and focus behavior
- [x] T024 Review `git diff` for `apps/frontend/src/components/RoomGallery.jsx`, `apps/frontend/src/components/Layout.jsx`, `apps/frontend/src/index.css`, `apps/frontend/src/tests/RoomGallery.test.jsx`, `apps/frontend/src/tests/setup.js`, `apps/frontend/src/tests/Layout.test.jsx`, the conditional `apps/frontend/package.json`, and `apps/frontend/package-lock.json` if the dependency change is approved. Confirm no unrelated dependency changes, no backend changes, no new runtime dependencies, no secrets, and no committed temporary fixtures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately. T002 is the approval gate for all automated test execution.
- **Foundational (Phase 2)**: Depends on Setup, especially T002 for T005. Blocks user story verification.
- **User Stories (Phases 3-5)**: All depend on Foundational.
  - US1 is the dialog foundation and should complete first.
  - US2 depends on the US1 dialog being mounted and controllable.
  - US3 depends on the US1 dialog structure but can be implemented after US2 without changing close/focus behavior.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories. Delivers the open-browse-close MVP.
- **User Story 2 (P1)**: Depends on US1's always-mounted native dialog. Adds focus, trigger metadata, and Escape coordination.
- **User Story 3 (P2)**: Depends on US1's dialog structure. Adds target sizing, fixed-header/scroll-body layout, backdrop styling, and mobile validation.

### Within Each User Story

- Write and fail tests before implementation.
- Keep the dialog mounted before adding focus or responsive behavior.
- Implement close paths before focus restoration, because focus restoration is exercised by every close path.
- Implement trigger metadata and Escape coordination together, because they share `Layout.jsx` and `galleryOpen`.
- Implement target sizing and dialog scrolling before manual mobile validation.

### Parallel Opportunities

- T001 and T003 can run together; T002 is the dependency approval gate.
- T007 can run alongside T006 because they touch different test files.
- T012 can run alongside T011 because they touch different test files.
- T016 and T018 can run together because they touch `Layout.jsx` and `index.css`; T017 touches `RoomGallery.jsx` and must not run in parallel with T011 or T013.
- T020, T021, and T022 can run together after implementation.

---

## Parallel Example: User Story 1

```text
Task: T006 Extend RoomGallery tests for mounted-closed dialog, close paths, ordering, and image fallback
Task: T007 Add Layout tests for opening, closing, and location-change closure
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Stop and validate the open-browse-close journey independently.
4. Do not claim test success if the tooling approval gate in T002 is unresolved.

### Incremental Delivery

1. US1 -> reliable always-mounted dialog MVP.
2. US2 -> keyboard, screen-reader, focus-restoration, and Escape behavior.
3. US3 -> 44 by 44 targets, fixed-header/scroll-body layout, and mobile validation.
4. Polish -> full test, lint, build, content, quickstart, and diff verification.

### Notes

- Do not add `GalleryButton`, `GalleryGrid`, `GalleryItem`, or a second Gallery system.
- Do not set the dialog's DOM `open` attribute directly; the component `open` prop must drive `showModal()` and `close()`.
- Do not restore focus unconditionally before native dialog restoration; the fallback must be idempotent.
- Do not install or modify dependencies without maintainer approval.
- Do not commit temporary multi-image fixtures, build output, or local environment files.
- Commit after each logical group only when explicitly requested.

## Verification Notes

- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify:ignore` passed.
- `npm --prefix apps/frontend run test` is blocked because `vitest` is not installed; the T002 approval gate remains unresolved.
- `npm run verify:content` fails before validation because `specs/001-campus-tour-foundation/contracts/content-schema.json` is missing. This is a pre-existing failure unrelated to the Gallery changes.
- Manual quickstart scenarios and real-browser accessibility verification remain pending.
- Diff scope reviewed: frontend component, style, and test files only. No backend, package, or lockfile changes were made. The root `package-lock.json` and `specs/004-gallery-ux-improvements/` are untracked worktree files.
