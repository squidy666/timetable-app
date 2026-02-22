# School Timetable App — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a responsive, editable two-week school timetable web app hosted on GitHub Pages with Firebase Firestore as the backend.

**Architecture:** Single-page vanilla HTML/CSS/JS app (no build step). Firebase Firestore stores the timetable data as a single document. Edit mode allows inline cell editing with a color picker; changes sync in real-time. Print styles produce a phone-sized hardcopy.

**Tech Stack:** HTML5, CSS3, JavaScript (ES modules via `<script type="module">`), Firebase Firestore v10 (CDN), GitHub Pages

**Design doc:** `docs/plans/2026-02-22-timetable-app-design.md`

---

## Prerequisites (Manual Steps — Do These Before Starting)

### Firebase project setup (one-time)
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `timetable-app` → disable Google Analytics → Create
3. In the project dashboard, click the web icon (`</>`) → register app as `timetable-web` → skip hosting setup
4. Copy the `firebaseConfig` object shown — you'll need it in Task 6
5. Go to **Build → Firestore Database** → Create database → **Start in test mode** → Choose nearest region (e.g. `australia-southeast1`) → Enable
6. Firestore is now live in test mode (open read/write for 30 days — fine for this app)

---

## Task 1: Project structure & Git initialisation

**Files to create:**
- `index.html`
- `style.css`
- `app.js`
- `seed.js`
- `.gitignore`

**Step 1: Initialise git and create .gitignore**

```bash
cd /Users/gregorypagano/Development/timetable_app
git init
```

Create `.gitignore`:
```
.DS_Store
*.log
node_modules/
```

**Step 2: Create empty placeholder files**

```bash
touch index.html style.css app.js seed.js
```

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialise project structure"
```

---

## Task 2: HTML skeleton

**Files:**
- Modify: `index.html`

**Step 1: Write the full HTML shell**

Replace `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>School Timetable</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <header>
    <h1>Timetable</h1>
    <div class="controls">
      <div class="week-tabs" role="tablist">
        <button class="tab active" data-week="A" role="tab" aria-selected="true">Week A</button>
        <button class="tab" data-week="B" role="tab" aria-selected="false">Week B</button>
      </div>
      <button id="editToggle" class="icon-btn" title="Toggle edit mode" aria-pressed="false">🔒</button>
      <button id="printBtn" class="icon-btn" title="Print timetable">🖨️</button>
    </div>
  </header>

  <main>
    <div class="print-note" id="printNote">
      Tip: Enable <strong>Background Graphics</strong> in print settings to preserve subject colours.
    </div>

    <div class="table-scroll">
      <table id="timetable" aria-label="School timetable">
        <thead>
          <tr>
            <th class="row-label-head"></th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
          </tr>
        </thead>
        <tbody id="timetableBody">
          <!-- Rows injected by app.js -->
        </tbody>
      </table>
    </div>

    <!-- Both weeks rendered for print; visibility controlled by JS/CSS -->
    <div class="print-only-week" id="printWeekA">
      <h2 class="print-week-label">Week A</h2>
      <div class="table-scroll">
        <table aria-label="Week A timetable">
          <thead>
            <tr>
              <th class="row-label-head"></th>
              <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
            </tr>
          </thead>
          <tbody id="printBodyA"></tbody>
        </table>
      </div>
    </div>

    <div class="print-only-week" id="printWeekB">
      <h2 class="print-week-label">Week B</h2>
      <div class="table-scroll">
        <table aria-label="Week B timetable">
          <thead>
            <tr>
              <th class="row-label-head"></th>
              <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
            </tr>
          </thead>
          <tbody id="printBodyB"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Edit popover -->
  <dialog id="editDialog" aria-label="Edit class">
    <form method="dialog" id="editForm">
      <h2>Edit Class</h2>
      <label>Subject <input type="text" id="editSubject" /></label>
      <label>Teacher <input type="text" id="editTeacher" /></label>
      <label>Room    <input type="text" id="editRoom" /></label>
      <label>Colour</label>
      <div class="color-swatches" id="colorSwatches"></div>
      <div class="dialog-actions">
        <button type="submit" id="saveCell">Save</button>
        <button type="button" id="cancelEdit">Cancel</button>
      </div>
    </form>
  </dialog>

  <script type="module" src="app.js"></script>
</body>
</html>
```

**Step 2: Open in browser and verify structure**

Open `index.html` in a browser (double-click or `open index.html`). You should see a bare page with the heading "Timetable", two tab buttons, lock and print buttons, and an empty table.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML skeleton"
```

---

## Task 3: CSS — Base styles

**Files:**
- Modify: `style.css`

**Step 1: Write base CSS**

```css
/* ===== Reset & Variables ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f5f5f5;
  --surface: #ffffff;
  --border: #ddd;
  --break-bg: #f9f9e8;
  --text: #222;
  --text-muted: #666;
  --tab-active: #1565c0;
  --tab-active-text: #fff;
  --edit-outline: #1565c0;
  --radius: 4px;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ===== Header ===== */
header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

h1 {
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ===== Week tabs ===== */
.week-tabs {
  display: flex;
  gap: 2px;
  background: #e0e0e0;
  border-radius: 6px;
  padding: 2px;
}

.tab {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
}

.tab.active {
  background: var(--tab-active);
  color: var(--tab-active-text);
}

/* ===== Icon buttons ===== */
.icon-btn {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius);
  line-height: 1;
}
.icon-btn:hover { background: #e0e0e0; }
.icon-btn[aria-pressed="true"] { background: #ffd54f; }

/* ===== Print note ===== */
.print-note {
  margin: 0.5rem 1rem;
  padding: 0.4rem 0.75rem;
  background: #fff8e1;
  border-left: 3px solid #ffc107;
  font-size: 0.8rem;
  display: none; /* shown only when printing */
}

/* ===== Table container ===== */
main { padding: 0.5rem; }

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: var(--radius);
}

/* ===== Table ===== */
table {
  border-collapse: collapse;
  width: 100%;
  min-width: 500px;
  background: var(--surface);
  font-size: 0.82rem;
}

thead th {
  padding: 0.4rem 0.5rem;
  text-align: center;
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  font-weight: 700;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Sticky row-label column */
.row-label-head,
td.row-label {
  position: sticky;
  left: 0;
  background: var(--surface);
  z-index: 5;
  border-right: 2px solid var(--border);
}

thead .row-label-head {
  z-index: 15; /* above both sticky row and col */
}

td {
  border: 1px solid var(--border);
  padding: 0;
  vertical-align: top;
  min-width: 90px;
}

td.row-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-align: center;
  padding: 0.25rem 0.4rem;
  white-space: nowrap;
  min-width: 40px;
}

/* ===== Break rows ===== */
tr.break-row td {
  background: var(--break-bg);
  height: 18px;
}

tr.break-row .row-label {
  background: var(--break-bg);
}

/* ===== Class cells ===== */
.class-cell {
  padding: 3px 4px;
  cursor: default;
  transition: outline 0.1s;
}

.subject-pill {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  margin-bottom: 2px;
}

.teacher-room {
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ===== Edit mode ===== */
body.edit-mode .class-cell {
  cursor: pointer;
  outline: 1px dashed #90caf9;
}

body.edit-mode .class-cell:hover {
  outline: 2px solid var(--edit-outline);
  background: #e3f2fd;
}

/* ===== Print-only week containers ===== */
.print-only-week { display: none; }
.print-week-label { font-size: 0.9rem; margin: 0.5rem 0 0.25rem; }

/* ===== Edit dialog ===== */
dialog {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,.2);
  padding: 1.25rem;
  width: min(320px, 90vw);
  font-size: 0.9rem;
}

dialog::backdrop { background: rgba(0,0,0,.4); }

dialog h2 { margin-bottom: 1rem; font-size: 1rem; }

dialog label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  font-size: 0.85rem;
}

dialog input[type="text"] {
  display: block;
  width: 100%;
  margin-top: 3px;
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
}

.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0.5rem 0 1rem;
}

.color-swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s, border-color 0.1s;
}

.color-swatch:hover { transform: scale(1.15); }
.color-swatch.selected { border-color: #333; }

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.dialog-actions button {
  padding: 0.4rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  cursor: pointer;
  font-size: 0.85rem;
}

#saveCell {
  background: var(--tab-active);
  color: #fff;
  border-color: var(--tab-active);
}
```

**Step 2: Verify in browser**

Reload `index.html`. The header should be styled with tabs and icon buttons. The table area should show a clean bordered table. Tabs should look pill-shaped.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add base CSS styles"
```

---

## Task 4: CSS — Print styles

**Files:**
- Modify: `style.css` — append to end of file

**Step 1: Append print media query**

```css
/* ===== Print styles ===== */
@media print {
  /* Hide interactive UI */
  header,
  .print-note,
  #editToggle,
  #printBtn,
  .week-tabs { display: none !important; }

  /* Show the static print containers instead of the live table */
  #timetable,
  .table-scroll:has(#timetableBody) { display: none !important; }

  .print-only-week { display: block !important; }

  /* Page setup — phone-sized landscape card */
  @page {
    size: 148mm 210mm portrait; /* A5 — folds to phone-sized */
    margin: 6mm;
  }

  body { background: white; font-size: 7.5pt; }

  main { padding: 0; }

  .print-week-label {
    font-size: 8pt;
    font-weight: 700;
    margin: 4mm 0 1mm;
    page-break-before: auto;
  }

  table {
    width: 100%;
    min-width: 0;
    border-collapse: collapse;
    font-size: 6.5pt;
  }

  thead th {
    padding: 1.5mm 1mm;
    font-size: 7pt;
    position: static; /* sticky not applicable in print */
  }

  td {
    padding: 0;
    min-width: 0;
    border: 0.3pt solid #ccc;
  }

  td.row-label {
    font-size: 6pt;
    padding: 0.5mm 1mm;
    min-width: 0;
    position: static;
  }

  tr.break-row td { height: 4mm; }

  .class-cell { padding: 1mm; }

  .subject-pill {
    font-size: 6pt;
    padding: 0.5mm 1mm;
    margin-bottom: 0.5mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .teacher-room { font-size: 5.5pt; }

  /* Keep both weeks on one page if possible */
  .print-only-week { page-break-inside: avoid; }
}
```

**Step 2: Verify in browser**

Click the browser's Print preview (Cmd+P on Mac). The print preview should show a compact layout. Live controls should be hidden.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add print CSS for phone-sized output"
```

---

## Task 5: Firebase config & data constants in app.js

**Files:**
- Modify: `app.js`

**Step 1: Add Firebase config and data constants**

Replace `app.js` contents with the following. **YOU MUST replace the placeholder `firebaseConfig` with the real values from your Firebase console.**

```javascript
// ============================================================
// FIREBASE CONFIG — replace with values from Firebase Console
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc }
  from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================================
// CONSTANTS
// ============================================================

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Ordered list of row keys and their display labels
const ROWS = [
  { key: 'AAM', label: 'AAM', isBreak: true  },
  { key: 'AM',  label: 'AM',  isBreak: true  },
  { key: 'RC',  label: 'RC',  isBreak: false },
  { key: '1',   label: '1',   isBreak: false },
  { key: '2',   label: '2',   isBreak: false },
  { key: 'R',   label: 'R',   isBreak: true  },
  { key: '3',   label: '3',   isBreak: false },
  { key: '4',   label: '4',   isBreak: false },
  { key: 'L',   label: 'L',   isBreak: true  },
  { key: '5',   label: '5',   isBreak: false },
  { key: 'PM',  label: 'PM',  isBreak: true  },
];

// Default colour palette for the swatch picker
const PALETTE = [
  '#ffcdd2', // red
  '#ffe0b2', // orange
  '#fff9c4', // yellow
  '#c8e6c9', // green
  '#b3e5fc', // light blue
  '#bbdefb', // blue
  '#d1c4e9', // purple
  '#f8bbd0', // pink
  '#dcedc8', // lime
  '#b2dfdb', // teal
  '#f5f5f5', // grey
  '#fffde7', // cream
];

// ============================================================
// SEED DATA — full timetable from the photo
// ============================================================

const SEED_DATA = {
  weekA: {
    Mon: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#ffcdd2' },
      2:  { subject: '7WELD',     teacher: 'GARS', room: 'E37',      color: '#b3e5fc' },
      3:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
      4:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#d1c4e9' },
      5:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#bbdefb' },
    },
    Tue: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#b2dfdb' },
      2:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#dcedc8' },
      3:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#bbdefb' },
      4:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
      5:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
    },
    Wed: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7PDHD',     teacher: 'DAVC', room: 'G55',      color: '#c5cae9' },
      2:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#ffcdd2' },
      3:  { subject: '7TM5',      teacher: 'FIER', room: 'F52',      color: '#f8bbd0' },
      4:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
      5:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
    },
    Thu: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP',  room: 'E41',     color: '#fffde7' },
      1:  { subject: '7ENG.D',    teacher: 'KRIR',  room: 'E33',     color: '#c8e6c9' },
      2:  { subject: '7SCI.D',    teacher: 'KATZ',  room: 'E23',     color: '#bbdefb' },
      3:  { subject: '7Assembly', teacher: 'HALL1', room: '',         color: '#f5f5f5' },
      4:  { subject: '7SP4',      teacher: 'PERJ',  room: 'G54',     color: '#c8e6c9' },
      5:  { subject: '7MATD',     teacher: 'CRIC',  room: 'D17',     color: '#ffcdd2' },
    },
    Fri: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7NSRD',     teacher: 'CAMN', room: 'E26',      color: '#e1bee7' },
      2:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
      3:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#ffcdd2' },
      4:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
      5:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#b2dfdb' },
    },
  },
  weekB: {
    Mon: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7PDHD',     teacher: 'DAVC', room: 'G55',      color: '#c5cae9' },
      2:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#ffcdd2' },
      3:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
      4:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#bbdefb' },
      5:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
    },
    Tue: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#bbdefb' },
      2:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
      3:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
      4:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#d1c4e9' },
      5:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#dcedc8' },
    },
    Wed: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
      2:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#d1c4e9' },
      3:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#b2dfdb' },
      4:  { subject: '7TM5',      teacher: 'FIER', room: 'F49',      color: '#f8bbd0' },
      5:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
    },
    Thu: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP',  room: 'E41',     color: '#fffde7' },
      1:  { subject: '7SCI.D',    teacher: 'KATZ',  room: 'E23',     color: '#bbdefb' },
      2:  { subject: '7TM5',      teacher: 'RABS',  room: 'F52',     color: '#f8bbd0' },
      3:  { subject: '7Assembly', teacher: 'HALL1', room: '',         color: '#f5f5f5' },
      4:  { subject: '7SP4',      teacher: 'PERJ',  room: 'G54',     color: '#c8e6c9' },
      5:  { subject: '7MATD',     teacher: 'CRIC',  room: 'D17',     color: '#ffcdd2' },
    },
    Fri: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#fffde7' },
      1:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#ffcdd2' },
      2:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#ffe0b2' },
      3:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#bbdefb' },
      4:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#dcedc8' },
      5:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#c8e6c9' },
    },
  },
};

export { db, doc, getDoc, setDoc, DAYS, ROWS, PALETTE, SEED_DATA };
```

**Step 2: Verify no syntax errors**

Open browser DevTools console. If there are syntax errors, they'll appear here. If it shows a Firebase initialisation warning (about missing config values) that's expected at this stage — you haven't filled in the real config yet.

**Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add Firebase config, data constants, and seed data"
```

---

## Task 6: Fill in real Firebase config

**Files:**
- Modify: `app.js`

**Step 1: Replace the placeholder firebaseConfig**

In `app.js`, replace the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Step 2: Verify Firebase connects**

Open `index.html` in the browser. In the console, you should see no errors. Run in the console:

```javascript
// In browser console — type this to verify Firestore is reachable:
// (temporary test only)
import('/app.js').then(m => console.log('Module loaded', m));
```

If you see "Module loaded" with the exports, Firebase is connected.

**Step 3: Commit**

```bash
git add app.js
git commit -m "chore: add Firebase project credentials"
```

---

## Task 7: Seed Firestore with initial timetable data

**Files:**
- Modify: `seed.js`

This file is a one-time seeder. It writes `SEED_DATA` to Firestore. You run it once from the browser.

**Step 1: Write seed.js**

```javascript
// seed.js — run once in browser to populate Firestore
// Open index.html, open DevTools console, and paste:
//   import('/seed.js')
// Then verify in Firebase Console that timetable/data document exists.

import { db, doc, setDoc, SEED_DATA }
  from './app.js';

async function seed() {
  const ref = doc(db, 'timetable', 'data');
  await setDoc(ref, SEED_DATA);
  console.log('✅ Seed complete! Firestore now has timetable/data.');
}

seed().catch(err => console.error('Seed failed:', err));
```

**Step 2: Run the seeder**

1. Open `index.html` in the browser
2. Open DevTools → Console
3. Paste and run: `import('/seed.js')`
4. You should see: `✅ Seed complete! Firestore now has timetable/data.`
5. Verify in Firebase Console → Firestore Database → `timetable/data` document exists with `weekA` and `weekB` fields

**Step 3: Commit**

```bash
git add seed.js
git commit -m "feat: add Firestore seed script for initial timetable data"
```

---

## Task 8: Timetable rendering

**Files:**
- Modify: `app.js` — replace export block at bottom with full app logic

**Step 1: Replace the export line and add rendering logic**

In `app.js`, remove the final `export { ... }` line and replace with:

```javascript
// ============================================================
// STATE
// ============================================================

let timetableData = null;  // loaded from Firestore
let activeWeek = 'A';      // 'A' or 'B'
let editMode = false;

// ============================================================
// RENDERING
// ============================================================

function buildCell(cellData) {
  if (!cellData) return '';
  const room = cellData.room ? ` ${cellData.room}` : '';
  return `
    <div class="subject-pill" style="background:${cellData.color || '#eee'}">
      ${cellData.subject}
    </div>
    <div class="teacher-room">${cellData.teacher}${room}</div>
  `;
}

function renderRows(tbodyEl, weekKey) {
  const weekData = timetableData[weekKey] || {};
  tbodyEl.innerHTML = '';

  for (const row of ROWS) {
    const tr = document.createElement('tr');
    if (row.isBreak) tr.classList.add('break-row');

    // Row label cell
    const labelTd = document.createElement('td');
    labelTd.className = 'row-label';
    labelTd.textContent = row.label;
    tr.appendChild(labelTd);

    if (row.isBreak) {
      // Break rows span all 5 day columns
      const breakTd = document.createElement('td');
      breakTd.colSpan = 5;
      tr.appendChild(breakTd);
    } else {
      for (const day of DAYS) {
        const td = document.createElement('td');
        td.className = 'class-cell';
        td.dataset.week = weekKey;
        td.dataset.day  = day;
        td.dataset.row  = row.key;
        const cell = weekData[day]?.[row.key];
        td.innerHTML = buildCell(cell);
        td.addEventListener('click', () => onCellClick(td, cell));
        tr.appendChild(td);
      }
    }

    tbodyEl.appendChild(tr);
  }
}

function renderAll() {
  const weekKey = `week${activeWeek}`;
  renderRows(document.getElementById('timetableBody'), weekKey);

  // Also render print copies
  renderRows(document.getElementById('printBodyA'), 'weekA');
  renderRows(document.getElementById('printBodyB'), 'weekB');
}

// ============================================================
// WEEK TOGGLE
// ============================================================

function setActiveWeek(week) {
  activeWeek = week;
  document.querySelectorAll('.tab').forEach(btn => {
    const isActive = btn.dataset.week === week;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  renderRows(document.getElementById('timetableBody'), `week${week}`);
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => setActiveWeek(btn.dataset.week));
});

// ============================================================
// EDIT MODE
// ============================================================

const editToggle = document.getElementById('editToggle');

function setEditMode(on) {
  editMode = on;
  document.body.classList.toggle('edit-mode', on);
  editToggle.textContent = on ? '🔓' : '🔒';
  editToggle.setAttribute('aria-pressed', on);
}

editToggle.addEventListener('click', () => setEditMode(!editMode));

// ============================================================
// EDIT DIALOG
// ============================================================

const dialog      = document.getElementById('editDialog');
const editSubject = document.getElementById('editSubject');
const editTeacher = document.getElementById('editTeacher');
const editRoom    = document.getElementById('editRoom');
const swatchesEl  = document.getElementById('colorSwatches');
const cancelBtn   = document.getElementById('cancelEdit');
const editForm    = document.getElementById('editForm');

let activeCellEl   = null;
let selectedColor  = null;

// Build colour swatches once
PALETTE.forEach(hex => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'color-swatch';
  btn.style.background = hex;
  btn.dataset.color = hex;
  btn.title = hex;
  btn.addEventListener('click', () => {
    swatchesEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    btn.classList.add('selected');
    selectedColor = hex;
  });
  swatchesEl.appendChild(btn);
});

function onCellClick(tdEl, cellData) {
  if (!editMode) return;
  activeCellEl = tdEl;

  const data = cellData || { subject: '', teacher: '', room: '', color: PALETTE[0] };
  editSubject.value = data.subject;
  editTeacher.value = data.teacher;
  editRoom.value    = data.room || '';
  selectedColor     = data.color || PALETTE[0];

  // Highlight matching swatch
  swatchesEl.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', s.dataset.color === selectedColor);
  });

  dialog.showModal();
  editSubject.focus();
}

cancelBtn.addEventListener('click', () => dialog.close());

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!activeCellEl) return;

  const { week, day, row } = activeCellEl.dataset;
  const newCell = {
    subject: editSubject.value.trim(),
    teacher: editTeacher.value.trim(),
    room:    editRoom.value.trim(),
    color:   selectedColor || PALETTE[0],
  };

  // Update local data
  if (!timetableData[week]) timetableData[week] = {};
  if (!timetableData[week][day]) timetableData[week][day] = {};
  timetableData[week][day][row] = newCell;

  // Persist to Firestore (merge so we don't overwrite other weeks)
  try {
    const ref = doc(db, 'timetable', 'data');
    await setDoc(ref, timetableData);
    activeCellEl.innerHTML = buildCell(newCell);
    // Also re-render the appropriate print body
    renderRows(
      document.getElementById(week === 'weekA' ? 'printBodyA' : 'printBodyB'),
      week
    );
  } catch (err) {
    console.error('Save failed:', err);
    alert('Save failed. Check the console for details.');
  }

  dialog.close();
});

// ============================================================
// PRINT BUTTON
// ============================================================

document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// ============================================================
// INIT — load data and render
// ============================================================

async function init() {
  try {
    const ref = doc(db, 'timetable', 'data');
    const snap = await getDoc(ref);

    if (snap.exists()) {
      timetableData = snap.data();
    } else {
      // First visit — no data yet, use seed data as default
      timetableData = SEED_DATA;
    }
  } catch (err) {
    console.error('Failed to load timetable:', err);
    timetableData = SEED_DATA; // fallback
  }

  renderAll();
}

init();
```

**Step 2: Verify in browser**

Open `index.html`. You should see:
- The full timetable rendered with coloured subject pills
- Week A is shown by default
- Clicking "Week B" tab switches the view
- Clicking the lock icon toggles edit mode (blue dashed borders appear on cells)

Check the browser console — no errors should appear.

**Step 3: Verify edit works**

1. Click the lock icon to enter edit mode
2. Click any class cell
3. The edit dialog should appear with pre-filled fields
4. Change a value and click Save
5. The cell should update immediately
6. Refresh the page — the change should persist (loaded from Firestore)

**Step 4: Commit**

```bash
git add app.js
git commit -m "feat: add timetable rendering, week toggle, and edit mode"
```

---

## Task 9: Polish — loading state & empty cells

**Files:**
- Modify: `index.html` — add loading indicator
- Modify: `style.css` — add loading style

**Step 1: Add loading text to index.html**

In `index.html`, add inside `<main>` before `.table-scroll`:

```html
<div id="loadingMsg" style="text-align:center; padding: 2rem; color: #888;">
  Loading timetable…
</div>
```

**Step 2: Show/hide loading in app.js**

In `app.js`, at the top of `init()` (before the try block), add:

```javascript
document.getElementById('loadingMsg').style.display = 'block';
document.querySelector('.table-scroll').style.display = 'none';
```

And after `renderAll()` at the bottom of `init()`, add:

```javascript
document.getElementById('loadingMsg').style.display = 'none';
document.querySelector('.table-scroll').style.display = '';
```

**Step 3: Verify in browser**

Reload. You should briefly see "Loading timetable…" before the table appears.

**Step 4: Commit**

```bash
git add index.html app.js
git commit -m "feat: add loading state while Firestore data loads"
```

---

## Task 10: GitHub Pages deployment

**Step 1: Create GitHub repo**

1. Go to https://github.com/new
2. Create a public repo named `timetable-app`
3. Do NOT add a README, .gitignore, or licence (project already has these)

**Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/timetable-app.git
git branch -M main
git push -u origin main
```

**Step 3: Enable GitHub Pages**

1. Go to your repo on GitHub → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Click Save
5. After ~60 seconds, your app is live at `https://YOUR_USERNAME.github.io/timetable-app/`

**Step 4: Verify live app**

Open the GitHub Pages URL in both a desktop browser and a mobile browser (or DevTools device mode). Confirm:
- Timetable loads with all data
- Week A / Week B tabs work
- Edit mode works (lock icon)
- Print preview shows compact layout

**Step 5: Share the URL**

Send the URL to your son. Done!

---

## Success Checklist

- [ ] Timetable loads with all Week A and Week B data from the photo
- [ ] Week A / Week B tabs switch the visible timetable
- [ ] Coloured subject pills match the original hardcopy
- [ ] Edit mode activates on lock icon click; cells are clickable
- [ ] Edit dialog shows current values; Save persists to Firestore
- [ ] Changes survive page refresh and appear on another device
- [ ] Print produces a compact, phone-sized layout with both weeks
- [ ] App is usable on mobile without broken layout
- [ ] GitHub Pages URL is live and shareable
