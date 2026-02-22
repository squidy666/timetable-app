# School Timetable App — Design Document

**Date:** 2026-02-22
**Status:** Approved

---

## Overview

A simple web app for a student to view (and edit) their school timetable. Supports two alternating weeks (Week A and Week B), is viewable on mobile and desktop, and is printable to a phone-sized hardcopy.

---

## Requirements

- Display a two-week rotating school timetable (Week A, Week B)
- Row headers: AAM, AM, RC, 1, 2, R, 3, 4, L, 5, PM
- Column headers: Mon, Tue, Wed, Thu, Fri
- Each class cell shows: subject code (color-coded), teacher code, room number
- Break rows (AAM, AM, R, L, PM) span the full width with no class data
- Editable by parent and son from any device (changes sync in real-time)
- Responsive: works on mobile and desktop
- Printable to approximately iPhone-sized hardcopy

---

## Architecture

**Type:** Static single-page app (SPA) — no build step, no framework
**Hosting:** GitHub Pages
**Backend:** Firebase Firestore (free tier)

### Files

```
timetable_app/
├── index.html       # App shell, markup
├── style.css        # All styling (responsive + print)
├── app.js           # Firebase integration, rendering, edit logic
├── firebase.js      # Firebase config (API keys for web — public is fine)
└── docs/
    └── plans/
        └── 2026-02-22-timetable-app-design.md
```

---

## Data Model

Single Firestore document at `timetable/data`.

```json
{
  "weekA": {
    "Mon": {
      "RC":  { "subject": "7Fitzroy1", "teacher": "LEEP", "room": "E41", "color": "#ffffcc" },
      "1":   { "subject": "7MATD",     "teacher": "CRIC", "room": "D17", "color": "#ff6666" },
      "2":   { "subject": "7WELD",     "teacher": "GARS", "room": "E37", "color": "#aaddff" },
      "3":   { "subject": "7ENG.D",    "teacher": "KRIR", "room": "E33", "color": "#88cc44" },
      "4":   { "subject": "7VIA5",     "teacher": "BILF", "room": "F46", "color": "#cc88ff" },
      "5":   { "subject": "7SCI.D",    "teacher": "KATZ", "room": "E23", "color": "#4488ff" }
    },
    "Tue": { ... },
    "Wed": { ... },
    "Thu": { ... },
    "Fri": { ... }
  },
  "weekB": { ... }
}
```

**Row keys:** `AAM`, `AM`, `RC`, `1`, `2`, `R`, `3`, `4`, `L`, `5`, `PM`
**Break rows** (`AAM`, `AM`, `R`, `L`, `PM`): No cell data stored — rendered as full-width shaded dividers.
**Column keys:** `Mon`, `Tue`, `Wed`, `Thu`, `Fri`

---

## UI Design

### Layout

- **Header:** App title + Week A / Week B tab toggle + Edit button + Print button
- **Timetable grid:** HTML table or CSS Grid
  - Sticky left column: row labels
  - Sticky top row: day headers
  - Break rows: span all 5 day columns, lightly shaded
  - Class cells: colored subject pill, teacher code, room number
- **Mobile:** Table scrolls horizontally; sticky headers prevent disorientation

### Week Toggle

Two tabs — "Week A" and "Week B". The active week's table is shown; the other is hidden. Tab state can optionally be remembered in localStorage.

### Color Coding

Each class cell has a background color associated with the subject. Colors are stored per-cell in Firestore. A color palette of ~12 distinct colors is provided in the editor. Colors print with "Background graphics" enabled.

### Edit Mode

1. Tap the padlock icon (top right) to toggle edit mode on/off
2. In edit mode, cells show a subtle highlight border
3. Tapping a class cell opens an inline popover with fields:
   - Subject (text input)
   - Teacher (text input)
   - Room (text input)
   - Color (swatch picker from palette)
4. Save button in popover writes the change to Firestore immediately
5. No authentication required — simple toggle. (PIN protection can be added later.)

### Print

- "Print" button triggers `window.print()`
- `@media print` CSS:
  - Hides navigation, tabs, buttons
  - Both Week A and Week B render stacked vertically on one page
  - Target dimensions: ~95mm × 130mm (folded phone-sized card)
  - Compact font (8–9pt) and tight row heights
  - Colors preserved (user must enable "Background graphics" in browser print dialog)
  - On-screen note: "Enable Background Graphics in print settings to print colors"

---

## Initial Data

The app will be seeded with all timetable data from the source photo:

**Week A**

| Row | MonA | TueA | WedA | ThuA | FriA |
|-----|------|------|------|------|------|
| RC | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 |
| 1 | 7MATD / CRIC / D17 | 7PED / DAVC / CANTEEN1 | 7PDHD / DAVC / G55 | 7ENG.D / KRIR / E33 | 7NSRD / CAMN / E26 |
| 2 | 7WELD / GARS / E37 | 7MUS.D / MORM / H56 | 7MATD / CRIC / D17 | 7SCI.D / KATZ / E23 | 7ENG.D / KRIR / E33 |
| 3 | 7ENG.D / KRIR / E33 | 7SCI.D / KATZ / E23 | 7TM5 / FIER / F52 | (Period 3) 7Assembly / HALL1 | 7MATD / CRIC / D17 |
| 4 | 7VIA5 / BILF / F46 | 7TM5 / RABS / F52 | 7HSID / JOHC / E27 | 7SP4 / PERJ / G54 | 7HSID / JOHC / E27 |
| 5 | 7SCI.D / KATZ / E23 | 7HSID / JOHC / E27 | 7ENG.D / KRIR / E33 | 7MATD / CRIC / D17 | 7PED / DAVC / CANTEEN1 |

**Week B**

| Row | MonB | TueB | WedB | ThuB | FriB |
|-----|------|------|------|------|------|
| RC | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 | 7Fitzroy1 / LEEP / E41 |
| 1 | 7PDHD / DAVC / G55 | 7SCI.D / KATZ / E23 | 7ENG.D / KRIR / E33 | 7SCI.D / KATZ / E23 | 7MATD / CRIC / D17 |
| 2 | 7MATD / CRIC / D17 | 7TM5 / RABS / F52 | 7VIA5 / BILF / F46 | 7TM5 / RABS / F52 | 7HSID / JOHC / E27 |
| 3 | 7HSID / JOHC / E27 | 7ENG.D / KRIR / E33 | 7PED / DAVC / CANTEEN1 | (Period 3) 7Assembly / HALL1 | 7SCI.D / KATZ / E23 |
| 4 | 7SCI.D / KATZ / E23 | 7VIA5 / BILF / F46 | 7TM5 / FIER / F49 | 7SP4 / PERJ / G54 | 7MUS.D / MORM / H56 |
| 5 | 7TM5 / RABS / F52 | 7MUS.D / MORM / H56 | 7HSID / JOHC / E27 | 7MATD / CRIC / D17 | 7ENG.D / KRIR / E33 |

---

## Subject Color Palette

Approximate colors from the photo (can be refined during implementation):

| Subject | Color |
|---------|-------|
| 7MATD | Red (#e74c3c) |
| 7ENG.D | Green (#27ae60) |
| 7SCI.D | Blue (#2980b9) |
| 7HSID | Orange (#e67e22) |
| 7VIA5 | Purple (#8e44ad) |
| 7TM5 | Pink (#e91e8c) |
| 7PDHD | Dark blue (#1a237e) |
| 7PED | Teal (#00897b) |
| 7WELD | Light blue (#42a5f5) |
| 7NSRD | Light purple (#ce93d8) |
| 7MUS.D | Yellow-green (#c0ca33) |
| 7SP4 | Dark green (#2e7d32) |
| 7Fitzroy1 | Yellow (#fffde7) |
| 7Assembly | Grey (#9e9e9e) |

---

## Non-Goals (YAGNI)

- No user accounts or login
- No multiple student support
- No notification or reminder features
- No history or undo beyond Firestore's own versioning
- No server-side rendering
- No offline mode / service workers (simple app, online assumed)

---

## Success Criteria

1. Timetable loads with pre-populated data on first visit
2. Both weeks are viewable and toggle correctly
3. A cell can be edited and the change persists after page refresh on another device
4. Print output fits on a folded phone-sized sheet with readable text
5. Layout is usable on an iPhone screen without horizontal scrolling of the outer page
