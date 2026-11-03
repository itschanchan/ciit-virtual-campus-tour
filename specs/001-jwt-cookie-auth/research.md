# Research: JWT Cookie Access

**Feature**: JWT Cookie Access (001-jwt-cookie-auth)
**Date**: 2026-11-04

## Decision: Dependency — cookie-parser

**Decision**: Add `cookie-parser` as a backend runtime dependency.

**Rationale**: The project constitution (Principle IV) requires `cookie-parser` before cookie-based authentication ships, and the approved dependencies list includes `cookie-parser`. Express 5 does not parse cookies into `req.cookies` without it. `cookie-parser` populates `req.cookies` so the auth middleware can read the JWT from the cookie header.

**Alternatives considered**:
- Manual cookie header parsing (rejected: error-prone, duplicates established middleware)
- `express.cookieParser()` built-in (rejected: removed in Express 4.x/5.x)

## Decision: JWT Signing and Verification

**Decision**: Use the `jsonwebtoken` package (already a declared dependency) with HS256 algorithm and a `JWT_SECRET` environment variable.

**Rationale**: `jsonwebtoken@^9.0.3` is already installed and listed in the constitution's approved dependencies. HS256 is sufficient for a single-service backend where the same secret signs and verifies tokens. The secret must come from `dotenv`-loaded environment variables, never hardcoded.

**Alternatives considered**:
- RS256 (rejected: unnecessary key-pair complexity for single-service backend)
- `jose` library (rejected: not in approved dependencies; would require maintainer approval)

## Decision: Cookie Security Attributes

**Decision**: Set authentication cookies with `httpOnly`, `secure`, and `sameSite: 'strict'`.

**Rationale**: Clarification Q2 confirmed all three attributes. `httpOnly` prevents client-side JavaScript access (mitigates XSS token theft). `secure` ensures cookies are only sent over HTTPS. `sameSite: 'strict'` prevents the cookie from being sent with cross-site requests (mitigates CSRF). Per the clarification, sessions use `SameSite=Strict`.

**Alternatives considered**:
- `sameSite: 'lax'` (rejected: clarification specified Strict)
- No SameSite (rejected: weakens CSRF protection)

## Decision: User Identity

**Decision**: Authenticate users by email address only.

**Rationale**: Clarification Q1 confirmed email-based login. The User model will have a unique email field. No separate username namespace is maintained.

**Alternatives considered**:
- Username only (rejected: clarification selected email)
- Either email or username (rejected: clarification selected email only)

## Decision: Rate Limiting

**Decision**: Rate-limit failed login attempts by IP address only.

**Rationale**: Clarification Q3 confirmed IP-based rate limiting. This blocks brute-force attempts from a single IP without penalizing legitimate users sharing an IP (e.g., behind NAT).

**Alternatives considered**:
- Rate limit by email (rejected: clarification selected IP only)
- Rate limit by email + IP (rejected: clarification selected IP only)
- No rate limiting (rejected: security gap for brute-force attacks)

## Decision: Session Duration

**Decision**: JWT expires after 24 hours.

**Rationale**: The spec assumptions state a 24-hour session duration is sufficient. Configured via `JWT_EXPIRES_IN=24h` environment variable.

**Alternatives considered**:
- Shorter duration (e.g., 1 hour) (rejected: assumption specifies 24 hours)
- No expiration (rejected: security risk; spec requires time-limited credentials)

## Decision: Mongoose User Model

**Decision**: User model with `email` (unique, required) and `passwordHash` (required) fields. Passwords are never stored in plaintext.

**Rationale**: Supports email-based login (FR-001) and constitution Principle IV (no plaintext passwords). The existing MongoDB connection via `config/db.js` is reused.

**Alternatives considered**:
- Embedding sessions in User document (rejected: JWT is stateless; session state lives in the client cookie)
