# Quickstart: Sidebar Share, About, Website Link, and Footer Layout — Validation Guide

**Feature**: `016-sidebar-share-about` | **Date**: 2026-11-10

## Purpose

Document runnable validation scenarios that prove the centered action row, working CIIT website link, Share dialog, About dialog, and pinned sidebar footer behave as specified.

## Prerequisites

- Node.js LTS (via nvm)
- Repository dependencies installed: `npm install` and `npm run setup` at the workspace root
- Frontend dev server running: `npm run dev` (or `cd apps/frontend && npm run dev`)

## Verification Viewports

| Category | Viewport | Mapping |
|----------|----------|---------|
| Mobile (small) | 320×568 | Narrow and tiny variants |
| Mobile (standard) | 375×667 | Narrow and tiny variants |
| Tablet | 768×1024 | Compact and narrow variants |
| Desktop | 1280×720 | Above compact |
| Short landscape | 667×375 | Narrow/tiny width with limited height |

## Validation Scenarios

### Scenario 1: Centered action row and working website link

**Steps**:
1. Open the tour and expand the sidebar on a desktop viewport.
2. Confirm the website, share, and about actions form one row below the floor buttons and are centered.
3. Select the CIIT website action.
4. Confirm `https://www.ciit.edu.ph/` opens in a new tab and the tour remains in the original tab.
5. Return to the tour and confirm the sidebar is still open.

**Expected outcome**: The action row is centered, the website link is functional, and the sidebar state is preserved (FR-001, FR-003, FR-004, SC-004).

### Scenario 2: Share dialog opens and dismisses three ways

**Steps**:
1. At the 320×568 mobile viewport, open the sidebar and select Share.
2. Confirm the dialog fits fully within the viewport with edge margins, the close control is visible, and the tour address and sharing actions are reachable. Scroll the content if it exceeds the dialog height.
3. Press Escape. Confirm the dialog closes and the sidebar remains open.
4. Reopen Share at the 768×1024 tablet viewport and the 1280×720 desktop viewport. Confirm the dialog stays within a comfortable maximum width instead of stretching edge-to-edge.
5. Open Share again and click the dialog's close control. Confirm it closes.
6. Open Share again and click outside the dialog on the backdrop. Confirm it closes and the sidebar remains open.
7. Repeat the open/scroll/close check at the 667×375 short landscape viewport. Confirm the dialog stays inside the viewport and the close control remains visible while the content scrolls.

**Expected outcome**: The dialog opens and closes by close control, Escape, and outside click without closing the sidebar, and it remains usable at mobile, tablet, desktop, and short landscape sizes (FR-005, FR-006, FR-018, FR-024, SC-001, SC-008, SC-010).

### Scenario 3: Copy link feedback

**Steps**:
1. Open the Share dialog.
2. Select Copy link.
3. Confirm a success confirmation appears.
4. Paste the clipboard into a text editor and confirm it matches the current tour address.
5. Close and reopen the Share dialog.
6. Confirm the confirmation has reset.

**Expected outcome**: The link is copied with visible success feedback, and the feedback resets on reopen (FR-007, SC-002).

### Scenario 4: Social sharing destinations

**Steps**:
1. Open the Share dialog.
2. Select Facebook. Confirm Facebook opens in a new tab with the tour link attached.
3. Return to the tour and select X. Confirm X opens with the tour link and share message.
4. Select WhatsApp and Email and confirm each opens its corresponding flow with the tour link.
5. Confirm every destination opens without unloading the tour page.

**Expected outcome**: Social and messaging destinations open correctly in a new context (FR-008, FR-009, FR-011, FR-013, SC-003).

### Scenario 5: Messenger and Discord copy-plus-open behavior

**Steps**:
1. Open the Share dialog.
2. Select Messenger.
3. Confirm the tour link is copied, Messenger opens in a new tab, and a notice explains that the link should be pasted.
4. Return to the tour and select Discord.
5. Confirm the tour link is copied, Discord opens, and the same paste guidance is shown.

**Expected outcome**: Messenger and Discord copy the link and open the platform with clear next-step guidance (FR-010, SC-003).

### Scenario 6: System share sheet when supported

**Steps**:
1. Open the tour in a browser on a device that supports the Web Share API.
2. Open the Share dialog.
3. Confirm a "More options" action is visible.
4. Select it and confirm the system share sheet opens with the tour link.
5. Repeat in a browser without Web Share support and confirm the action is not shown.

**Expected outcome**: The system share option appears only when supported (FR-012).

### Scenario 7: About dialog content and dismissal

**Steps**:
1. At the 320×568 mobile viewport, open the sidebar and select About.
2. Confirm the dialog fits fully within the viewport with edge margins and the close control is visible.
3. Confirm the dialog explains the virtual tour and lists at least four credit entries. Scroll the content and confirm all credits remain reachable.
4. Select the CIIT website reference and confirm the official site opens in a new tab.
5. Dismiss the dialog by close control, then reopen and dismiss by Escape, then reopen and dismiss by clicking outside.
6. Confirm the sidebar remains open after each dismissal.
7. Repeat the content and scrolling check at the 768×1024 tablet viewport and the 667×375 short landscape viewport. Confirm the dialog stays inside the viewport and the close control remains visible.

**Expected outcome**: The About dialog contains the required content, fits and scrolls correctly on mobile, tablet, desktop, and short landscape sizes, and dismisses without closing the sidebar (FR-014 through FR-018, FR-024, SC-005, SC-010).

### Scenario 8: Copyright pinned to the sidebar bottom

**Steps**:
1. Open the sidebar on a desktop viewport.
2. Confirm `© 2026 CIIT. All rights reserved.` is visible at the bottom of the sidebar.
3. Scroll the floor list down and back up. Confirm the copyright line stays visible at the bottom and is not clipped.
4. At the 320×568 mobile viewport, scroll the floor list to the bottom and back. Confirm the sidebar close control stays visible at the top-left and does not overlap the scrolling content.
5. Repeat on the 768×1024 tablet viewport and the 667×375 short landscape viewport. Confirm the footer remains visible and the body scrolls independently; at 667×375, also confirm the narrow-viewport close control stays visible.

**Expected outcome**: The copyright line remains pinned and fully visible at every supported width and height, and the narrow-viewport close control stays visible and unobstructed while the body scrolls (FR-020, FR-021, FR-025, SC-006, SC-011).

### Scenario 9: Narrow viewport action row wrapping

**Steps**:
1. Open the tour at a 320px viewport width.
2. Open the sidebar.
3. Confirm the website, share, and about actions wrap as needed and remain centered.
4. Confirm there is no horizontal scrolling and no clipped labels.

**Expected outcome**: The action row wraps cleanly without horizontal overflow (FR-002, SC-007).

### Scenario 10: Keyboard and focus behavior

**Steps**:
1. With the sidebar open, tab to the website, share, and about actions and confirm each shows a visible focus indicator.
2. Activate Share with the keyboard.
3. Confirm focus moves into the dialog and Tab stays within it.
4. Press Escape and confirm focus returns sensibly to the Share action.
5. Repeat for About.

**Expected outcome**: All new controls are keyboard operable, focus is trapped while a dialog is open, and focus is restored on close (FR-022, SC-008).

### Scenario 11: Sidebar closes while a dialog is open

**Steps**:
1. Open the Share dialog.
2. Close the sidebar using the sidebar close control or the sidebar toggle.
3. Confirm the dialog closes with the sidebar.

**Expected outcome**: No dialog remains over an inactive sidebar (FR-019).

### Scenario 12: Existing sidebar behavior regression check

**Steps**:
1. Select several available floors and confirm scene switching still works.
2. Activate a locked floor and confirm the existing delayed notice still appears.
3. Dismiss the notice by clicking outside or pressing Escape.
4. Toggle the sidebar open and closed repeatedly.

**Expected outcome**: Existing floor selection, locked-floor notices, scene switching, and toggle behavior are unchanged (FR-023, SC-009).

### Scenario 13: Clipboard unavailable fallback

**Steps**:
1. Open the Share dialog in a context where clipboard permission is denied or unavailable.
2. Select Copy link.
3. Confirm the dialog shows an error or fallback notice and the tour address remains visible and selectable.

**Expected outcome**: The visitor can still retrieve the link manually when automatic copying fails (edge case: clipboard unavailable).

## Commands

```bash
# Install workspace, backend, and frontend dependencies
npm install
npm run setup

# Run the frontend dev server
cd apps/frontend
npm run dev

# Run frontend tests
npx vitest run

# Lint the frontend
npm run lint

# Build the frontend
npm run build
```

## Automated Test Targets

| Test file | Coverage |
|-----------|----------|
| `apps/frontend/src/tests/Sidebar.test.jsx` | Action row rendering, website link attributes, Share/About dialog opening and dismissal, dialog sizing/scroll structure, copy feedback, destination links, About content, footer placement, close-control placement, sidebar-close cascade, keyboard behavior, existing floor behavior |
| `apps/frontend/src/tests/shareLinks.test.js` | Tour URL retrieval, Facebook/X/WhatsApp/Email URL construction, encoding, share message, Messenger/Discord platform URLs |

## Expected Outcomes Summary

| Requirement | Validation scenario |
|-------------|---------------------|
| FR-001, FR-002 | Scenarios 1, 9 |
| FR-003, FR-004 | Scenario 1 |
| FR-005, FR-006, FR-007 | Scenarios 2, 3 |
| FR-008, FR-009, FR-011, FR-013 | Scenario 4 |
| FR-010 | Scenario 5 |
| FR-012 | Scenario 6 |
| FR-014 through FR-017 | Scenario 7 |
| FR-018 | Scenarios 2, 7 |
| FR-019 | Scenario 11 |
| FR-020, FR-021 | Scenario 8 |
| FR-022 | Scenario 10 |
| FR-023 | Scenario 12 |
| FR-024 | Scenarios 2, 7 |
| FR-025 | Scenario 8 |
| SC-001 through SC-009 | Scenarios 1–12 |
| SC-010 | Scenarios 2, 7 |
| SC-011 | Scenario 8 |

## References

- Feature specification: `specs/016-sidebar-share-about/spec.md`
- Implementation plan: `specs/016-sidebar-share-about/plan.md`
- Research decisions: `specs/016-sidebar-share-about/research.md`
- Data model: `specs/016-sidebar-share-about/data-model.md`
- Existing sidebar tests: `apps/frontend/src/tests/Sidebar.test.jsx`
- Design tokens: `apps/frontend/src/index.css`
