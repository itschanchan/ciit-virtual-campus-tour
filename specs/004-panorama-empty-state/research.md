# Phase 0 Research: Panorama Empty State Message

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All unknowns from the Technical Context are resolved below.

## Decision 1: Message Ownership and Canonical Text

**Decision**: The panorama viewer owns the message "No panorama available yet." and renders it as a single canonical string.

**Rationale**: The viewer is the surface a visitor looks at when expecting a 360-degree scene. A single source for the string prevents the sidebar and viewer from drifting apart and makes test assertions exact.

**Alternatives considered**:

- Keep the message in both surfaces: rejected because it duplicates feedback and clutters the floor list.
- Use different wording per surface: rejected because it creates two concepts for one condition.
- Make the message configurable per location: rejected as out of scope; the requested text is fixed.

## Decision 2: Viewer Trigger States

**Decision**: Show the message when either no location is selected or the selected location has no panorama. Hide it as soon as a location with a panorama is displayed.

**Rationale**: Both conditions produce the same visitor-visible outcome: there is nothing to render in the viewer. One message keeps the empty state predictable.

**Alternatives considered**:

- Show it only when a location is selected but lacks a panorama: rejected because the viewer can also be ready with no selected location.
- Show it only on initial load: rejected because switching from an available location to an unavailable one must update the viewer.
- Use a separate "no location" message: rejected because it adds wording the visitor does not need.

## Decision 3: Sidebar Scope

**Decision**: Remove "No panorama available yet." from the floor list. Keep the existing coming-soon feedback for locked floors and the existing location-unavailable feedback for locations that exist without a panorama.

**Rationale**: The floor list is a navigation surface. It should communicate floor identity and access state, not repeat the viewer's empty-state explanation. Preserving the other statuses avoids losing information visitors already rely on.

**Alternatives considered**:

- Remove every status message from the floor list: rejected because locked and unavailable states would become ambiguous.
- Keep the message only on empty floors: rejected because it is the behavior the feature explicitly replaces.
- Enable empty floors so the viewer can be reached from them: rejected as a separate navigation feature; empty floors remain non-selectable.

## Decision 4: Viewer Mounting and Control Scope

**Decision**: Mount the panorama viewer whenever tour content is ready, even when no location is selected. Keep the gallery and narration controls conditional on a selected location.

**Rationale**: The message must live in the viewer, so the viewer has to exist in the no-location state. Gallery and narration depend on location content and should not appear when there is nothing to show.

**Alternatives considered**:

- Keep the viewer conditional on a selected location and put the message elsewhere: rejected because it contradicts the requested ownership.
- Mount gallery and narration with empty content: rejected because empty controls confuse visitors and add no value.

## Decision 5: Accessibility and Responsive Presentation

**Decision**: Present the message with the viewer's existing alert semantics, a visible heading, readable body text, and the centered panel layout already used for viewer errors. Reuse the project's Tailwind tokens rather than adding new styles.

**Rationale**: The existing alert pattern is already announced to assistive technology and is positioned consistently over the viewer. Reusing it keeps the visual language stable and avoids new design tokens for a one-off message.

**Alternatives considered**:

- A toast or transient notification: rejected because the empty state persists and must remain discoverable.
- A new global modal: rejected as too heavy for a passive status message.
- A new component stylesheet: rejected by the project styling guide.

## Decision 6: Testing and Verification With Deferred Tooling

**Decision**: Add regression coverage to the existing `PanoramaViewer` and `Sidebar` tests, and document that execution depends on restoring the deferred Vitest, Testing Library, and jsdom tooling. Until then, verify with ESLint, the production build, and manual desktop/mobile scenarios.

**Rationale**: The change affects navigation and panorama behavior, which the constitution requires tests for. The repository already contains the test suites and configuration; the missing piece is the deferred tooling, which this feature must not install without maintainer approval.

**Alternatives considered**:

- Install Vitest and Testing Library inside this feature: rejected because dependency installation requires maintainer approval and is unrelated to the UI change.
- Skip tests entirely: rejected because it violates the test-first quality gate.
- Rely only on manual smoke testing: rejected as the sole strategy because regressions would be easy to reintroduce.

## Decision 7: Popover Delay and Timer Lifecycle

**Decision**: Use a fixed `POPOVER_DELAY_MS = 1500` for the coming-soon popover. Keep a single pending notice; every locked-floor activation clears the previous timer and schedules a new one. Clear the timer on unmount and when the sidebar closes.

**Rationale**: A fixed value inside the required 1-2 second window is deterministic, easy to test with fake timers, and avoids random timing that would feel inconsistent. A single pending notice prevents duplicate popovers and lets the latest activation win.

**Alternatives considered**:

- Random delay between 1000 ms and 2000 ms: rejected because it makes acceptance tests non-deterministic and gives visitors inconsistent feedback.
- Exactly 1000 ms or 2000 ms: rejected because both sit on the boundary and leave no scheduling tolerance.
- CSS-only transition delay: rejected because it does not control MUI's `open` state, dismissal, or timer cleanup.
- No delay: rejected because it contradicts the clarified requirement.

## Decision 8: Dismissal and Activation While Visible

**Decision**: Once visible, the popover stays open until the visitor clicks outside it or presses Escape. If a different locked floor is activated while the popover is already visible, update the popover content and anchor immediately without restarting the delay. Closing the sidebar cancels any pending delay and closes a visible popover.

**Rationale**: The clarified dismissal behavior forbids auto-close. Updating visible content immediately avoids flicker and stale floor names, while cancelling on sidebar close prevents an orphaned popover anchored to a hidden button.

**Alternatives considered**:

- Hide the popover and restart the delay on every new activation: rejected because feedback would disappear and reappear unexpectedly.
- Auto-dismiss after a fixed duration: rejected by the clarification.
- Leave the old floor name while the popover is open: rejected because it misrepresents the latest activation.

## Decision 9: Immediate Acknowledgement and Reduced Motion

**Decision**: Acknowledge the activation synchronously before scheduling the delay. Keep the existing shake when motion is allowed. When `prefers-reduced-motion: reduce` matches, apply a transient non-motion border and background change for the same short acknowledgement period.

**Rationale**: The clarified behavior requires immediate feedback and a non-motion alternative. A transient colour change communicates the press without violating reduced-motion preferences, and the delay still governs only the popover.

**Alternatives considered**:

- No acknowledgement for reduced-motion visitors: rejected because it violates the immediate-feedback requirement.
- Skip the popover delay for reduced-motion visitors: rejected because the delay is not motion and the clarified timing applies to everyone.
- Keep the shake regardless of preference: rejected because it ignores the accessibility preference.

## Open Unknowns

None. All Technical Context unknowns are resolved.
