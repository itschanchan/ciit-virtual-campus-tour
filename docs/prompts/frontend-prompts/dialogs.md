# Share and About Dialogs

**Description:** This document contains all of the requirements about the Share and About Dialogs in the Sidebar component.

---

## Rules

1. Do not over-engineer the entire codes among these files as per indicated in `AGENTS.md`. Identify complicated codes and simplify it for ease of readability.

---

## Share Dialog

---

## About Dialog

- Use MUI Close Icon in the modal and position it to the top right of the modal.
- Retain the Dialog Title but keep it blank; position the MUI Close Icon button to the top right of the Dialog. Place the "About the Virtual Campus Tour" heading directly above the tour description paragraph.
- Make the CIIT Glitch Tower Logo larger than other content on tablet+; smaller on mobile.
- Make the modal wider than default on tablet+; full-width on mobile.

### Content Positioning

This is the positioning of the headers and its bodies in the dialog.

- **Div In Row:** The CIIT Glitch Tower Logo, the About The Virtual Campus Tour heading + paragraph, and the Credits list sit side by side on tablet+; stack vertically on mobile. Logo height matches the row.

- **Div in Column with sub-row:** The Tech Lead and Frontend Team are stacked in a columned div, with the Backend Team beside it in a rowed div on tablet+; all stack vertically on mobile.

- **Div in Row:** The Photography and Voice Over sections sit in a row on tablet+; stack vertically on mobile. The Professors section sits below that row on all viewports.

### Responsiveness

- Dialog uses `fullWidth` on mobile with `maxWidth="md"` cap on tablet+; no fixed `minWidth` so it fits 320px+ screens.
- All three content rows use `flex-col` by default (mobile) and `flex-row` at `sm:` breakpoint (tablet+).
- All flex children use `min-w-0` to prevent overflow on narrow screens.
- Logo scales from `h-16` (mobile) to `h-45` (tablet+).
- Gaps reduce from `gap-6` (tablet+) to `gap-4` (mobile).

---
