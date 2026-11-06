# Phase 0 Research: Sidebar 5F and 5M Paired Row

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All unknowns from the Technical Context are resolved below.

## Decision 1: Derive Display Rows From the Ordered Floor List

**Decision**: Build the ordered floor entries exactly as today, then group those entries into display rows before rendering. A row holds one floor by default and two floors only for the declared pair.

**Rationale**: The list already resolves each floor to its location and already produces the descending order. Grouping at the display layer leaves location resolution, ordering, and floor state untouched and gives the paired row one obvious place to live.

**Alternatives considered**:

- Split `FLOOR_SEQUENCE` into separate sequences for paired and unpaired floors: rejected because it duplicates ordering rules and makes future floor changes error-prone.
- Hardcode the 5F and 5M markup inside the list: rejected because it bypasses the existing floor-to-location mapping.
- Change the floor data model to include a row group: rejected because the feature is a display-only change and the tour content does not need a new field.

## Decision 2: Pair Membership and Left-to-Right Order

**Decision**: Declare exactly one pair, containing 5M and 5F. Render 5M first from the left because the list is displayed top-to-bottom in descending floor order.

**Rationale**: The floor list currently descends from 11F to LG. Reading order inside a row should continue that descent, so the higher mezzanine level comes first. A single declared pair keeps the rule visible and avoids accidental grouping of other floors.

**Alternatives considered**:

- Put 5F first because it is named first in the source sequence: rejected because the visible list descends and the row would break reading order.
- Group any floors whose labels share a numeric prefix: rejected because it would also pair other floors unexpectedly.
- Merge 5F and 5M into one button: rejected because the specification requires two independent controls.

## Decision 3: Centered, Content-Sized Pair With Existing Styling

**Decision**: Render every floor button, including each button in the pair, horizontally centered in the sidebar column, and render the paired row as a flex group of two content-sized buttons separated by the existing list gap. Reuse the current floor-button component and its styling.

**Rationale**: Centering the buttons matches the requested placement and keeps the whole list visually consistent instead of left-hugging the edge. Sizing each button to its own content keeps short floor labels compact, and centering the two together keeps the pair readable as a group. Reusing the button component means current, locked, unavailable, and disabled states continue to work without new variants.

**Alternatives considered**:

- Equal-width columns that stretch to fill the row: rejected because the clarification asks each button to size to its own content.
- A separate compact button style for paired floors: rejected because it would create a second visual language for the same control.
- A horizontally scrolling row: rejected because it hides information and adds an unnecessary interaction on mobile.
- Keeping the buttons left-aligned: rejected because the request is to center the button placement in the sidebar.

## Decision 4: Per-Floor State Independence

**Decision**: Keep passing selection, current, locked, availability, and status props to each floor button individually. The row container carries no selection or status state of its own.

**Rationale**: The specification requires that activating or highlighting one floor never affects the other. Keeping state at the button level preserves the existing click handling and prevents the pair from behaving like a single combined control.

**Alternatives considered**:

- A shared selected state for the pair: rejected because selecting 5F must not highlight 5M.
- A combined click target with two labels: rejected because it removes independent activation.
- Disabling the whole row when one floor is unavailable: rejected because the other floor may still be selectable.

## Decision 5: Accessibility and Focus Order

**Decision**: Keep both floor buttons in the document in the same order they appear visually. Wrap them in a labelled group so assistive technology announces that the two controls belong to the fifth-floor levels, while each button keeps its own accessible name and state.

**Rationale**: A labelled group explains the visual pairing without collapsing the controls. Visual order and DOM order stay aligned, so keyboard focus and screen-reader reading order match what sighted visitors see.

**Alternatives considered**:

- Announce the pair as a single list item with no group label: rejected because the relationship between the two controls would be unclear.
- Add a separate heading for the pair: rejected because it adds a heading level that does not belong in the floor list.
- Reorder the buttons with CSS only: rejected because it would desynchronize focus order from visual order.

## Decision 6: Narrow-Viewport Readability Through Wrapping

**Decision**: Keep the pair inside the existing sidebar width with each button sized to its own content. Let labels and status text wrap onto more lines inside each button, keep the two buttons centered together, and verify that no horizontal scrolling appears at 320 CSS pixels.

**Rationale**: The sidebar already narrows on compact viewports. Letting text wrap keeps both labels fully visible and keeps the pair in one row without shrinking text below a readable size or introducing a new breakpoint.

**Alternatives considered**:

- Shrink the text only for the pair: rejected because inconsistent type sizes reduce readability.
- Trim long location names: rejected because it hides information the visitor needs.
- Stack the pair vertically below a breakpoint: rejected because it defeats the requested side-by-side arrangement at the sizes where it matters most.
- Add a new responsive variant: rejected because the existing `compact`, `narrow`, and `tiny` variants already cover the supported widths.

## Decision 7: Testing With Deferred Tooling

**Decision**: Extend `Sidebar.test.jsx` with cases that assert the two floors share one list row, that neighbouring floors do not share a row, that the pair appears in descending order, and that activating one floor calls the selection handler only for that floor. Document that execution depends on restoring the deferred Vitest, Testing Library, and jsdom tooling.

**Rationale**: The change affects navigation layout and interaction, which the constitution requires tests for. The repository already contains the suite and configuration; the missing piece is the deferred tooling, which this feature must not install without maintainer approval.

**Alternatives considered**:

- Install the test tooling inside this feature: rejected because dependency installation requires maintainer approval and is unrelated to the layout change.
- Skip tests entirely: rejected because it violates the test-first quality gate.
- Rely only on manual smoke testing: rejected as the sole strategy because row grouping regressions would be easy to reintroduce.

## Decision 8: Scope Boundary

**Decision**: Limit the feature to the 5F and 5M pair inside the campus floor list. Do not change floor labels, location mapping, tour content, collapse behaviour, the locked-floor popover, or the panorama viewer.

**Rationale**: The request names one pairing. Keeping the change narrow protects the existing navigation behaviour and makes the regression surface small.

**Alternatives considered**:

- Introduce a general pairing system for all future floor groups: rejected because no other group is requested and the extra configuration has no consumer.
- Pair floors by location availability: rejected because availability changes over time and the pairing must remain stable.
- Move the pairing rule into the tour catalog: rejected because the pairing is a sidebar layout concern, not tour content.

## Open Unknowns

None. All Technical Context unknowns are resolved.
