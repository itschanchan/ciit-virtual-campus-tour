# Data Model

## FloorEntry
- **id**: floor code (e.g., `5F`, `5M`) – unique within the list.
- **label**: display text for the button (often the same as `id`).
- **locationId**: optional reference to a tour location (nullable).
- **current**: `true` if this floor is the currently selected location.
- **locked**: `true` if the floor is locked / off‑limits.
- **unavailable**: `true` if the floor has no panorama / tour content.
- **disabled**: `true` if the floor is disabled (e.g., both locked and unavailable).
- **order**: numeric position in the overall floor list (descending order).

## FloorList
- **entries**: ordered array of `FloorEntry` objects, sorted by `order` descending.
- **pairing**: optional map indicating which entries belong to the same row (e.g., `{ "5F": "5M", "5M": "5F" }`). Only the fifth‑floor pair is paired; all other entries are single.

## FloorOrderState
- **activePair**: the pair identifier currently subject to switching (e.g., `"5F-5M"`).
- **switched**: `true` when 5M appears first (default is `false`, meaning 5M appears first to match descending order; switching makes 5F appear first).
- **scope**: session-only; held in component state while the sidebar is open, reset on unmount.

## DisplayRow
- **type**: `"single"` or `"pair"`.
- **entries**: array of `FloorEntry` objects belonging to this row.
- **centered**: `true` for all rows – each button is horizontally centered in the sidebar column.
- **pairGroup**: for a `"pair"` row, the two entries are rendered side‑by‑side; each button sizes to its own content while the pair stays centered together; left-to-right order follows `FloorOrderState`.

### Validation Rules (derived from Requirements)
- Exactly one pair row exists containing `5F` and `5M`.
- All other rows are `"single"`.
- The left-to-right order of entries in the pair matches the active `FloorOrderState` (default or switched).
- Each `FloorEntry` maintains its own `current`, `locked`, `unavailable`, `disabled` flags independent of row position.
- Buttons are horizontally centered; labels wrap to stay in one row at 320 px viewport width.
- The switched order takes effect immediately during render; no page reload required.
- The switched order is retained across sidebar collapse/expand while the sidebar remains mounted.
