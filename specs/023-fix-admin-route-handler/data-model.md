# Data Model: Fix Admin Route Handler Error

## Overview

This feature is a bug fix, not a new data feature. No new entities, fields, or collections are introduced. The fix removes two broken route registrations from `AdminRoutes.js` whose controller handlers (`adminController.login`, `adminController.logout`) do not exist. The data model remains the existing `Admin` model.

## Existing Entities

### Admin

Represents an administrator account in the system. Stored in the `admins` MongoDB collection via the Mongoose schema in `apps/backend/models/Admins.js`.

| Field | Type | Required | Notes |
|---|---|---|---|
| username | String | yes | unique, trimmed, lowercase |
| email | String | yes | unique, trimmed, lowercase |
| password | String | yes | hashed with bcrypt before save |
| first_name | String | yes | trimmed |
| last_name | String | yes | trimmed |
| date_of_birth | Date | yes | |
| address | String | yes | trimmed |
| contact_number | String | yes | trimmed |
| is_active | Boolean | no | default `true` |
| createdAt / updatedAt | Date | no | managed by Mongoose timestamps |

Key behaviors:
- Password is hashed via `bcrypt.hash` with 10 salt rounds in a `pre('save)` hook when modified.
- `comparePassword(instanceMethod)` compares a clear-text candidate against the stored hash.
- Model exported as `Admin` from `apps/backend/models/Admins.js`.

## Entities Referenced by This Feature (no new data)

| Concept | What it represents | Data location |
|---|---|---|
| Admin route | API endpoint under admin management (login, logout, CRUD) | `apps/backend/routes/AdminRoutes.js` |
| Controller handler | Function exported from a controller that processes a request | `apps/backend/controllers/AdminController.js`, `AuthController.js` |
| Admin session | Authenticated admin state established by valid credentials | JWT access token + `httpOnly` refresh token cookie (existing, in `AuthController.js`) |

## Relationships

- Each `Admin` document can be retrieved, created, updated, deactivated/activated, or deleted through the admin CRUD routes.
- Admin sessions are established through the existing auth routes (`POST /api/admin/login`, `POST /api/admin/logout`), not through `AdminRoutes.js`.

## State Transitions

No new state transitions are introduced by this fix. The existing `is_active` field on `Admin` supports activate/deactivate transitions via `PATCH /api/admins/:id/activate` (unchanged).

## Data Impact of the Fix

- Removing `/login` and `/logout` from `AdminRoutes.js` has **no data impact**: no collections, fields, or documents are created, modified, or deleted.
- Login/logout continue to function through the existing `AuthRoutes.js` endpoints at `/api/admin/login` and `/api/admin/logout`, which read/write the `Admin` model and issue/clear tokens as before.

## Validation Rules (from existing model)

- `username` and `email` must be unique.
- `password` is required and is hashed before persistence.
- All string fields except `is_active` are required and trimmed.
