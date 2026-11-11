# Tasks: Sidebar Share, About, Website Link, and Footer Layout

**Input**: Design documents from `specs/016-sidebar-share-about/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Tests**: Included because constitution Principle III requires Vitest coverage for frontend navigation and interaction behavior. Write each test task first and confirm it fails before implementing.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable. User Stories 1–4 all modify `apps/frontend/src/components/Sidebar.jsx` and `apps/frontend/src/tests/Sidebar.test.jsx`, so those edits must be serialized even though the dialog component files themselves are separate.

**Responsive baseline**: Every dialog uses `fullWidth` with `maxWidth="sm"`, a scrollable `DialogContent`, and a close control outside the scroll region (`FR-024`, `SC-010`). The narrow-viewport sidebar close control stays absolutely positioned in the non-scrolling shell with body padding beneath it (`FR-025`, `SC-011`). Validation uses the viewport matrix in `quickstart.md`: 320×568, 375×667, 768×1024, 1280×720, and 667×375.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (`US1`, `US2`, `US3`, `US4`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing stack and test baseline before changes

- [X] T001 [P] Run the existing frontend suite with `npx vitest run` from `apps/frontend` and confirm `apps/frontend/src/tests/Sidebar.test.jsx` is green before changes
- [X] T002 [P] Confirm `@mui/material` and `@mui/icons-material` are declared in `apps/frontend/package.json` and that no new packages are required

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the pure share-link helper needed by User Story 1

**⚠️ CRITICAL**: User Story 1 depends on this phase. User Stories 2–4 do not.

- [X] T003 [P] Write failing tests for the tour address, share message, and destination URLs in `apps/frontend/src/tests/shareLinks.test.js`, covering encoding for Facebook, X, WhatsApp, Email, Messenger, and Discord
- [X] T004 Create `apps/frontend/src/lib/shareLinks.js` with `SHARE_MESSAGE`, `getTourUrl()`, `buildFacebookShareUrl()`, `buildXShareUrl()`, `buildWhatsAppShareUrl()`, `buildEmailShareUrl()`, `MESSENGER_URL`, and `DISCORD_URL`, then run the T003 tests until green

**Checkpoint**: Share-link helpers are tested and ready for the Share dialog

---

## Phase 3: User Story 1 - Share the tour with others (Priority: P1) 🎯 MVP

**Goal**: A visitor can open a Share dialog from the sidebar, copy the tour link, and share it to Facebook, X, Messenger, Discord, WhatsApp, Email, or the system share sheet.

**Independent Test**: Open the sidebar, select Share, copy the tour link, and verify each destination. Dismiss the dialog by close control, Escape, and outside click, and confirm the sidebar stays open. At 320×568 and 667×375, confirm the dialog stays inside the viewport, its close control stays visible, and its content scrolls.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST and confirm they FAIL before implementation**

- [X] T005 [US1] Add failing Share tests in `apps/frontend/src/tests/Sidebar.test.jsx` for dialog opening, tour-address display, copy feedback, Facebook/X/WhatsApp/Email destinations, Messenger/Discord copy-plus-open notices, optional system share, dismissal by close/Escape/backdrop while the sidebar remains open, and responsive dialog structure (close control outside the scrollable content region, scrollable content container present)

### Implementation for User Story 1

- [X] T006 [US1] Implement `apps/frontend/src/components/ShareDialog.jsx` with MUI `Dialog` using `fullWidth` and `maxWidth="sm"`, a `DialogTitle` and `IconButton` close control kept outside the scroll region, a scrollable `DialogContent` for the link field and destination list, `DialogActions` for primary actions, clipboard copy with fallback, destination buttons with Material icons, status/notice `Alert`, and optional native share
- [X] T007 [US1] Wire `shareOpen` state, the Share trigger button using the horizontally flipped `ReplyIcon` (`sx={{ transform: "scaleX(-1)" }}`), and `ShareDialog` into `apps/frontend/src/components/Sidebar.jsx`; reset dialog state when the sidebar closes or the dialog reopens
- [X] T008 [US1] Run the User Story 1 tests and fix `apps/frontend/src/components/ShareDialog.jsx` or `apps/frontend/src/components/Sidebar.jsx` until they pass

**Checkpoint**: The Share dialog works independently at narrow and short viewports and the sidebar stays open after every dismissal

---

## Phase 4: User Story 2 - Learn about the tour and its credits (Priority: P2)

**Goal**: A visitor can open an About dialog that explains the virtual tour, lists credits, and links to the official CIIT website.

**Independent Test**: Open the sidebar, select About, confirm the description and at least four credit entries, activate the CIIT website reference, and dismiss the dialog all three ways while the sidebar stays open. At 320×568 and 667×375, confirm the dialog fits, scrolls its content, and keeps its close control visible.

### Tests for User Story 2 ⚠️

- [X] T009 [US2] Add failing About tests in `apps/frontend/src/tests/Sidebar.test.jsx` for the trigger, tour description, at least four credit entries, CIIT website link attributes, dismissal by close/Escape/backdrop, and responsive dialog structure (close control outside the scrollable content region, scrollable content container present)

### Implementation for User Story 2

- [X] T010 [US2] Implement `apps/frontend/src/components/AboutDialog.jsx` with MUI `Dialog` using `fullWidth` and `maxWidth="sm"`, a `DialogTitle` and `IconButton` close control kept outside the scroll region, a scrollable `DialogContent` containing the tour overview and credits list, and a CIIT website link with `target="_blank"` and `rel="noopener noreferrer"`
- [X] T011 [US2] Wire `aboutOpen` state, the About trigger button (`InfoOutlinedIcon`), and `AboutDialog` into `apps/frontend/src/components/Sidebar.jsx`; close the dialog when the sidebar closes
- [X] T012 [US2] Run the User Story 2 tests and fix `apps/frontend/src/components/AboutDialog.jsx` or `apps/frontend/src/components/Sidebar.jsx` until they pass

**Checkpoint**: The About dialog works independently at narrow and short viewports and the sidebar stays open after dismissal

---

## Phase 5: User Story 3 - Reach the official CIIT website (Priority: P2)

**Goal**: The sidebar's website action is a real link that opens the official CIIT website in a new tab.

**Independent Test**: Open the sidebar, select the website action, and confirm `https://www.ciit.edu.ph/` opens in a new tab with safe link attributes.

### Tests for User Story 3 ⚠️

- [X] T013 [US3] Add a failing website-link test in `apps/frontend/src/tests/Sidebar.test.jsx` asserting the action is a link with `href="https://www.ciit.edu.ph/"`, `target="_blank"`, a `rel` containing `noopener` and `noreferrer`, and a clear accessible name

### Implementation for User Story 3

- [X] T014 [US3] Replace the invalid `<link rel="stylesheet">` element in `apps/frontend/src/components/Sidebar.jsx` with a styled anchor action using `LanguageIcon`, visible text, and safe new-tab attributes
- [X] T015 [US3] Run the User Story 3 test and confirm the website action is keyboard focusable with a visible focus state in `apps/frontend/src/components/Sidebar.jsx`

**Checkpoint**: The website action is functional, safe, and keyboard accessible

---

## Phase 6: User Story 4 - Tidy, stable sidebar footer and action row (Priority: P3)

**Goal**: The website, share, and about actions are centered below the floor buttons, wrap on narrow screens, and the copyright line stays pinned to the bottom while the floor list scrolls. The sidebar close control stays visible in the non-scrolling shell.

**Independent Test**: Inspect the centered action row at 320×568, 375×667, 768×1024, and 1280×720, scroll the floor list, and confirm the copyright line remains visible at the bottom with no horizontal overflow. On narrow and 667×375 short-landscape viewports, confirm the close control stays visible and does not overlap the scrolling content.

### Tests for User Story 4 ⚠️

- [X] T016 [US4] Add failing layout tests in `apps/frontend/src/tests/Sidebar.test.jsx` for the centered action row, wrapping behavior classes, copyright text, the footer being a sibling of the scrollable body, and the narrow-viewport close control living outside the scrollable body so it cannot scroll away

### Implementation for User Story 4

- [X] T017 [US4] Restructure `apps/frontend/src/components/Sidebar.jsx` into a full-height flex column with the narrow-viewport close control absolutely positioned at the top-left of the non-scrolling shell, a scrollable body (`min-h-0 flex-1 overflow-y-auto`) containing the logo, heading, floor list, and action row, plus a `shrink-0` footer containing the copyright line
- [X] T018 [US4] Apply centered/wrapping classes to the action row and mobile-first `compact`/`narrow` padding to the body and footer in `apps/frontend/src/components/Sidebar.jsx`, adding body top padding so scrolling content never sits behind the close control
- [ ] T019 [US4] Run the User Story 4 tests and manually confirm no horizontal overflow and an unobstructed close control at 320×568, 375×667, 768×1024, 1280×720, and 667×375 in `apps/frontend/src/components/Sidebar.jsx`

**Checkpoint**: The action row is centered and wrapping, the footer stays pinned, and the close control stays visible at every supported viewport

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify quality gates and finish cleanup

- [X] T020 [P] Run `npm run lint` from `apps/frontend` and fix all reported issues in `apps/frontend/src/`
- [X] T021 [P] Run `npx vitest run` from `apps/frontend` and fix all failures in `apps/frontend/src/tests/`
- [X] T022 [P] Run `npm run build` from `apps/frontend` and confirm the production build succeeds
- [ ] T023 [P] Execute every validation scenario in `specs/016-sidebar-share-about/quickstart.md` across 320×568, 375×667, 768×1024, 1280×720, and 667×375, checking dialog viewport fit, dialog content scrolling, sidebar close-control visibility, and pinned footer, then record any deviations
- [X] T024 [P] Review focus trapping and focus return, ARIA labels, and live status announcements in `apps/frontend/src/components/ShareDialog.jsx`, `apps/frontend/src/components/AboutDialog.jsx`, and `apps/frontend/src/components/Sidebar.jsx`; add tests in `apps/frontend/src/tests/Sidebar.test.jsx` for any gap found
- [X] T025 [P] Verify no new dependencies were added and that changes are limited to `apps/frontend/src/components/`, `apps/frontend/src/lib/`, `apps/frontend/src/tests/`, and `specs/016-sidebar-share-about/`
- [X] T026 Clean up `apps/frontend/src/components/Sidebar.jsx`: remove unused imports and state, keep helper functions under 25–30 lines, and keep nesting at three levels or fewer
- [X] T027 Update `specs/016-sidebar-share-about/quickstart.md` if validation reveals command, path, or scenario drift

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — blocks User Story 1 only
- **User Stories (Phases 3–6)**: All depend on Setup; User Story 1 also depends on Phase 2
  - User Stories 2, 3, and 4 can start after Setup, but their `Sidebar.jsx` and `Sidebar.test.jsx` edits must be serialized with User Story 1
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (`shareLinks.js`). No dependency on other stories.
- **User Story 2 (P2)**: No dependency on other stories. Shares `Sidebar.jsx` with US1, US3, and US4.
- **User Story 3 (P2)**: No dependency on other stories. Shares `Sidebar.jsx` with US1, US2, and US4.
- **User Story 4 (P3)**: No dependency on other stories. Shares `Sidebar.jsx` with US1, US2, and US3.

### Within Each User Story

- Write the test task first and confirm it fails
- Implement the dialog component before wiring it into `Sidebar.jsx`
- Wire the trigger and state into `Sidebar.jsx`
- Run the story's tests and fix failures before moving on
- Confirm the story's responsive checks before moving on

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T004 are sequential (test before implementation), but the pair is independent of User Stories 2–4
- `ShareDialog.jsx` (T006) and `AboutDialog.jsx` (T010) are separate files and can be developed in parallel once their tests exist
- T020–T025 are independent checks and can run in parallel
- `Sidebar.jsx` and `Sidebar.test.jsx` edits must not be parallelized across stories

---

## Parallel Example: User Story 1

```bash
# After T004 completes, these touch different files:
Task: "Write failing Share tests in apps/frontend/src/tests/Sidebar.test.jsx"
Task: "Implement ShareDialog in apps/frontend/src/components/ShareDialog.jsx"

# Then serialize the integration:
Task: "Wire shareOpen and ShareDialog into apps/frontend/src/components/Sidebar.jsx"
```

> The test task should still be written first so it fails before `ShareDialog.jsx` exists.

---

## Parallel Example: User Stories 2 and 3

```bash
# Different component files can proceed in parallel:
Task: "Implement AboutDialog in apps/frontend/src/components/AboutDialog.jsx"
Task: "Fix the CIIT anchor in apps/frontend/src/components/Sidebar.jsx"

# But both stories eventually edit Sidebar.jsx, so coordinate integration order.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: share-link helpers
3. Complete Phase 3: Share dialog and sidebar trigger
4. **STOP and VALIDATE**: Run the Share tests and the quickstart Share scenarios at 320×568 and 667×375
5. Deploy or demo the Share capability if ready

### Incremental Delivery

1. Complete Setup + Foundational → share helpers ready
2. Add User Story 1 → validate Share independently → demo (MVP)
3. Add User Story 2 → validate About independently → demo
4. Add User Story 3 → validate website link independently → demo
5. Add User Story 4 → validate layout, pinned footer, and close control → demo
6. Run Phase 7 quality gates

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Once foundations are ready:
   - Developer A: User Story 1 (`ShareDialog.jsx`, share helpers)
   - Developer B: User Story 2 (`AboutDialog.jsx`), then coordinate `Sidebar.jsx` edits
   - Developer C: User Story 3 and User Story 4 tests, then coordinate `Sidebar.jsx` edits
3. Serialize all `Sidebar.jsx` and `Sidebar.test.jsx` edits to avoid conflicts

---

## Notes

- `[P]` marks tasks that use different files and have no incomplete dependency
- Every user story remains independently testable through `Sidebar` rendering
- Tests are mandatory under constitution Principle III
- Responsive dialog fit, content scrolling, and close-control visibility are asserted structurally in jsdom and confirmed visually in `quickstart.md`
- Commit after each logical task group
- Stop at each checkpoint to validate the story independently
- Avoid touching `apps/frontend/src/lib/catalog.json` or any backend files
