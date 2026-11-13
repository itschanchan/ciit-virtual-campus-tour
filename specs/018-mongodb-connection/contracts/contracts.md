# Interface Contracts: MongoDB Connection Configuration

## Summary

This feature standardizes internal backend configuration for the MongoDB connection. It does **not** introduce new external API interfaces, change existing endpoint contracts, or expose new surface area to clients.

## Existing Interfaces (unchanged by this feature)

| Interface | Type | Description |
|-----------|------|-------------|
| `GET /api/health` | HTTP GET | Health check endpoint; unchanged |
| `POST /api/admin/*` | HTTP POST | Admin authentication endpoints; unchanged |

## Internal Configuration Contract

The following environment variables constitute the internal configuration contract for the MongoDB connection:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | Canonical MongoDB connection URI; used by `config/db.js`, `config/env.js`, `scripts/create-admin.js` |
| `MONGODB_NAME` | No | Optional database name; used by `config/db.js` |

## Contract Stability

- No breaking changes to external API contracts.
- Internal environment variable naming is standardized to `MONGODB_URI` (previously `MONGO_URI` in `config/db.js`).
- `.env` file remains excluded from version control; no `.env.example` or `.rest` files are included in specs.
