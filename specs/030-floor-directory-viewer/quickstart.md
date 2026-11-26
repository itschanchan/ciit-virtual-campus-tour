# Quickstart: Floor Directory Viewer

**Feature**: `030-floor-directory-viewer`

Runnable checks that prove the viewer meets the spec. Implementation details live in `plan.md` and `research.md`; interaction rules live in [contracts/floor-directory-dialog.md](./contracts/floor-directory-dialog.md).

## Prerequisites

- Node.js LTS with `nvm`, npm
- Dependencies installed: `npm install` then `npm run setup`
- Backend environment copied if the tour needs the API: `Copy-Item apps/backend/.env.example apps/backend/.env`

## Commands

| Purpose | Command |
| :--- | :--- |
| Run the tour | `npm run dev` |
| Frontend tests | `npm --prefix apps/frontend run test` |
| Lint | `npm run lint` |
| Production build | `npm run build` |

## Automated Validation

1. `npm --prefix apps/frontend run test` — expect the rewritten floor-directory tests and the new viewer tests to pass:
   - dialog opens, is labelled, and traps focus;
   - close, Escape, and backdrop close the dialog and restore focus;
   - zoom buttons update the percentage and disable at 100% and 400%;
   - keyboard pan/zoom/reset keys act on the viewer;
   - image failure shows an alert and keeps the close control usable;
   - opening the gallery or sidebar closes the directory;
   - reduced-motion mode applies instant changes;
   - the bounds helper returns `fitScale`, `fitScale * 4`, and a clamped integer percentage, including the zero-size fallback.
2. `npm run lint` — expect no errors.
3. `npm run build` — expect a successful production build.

## Manual Validation

Start the tour with `npm run dev` and open the map button in the floating menu.

### Desktop

1. The dialog opens with the whole directory visible, centered, with panel background on the sides.
2. Scroll over a room row: the image zooms around the cursor and the page behind does not scroll.
3. Zoom to the cap: the percentage reads `400%`, the zoom-in control is disabled, and further scrolling does nothing.
4. Drag the image to an edge: it stops at the edge with no blank gap.
5. Zoom out to `100%`: the zoom-out and reset controls are disabled and the image is letterboxed again.
6. Double click the directory: it zooms in; double click again: it returns to `100%`.

### Tablet

1. Resize to about 768 px wide: the dialog stays within the viewport and does not scroll.
2. Pinch with two fingers over a floor label: the label stays under the fingers and the page does not zoom.
3. Drag with one finger: the image pans and does not dismiss the dialog.

### Mobile

1. Resize to about 390 px wide: the dialog fills the screen and the header and toolbar stay reachable.
2. Pinch, drag, and double tap behave as on the tablet.
3. Rotate to landscape: the image re-fits or stays in view, and no part of the viewer is stranded off-screen.

### Keyboard

1. Tab from the map button into the dialog: focus lands on the close control.
2. Tab through the controls: focus wraps inside the dialog and every control shows a visible focus ring.
3. With the viewer focused: arrow keys pan, `+`/`-` zoom, `0` resets.
4. Press Escape: the dialog closes and focus returns to the map button.

### Reduced Motion

1. Enable the operating system's reduced-motion setting.
2. Zoom, reset, and fit: changes apply instantly with no easing or inertia.
3. Flick the image: it does not glide after release.

### Overlay Handoff

1. Open the directory, then open the gallery or the sidebar: the directory closes.
2. Reopen the directory: it starts fitted at `100%`, not at the previous zoom.

### Failure State

1. Temporarily rename `apps/frontend/public/img/glitch_directory.png`.
2. Open the directory: an alert explains the directory is unavailable and the close control still works.
3. Restore the image.

## Expected Outcomes

- Zoom percentage always reads between `100%` and `400%`.
- The image is never lost off-screen and never shows a blank gap while zoomed.
- No interaction scrolls, zooms, or refreshes the page behind the dialog.
- All actions are reachable by keyboard with visible focus.
- Reduced-motion users see no animated transitions.

## Troubleshooting

- **Percentage shows `100%` but the image overflows**: the fit measurement ran before layout. Confirm the viewer re-measures on image load and on the `ResizeObserver` callback.
- **Tests fail with `NaN` or `scale(NaN)`**: jsdom reports zero layout sizes. Stub `clientWidth`, `clientHeight`, `offsetWidth`, and `offsetHeight`, or assert on the percentage and control state instead of transforms.
- **Page scrolls while zooming**: confirm the wheel event targets the viewer wrapper, not the backdrop, and that the old custom `onWheel` handler was removed.
- **Dialog does not close when the gallery opens**: confirm the handoff effect in `FloatingMenu` watches both `open` and `sidebarOpen`.
