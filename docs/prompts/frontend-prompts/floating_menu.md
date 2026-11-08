# Floating Menu Button

A floating menu at the center bottom of the website that controls campus tour narration. The file should be called `FloatingMenu.jsx`.

## Description

The Floating Menu is a narration control surface mounted at the center bottom of the Virtual Campus Tour. It lets visitors play/pause the tour narration, see an audio visualization while narration plays, mute/unmute the narration, and toggle the location transcript. Controls are keyboard operable and accessible per the project constitution.

## Requirements

The floating menu button must have the following functional requirements:

1. **Play / Pause button**: Starts and pauses the campus tour narration. Uses Material UI `PlayArrow` icon when not playing and `Pause` icon when playing. Pressing `p` on a focused button toggles play/pause.

2. **Audio Visualization**: An oscillation animation plays once the audio is playing. It is displayed to the left of the Play button. The animation respects `prefers-reduced-motion` and is disabled when reduced motion is preferred.

3. **Mute / Unmute button**: Silences or restores narration audio. Uses Material UI `VolumeUp` icon when audible and `VolumeOff` icon when muted. Pressing `m` on a focused button toggles mute/unmute.

4. **Transcript button** (when narration exists): Shows or hides the location transcript text.

5. **Keyboard accessibility**: All controls are keyboard operable with visible focus states and accessible names/labels per Constitution Principle V. Keyboard shortcuts: `p` for play/pause, `m` for mute/unmute.

6. **Layout**: Contents are centered horizontally and vertically within the floating menu. The menu is fixed at the center bottom of the viewport, above the PanoramaViewer and sidebar.

## Implementation notes

- Built with Tailwind CSS only (no separate CSS file).
- Uses Material UI Icons (`@mui/icons-material`) which is already an approved project dependency.
- Merged with the previous `NarrationPlayer` audio logic; owns the `<audio>` element, playback status, and transcript.
- Mounted in `Layout.jsx` at center bottom, wired to `TourContext` for narration state (`playNarration`, `pauseNarration`, `toggleMute`, `isMuted`, `narrationStatus`).
