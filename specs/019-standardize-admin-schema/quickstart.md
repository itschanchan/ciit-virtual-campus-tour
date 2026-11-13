# Quickstart: Validate Admin Schema Standardization

This guide documents runnable validation scenarios that prove the standardized Admin schema works end-to-end. It references the data model and contracts rather than duplicating them.

## Prerequisites

- Node.js LTS (via `nvm`) installed
- Backend dependencies installed (`npm install` in `apps/backend`)
- A running MongoDB instance (local or connection URI configured via `apps/backend/.env`)
- `apps/backend/.env` populated with `MONGODB_URI` and `JWT_SECRET` (see `.env.example`)

## Setup commands

From the repo root:

```bash
cd apps/backend
npm install
```

## Validation scenarios

### Scenario 1: Create an admin account with all required fields

**Command**:
```bash
cd apps/backend
npm test -- --run tests/adminAuth.test.js
```

**Expected outcome**: Admin creation tests pass; an admin document is stored with `username`, `email`, hashed `password`, `first_name`, `last_name`, `role: "admin"`, `is_active: true`, and `createdAt`/`updatedAt` timestamps.

**References**: [data-model.md](../data-model.md), [admin-data-contract.md](./contracts/admin-data-contract.md)

### Scenario 2: Reject duplicate username or email

**Command**:
```bash
cd apps/backend
npm test -- --run tests/adminAuth.test.js
```

**Expected outcome**: Attempts to create an admin with an existing `username` or `email` are rejected with a validation error.

**References**: [data-model.md](../data-model.md)

### Scenario 3: Password is never stored in plaintext

**Command**:
```bash
cd apps/backend
npm test -- --run tests/adminAuth.test.js
```

**Expected outcome**: The stored `password` field differs from the clear-text input; a hash comparison (`comparePassword`) succeeds for the correct password and fails for an incorrect one.

**References**: [admin-data-contract.md](./contracts/admin-data-contract.md)

### Scenario 4: Credential verification accepts correct / rejects incorrect password

**Command**:
```bash
cd apps/backend
npm test -- --run tests/adminAuth.test.js
```

**Expected outcome**:
- Correct password + active account → login succeeds, JWT cookie set
- Incorrect password → `401 Invalid credentials`
- Inactive account → login denied

**References**: [contracts/admin-data-contract.md](./contracts/admin-data-contract.md), [specs/017-admin-auth-dashboard/contracts/admin-auth-api.md](../017-admin-auth-dashboard/contracts/admin-auth-api.md)

### Scenario 5: Timestamps present on every admin account

**Command**:
```bash
cd apps/backend
npm test -- --run tests/adminAuth.test.js
```

**Expected outcome**: Every stored admin document includes `createdAt` and `updatedAt`.

**References**: [data-model.md](../data-model.md)

## Run all validation

```bash
cd apps/backend
npm test -- --run
```

## Expected final state

All admin auth tests pass; no plaintext passwords are stored; duplicate usernames/emails are rejected; inactive accounts cannot log in; timestamps are present on every account.

## What to avoid in this guide

- Full model/service/controller bodies (implementation belongs in `/speckit.tasks` and the implementation phase)
- Migrations or schema setup scripts
- Complete test suites (only scenario summaries and commands are shown here)
