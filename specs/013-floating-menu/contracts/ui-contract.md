# UI Contract: Floating Menu Button

**Feature**: 013-floating-menu
**Created**: 2026-11-08
**Spec**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines how `FloatingMenu.jsx` integrates into the Virtual Campus Tour layout and behaves as the narration control surface.

## Interface Contract

This feature is a frontend web application. The contract is the UI composition contract between `Layout.jsx` and `FloatingMenu.jsx`.

### Layout.jsx (composition root)

Renders `FloatingMenu.jsx` at center bottom of the viewport, above the PanoramaViewer and sidebar (the "floating narration bar" referenced in spec 009). Provides narration state and actions:

| Prop/State | Type | Direction | Description |
|------------|------|-----------|-------------|
| `isPlaying` | boolean | in | Whether narration is currently playing |
| `isMuted` | boolean | in | Whether narration is muted |
| `onPlayPause` | function | in | Called when play/pause is activated |
| `onMuteToggle` | function | in | Called when mute/unmute is activated |

### FloatingMenu.jsx

| Prop | Type | Direction | Description |
|------|------|-----------|-------------|
| `isPlaying` | boolean | in | Current playback state; drives play/pause label and visualization visibility |
| `isMuted` | boolean | in | Current mute state; drives mute/unmute label |
| `onPlayPause` | function | in | Callback invoked on play/pause activation (click or keyboard "p") |
| `onMuteToggle` | function | in | Callback invoked on mute/unmute activation (click or keyboard "m") |

FloatingMenu behavior:
- Renders at center bottom of the viewport; does not block the PanoramaViewer or sidebar.
- Shows a Play button when narration is stopped/paused; a Pause button when playing.
- Shows an oscillation audio visualization to the left of the Play button while `isPlaying` is true; hidden otherwise.
- Shows a Mute button when audible; an Unmute button when muted.
- All controls are keyboard operable with visible focus states and accessible names/labels.
- Keyboard hints are shown for each control (e.g., play/pause: p, mute/unmute: m).
- Respects `prefers-reduced-motion`: the oscillation is disabled when reduced motion is preferred.

## Accessibility Contract

- Every control has a programmatically associated accessible name/label.
- Every control shows a visible focus state when keyboard-focused.
- All controls are activatable via keyboard (Enter/Space or documented hint key).
- Narration has a text alternative per location (provided by the location's narration text in catalog).
- Controls do not rely on color alone to convey state.

## Responsive Contract

- Verified at representative desktop (1440x900) and mobile (375x667) viewports.
- Remains usable and does not block the panorama viewer on narrow mobile viewports.

## Out of Scope

- Backend API changes or new endpoints.
- New frontend dependencies (visualization uses CSS animation only).
- Audio file production (placeholder `narration.wav` stands in).
- Persisting playback state across page reloads.
