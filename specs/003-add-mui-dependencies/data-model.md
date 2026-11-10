# Phase 1 Data Model: Add MUI React Dependencies

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature stores no application data. The "entities" below describe the dependency records that must stay consistent across the manifest, lockfile, and documentation.

## Dependency Record

Represents one package the frontend relies on.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `name` | Package identifier | Must match the name in `apps/frontend/package.json` exactly |
| `versionRange` | Declared semver range | Must satisfy the installed React version and the package's peer requirements |
| `layer` | `runtime` or `development` | MUI and Emotion are recorded as `runtime` |
| `approval` | Approval status | Must be `Approved`; the maintainer requested these packages |
| `purpose` | One-line contribution | Must explain the package's role in the frontend |
| `peerRequirements` | Required companion packages | Every required peer must also be present or explicitly documented as intentionally omitted |

### Initial Records

| Name | Version range | Layer | Approval | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `@mui/material` | `^9.5.0` | runtime | Approved | Core component library for future interface surfaces |
| `@mui/icons-material` | `^9.5.0` | runtime | Approved | Material icon components used with MUI controls |
| `@emotion/react` | `^11.14.0` | runtime | Approved | Style engine peer required by MUI |
| `@emotion/styled` | `^11.14.1` | runtime | Approved | Styled-component peer required by MUI |

### Validation Rules

- Every runtime package in the manifest must have a matching documentation entry.
- Every MUI package's required Emotion peers must be declared.
- `@mui/material-pigment-css` must not be declared; it is an optional peer for an unused styling path.
- No added record may be a `development` dependency; these packages ship with the frontend.
- Version ranges must resolve with the installed React 19.x line without peer-dependency errors.

## Documentation Entry

Represents the publishable description of a dependency in `docs/tech_stack.md` or `docs/project_setup.md`.

| Field | Description | Validation |
| :--- | :--- | :--- |
| `document` | File that contains the entry | Must be one of the two files named in the request |
| `section` | Table row or guidance section | Must use the existing structure of that document |
| `packageReferences` | Packages the entry describes | Must cover all four added packages across the two documents |
| `approval` | Approval status shown to contributors | Must match the Dependency Record |
| `coexistenceRule` | Styling relationship | Must state that Tailwind remains primary and MUI is additive |

### Relationships

- One Dependency Record maps to one or more Documentation Entries.
- All four Dependency Records must be covered by the runtime dependency table in `docs/tech_stack.md`.
- The setup guidance in `docs/project_setup.md` references the same package set and coexistence rule.

## State Transitions

A dependency moves through these states in this feature:

1. **Requested**: The maintainer asks for MUI packages.
2. **Approved**: Approval is recorded in the documentation.
3. **Declared**: Packages appear in `apps/frontend/package.json`.
4. **Installed**: The lockfile resolves all packages and peers.
5. **Documented**: Both documents describe the packages and coexistence rule.

The feature is complete only when every added package reaches the **Documented** state.
