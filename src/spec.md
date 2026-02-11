# Specification

## Summary
**Goal:** Replace the current mod-menu/authenticated experience with a laptop-only 2D web-browser-style UI that loads websites in an iframe.

**Planned changes:**
- Remove/replace the existing mod-menu/VR/authentication-first UI flow with a desktop/laptop browser page as the primary experience.
- Add a browser-like top bar with URL input and controls: Back, Forward, Reload, and Go (Enter key supported).
- Implement app-managed navigation history for URLs entered in the URL bar (Back/Forward), and reload the current iframe URL on demand.
- Normalize entered addresses by prepending `https://` when the protocol is missing.
- Update app shell branding to match the new browser experience (HTML document title and PWA manifest name/short_name/description).
- Apply a consistent visual theme across the browser UI (colors, typography, spacing) and ensure responsive layout for typical laptop widths.

**User-visible outcome:** On a laptop/desktop browser, users see a simple web-browser interface with a URL bar and navigation buttons, can load sites in an iframe, and can go back/forward/reload within their entered-URL history—without any VR/mod-menu/authentication UI.
