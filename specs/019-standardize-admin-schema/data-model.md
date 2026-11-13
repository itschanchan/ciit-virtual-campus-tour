# Data Model: Admin

## Entity: Admin

Represents an administrative user account for the CIIT Virtual Campus Tour backend. One document per admin in the `admins` MongoDB collection.

## Fields

| Field | Type | Required | Unique | Default | Validation / Notes |
|-------|------|----------|--------|---------|--------------------|
| username | String | Yes | Yes | — | Trimmed, lowercased; unique across admins |
| email | String | Yes | Yes | — | Trimmed, lowercased; unique across admins |
| password | String | Yes | No | — | Hashed via bcrypt before storage; never stored plaintext |
| first_name | String | Yes | No | — | — |
| last_name | String | Yes | No | — | — |
| role | String | No | No | `"admin"` | Enum: `["admin"]` |
| is_active | Boolean | No | No | `true` | Toggles administrative access on/off |
| createdAt | Date | No | No | — | Auto-managed by Mongoose timestamps |
| updatedAt | Date | No | No | — | Auto-managed by Mongoose timestamps |

## Validation Rules

- `username` must be present, unique, trimmed, and lowercased.
- `email` must be present, unique, trimmed, and lowercased.
- `password` must be present; is hashed on `save` when modified.
- `first_name` and `last_name` must be present.
- `role` must be one of `["admin"]`; defaults to `"admin"`.
- `is_active` defaults to `true`.

## Relationships

- One admin has zero or more authenticated sessions (managed via JWT cookies at the auth layer, not stored on the Admin document).
- No foreign-key relationships to other collections in this feature scope.

## State Transitions

| From | To | Trigger | Condition |
|------|----|---------|-----------|
| inactive | active | Admin reactivation | `is_active` set to `true` |
| active | inactive | Admin deactivation / suspension | `is_active` set to `false` |
| — | — | Password change | `password` field modified → pre-save middleware re-hashes |

## Indexes

- Unique index on `username`
- Unique index on `email`
