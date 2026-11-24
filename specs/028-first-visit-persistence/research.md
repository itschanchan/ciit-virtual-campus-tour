# Research: first-visit-persistence

**Feature**: 028-first-visit-persistence
**Date**: 2026-11-18

## Decisions

### Decision: Browser storage mechanism for first-visit persistence

**Decision**: Use `window.localStorage` to store a first-visit flag.

**Rationale**: The user requirement states the screens reappear only when the user clears browser cache or site data. `localStorage` persists across tab closes, browser restarts, and sessions, and is cleared when the user clears site data — matching the requirement exactly. It provides a simple key-value API with no additional dependencies.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| `sessionStorage` | Cleared when the tab/session closes, so screens would reappear on every new tab — does not match the persistence requirement |
| `IndexedDB` | Overkill for a single boolean flag; more complex API than needed |
| Cookies | Sent with every HTTP request, unnecessary overhead; not cleared the same way as site data in all browsers |

### Decision: Location of the persistence gate

**Decision**: Gate the screen flow in `App.jsx` (`TourExperience` component), which already manages the `screen` state (`welcome` → `instructions` → `tour`).

**Rationale**: Centralizing the first-visit check in the existing state machine avoids duplicating storage logic across `WelcomeScreen` and `InstructionsScreen`. The components remain presentational; `App.jsx` decides whether to render them.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Per-component storage checks | Duplicated logic in both screens; harder to maintain |
| Custom React context | Unnecessary abstraction for a single boolean flag; adds dependency |

### Decision: Responsive implementation approach

**Decision**: Use CSS-driven responsiveness with Tailwind CSS utility classes (mobile-first), no JavaScript viewport detection or resize listeners.

**Rationale**: Aligns with AGENTS.md (CSS-first responsiveness, no JS viewport detection) and Constitution Principle V (responsive on desktop and mobile). Tailwind responsive prefixes (`sm:`, `md:`) handle breakpoint adjustments without custom media queries.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| JS `window.innerWidth` / resize listeners | Prohibited by AGENTS.md; couples responsiveness to interactivity |
| Custom CSS media queries | Less maintainable than Tailwind utilities; not aligned with project styling conventions |

## Assumptions Documented

- `localStorage` is available and not blocked by the browser (standard for modern web browsers).
- Completing the instructions screen and entering the tour counts as having seen the introduction (the first-visit flag is set once the tour is reached).
- There is no separate UI to re-show the introduction outside of clearing browser data.
- Mobile and tablet viewports include both portrait and landscape orientations.
