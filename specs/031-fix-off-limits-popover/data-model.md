# Phase 1 Data Model: Fix Off-Limits Popover Duplicate Message

**Feature**: 031-fix-off-limits-popover
**Created**: 2026-11-26
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

This feature has no persisted data. The "data model" describes the transient notification state machine that drives the off-limits Popover in `apps/frontend/src/components/Sidebar.jsx`.

## Entity: Off-Limits Notice

Represents the single transient message shown when a visitor selects an off-limits floor.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `floor` | string | Floor label shown in the message (e.g., `"1F"`) | Must belong to `LOCKED_FLOORS` (`1F`, `2F`, `3F`, `10F`, `11F`) |
| `anchorEl` | HTMLElement \| null | The selected floor button that the popover is positioned against | Must remain stable for the entire visible and exiting lifecycle |
| `noticeOpen` | boolean | Whether the popover should be visible | `false` triggers the exit transition; content is not cleared yet |
| `hideTimer` | timeout handle (ref) | Pending auto-hide timer | At most one active timer at a time; cleared on dismiss, replacement, sidebar close, and unmount |

### Derived/Rendered Value

- **Message text**: `${floor} is coming soon.`
- The message text must never render without a floor label while the popover is mounted.

## State Machine

```text
                 select locked floor
        IDLE ───────────────────────────▶ VISIBLE
          ▲                                 │  │
          │                                 │  │ select another floor
          │                                 │  └──────────────┐
          │                                 │                 │
          │        auto-hide timer fires    │                 ▼
          │        or dismiss (Esc/backdrop)│            VISIBLE (content
          │        or sidebar closes        │             replaced, anchor
          │                                 ▼             updated, timer
          │                              HIDING           restarted)
          │                                 │
          └─────────────────────────────────┘
                    exit transition completes (onExited)

IDLE:    notice = null,  noticeOpen = false, no timer
VISIBLE: notice = {floor, anchorEl}, noticeOpen = true, timer scheduled
HIDING:  notice retained, noticeOpen = false, no timer; label stays complete
```

## State Transitions

| From | Trigger | To | Actions |
|---|---|---|---|
| IDLE | Select a locked floor | VISIBLE | Set notice content; set `noticeOpen = true`; start/restart hide timer |
| VISIBLE | Select the same floor again | VISIBLE | Keep content; restart hide timer; no second popover |
| VISIBLE | Select a different locked floor | VISIBLE | Replace `floor` and `anchorEl`; restart hide timer; still one popover |
| VISIBLE | Auto-hide timer fires | HIDING | Clear timer; set `noticeOpen = false`; keep notice content and anchor |
| VISIBLE | Dismiss (Escape or backdrop) | HIDING | Clear timer; set `noticeOpen = false`; keep notice content and anchor |
| VISIBLE / HIDING | Sidebar closes | HIDING | Clear timer; set `noticeOpen = false`; keep content until exit completes |
| HIDING | Exit transition completes | IDLE | Set `notice = null`; no message remains |
| HIDING | Select a locked floor before exit completes | VISIBLE | Replace content/anchor; set `noticeOpen = true`; restart timer (transition reverses) |

## Invariants

1. **Single notice**: At most one Popover / `role="status"` element exists at any time.
2. **Complete label**: Whenever the popover is mounted and visible, its text contains the current floor label followed by `"is coming soon."`.
3. **Stable anchor**: `anchorEl` does not change between the start of hiding and `onExited`.
4. **No stale content**: `notice` is `null` only in the IDLE state.
5. **Timer uniqueness**: `hideTimer` references at most one pending timeout; stale timers are cleared before scheduling a new one.
6. **Cancel on close**: Closing the sidebar leaves the state on a path to IDLE with no pending timer.

## Validation Rules

- A selection event only produces a notice for floors in `LOCKED_FLOORS`.
- The auto-hide period is `POPOVER_HIDE_DELAY_MS` (2000 ms) measured from the latest selection.
- Reduced-motion preference affects animation duration only; it must not change the state sequence or duplicate the notice.
