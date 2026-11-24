# Quickstart: first-visit-persistence

**Feature**: 028-first-visit-persistence
**Date**: 2026-11-18

## Purpose

Runnable validation scenarios that prove first-visit persistence and responsive behavior of the welcome and instructions screens end-to-end.

## Prerequisites

- Frontend dev server running (`npm run dev` from repo root, or `npm --prefix apps/frontend run dev`)
- A modern web browser with DevTools available (Application > Local Storage panel)
- No existing `ciit_introduction_seen` key in localStorage for the app origin (clear site data if needed)

## Validation Scenarios

### Scenario 1: First-time visitor sees welcome then instructions then tour

1. Open the webpage in a browser.
2. **Expected**: The welcome screen (`GLITCH TOWER`, START button) is displayed.
3. Click START.
4. **Expected**: The instructions screen (`How to Move Around`) is displayed.
5. Click anywhere on the instructions screen (or press Enter/Space).
6. **Expected**: The virtual tour (`Layout` with panorama) is displayed directly.

### Scenario 2: Returning visitor skips introduction and enters tour directly

1. Complete Scenario 1 (this writes `hasSeenIntroduction = true` to localStorage).
2. Refresh the page (do not clear site data).
3. **Expected**: The virtual tour is displayed directly; welcome and instructions screens do not appear.
4. Open DevTools > Application > Local Storage and confirm `ciit_introduction_seen` exists with `hasSeenIntroduction: true`.

### Scenario 3: Screens reappear after clearing browser site data

1. Complete Scenario 2 (visitor is a returning user seeing the tour directly).
2. Clear browser site data / cache for the app origin (or remove the `ciit_introduction_seen` key from localStorage).
3. Refresh the page.
4. **Expected**: The welcome screen appears again, followed by the instructions screen, then the tour.

### Scenario 4: Welcome screen fits mobile viewport without scrolling

1. Open DevTools device toolbar and select a mobile viewport (e.g., iPhone SE ~375px wide).
2. Ensure localStorage is cleared so the welcome screen shows.
3. **Expected**: All welcome screen content (logo, title, rule, subtitle, START button) fits within the screen; no vertical or horizontal scrollbar appears; the START button is reachable without scrolling.

### Scenario 5: Instructions screen fits mobile viewport without scrolling

1. With mobile viewport active, complete the welcome screen.
2. **Expected**: All instructions screen content (title, lead text, three instruction cards with visuals, continue prompt) fits within the screen; no vertical or horizontal scrollbar; every tappable card and the continue prompt are reachable without scrolling.

### Scenario 6: Welcome screen fits tablet viewport without scrolling

1. Switch device toolbar to a tablet viewport (e.g., iPad ~768px wide).
2. Clear localStorage and refresh.
3. **Expected**: Welcome screen content fits within the tablet screen without scrolling; START button reachable without scrolling.

### Scenario 7: Instructions screen fits tablet viewport without scrolling

1. With tablet viewport active, complete the welcome screen.
2. **Expected**: Instructions screen content fits within the tablet screen without scrolling; all three instruction cards and continue prompt reachable without scrolling.

## Expected Outcomes

| Scenario | Pass criterion |
|---|---|
| 1 | First-time visitor sees welcome → instructions → tour in order |
| 2 | Returning visitor enters tour directly; no introduction screens |
| 3 | After clearing site data, introduction screens reappear |
| 4 | Welcome screen fits mobile viewport; no scrolling; START reachable |
| 5 | Instructions screen fits mobile viewport; no scrolling; all cards reachable |
| 6 | Welcome screen fits tablet viewport; no scrolling; START reachable |
| 7 | Instructions screen fits tablet viewport; no scrolling; all cards reachable |

## References

- Feature specification: `spec.md`
- Data model: `data-model.md`
- UI contract: `contracts/ui-contract.md`
- Research decisions: `research.md`
