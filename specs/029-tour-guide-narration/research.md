# Research: Tour Guide Narration

**Branch**: `029-tour-guide-narration` | **Spec**: `specs/029-tour-guide-narration/spec.md`

## Phase 0: Unknowns and Resolved Decisions

No `NEEDS CLARIFICATION` markers remain in the Technical Context of `plan.md`. All unknowns were resolved during the `/speckit.clarify` sessions on 2026-11-24 and 2026-11-25. The decisions below consolidate those clarifications.

### Decision: Recording-to-floor mapping is sequential floor order

**Rationale**: The spec (FR-002) and clarification session on 2026-11-24 establish that all ten recordings map to narrated floors in sequential floor order: LG initial view = voice-1, LG-2 = voice-2, UG = voice-3, 4F = voice-4, 5F = voice-5, 5M = voice-6, 6F = voice-7, 7F = voice-8, 8F = voice-9, 9F = voice-10. Locked floors (1F, 2F, 3F, 10F, 11F) have no recording.

**Alternatives considered**: None — the mapping is mandated by the source document and confirmed by clarification.

### Decision: Keep flat `public/voice/` and `public/transcripts/` layout; transcripts are a content dependency

**Rationale**: Clarification session on 2026-11-24 confirmed the flat layout under `public/` with no first-name subfolder. Transcript text is supplied by the content owner; until supplied, the Floating Menu shows a clear fallback ("Transcript not available yet.") and the tour remains usable (FR-014, FR-024).

**Alternatives considered**: Nesting assets under a first-name subfolder — rejected; the spec explicitly prohibits it.

### Decision: Per-floor replacement with global pause; refresh restores floor and pause state

**Rationale**: Clarification session on 2026-11-24 confirmed that changing floors replaces the recording unless narration is paused; refresh restores the current floor and paused/playing state; active playback restarts the floor recording from the beginning; blocked autoplay falls back to a manual play prompt (FR-005, FR-008, FR-010, FR-011, FR-015).

**Alternatives considered**: Keeping the old recording playing across floor changes — rejected; would play the wrong floor's audio.

### Decision: Transcript accordion reveal applies on tablet and desktop only

**Rationale**: Clarification session on 2026-11-25 confirmed that when the transcript is revealed on tablet and desktop viewports, the Floating Menu animates smoothly from its pill shape to a rounded rectangle; when collapsed, it returns to its original pill shape. Compact mobile viewports keep the existing menu shape (full-width, bottom-anchored, top-only rounding via `narrow:rounded-t-panel`) without the accordion reveal (FR-025).

**Alternatives considered**:
- All viewports — rejected; compact mobile already uses a different layout that would conflict with a rounded-rectangle reveal.
- Desktop only — rejected; tablet has sufficient width to benefit from the rounded-rectangle shape.

### Decision: No new dependencies; reuse existing React, MUI icons, Vitest, and Marzipano

**Rationale**: The Technical Context in `plan.md` lists all existing dependencies and confirms no new packages are needed. Browser `HTMLMediaElement` audio API is used directly.

**Alternatives considered**: Adding a dedicated animation library — rejected; CSS transitions (`transition-all duration-300 ease-out`) already handle the accordion reveal per FR-025.

## Open Items (tracked in tasks.md, not created here)

None remaining at the research level. All NEEDS CLARIFICATION items are resolved.
