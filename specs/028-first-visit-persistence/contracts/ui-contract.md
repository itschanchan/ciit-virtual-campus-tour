# UI Contract: first-visit-persistence

**Feature**: 028-first-visit-persistence
**Date**: 2026-11-18

## Screen Flow States

The `TourExperience` in `App.jsx` manages a `screen` state with three values:

| State | Description | When shown |
|---|---|---|
| `welcome` | Welcome screen (`WelcomeScreen`) | First visit only (no stored `hasSeenIntroduction` flag) |
| `instructions` | Instructions screen (`InstructionsScreen`) | After welcome screen is completed, first visit only |
| `tour` | Main virtual tour (`Layout`) | After instructions completed, or on any subsequent visit |

## State Transitions

| From | To | Trigger |
|---|---|---|
| `welcome` | `instructions` | Visitor clicks the START button (`onStart`) |
| `instructions` | `tour` | Visitor clicks anywhere (`onContinue`) or presses Enter/Space (`handleKeyDown`) |
| Any | `tour` (direct) | Subsequent visit where `hasSeenIntroduction` is `true` |

## Storage Contract

| Item | Detail |
|---|---|
| Storage mechanism | `window.localStorage` |
| Key | `ciit_introduction_seen` |
| Value | JSON: `{ "hasSeenIntroduction": boolean, "firstVisitTimestamp": string }` |
| Write trigger | Transition from `instructions` to `tour` |
| Read trigger | Page load in `TourExperience` |
| Clear trigger | User clears browser cache or site data (browser-managed) |

## Component Props

### WelcomeScreen

| Prop | Type | Description |
|---|---|---|
| `onStart` | function | Callback invoked when the visitor clicks START |

### InstructionsScreen

| Prop | Type | Description |
|---|---|---|
| `onContinue` | function | Callback invoked when the visitor clicks anywhere or presses Enter/Space |

## Responsiveness Requirements

| Viewport | Requirement |
|---|---|
| Mobile | All content and buttons fit within viewport without vertical or horizontal scrolling; every tappable area reachable without scrolling |
| Tablet | All content and buttons fit within viewport without vertical or horizontal scrolling; every tappable area reachable without scrolling |
| Desktop | All content and buttons fit within viewport without vertical or horizontal scrolling |

## Accessibility

- Welcome screen: `aria-labelledby` references `welcome-title`
- Instructions screen: `aria-labelledby` references `instructions-title`, `tabIndex={0}`, keyboard operable (Enter/Space)
- Images include meaningful alt text
