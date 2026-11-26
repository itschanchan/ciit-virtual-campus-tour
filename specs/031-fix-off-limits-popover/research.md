# Phase 0 Research: Fix Off-Limits Popover Duplicate Message

**Feature**: 031-fix-off-limits-popover
**Created**: 2026-11-26
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Research Questions

1. Why does the off-limits notification render a blank/duplicate message before hiding?
2. How should visibility be separated from content so the label survives the exit transition?
3. What is the intended display timing (delayed show vs. immediate show)?
4. How should dismissal, floor switching, and sidebar closing interact with the exit transition?
5. How do we prove the fix without relying on visual inspection?

---

## Decision 1: Keep notice content and anchor mounted through the exit transition

**Decision**: Split the single `notice` object into stable content (`notice` = `{ floor, anchorEl }`) plus a separate visibility flag (`noticeOpen`). Clear the content only in the Popover's `onExited` transition callback, never when the timer or dismiss action fires.

**Rationale**: The current code deletes `notice` (both label and anchor) the moment the auto-hide timer fires. React re-renders the still-mounted, still-exiting Popover with `notice === null`, so `{notice?.floor} is coming soon.` becomes `" is coming soon."` (the blank `"__ coming soon."` the visitor reported). Because `anchorEl` also becomes `null`, MUI's `Popover` falls back to `document.body` for positioning during that same exit, so the blank paper detaches from the floor button and appears elsewhere — the perceived duplicate `"coming soon."` before it finally unmounts. Holding `notice` until `onExited` keeps the label complete and the anchor stable for the whole animation.

**Alternatives considered**:
- `keepMounted` on the Popover: only controls unmounting, not the `notice` state; the blank label would still render.
- Disable the transition (`transitionDuration={0}`): hides the symptom but removes motion and reduced-motion handling, and still clears content abruptly.
- Render the last floor label from a ref inside the popover: duplicates the state source and is more complex than a visibility flag.

**Evidence**: `apps/frontend/src/components/Sidebar.jsx` sets `open={open && Boolean(notice)}`, `anchorEl={notice?.anchorEl ?? null}`, and the timer callback `setNotice(null)`. MUI `Popover` positions against `document.body` when `anchorEl` is absent (`apps/frontend/node_modules/@mui/material/Popover/Popover.js`). Commit `83ba216a` changed the timer from a delayed show to an immediate show plus `setNotice(null)` auto-hide.

---

## Decision 2: Use a single dismiss path; use `onExited` only for content cleanup

**Decision**: Introduce `noticeOpen` as the Popover `open` input. A `dismissNotice` handler clears the pending timer and sets `noticeOpen = false` for both timer-driven hides and user dismissal (`onClose`). The transition's `onExited` callback sets `notice` back to `null` after the popover has fully left the screen.

**Rationale**: The prior code attached `handleCloseNotice` to both `onClose` and `slotProps.transition.onExited`. That created two cleanup paths racing each other and made the exit state ambiguous. A single dismissal path plus a dedicated post-exit cleanup removes the race while keeping the content mounted long enough to animate out correctly.

**Alternatives considered**:
- Keep `onExited` calling the same close handler: repeats the original double-cleanup race.
- Remove `onExited` entirely: leaves stale content in state and skips post-transition cleanup.

---

## Decision 3: Retain immediate display and the ~2 second auto-hide

**Decision**: Show the notification immediately on selection and auto-hide it after `POPOVER_HIDE_DELAY_MS` (2000 ms), matching the behavior introduced in the latest commit. Update the stale `"waits 1.5 seconds before showing a locked-floor popover"` test, which still asserts the older delayed-show design.

**Rationale**: The feature specification requires a notification on selection and defined instant feedback. The 1.5 s delayed-show test predates commit `83ba216a`, which intentionally replaced the delayed show with immediate display plus auto-hide but did not update the test. Restoring a 1.5 s delay would change the user experience beyond the reported bug and would weaken the "single clear message on selection" behavior.

**Alternatives considered**:
- Restore the 1.5 s delayed show to satisfy the stale test: changes UX scope, leaves the reported bug's timing untouched, and makes the notification feel unresponsive.
- Remove the auto-hide entirely: violates the spec requirement that the message disappears on its own.

---

## Decision 4: Restart, don't stack, when floors change or repeat

**Decision**: Selecting any off-limits floor sets the content (new floor or same floor), sets `noticeOpen = true`, and restarts the hide timer. Selecting a different floor updates the anchor so the single popover repositions to the latest button.

**Rationale**: The spec requires only one notification and the most recent floor label. Because the Popover remains `open` and only its props change, MUI updates the existing paper rather than creating a second one. Restarting the timer matches the requirement that repeated activation restarts the display period.

**Alternatives considered**:
- Close then reopen on every selection: introduces a guaranteed exit/enter flicker and a possible duplicate frame.
- Keep the first timer running when the floor changes: hides the message too early relative to the latest selection.

---

## Decision 5: Cancel on sidebar close; clear after exit

**Decision**: When the sidebar closes, cancel the pending timer and set `noticeOpen = false`. The popover then exits and `onExited` clears the content. Reopening the sidebar shows no stale notification.

**Rationale**: The spec requires that closing the floor list leaves no notification. Using the same dismissal path keeps this consistent with Escape/backdrop dismissal and avoids a second code path.

**Alternatives considered**:
- Clear `notice` immediately on sidebar close: reintroduces the blank exit frame.
- Leave the timer running: the notification could reappear after the sidebar is closed.

---

## Decision 6: Prove the fix with fake-timer lifecycle assertions

**Decision**: Add regression tests in `apps/frontend/src/tests/Sidebar.test.jsx` that:
- assert the exact visible text is `"<floor> is coming soon."` from selection through the hide timer and the exit transition;
- assert the blank form (`"is coming soon."` without a floor) never appears;
- assert only one `role="status"` element exists at any lifecycle point;
- cover rapid floor switching, repeated activation, Escape dismissal, sidebar close, and reduced motion.

**Rationale**: The bug is a transient render-state defect that jsdom can observe directly at each timer tick. The existing tests already use fake timers, so the regression can be deterministic and fast. Testing Library queries by accessible role and text detect exactly the blank/duplicate regression without screenshots.

**Alternatives considered**:
- End-to-end browser screenshots: slower, flakier, and not part of the current test stack.
- Manual verification only: violates constitution Principle III (bug fixes require a failing regression test).

---

## Resolved Unknowns

| Technical Context unknown | Resolution |
|---|---|
| Root cause of blank/duplicate message | `notice` cleared during active exit transition; documented in Decision 1 |
| Transition timing and reduced motion | Keep MUI `Popover`/`Grow` defaults; MUI already scales durations to `prefers-reduced-motion` |
| Intended display timing | Immediate show, ~2 s auto-hide (Decision 3) |
| Test strategy | Fake-timer lifecycle tests in the existing Sidebar suite (Decision 6) |
| Dependencies | None added |

## Constitution Alignment

All five principles remain satisfied: the fix stays inside the React frontend, uses the approved Vitest stack, adds a failing regression test first, introduces no secrets, and preserves the accessible, responsive notification contract.
