# Page Management

## Purpose

Describes how the virtual campus tour frontend organizes its top-level views (pages) and how the application shell switches between them.

## Folder structure

```
src/
├── pages/
│   ├── Panorama.jsx   # Main tour surface (panorama viewer, narration, gallery)
│   └── Dashboard.jsx  # Backend dashboard (stub)
├── components/
│   ├── Layout.jsx     # App shell: header, sidebar, active-page outlet
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── RoomGallery.jsx
│   ├── NarrationPlayer.jsx
│   ├── PanoramaViewer.jsx
│   ├── ErrorBoundary.jsx
│   └── Marzipano.jsx
└── context/
    └── useTour.js
```

## How views are rendered

`Layout.jsx` is the single app shell. It holds the active view in local state
(`activeView`, default `"panorama"`) and renders either `<Panorama />` or
`<Dashboard />` inside the main content area:

```jsx
{activeView === "panorama" ? <Panorama /> : <Dashboard />}
```

## Adding or switching views

1. Create a new page component under `src/pages/` (a single flat file).
2. Import it in `Layout.jsx`.
3. Add a branch to the conditional render in `Layout.jsx` and a way to set
   `activeView` (for example, a navigation action in the sidebar/header).

## Navigation guidance

For now there is no router; view switching is handled by `Layout` state. If
navigation between views becomes complex (multiple routes, deep links, history
management), consider adding `react-router-dom`. This requires maintainer
approval before installation per the project's dependency constraint.

## Conventions

- Keep `src/pages/` flat (one file per page) unless a page grows large enough
  to need its own subfolder of page-specific components.
- Pages compose presentational components from `src/components/`; they do not
  duplicate UI markup.
- Keep each page focused on a single user task.
