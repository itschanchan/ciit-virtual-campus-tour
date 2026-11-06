# Phase 1 Data Model: Panorama Empty State Message

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature stores no new application data. The model below describes the tour content and UI states that determine whether the message is shown.

## Location

Represents a campus room or floor entry in the tour content.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `id` | Stable location identifier | Must be unique and match an existing catalog entry |
| `name` | Visitor-facing location name | Must be non-empty |
| `order` | Position in the tour sequence | Must be a non-negative integer and unique |
| `panorama` | 360-degree imagery definition | May be absent; if present, it must be valid catalog panorama data |
| `gallery` | Optional still imagery | Unchanged by this feature |
| `narration` | Optional narration | Unchanged by this feature |

## Panorama Availability

Represents whether a location can produce a viewer scene.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `hasPanorama` | Whether the location has usable panorama data | Derived from the presence of a valid `panorama` record |
| `reason` | Why no panorama is available | One of `missing-location`, `missing-panorama`, or `none` |

### Validation Rules

- A location with a valid panorama always resolves to `hasPanorama = true` and `reason = none`.
- A location without panorama data resolves to `hasPanorama = false` and `reason = missing-panorama`.
- No selected location resolves to `hasPanorama = false` and `reason = missing-location`.
- `hasPanorama` must never be true when the viewer cannot create a scene.

## Floor Entry

Represents a row in the campus floor list.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `floor` | Floor label shown to the visitor | Must be one of the established floor sequence values |
| `location` | Referenced location, if any | May be null when the tour has no content for that floor |
| `locked` | Whether the floor is intentionally unavailable | Must be true only for the established locked floor set |
| `statusMessage` | Feedback shown inside the floor row | Must be location-unavailable for a location without a panorama, or empty otherwise |
| `disabled` | Whether the visitor can select the floor | Locked floors stay selectable for coming-soon feedback; floors without a location stay disabled |

### Validation Rules

- `statusMessage` must never equal "No panorama available yet."
- A locked floor must show its locked label and trigger the coming-soon notice when activated.
- A floor with a location that has no panorama must show the location-unavailable feedback.
- A floor with no location must not show the missing-panorama message.

## Viewer Display State

Represents what the panorama viewer presents to the visitor.

| State | Condition | Visible content |
| :--- | :--- | :--- |
| `loading` | A panorama scene is being prepared | Loading status |
| `ready` | A selected location has a usable panorama | Panorama scene |
| `missing` | No location is selected or the selected location has no panorama | "No panorama available yet." alert |
| `error` | A panorama exists but the scene cannot be created | Existing load-error alert |

### State Transitions

1. `loading` -> `ready` when the selected location's panorama is created successfully.
2. `loading` -> `error` when scene creation fails.
3. `ready` -> `missing` when the selected location changes to one without a panorama.
4. `missing` -> `ready` when a location with a panorama is selected.
5. `ready` -> `loading` -> `ready` when the visitor switches between available locations.

The missing-panorama message is valid only in the `missing` state.

## Message

Represents the visitor-facing empty-state text.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `text` | Exact visitor-facing message | Must equal "No panorama available yet." |
| `owner` | Surface that renders the message | Must be the panorama viewer |
| `role` | Accessibility semantics | Must be announced as an alert |
| `visibility` | When the message is shown | Only in the `missing` viewer state |

## Coming-Soon Notice

Represents the popover shown after a locked floor is activated.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `floor` | Floor label shown in the popover | Must match the most recently activated locked floor |
| `anchor` | Element the popover is positioned against | Must be the button of the most recently activated locked floor |
| `state` | Lifecycle state | One of `pending`, `visible`, or `dismissed` |
| `delayMs` | Wait before the popover becomes visible | Must be between 1000 and 2000 ms inclusive; the implementation uses a fixed 1500 ms |
| `acknowledgement` | Immediate feedback mode | Must be `motion` or `reduced-motion` |

### State Transitions

1. `idle` -> `pending` when a locked floor is activated; acknowledgement starts immediately.
2. `pending` -> `pending` when another locked floor is activated; the timer restarts and `floor` and `anchor` update.
3. `pending` -> `visible` after `delayMs` elapses.
4. `visible` -> `visible` when another locked floor is activated; `floor` and `anchor` update immediately without a new delay.
5. `visible` -> `dismissed` on an outside click or Escape.
6. `pending` or `visible` -> `idle` when the sidebar closes or the sidebar unmounts.

### Validation Rules

- At most one notice may be pending or visible at any time.
- A pending notice must not render popover content.
- A visible notice must name the most recently activated locked floor.
- A visible notice must not close on a timer; only an explicit dismissal closes it.
- A floor that is not locked must never create a notice.

## Activation Acknowledgement

Represents the immediate feedback on the activated locked-floor button.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `mode` | Visual feedback style | `motion` uses the existing shake; `reduced-motion` uses a border and background change |
| `durationMs` | How long the acknowledgement lasts | Must be short and non-blocking; the implementation keeps the existing 320 ms |
| `timing` | When the acknowledgement starts | Must start immediately on activation, before the popover delay is scheduled |

### Validation Rules

- Every locked-floor activation must produce an acknowledgement.
- Reduced-motion mode must not use transform-based motion.
- The acknowledgement must not delay or replace the coming-soon notice.

### Relationships

- One viewer display state may reference zero or one location.
- One location resolves to exactly one panorama availability result.
- One floor entry may reference zero or one location.
- The message is rendered by the viewer and never by a floor entry.

## Validation Rules

- The exact text "No panorama available yet." appears in the viewer and nowhere in the campus floor list.
- The message is absent when a location with a panorama is displayed.
- The message is present for both missing-location and missing-panorama conditions.
- Locked-floor and location-unavailable feedback remain unchanged.
- The message remains available with the floor list collapsed and at the minimum supported viewport width.
- The coming-soon popover appears 1500 ms after the latest locked-floor activation, within the required 1-2 second window.
- Only one locked-floor popover may be pending or visible, and the latest activation wins.
- A visible coming-soon popover remains open until an outside click or Escape.
- Every locked-floor activation produces immediate acknowledgement, using a non-motion style when reduced motion is preferred.
