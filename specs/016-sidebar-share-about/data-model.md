# Data Model: Sidebar Share, About, Website Link, and Footer Layout

**Feature**: `016-sidebar-share-about` | **Date**: 2026-11-10

## Overview

This is a frontend-only UI feature. It introduces no database collections, API payloads, or persisted user data. The "data" is limited to component UI state, static About/credits content, and share destination definitions derived from the current page address.

## UI Entities

| Entity | Representation | Fields / content | Source |
|--------|----------------|------------------|--------|
| Sidebar action row | Markup inside `Sidebar.jsx` | Three actions: website, share, about; centered layout; wraps on narrow widths | Static |
| Share dialog | `ShareDialog.jsx` | Tour address, copy action, destination actions, status notice, system-share availability | Derived from `window.location.href` and browser capabilities |
| About dialog | `AboutDialog.jsx` | Tour title, description paragraphs, credits list, CIIT website reference | Static constants |
| Tour link | String | Complete current page address including query string and fragment | `window.location.href` via `getTourUrl()` |
| Credits | Array of strings | Presenting institution, tour content and narration, technology acknowledgement, community thanks | Static constant in `AboutDialog.jsx` |
| Sidebar footer | Markup inside `Sidebar.jsx` | `© 2026 CIIT. All rights reserved.` | Static |
| Sidebar close control | Markup inside `Sidebar.jsx` | Absolutely positioned at the top-left of the non-scrolling sidebar shell; visible on narrow viewports | Static |

## Component State

| Component | State | Type | Initial | Purpose |
|-----------|-------|------|---------|---------|
| `Sidebar` | `shareOpen` | boolean | `false` | Whether the Share dialog is visible |
| `Sidebar` | `aboutOpen` | boolean | `false` | Whether the About dialog is visible |
| `ShareDialog` | `copyStatus` | `'idle' \| 'copied' \| 'error'` | `'idle'` | Drives the visible copy confirmation or error notice |
| `ShareDialog` | `notice` | string or `null` | `null` | Explains copy-plus-open behavior for Messenger and Discord |
| `ShareDialog` | `systemShareAvailable` | boolean | Derived on render | Controls visibility of the "More options" action |

`AboutDialog` is stateless. `ShareDialog` may be stateless for the URL itself by deriving it from `getTourUrl()` when needed. Dialog sizing and scrolling are prop-driven (`fullWidth`, `maxWidth="sm"`, scrollable `DialogContent`) rather than component state.

## Dialog Viewport Behavior

| Viewport | Dialog width | Content behavior | Close control |
|----------|--------------|------------------|---------------|
| Mobile, 320px wide | Full width minus viewport margins | Scrolls vertically when content is taller than the viewport | Visible outside the scroll region |
| Tablet, approximately 768px wide | Capped at the comfortable desktop maximum | Scrolls only if content exceeds height | Visible outside the scroll region |
| Desktop, approximately 1280px wide | Capped at the comfortable desktop maximum | Scrolls only if content exceeds height | Visible outside the scroll region |
| Short landscape, approximately 667×375 | Full width minus viewport margins | Scrolls vertically; content is not clipped | Visible outside the scroll region |

Invariants:

- The dialog never exceeds the viewport width or height.
- The close control remains visible at every content scroll position.
- All dialog content remains reachable by scrolling.
- Dialog sizing is CSS-driven; no viewport-detection hook or resize listener is used.

## Share Destination Model

| ID | Label | Behavior | Destination |
|----|-------|----------|-------------|
| `copy` | Copy link | Writes the tour link to the clipboard; shows success or failure | N/A |
| `facebook` | Facebook | Opens a new tab | `https://www.facebook.com/sharer/sharer.php?u=<encoded tour link>` |
| `x` | X | Opens a new tab | `https://twitter.com/intent/tweet?url=<encoded tour link>&text=<encoded message>` |
| `messenger` | Messenger | Copies the tour link, opens a new tab, and shows a paste notice | `https://www.messenger.com/` |
| `discord` | Discord | Copies the tour link, opens a new tab, and shows a paste notice | `https://discord.com/app` |
| `whatsapp` | WhatsApp | Opens a new tab | `https://wa.me/?text=<encoded message + tour link>` |
| `email` | Email | Opens the device email flow | `mailto:?subject=<encoded subject>&body=<encoded message + tour link>` |
| `native` | More options | Opens the system share sheet when supported | `navigator.share({ title, text, url })` |

## Static Content Model

### About dialog

```text
Title: About the Virtual Campus Tour
Description: Explains the 360° Glitch Tower tour, floor navigation, galleries, and narration.
Credits:
  1. Presented by CIIT College of Innovation and Integrated Technology
  2. 360° panoramas, tour content, and narration: CIIT
  3. Built with React, Marzipano, and Material UI
  4. Special thanks to the CIIT community
Website: https://www.ciit.edu.ph/
```

### Share message

```text
Explore CIIT's Glitch Tower with the 360° Virtual Campus Tour!
```

### Footer

```text
© 2026 CIIT. All rights reserved.
```

## State Transitions

| Trigger | Before | After |
|---------|--------|-------|
| Visitor selects Share while the sidebar is open | `shareOpen = false` | `shareOpen = true`, `copyStatus = 'idle'` |
| Visitor selects Copy link | `copyStatus = 'idle'` | `copyStatus = 'copied'` on success, `'error'` on failure |
| Visitor selects Messenger or Discord | `notice = null` | Tour link copied, platform opened, `notice` explains paste step |
| Share dialog is dismissed (close, Escape, outside click) | `shareOpen = true` | `shareOpen = false`; sidebar remains open |
| Visitor selects About while the sidebar is open | `aboutOpen = false` | `aboutOpen = true` |
| About dialog is dismissed (close, Escape, outside click) | `aboutOpen = true` | `aboutOpen = false`; sidebar remains open |
| Sidebar closes while a dialog is open | `shareOpen` or `aboutOpen` is `true` | Both `false` |
| Share dialog reopens after a previous copy | `copyStatus` is `'copied'` or `'error'` | `copyStatus = 'idle'`, `notice = null` |
| Visitor clicks inside dialog content | Dialog open | Dialog remains open (only backdrop clicks close it) |
| Visitor scrolls the sidebar floor list on a narrow viewport | Close control visible above the body | Close control remains visible and unobstructed; body content scrolls beneath it |
| Visitor opens a dialog on a short viewport | Dialog at rest | Dialog stays inside the viewport; content scrolls; close control remains visible |

## Validation Rules

- The tour link must be a non-empty absolute page address in the browser; when it cannot be resolved, Copy is disabled and the dialog shows an unavailable message.
- Every destination URL must encode the tour link and message with `encodeURIComponent`; no raw string concatenation into query parameters.
- The Message/Notice area must use `role="status"` or `aria-live="polite"` so copy feedback is announced.
- The About dialog must render at least four credit entries.
- The footer text is fixed and must remain visible while the floor list scrolls.
- The dialogs must fit within the viewport at 320px and above, keep the close control visible outside the scroll region, and scroll their content when it exceeds the available height (FR-024, SC-010).
- The narrow-viewport sidebar close control must remain visible and unobstructed at every body scroll position, with body padding preventing content from sitting behind it (FR-025, SC-011).
- No data is written to storage, sent to a backend, or shared beyond the platform the visitor explicitly selects.

## Relationships

- `Sidebar` owns both dialog open states and the action row that triggers them.
- `ShareDialog` depends on `shareLinks.js` for all destination URLs and the share message.
- `AboutDialog` owns its static description and credits content.
- `Sidebar`'s pinned footer and non-scrolling close control are independent of dialog state and floor-list scroll position.
- Closing the sidebar cascades to both dialogs; closing a dialog does not affect the sidebar.
- Dialog `fullWidth`/`maxWidth` sizing and the scrollable content region are independent of sidebar state.

## No Persistence

No new entities are persisted. No catalog, API, or configuration files change. The only existing data read is the current page address from the browser.
