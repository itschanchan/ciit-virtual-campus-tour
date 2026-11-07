# Data Model: Fix Sidebar Buttons

## Overview

This feature is a frontend UI fix with no database or persistent storage. The data model describes the in-memory domain entities involved in the floor-to-location mapping and button click behavior.

## Entities

### Floor

Represents a campus floor shown as a button in the sidebar.

| Field | Type | Description |
|-------|------|-------------|
| label | string | Floor label, e.g. "LG", "UG", "4F", "5F", "5M", "6F", "7F", "8F", "9F", "1F", "2F", "3F", "10F", "11F" |
| sequenceOrder | number | Position in `FLOOR_SEQUENCE` (0-based) |
| locked | boolean | Whether the floor is locked (off limits), per `LOCKED_FLOORS` |

### Location

Represents a campus location with associated panorama data.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique location identifier |
| name | string | Display name of the location |
| panorama | object\|null | Panorama scene data; null when no tile is available for this floor |
| order | number | Sort order for locations |

### FloorToLocationMapping

The association between a floor label and its location data.

| Field | Type | Description |
|-------|------|-------------|
| floorLabel | string | Floor label (key from `FLOOR_SEQUENCE`) |
| location | Location\|null | Matched location entry, or null when no location exists for this floor |
| available | boolean | Whether `location` is non-null and `location.panorama` is present |

## Relationships

- A **Floor** maps to at most one **Location** via the floor label (not array position).
- A **Location** is associated with a floor by matching its position in the sorted locations list to the floor label.
- `FloorToLocationMapping.available` is `true` only when `location` exists and `location.panorama` is non-null.

## Validation Rules

- Each floor label appears at most once in `FLOOR_SEQUENCE`.
- Each location `id` is unique within the `locations` array.
- A floor button is clickable (`disabled = false`) only when: not locked AND `available === true`.
- A floor button is disabled when: not locked AND `available === false`.
- A floor button is visually "off limits" when: locked (regardless of availability).

## State Transitions

| From | Trigger | To | Condition |
|------|---------|-----|-----------|
| inactive | Visitor clicks available button | scene-switching | Button is clickable (not locked, available) |
| scene-switching | Panorama viewer loads scene | inactive | Viewer confirms new scene displayed |
| inactive | Visitor clicks unavailable button | inactive | No transition; click is ignored |
| inactive | Visitor clicks locked button | inactive | No transition; locked-floor notice shown instead |

## Notes

- No persistence layer; all data lives in component props/state during a session.
- Panorama scene IDs are referenced by floor label via the existing `FLOOR_SCENE_MAP` (unchanged by this fix).
