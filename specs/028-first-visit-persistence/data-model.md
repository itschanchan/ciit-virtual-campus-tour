# Data Model: first-visit-persistence

**Feature**: 028-first-visit-persistence
**Date**: 2026-11-18

## Entity: VisitorIntroductionState

Represents whether a visitor has seen the introduction screens (welcome and instructions). Stored client-side in browser `localStorage`.

### Fields

| Field | Type | Description | Validation Rule |
|---|---|---|---|
| `hasSeenIntroduction` | boolean | `true` once the visitor has completed the instructions screen and entered the tour; `false` on first visit | Must be a boolean; defaults to `false` when absent |
| `firstVisitTimestamp` | string (ISO 8601) | Timestamp of the visitor's first page load | Must be a valid ISO 8601 string; set once on first visit |

### Storage Contract

- **Storage key**: `ciit_introduction_seen` (under `window.localStorage`)
- **Value shape**: JSON object `{ hasSeenIntroduction: boolean, firstVisitTimestamp: string }`
- **Set condition**: Written when the visitor completes the instructions screen (transitions from `instructions` to `tour`)
- **Clear condition**: Cleared when the user clears browser cache or site data (handled by the browser, not application code)
- **Read condition**: Checked on page load to determine whether to show introduction screens or go directly to the tour

### State Transitions

```
[First visit, no stored state]
        |
        v (page loads, hasSeenIntroduction is false/absent)
[Welcome screen shown]
        |
        v (visitor clicks START)
[Instructions screen shown]
        |
        v (visitor clicks continue / presses Enter/Space)
[Write hasSeenIntroduction = true to localStorage]
        |
        v (Tour screen shown)
        |
        v (subsequent visits, hasSeenIntroduction is true)
[Tour screen shown directly; introduction screens skipped]
```

### Relationships

- `VisitorIntroductionState` is scoped per-browser, per-origin (same-origin policy for `localStorage`).
- No relationship to backend users or accounts — persistence is device/browser-local only.

### Validation Rules

- `hasSeenIntroduction` defaults to `false` when the key is absent or the value is malformed (treated as first visit).
- `firstVisitTimestamp` is set only once, on the first page load, and is not updated on subsequent visits.
