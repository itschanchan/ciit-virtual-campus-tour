# Research: Floating Menu Button

Decisions resolving the NEEDS CLARIFICATION items from the plan Technical Context.

## Narration Audio Source

**Decision**: Serve narration audio as local static files under `apps/frontend/public/panoramas/<location-slug>/narration.wav`, referenced per-location via `catalog.json`'s `narration.audioSrc` (e.g., `/panoramas/placeholder/narration.wav`). Do not add a backend API endpoint.

**Rationale**: The frontend already owns narration playback via the existing `NarrationPlayer.jsx` (`<audio src={narration.audioSrc}>`), the tech stack doc places narration audio under `public/`, and `verify-content.mjs` validates per-location `audioSrc`. The Express backend has no audio-serving precedent (routes are health-only; `serve-static` is unused), so Vite's built-in static serving of `public/` is simpler and avoids an unnecessary backend dependency. Per-location files match the per-location voice-over model; the placeholder `narration.wav` can stand in until real per-location recordings exist.

**Alternatives considered**:
- Backend API endpoint serving audio: rejected — no existing audio-serving precedent in Express, adds an unnecessary backend dependency and route.

## Audio Visualization (Oscillation)

**Decision**: Implement the oscillation with a plain CSS animation driven by React state tied to the audio's playing/paused status. No new dependency.

**Rationale**: Approved frontend dependencies are only `react` and `react-dom`; any new dependency requires maintainer approval plus a `docs/tech_stack.md` entry. CSS is lighter and simpler for a visual indicator. The animation is toggled by adding/removing a class (or data attribute) based on playback state, and the keyframes are wrapped in `@media (prefers-reduced-motion: reduce)` to disable animation for users who prefer reduced motion (Constitution Principle V).

**Alternatives considered**:
- Dedicated audio-visualization library: rejected — requires maintainer approval and `docs/tech_stack.md` entry; overkill for a simple oscillation indicator.

## Narration Start Latency Performance Target

**Decision**: Target under 300ms from Play click to audible narration.

**Rationale**: Under 300ms is perceptually instantaneous for UI feedback and is achievable when audio buffers are preloaded via the Web Audio API. Mobile browsers suspend the AudioContext until the first user gesture, so warm the audio context on the first interaction to keep both desktop and mobile within target (Constitution Principle V).

**Measurable success criterion**: At least 95% of Play actions on Chrome, Firefox, and Safari (desktop and mobile, over Wi-Fi and 4G) begin audible narration within 300ms of the click.

**Alternatives considered**:
- No quantified target: rejected — the plan requires measurable outcomes, and an unquantified "fast" target is not testable.
