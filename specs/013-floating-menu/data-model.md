# Data Model

## NarrationPlaybackState

Client-side playback state owned by the floating menu component.

- **isPlaying**: `boolean` — true when narration is playing, false when paused or stopped.
- **isMuted**: `boolean` — true when narration audio is muted, false when audible.
- **volume**: `number` — playback volume level (0.0 to 1.0). Defaults to 1.0 when not muted.
- **src**: `string` — narration audio file URL (e.g., `/panoramas/<location-slug>/narration.wav`).
- **currentTime**: `number` — current playback position in seconds.
- **duration**: `number` — total narration duration in seconds.

## Relationships

- Narration play event → isPlaying = true → audio visualization oscillation starts.
- Narration pause/stop event → isPlaying = false → audio visualization oscillation stops.
- Mute event → isMuted = true → volume effectively 0 (audio continues but silent).
- Unmute event → isMuted = false → volume restored to previous level.
- isMuted is independent of isPlaying; narration can play while muted.

## Validation Rules (derived from Requirements)

- When isPlaying is true: the oscillation audio visualization MUST be visible to the left of the Play button.
- When isPlaying is false: the oscillation audio visualization MUST NOT be visible.
- When isMuted is true: no narration audio is audible regardless of isPlaying.
- When isMuted is false: narration audio is audible when isPlaying is true.
- src MUST resolve to a static audio file under `apps/frontend/public/` (Vite serves `public/` at root).
- All controls MUST expose an accessible name/label and visible focus state (Constitution Principle V).

## State Transitions

| From | Trigger | To | Effect |
|------|---------|-----|--------|
| stopped | Play pressed | playing | Narration starts; oscillation begins |
| playing | Pause pressed | stopped | Narration stops; oscillation ends |
| playing | Mute pressed | playing (muted) | Audio silenced; playback continues |
| playing (muted) | Unmute pressed | playing | Audio restored |
| stopped (muted) | Unmute pressed | stopped (unmuted) | No audio; mute flag cleared |
