# UI Contract: Off-Limits Notice Popover

**Feature**: 031-fix-off-limits-popover
**Created**: 2026-11-26
**Spec**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines how `Sidebar.jsx` presents the transient "coming soon" notice for off-limits floors and how it behaves across the notice lifecycle.

## Component Boundary

`Sidebar` owns the notice state and renders one MUI `Popover`. No other component renders an off-limits notice.

## Inputs

| Input | Type | Source | Description |
|---|---|---|---|
| Locked-floor selection | event (`floor`, `currentTarget`) | `FloorButton` → `onLocked` | Visitor activates a floor in `LOCKED_FLOORS` |
| Dismiss request | event (`Escape` / backdrop) | MUI `Popover` `onClose` | Visitor dismisses the visible notice |
| Sidebar open state | boolean | `Layout` prop `open` | When it becomes `false`, the notice must be cancelled |
| Reduced motion | media query | `prefers-reduced-motion` | Animation duration only; behavior unchanged |

## Outputs / DOM Contract

While the notice is visible or exiting, the DOM MUST expose exactly one element with:

| Attribute/Content | Required value |
|---|---|
| Role | `status` |
| `aria-live` | `polite` |
| Text | `"<floor> is coming soon."` where `<floor>` is the selected floor label |
| Anchor | Positioned against the selected floor button |
| Count | Exactly one such element |

### Required behavior

1. **On selection**: the fully labelled notice becomes visible immediately.
2. **During display**: the text never becomes empty, truncated, or label-less (for example, `"is coming soon."` alone is forbidden).
3. **During exit**: the text and anchor remain unchanged until the exit transition finishes; the popover must not jump to another location.
4. **Auto-hide**: the notice begins hiding after `POPOVER_HIDE_DELAY_MS` (2000 ms) from the latest selection.
5. **Replacement**: selecting another off-limits floor updates the existing notice to the latest floor and restarts the timer; it must not stack a second notice.
6. **Repeat selection**: selecting the same floor restarts the timer without creating a second notice.
7. **Dismissal**: `Escape` or backdrop click hides the notice immediately and cancels the pending auto-hide.
8. **Sidebar close**: closing the sidebar hides the notice and cancels the pending auto-hide; no notice reappears afterward.

## Forbidden Behaviors (Regression Guards)

- Rendering `" is coming soon."` with a blank floor label at any point.
- Two `role="status"` notice elements at the same time.
- A second `"coming soon."` message appearing after the labelled message and before hiding.
- Repositioning the exiting notice to a location other than the selected floor button.
- Re-showing a dismissed notice.
- A pending timer firing after the sidebar has closed.

## Accessibility Contract

- The notice is announced once per activation through `role="status"` and `aria-live="polite"`.
- The announcement includes the full floor label.
- The notice does not trap focus; it is non-blocking and dismissible by keyboard (`Escape`).
- Reduced-motion users receive the same complete, single notice with shortened animation.

## Responsive Contract

- Verified at desktop (1440×900), tablet (768×1024), and mobile (375×667) viewports.
- The notice remains fully visible, does not overflow the viewport, and stays anchored near the selected floor on all three sizes.

## Out of Scope

- Changing which floors are off limits or the message wording.
- Changing the notification from a popover to another pattern.
- Backend, API, persistence, or new dependencies.
- Restoring a delayed show before the notice appears.
