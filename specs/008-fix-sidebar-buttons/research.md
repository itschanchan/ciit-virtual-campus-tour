# Research: Fix Sidebar Buttons

## Context

The sidebar floor buttons for floors with available panorama tiles are unclickable. Root cause identified in `apps/frontend/src/components/Sidebar.jsx`:

`buildFloorItems` pairs each floor in `FLOOR_SEQUENCE` with a location by **array index**:

```js
const items = FLOOR_SEQUENCE.map((floor, index) => ({
  floor,
  location: sortedLocations[index] ?? null,
}));
```

`FLOOR_SEQUENCE` contains 14 floors (LG through 11F). If `locations` contains only the floors that have panorama tiles (fewer than 14, or in a different order), the index alignment breaks. A floor with an available tile can be paired with `null` or the wrong location, making `location.panorama` falsy, which sets `disabled = true`:

```js
const available = Boolean(location?.panorama);
const disabled = !locked && !available;
```

The result: available-tile floor buttons render as disabled and do not respond to clicks.

## Decision: Match by floor label, not position

**Decision**: Replace index-based alignment with label-based lookup. Build a map from floor label to location entry, then assign each floor button its matching location by `floor` label.

**Rationale**: The floor label is the stable, canonical identifier shared between the sidebar sequence and the location data. Matching by label guarantees each button gets its correct location regardless of how many floors are present or their order in the `locations` array. This directly satisfies FR-005 ("Floor buttons MUST be matched to their corresponding location data by floor label, not by position in a list").

**Alternatives considered**:
- Keep index alignment but require `locations` to contain all 14 floors in exact `FLOOR_SEQUENCE` order. Rejected: fragile; depends on callers always providing a complete, correctly-ordered array, which is not guaranteed and shifts the burden upstream.
- Filter `FLOOR_SEQUENCE` to only floors present in `locations`. Rejected: would drop floor buttons entirely for missing floors, removing UI the visitor expects to see; better to show the button marked unavailable (FR-003/FR-004).

## Decision: Keep unavailable buttons visible but disabled

**Decision**: Floors without available tiles remain rendered as buttons, marked visually unavailable and disabled (per FR-003/FR-004), rather than being hidden.

**Rationale**: Visitors need to understand which floors exist but are not yet accessible, rather than wondering why a floor is missing from the sidebar. Consistent with the existing spec behavior for locked floors (LOCKED_FLOORS set).

## Decision: No new dependencies

**Decision**: No new npm packages are introduced. The fix uses existing React state and the already-imported MUI components.

**Rationale**: Constitution prohibits new dependencies without maintainer approval and `docs/tech_stack.md` updates. The existing Sidebar.jsx already imports everything needed.

## Decision: Test coverage with Vitest

**Decision**: Add `apps/frontend/src/tests/Sidebar.test.jsx` covering click behavior for available and unavailable floor buttons.

**Rationale**: Constitution Principle III requires Vitest tests for behavior affecting navigation/panorama controls, and a regression test for this bug fix.

## Related specs

- `specs/005-sidebar-floor-pair-row` — sidebar floor pairing/layout (adjacent concern, not modified here)
- `specs/006-marzipano-viewer-integration` — panorama viewer integration (baseline; not modified here)
