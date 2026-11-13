# Admin Data Contract

This contract describes the `Admin` Mongoose model interface consumed by the backend authentication layer. It complements the HTTP API contract documented in `specs/017-admin-auth-dashboard/contracts/admin-auth-api.md`, which remains unchanged by this schema standardization.

## Model

**File**: `apps/backend/models/Admins.js`

**Model name**: `Admin`

**Collection**: `admins`

## Fields exposed to the service layer

| Field | Type | Exposed | Notes |
|-------|------|---------|-------|
| `_id` | ObjectId | Yes | Document identifier; mapped to `id` in sanitized output |
| `username` | String | Yes | Unique, lowercased |
| `email` | String | Yes | Unique, lowercased |
| `password` | String | No | Hashed value; never returned by `sanitizeAdmin` |
| `first_name` | String | Yes | — |
| `last_name` | String | Yes | — |
| `role` | String | Yes | Defaults to `"admin"` |
| `is_active` | Boolean | Yes | Defaults to `true` |
| `createdAt` | Date | Yes | Auto-managed (timestamps) |
| `updatedAt` | Date | Yes | Auto-managed (timestamps) |

## Methods exposed to the service layer

- `comparePassword(candidatePassword)` → `Promise<boolean>`: Compares a clear-text password against the stored hash. Used by the login flow.

## Service-layer consumption

`apps/backend/services/adminAuthService.js` consumes the model via:

- `AdminModel.findOne({ $or: [{ username }, { email }] })` — lookup by identifier for login
- `AdminModel.findById(id)` — lookup by id for session restoration
- `admin.passwordHash` — hashed password field read during credential comparison
- `admin.isActive` — active-status check during login and session restoration
- `admin.toObject()` — plain-object conversion for sanitization

## Field-naming note

The schema field names are `password` and `is_active` (per the reference schema). The consuming service references `passwordHash` and `isActive`. This mismatch is documented in `research.md` (Decision 5) and must be reconciled during implementation so the service reads the correct schema fields.

## HTTP API contract

Unchanged by this feature. See `specs/017-admin-auth-dashboard/contracts/admin-auth-api.md` for:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
