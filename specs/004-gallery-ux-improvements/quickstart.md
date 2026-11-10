# Quickstart Validation: Improve Gallery Button and Popup

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **UI Contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

Use this guide after implementation to prove the Gallery improvements work end to end. All commands run from the repository root unless stated otherwise.

## Prerequisites

- Node.js and npm compatible with the existing project setup.
- Frontend dependencies installed with `npm run setup` or `npm --prefix apps/frontend install`.
- A checkout on the `004-gallery-ux-improvements` branch.
- **Test tooling prerequisite:** the repository configures Vitest, Testing Library, jest-dom, and jsdom, but those dev dependencies are currently undeclared/uninstalled. Obtain maintainer approval and restore the already-configured dev-only test tooling before relying on automated commands. Do not add runtime packages.
- No `.env` file is required for frontend validation.

## Scenario 1: Automated Gallery Tests

**Command**:

```bash
npm --prefix apps/frontend run test
```

**Expected outcome**:

- The existing Gallery tests continue to pass.
- New tests confirm the dialog remains mounted while closed and the trigger's `aria-controls="room-gallery"` resolves to the mounted dialog.
- New tests cover close button, backdrop, Escape/cancel, image ordering, missing images, and image failure fallback.
- Focus-restoration tests cover the close button, Escape, and backdrop, including the `#tour-main` fallback when the invoking trigger is no longer available.
- New integration coverage confirms Escape closes the Gallery without closing the sidebar.
- Existing catalog, TourContext, PanoramaViewer, NarrationPlayer, and Sidebar suites remain green.

**If blocked**: record that the test tooling prerequisite was not approved or installed. Do not claim automated verification passed.

## Scenario 2: Lint and Build

**Commands**:

```bash
npm run lint
npm run build
```

**Expected outcome**:

- ESLint exits with code 0.
- Vite produces a production build with no new warnings or errors.
- No new runtime dependency appears in `apps/frontend/package.json`.

## Scenario 3: Content Verification

**Command**:

```bash
npm run verify:content
```

**Expected outcome**:

- The catalog and referenced Gallery assets validate with no new failures.
- The Gallery still reads from `apps/frontend/src/lib/catalog.json`.
- No backend or API change is required.

## Scenario 4: Desktop Gallery Behavior

**Command**:

```bash
npm run dev
```

Open the frontend URL at a desktop viewport, such as 1440x900.

**Verify**:

1. The "View gallery" button is visible at the top-right of the panorama.
2. The button is at least 44px wide and 44px tall and shows a visible focus indicator.
3. The button exposes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls="room-gallery"`; the controls reference resolves to the mounted dialog even while closed.
4. While the Gallery is closed, the dialog remains in the DOM but is not visible or in the native open state.
5. Activating the button opens the Gallery with the current location's images in catalog order.
6. The Gallery announces itself as a dialog named "Gallery".
7. Focus moves to the close control.
8. Pressing Tab and Shift+Tab keeps focus within the Gallery.
9. Background tour controls cannot be focused or activated while the Gallery is open.
10. The close control closes the Gallery.
11. Clicking the visible backdrop closes the Gallery.
12. Pressing Escape closes the Gallery.
13. After each close, focus returns to the "View gallery" button without a second focus jump.
14. Opening the Gallery while the sidebar is open, then pressing Escape, closes only the Gallery.
15. Long captions wrap without clipping or horizontal overflow.

## Scenario 5: Long Gallery and Scroll Behavior

Use a temporary local fixture with enough images to exceed the viewport height, or the multi-image test fixture used by the automated tests.

**Verify**:

1. The Gallery body scrolls while the header and close control remain visible.
2. The close control works without scrolling back to the top.
3. Images remain in ascending `order`.
4. The grid does not introduce horizontal scrolling.
5. The first image loads eagerly and later images defer.

Do not commit temporary fixture content.

## Scenario 6: Mobile and Responsive Behavior

Validate at 700x800, 560x800, 375x667, 320x568, and landscape phone dimensions.

**Verify**:

1. The trigger and close control remain reachable and at least 44px wide and 44px tall at every tested breakpoint, including `tiny`.
2. The Gallery uses the available screen space without clipped controls.
3. At the `tiny` breakpoint, the full-screen presentation keeps the close control visible while the body scrolls.
4. Safe-area insets do not place the close control or content under a notch or rounded edge.
5. No horizontal page scrolling occurs.
6. 200 percent zoom does not clip the close control or image content.
7. The Gallery remains usable in forced-colors mode.

## Scenario 7: Keyboard and Screen Reader

Use a keyboard only, then repeat with a screen reader such as NVDA or VoiceOver.

**Verify**:

1. The trigger is reachable by Tab and has a clear accessible name.
2. Activating it moves focus into the Gallery.
3. The Gallery is announced as a modal dialog named "Gallery".
4. Background content is not announced as available interactive content.
5. Tab and Shift+Tab remain within the Gallery.
6. Escape closes the Gallery.
7. Focus returns to the trigger and no competing or duplicate focus jump occurs.
8. If the trigger is no longer available after a location change, focus moves to the `#tour-main` fallback instead of `document.body`.
9. The empty state and image fallback are announced meaningfully.
10. Reduced-motion preference suppresses non-essential motion.

## Scenario 8: Image Failure Fallback

Temporarily point one Gallery image at a missing local asset.

**Verify**:

1. The failed image is replaced by a meaningful fallback.
2. The fallback preserves the image's accessible name.
3. The rest of the Gallery still renders and remains navigable.
4. The Gallery can still be closed normally.
5. The fallback does not introduce layout overlap or horizontal scrolling.

Revert the temporary asset change after validation.

## Scenario 9: Regression Checks

**Verify**:

1. The panorama loads and can be dragged.
2. Arrow-key rotation and zoom controls still work.
3. The location menu opens, closes, and switches locations.
4. Changing location while the Gallery is open closes the Gallery, shows the new location, and leaves focus on a connected control or the `#tour-main` fallback.
5. Narration play, pause, transcript, and status messages still work.
6. The skip link and focus styles remain intact.
7. Existing content verification and catalog validation still pass.

## Failure Handling

- **Dialog test failure in jsdom**: confirm the guarded `showModal`/`close` shim is present in `apps/frontend/src/tests/setup.js` and that `close()` removes the `open` attribute; verify real focus trapping manually in a browser.
- **`aria-controls` points to no element**: confirm `RoomGallery` keeps the dialog mounted while closed and does not return `null`.
- **Focus leaves the dialog**: confirm `showModal()` is used rather than `show()` or a non-modal render.
- **Focus restoration runs twice or jumps**: confirm native restoration is primary and the fallback focuses only when focus did not land on the connected invoking trigger.
- **Focus is lost after a location change**: confirm the removed-trigger fallback focuses `#tour-main`.
- **Backdrop does not close**: confirm the dialog target comparison is used and that the click is on the backdrop, not inside the dialog panel.
- **Escape closes the sidebar too**: confirm the `Layout` sidebar handler requires `!galleryOpen`.
- **Close control scrolls away**: confirm the header is outside the scrollable body and the body owns the scrolling.
- **Horizontal overflow on mobile**: check long captions, safe-area padding, and full-screen width classes.
- **Build or lint failure**: follow the existing frontend conventions and run `npm run lint` and `npm run build` again.
- **Test tooling unavailable**: document the blocked verification and do not add unapproved dependencies.
