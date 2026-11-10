# Research: Sidebar Share, About, Website Link, and Footer Layout

**Feature**: `016-sidebar-share-about` | **Date**: 2026-11-10

## Decisions

### Decision 1: Build the dialogs on MUI `Dialog`

**Decision**: Use `@mui/material/Dialog`, `DialogTitle`, `DialogContent`, and `DialogActions` for both the Share and About surfaces. Use `IconButton` with `CloseIcon` for the top-right close control, `Button` with `startIcon` for actions, and `TextField` with a read-only input for the tour address.

**Rationale**: MUI Dialog is already available and already used in this project (`Sidebar.jsx` uses MUI `Popover`). It provides the accessibility behavior the feature needs out of the box: focus trapping, focus restoration, Escape handling, backdrop rendering, scroll locking, and correct ARIA dialog semantics. Building a custom modal would duplicate this behavior and increase the risk of focus or screen-reader regressions, which the constitution explicitly guards against.

**Alternatives considered**:
- Native `<dialog>` element: Rejected — focus return and backdrop-click behavior would need custom handling, and styling a modal backdrop consistently across the app would be harder.
- Custom fixed-position overlay: Rejected — would require manual focus trap, Escape handling, ARIA wiring, and body scroll management.
- New dialog dependency: Rejected — no new dependencies are permitted, and MUI already covers the requirement.

### Decision 2: Rely on MUI Dialog `onClose` for outside-click, Escape, and close-control dismissal

**Decision**: Pass a single `onClose` handler to each `Dialog`. MUI invokes it for `backdropClick` and `escapeKeyDown`; the visible close button and any "Cancel" action call the same handler. Do not use `disableEscapeKeyDown` or `hideBackdrop`.

**Rationale**: This implements FR-018 with the library's tested behavior rather than custom event listeners. MUI only fires `backdropClick` when the click target is the backdrop itself, so clicks inside the dialog content do not close it.

**Interaction with the existing Layout Escape handler**: `Layout.jsx` closes the sidebar on window-level Escape when the sidebar is open. MUI's modal root key handler calls `event.stopPropagation()` for Escape before invoking `onClose`, so the window listener does not also close the sidebar. This preserves the spec requirement that dismissing a dialog leaves the sidebar open.

**Alternatives considered**:
- Custom backdrop click listener: Rejected — duplicates MUI behavior and risks closing on inside clicks.
- Disabling Escape: Rejected — violates FR-018 and keyboard accessibility.
- Removing the Layout Escape handler: Rejected — that would regress existing sidebar keyboard behavior.

### Decision 3: Keep share-link construction in a small pure helper module

**Decision**: Add `apps/frontend/src/lib/shareLinks.js` with small functions that return the current tour address and the destination URLs for Facebook, X, WhatsApp, and Email, plus the Messenger and Discord platform URLs and a short share message constant.

**Rationale**: URL construction is pure and independently testable. Keeping it out of the dialog component keeps both files small and readable under the KISA rules, and avoids duplicating `encodeURIComponent` logic across buttons.

**Alternatives considered**:
- Build URLs inline in `ShareDialog.jsx`: Rejected — makes the component longer and harder to test.
- Add a share library dependency: Rejected — a handful of templates do not justify a dependency.

### Decision 4: Use direct share entry points where they exist, and copy-plus-open for Messenger and Discord

**Decision**:
- Facebook: `https://www.facebook.com/sharer/sharer.php?u=<encoded tour URL>`.
- X: `https://twitter.com/intent/tweet?url=<encoded tour URL>&text=<encoded message>`.
- WhatsApp: `https://wa.me/?text=<encoded message + tour URL>`.
- Email: `mailto:?subject=<encoded subject>&body=<encoded message + tour URL>`.
- Messenger: copy the tour URL, then open `https://www.messenger.com/` in a new tab with a notice to paste the link.
- Discord: copy the tour URL, then open `https://discord.com/app` in a new tab with a notice to paste the link.

**Rationale**: Facebook, X, WhatsApp, and Email have dependable URL-based sharing entry points. Messenger and Discord do not offer a dependable one-click web share URL without application registration or bot setup, which the spec explicitly avoids. Copying the link and opening the platform is honest, works on desktop and mobile, and keeps the feature dependency-free.

**Alternatives considered**:
- Messenger send dialog with a Meta app ID: Rejected by the clarified spec — requires registration and configuration.
- Messenger/Discord custom deep links: Rejected as the primary path — behavior varies by device and installed app; the web platform URL is more predictable.
- Omitting Messenger and Discord: Rejected — the user explicitly requested them.

### Decision 5: Copy through the Clipboard API with a legacy fallback

**Decision**: Copy with `navigator.clipboard.writeText(tourUrl)` when available. If unavailable or rejected, fall back to a temporary hidden textarea plus `document.execCommand('copy')`. If both fail, show an error notice and keep the tour address visible and selectable in the read-only field.

**Rationale**: Clipboard access can be unavailable in insecure contexts, older browsers, or when permission is denied. The spec requires a clear outcome in those cases. A small fallback keeps the primary action useful without adding a dependency.

**Alternatives considered**:
- Clipboard API only: Rejected — leaves users on unsupported contexts with no fallback.
- Always use `execCommand`: Rejected — deprecated and less reliable than the modern API when available.

### Decision 6: Offer the system share sheet only when the browser supports it

**Decision**: Render the "More options" action only when `navigator.share` is a function. Call `navigator.share({ title, text, url })` and ignore an `AbortError` (user dismissed the sheet). Show other failures as a non-blocking notice.

**Rationale**: Feature detection satisfies FR-012 and avoids a dead control on desktop browsers. The Web Share API is an enhancement, not a requirement, because the explicit destinations already cover sharing.

**Alternatives considered**:
- Always render More options: Rejected — broken control on unsupported browsers.
- Use Web Share API as the only share path: Rejected — inconsistent support and does not satisfy the named destination requirements.

### Decision 7: Map actions to available Material icons; use generic Material icons for brands MUI does not ship

**Decision**:
- Website action: `LanguageIcon`.
- Share trigger: `ShareIcon`.
- About trigger: `InfoOutlinedIcon`.
- Copy action: `ContentCopyIcon`, with `CheckIcon` on success.
- Facebook: `FacebookIcon`.
- X: `XIcon`.
- WhatsApp: `WhatsAppIcon`.
- Email: `EmailIcon`.
- Messenger: `ChatBubbleIcon` plus a text label, because MUI has no Messenger brand icon.
- Discord: `ForumIcon` plus a text label, because MUI has no Discord brand icon.
- More options: `MoreHorizIcon`.
- Dialog close: `CloseIcon`.
- About external link: `OpenInNewIcon`.

**Rationale**: The installed `@mui/icons-material` package includes the Facebook, X, WhatsApp, and Email icons, but not Messenger or Discord brand marks. Pairing an appropriate generic Material icon with a visible text label keeps every action understandable without introducing custom SVGs or a second icon package.

**Alternatives considered**:
- Custom inline SVG brand icons: Rejected — the clarified spec asks for Material icons and custom marks add maintenance surface.
- Icon-only controls for Messenger and Discord: Rejected — generic icons alone would be ambiguous, so text labels are required.
- Text-only actions: Rejected — less consistent with the rest of the sidebar and the user's request for icons.

### Decision 8: Split the sidebar into a scrollable body, a non-scrolling close control, and a pinned footer

**Decision**: Make the sidebar panel a full-height flex column. Keep the narrow-viewport close button absolutely positioned at the top-left of the non-scrolling shell. Put the logo, heading, floor list, and action row inside a `min-h-0 flex-1 overflow-y-auto` body with top padding so content never sits behind the close button. Place the copyright line in a `shrink-0` footer sibling with a top border and centered text.

**Rationale**: The current copyright line is the last child of the scroll container, so it scrolls out of view. A flex column with an independently scrolling body is the simplest CSS-only fix, keeps the footer visible at all heights, and preserves the existing mobile-first padding and width rules. Keeping the close control in the non-scrolling shell, with matching body padding, guarantees it stays reachable and unobstructed at every scroll position (FR-025, SC-011).

**Alternatives considered**:
- `position: sticky` footer inside the existing scroll container: Rejected — a sticky footer only pins once content reaches it; short content leaves it floating mid-panel, and the scrollbar still runs behind it.
- Fixed-position footer outside the sidebar: Rejected — would overlap content and complicate the responsive panel.
- Shrinking the floor list height with a fixed value: Rejected — brittle across viewports and inconsistent with the mobile-first rules.

### Decision 9: Theme dialogs with existing CSS variables instead of MUI's light defaults

**Decision**: Style the dialog paper, backdrop, title, content, dividers, and buttons with `slotProps.paper.sx`, `slotProps.backdrop.sx`, and component-level `sx` values that reference the existing tokens (`--color-surface`, `--color-ink`, `--color-line`, `--color-accent`, `--radius-panel`, `--shadow-gallery`). Use Tailwind utilities for layout inside the dialogs.

**Rationale**: MUI's default light palette would clash with the dark tour interface. Reusing the project tokens keeps the dialogs visually consistent with the sidebar, header, and popover, and avoids a second theme layer or global CSS overrides.

**Alternatives considered**:
- Global MUI theme provider: Rejected — the app currently styles MUI components locally; a global theme is a larger change than this feature needs.
- Custom CSS classes for every MUI part: Rejected — more verbose and harder to keep in sync than `sx` with tokens.

### Decision 10: Test behavior through the existing Sidebar test suite and a pure helper suite

**Decision**: Extend `apps/frontend/src/tests/Sidebar.test.jsx` with rendering and interaction tests for the action row, website link, dialog opening, outside-click and Escape dismissal, copy feedback, share destinations, About content, footer placement, and close-control placement. Add `apps/frontend/src/tests/shareLinks.test.js` for URL encoding and destination construction. Mock `navigator.clipboard`, `navigator.share`, `window.open`, and `matchMedia` as needed.

**Rationale**: The existing suite already renders `Sidebar` directly and controls `matchMedia`, so the new tests fit the established pattern. Separating pure URL tests keeps failure diagnosis clear. The constitution requires frontend tests for navigation-affecting behavior, and this feature changes sidebar interactions. Visual viewport fit and scroll behavior remain manual quickstart checks because jsdom does not compute layout.

**Alternatives considered**:
- Snapshot tests: Rejected — snapshots would not verify dismissal, clipboard, or destination behavior.
- End-to-end browser tests: Rejected — the project has no end-to-end harness; Testing Library covers the required behavior.

### Decision 11: Use fluid dialog sizing with a scrollable content area

**Decision**: Render the Share and About dialogs with `fullWidth` and `maxWidth="sm"`, keep the title, close button, and primary actions in non-scrolling regions, and let `DialogContent` scroll when the content exceeds the available height. Verify at 320px mobile, 768px tablet, 1280px desktop, and 667×375 short landscape.

**Rationale**: `fullWidth` removes fixed-width overflow at 320px while `maxWidth="sm"` keeps the desktop dialog readable. Scrolling content with a fixed close control satisfies FR-024 and SC-010, keeps every action reachable on short screens, and uses MUI's built-in scroll behavior without JavaScript viewport detection.

**Alternatives considered**:
- `maxWidth="xs"`: Rejected — the Share dialog's eight actions feel cramped on desktop.
- Fixed width without `fullWidth`: Rejected — risks overflow on narrow screens.
- `fullScreen` on mobile: Rejected — changes the interaction model, requires viewport detection, and hides the sidebar context.
- Sticky actions only: Rejected — scrollable content is still needed for the About text and the Share destination list.

## No NEEDS CLARIFICATION Items

All specification clarifications are resolved. The spec contains no `[NEEDS CLARIFICATION]` markers, and the clarified decisions are recorded in `spec.md`, including FR-024/SC-010 for dialog viewport fit and FR-025/SC-011 for the sidebar close control.
