# Research: Standardize Admin Mongoose Schema

## Decisions

### Decision 1: Schema field syntax (compact vs expanded)

**Decision**: Use compact single-line field definitions per the reference schema (e.g., `username: { type: String, required: true, unique: true }`) rather than the expanded multi-line block currently in `Admins.js`.

**Rationale**: The reference document `docs/prompts/backend-prompts/admin_schema.md` presents the industry-standard Mongoose instantiation pattern with compact field declarations. Adopting it makes `Admins.js` consistent with the documented standard and improves readability.

**Alternatives considered**: Keep the existing expanded multi-line syntax (rejected — does not match the reference standard the user asked to align with).

### Decision 2: Role field constraints

**Decision**: Constrain `role` to an `enum` of `["admin"]` with a default of `"admin"`.

**Rationale**: The spec states the admin role defaults to `"admin"`. The reference schema demonstrates the `enum` pattern for role fields, which prevents invalid role values from being persisted.

**Alternatives considered**: Keep `role` as an unconstrained `String` (rejected — allows invalid roles, weaker data integrity).

### Decision 3: Password salt rounds

**Decision**: Use 10 salt rounds for bcrypt password hashing in the pre-save middleware.

**Rationale**: The reference schema identifies 10 as the "sweet spot" for salt rounds, balancing security and computational cost.

**Alternatives considered**: Higher/lower salt rounds (rejected — 10 is the documented industry-standard default in the reference).

### Decision 4: comparePassword instance method

**Decision**: Add a `comparePassword(candidatePassword)` instance method to the schema that compares a clear-text password against the stored hash via `bcrypt.compare`.

**Rationale**: The reference schema includes this method, and the spec requires credential verification (FR-005). It centralizes password comparison logic on the model.

**Alternatives considered**: Compare passwords in the service layer only (rejected — duplicates logic and deviates from the reference pattern).

### Decision 5: Field naming (password / is_active)

**Observation**: The standardized schema keeps the field names `password` and `is_active` per the reference and spec. The existing consuming service (`apps/backend/services/adminAuthService.js`) references `passwordHash` and `isActive` (camelCase), which do not match the schema's `password` and `is_active` (snake_case).

**Rationale**: This feature standardizes schema *instantiation syntax*, not field names. Reconciling the service-layer field references (`passwordHash` → `password`, `isActive` → `is_active`) is an implementation-task concern to be addressed in `/speckit.tasks`, not a schema change.

**Alternatives considered**: Rename schema fields to `passwordHash`/`isActive` to match the service (rejected — would deviate from the reference schema and spec field names).

## Dependencies

- `mongoose` (runtime, approved per constitution)
- `bcrypt` (runtime, used for password hashing/comparison)
- ` Vitest` + `supertest` (dev, approved per constitution) for schema and auth tests

## Integrations

- `adminAuthService.js` consumes the `Admin` model for login/session lookup (`findOne`, `findById`) and reads `passwordHash`/`isActive`.
- `adminAuthController.js` and `adminAuthRoutes.js` expose `/api/admin/login`, `/api/admin/logout`, `/api/admin/session`.
- Existing contract documented in `specs/017-admin-auth-dashboard/contracts/admin-auth-api.md` remains unchanged by this schema standardization.
