# Quickstart: MongoDB Connection Configuration Validation

## Purpose

Document runnable validation scenarios that prove the MongoDB connection configuration feature works end-to-end.

## Prerequisites

- Node.js LTS installed (via nvm)
- Backend dependencies installed (`npm install` in `apps/backend/`)
- `apps/backend/.env` exists with `MONGODB_URI` set (excluded from version control)
- MongoDB instance reachable at the configured `MONGODB_URI` (for positive test)

## Setup Commands

```bash
# From repo root
cd apps/backend
npm install
```

## Validation Scenarios

### Scenario 1: Server starts successfully with valid MONGODB_URI

**Prerequisites**: `MONGODB_URI` is set in `.env`; MongoDB is reachable.

**Steps**:
1. Start the backend: `npm run dev` (or `node index.js`)
2. Observe console output: "Connected to MongoDB." appears before the server accepts requests.
3. Send a request to `GET /api/health` and confirm a successful response.

**Expected outcome**: Server starts, MongoDB connection is established, health endpoint responds.

### Scenario 2: Server fails fast when MONGODB_URI is missing

**Prerequisites**: `MONGODB_URI` is unset (removed from `.env` or environment).

**Steps**:
1. Start the backend: `node index.js`
2. Observe console output and exit code.

**Expected outcome**: Server exits with a non-zero exit code and a clear error message indicating `MONGODB_URI` is missing. The `MONGODB_URI` value does not appear in the output.

### Scenario 3: Server fails fast when MongoDB is unreachable

**Prerequisites**: `MONGODB_URI` is set but points to an unreachable MongoDB instance.

**Steps**:
1. Start the backend: `node index.js`
2. Observe console output and exit code.

**Expected outcome**: Server exits with a non-zero exit code and a descriptive connection error. The `MONGODB_URI` value does not appear in the error output. No automatic retry occurs.

### Scenario 4: Environment variable naming consistency

**Prerequisites**: Backend source files are present.

**Steps**:
1. Search all files under `apps/backend/config/` and `apps/backend/scripts/` for MongoDB URI environment variable references.

**Expected outcome**: Only `MONGODB_URI` appears as the environment variable name for the MongoDB connection URI. `MONGO_URI` does not appear.

## Test Commands

```bash
# Run backend tests
cd apps/backend
npx vitest run
```

**Expected outcome**: All tests pass, including `env.test.js` which validates `MONGODB_URI` handling.

## References

- Feature spec: [spec.md](./spec.md)
- Data model: [data-model.md](./data-model.md)
- Contracts: [contracts/contracts.md](./contracts/contracts.md)
