# Phase 1 Data Model: Sidebar 5F and 5M Paired Row

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature stores no new application data. The model below describes the floor entries, display rows, and UI states that determine what the visitor sees in the campus floor list.

## Floor Entry

Represents one campus level as it is prepared for display.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `floor` | Short floor label shown to the visitor | Must be one of the established floor sequence values |
| `location` | Referenced tour location, if any | May be null when the tour content has no location for that floor |
| `locked` | Whether the floor is intentionally off limits | Must be true only for the established locked floor set |
| `available` | Whether the floor has a usable location panorama | Derived from the location; false when there is no location |
| `current` | Whether this floor is the selected location | Derived from the current location identifier |
| `status` | Feedback shown inside the floor button | Location-unavailable text when a location exists without a panorama; otherwise empty |
| `disabled` | Whether the visitor can select the floor | Floors without a panorama and without a locked state are disabled |

### Validation Rules

- Every floor label must appear at most once.
- A floor entry must never change its label because of pairing.
- A locked floor must stay selectable so it can show coming-soon feedback.
- Current, locked, available, and disabled state must be resolved per floor entry.

## Display Row

Represents one row of the campus floor list.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `kind` | Row shape | One of `single` or `pair` |
| `entries` | Ordered floor entries in the row | Exactly one entry for `single`; exactly two for `pair` |
| `order` | Position of the row in the list | Must preserve the existing descending floor order |
| `label` | Optional group label for assistive technology | Required for `pair`; absent for `single` |

### Validation Rules

- Exactly one row may be a `pair` in this feature.
- The pair row must contain 5M followed by 5F.
- All other rows must be `single` rows.
- No floor entry may appear in more than one row.
- A row must never reorder the floor entries it contains.

## Paired Row

Represents the fifth-floor row specifically.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `floors` | The two labels in reading order | Must be exactly `5M`, `5F` |
| `label` | Group description announced to assistive technology | Must identify the fifth-floor levels without replacing either floor label |
| `layout` | How the two buttons share the row and sit in the list | Each button sized to its own content, centered together within the sidebar column |
| `stateScope` | Where visual state is applied | Per button, never to the row container |

### Validation Rules

- Activating 5M must not select, highlight, or change 5F, and the reverse must also hold.
- The pair must be horizontally centered in the sidebar column, with each button sized to its own content.
- The pair must not introduce horizontal scrolling at 320 CSS pixels.
- The pair must keep both buttons focusable and reachable in reading order.
- Removing one floor from the tour sequence must fall back to a single row for the remaining floor.

## Floor List Layout State

Represents the visible state of the list that contains the rows.

| State | Condition | Visible outcome |
| :--- | :--- | :--- |
| `expanded-desktop` | The sidebar is open at a desktop width | All rows visible; 5M and 5F share one row |
| `expanded-compact` | The sidebar is open at a compact width | All rows visible inside the narrower sidebar; the pair still shares one row |
| `collapsed` | The sidebar is closed | No rows visible; the toggle remains available |
| `selection-changed` | A floor with a location is selected | The selected floor shows the current state; all other floors, including its pair, do not |

### State Transitions

1. `expanded-*` -> `collapsed` when the visitor collapses the sidebar.
2. `collapsed` -> `expanded-*` when the visitor expands the sidebar.
3. `expanded-*` -> `expanded-*` when the current location changes; only the affected floor buttons update.
4. `expanded-compact` -> `collapsed` after a location is selected, preserving the existing compact behaviour.

## Relationships

- One floor list contains many display rows.
- One display row contains one or two floor entries.
- One floor entry references zero or one tour location.
- One tour location may be referenced by exactly one floor entry.
- The paired row contains exactly two floor entries and no location of its own.

## Validation Rules

- 5F and 5M share one row; every other floor occupies its own row.
- Every floor button, including each button in the pair, is horizontally centered in the sidebar column.
- The pair appears in the list's existing descending order, with 5M before 5F in reading order.
- Each floor in the pair keeps an independent label, state, and activation behaviour.
- Both floors stay readable and reachable at 320 CSS pixels and on desktop.
- Collapsing the sidebar hides the pair with the rest of the list and changes no existing behaviour.
