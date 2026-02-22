// ============================================================
// FIREBASE CONFIG — replace REPLACE_ME values with real ones
// from https://console.firebase.google.com after project setup
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc }
  from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAss8KeWk8nzhjrqyKr3EGd--xdP_Y785Y",
  authDomain: "timetable-app-6844e.firebaseapp.com",
  projectId: "timetable-app-6844e",
  storageBucket: "timetable-app-6844e.firebasestorage.app",
  messagingSenderId: "927432078965",
  appId: "1:927432078965:web:3918807e7e9cd50ff82a3c"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================================
// CONSTANTS
// ============================================================

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

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

const PALETTE = [
  '#d90d0d', // red
  '#ffe0b2', // orange
  '#ffe600', // yellow
  '#225023', // green
  '#bde8fc', // light blue
  '#0b24e4', // blue
  '#c5a5ff', // purple
  '#fa4081', // pink
  '#ffc0cb', // light pink
  '#76d576', // light green
  '#80ab52', // olive
  '#dcedc8', // lime
  '#b2dfdb', // teal
  '#f5f5f5', // grey
  '#fffde7', // cream
  '#faf3f8', // light salmon
];

// ============================================================
// SEED DATA — full timetable from the photo
// ============================================================

export const SEED_DATA = {
  weekA: {
    Mon: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#d90d0d' },
      2:  { subject: '7WELD',     teacher: 'GARS', room: 'E37',      color: '#fffde7' },
      3:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
      4:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#fa4081' },
      5:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#0b24e4' },
    },
    Tue: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#225023' },
      2:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#bde8fc' },
      3:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#0b24e4' },
      4:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
      5:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
    },
    Wed: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7PDHD',     teacher: 'DAVC', room: 'G55',      color: '#76d576' },
      2:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#d90d0d' },
      3:  { subject: '7TM5',      teacher: 'FIER', room: 'F52',      color: '#f8bbd0' },
      4:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
      5:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
    },
    Thu: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP',  room: 'E41',     color: '#faf3f8' },
      1:  { subject: '7ENG.D',    teacher: 'KRIR',  room: 'E33',     color: '#ffe600' },
      2:  { subject: '7SCI.D',    teacher: 'KATZ',  room: 'E23',     color: '#0b24e4' },
      3:  { subject: '7Assembly', teacher: 'HALL1', room: '',         color: '#f5f5f5' },
      4:  { subject: '7SP4',      teacher: 'PERJ',  room: 'G54',     color: '#225023' },
      5:  { subject: '7MATD',     teacher: 'CRIC',  room: 'D17',     color: '#d90d0d' },
    },
    Fri: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7NSRD',     teacher: 'CAMN', room: 'E26',      color: '#e1bee7' },
      2:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
      3:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#d90d0d' },
      4:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
      5:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#225023' },
    },
  },
  weekB: {
    Mon: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7PDHD',     teacher: 'DAVC', room: 'G55',      color: '#76d576' },
      2:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#d90d0d' },
      3:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
      4:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#0b24e4' },
      5:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
    },
    Tue: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#0b24e4' },
      2:  { subject: '7TM5',      teacher: 'RABS', room: 'F52',      color: '#f8bbd0' },
      3:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
      4:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#fa4081' },
      5:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#bde8fc' },
    },
    Wed: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
      2:  { subject: '7VIA5',     teacher: 'BILF', room: 'F46',      color: '#fa4081' },
      3:  { subject: '7PED',      teacher: 'DAVC', room: 'CANTEEN1', color: '#225023' },
      4:  { subject: '7TM5',      teacher: 'FIER', room: 'F49',      color: '#f8bbd0' },
      5:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
    },
    Thu: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP',  room: 'E41',     color: '#faf3f8' },
      1:  { subject: '7SCI.D',    teacher: 'KATZ',  room: 'E23',     color: '#0b24e4' },
      2:  { subject: '7TM5',      teacher: 'RABS',  room: 'F52',     color: '#f8bbd0' },
      3:  { subject: '7Assembly', teacher: 'HALL1', room: '',         color: '#f5f5f5' },
      4:  { subject: '7SP4',      teacher: 'PERJ',  room: 'G54',     color: '#225023' },
      5:  { subject: '7MATD',     teacher: 'CRIC',  room: 'D17',     color: '#d90d0d' },
    },
    Fri: {
      RC: { subject: '7Fitzroy1', teacher: 'LEEP', room: 'E41',      color: '#faf3f8' },
      1:  { subject: '7MATD',     teacher: 'CRIC', room: 'D17',      color: '#d90d0d' },
      2:  { subject: '7HSID',     teacher: 'JOHC', room: 'E27',      color: '#80ab52' },
      3:  { subject: '7SCI.D',    teacher: 'KATZ', room: 'E23',      color: '#0b24e4' },
      4:  { subject: '7MUS.D',    teacher: 'MORM', room: 'H56',      color: '#bde8fc' },
      5:  { subject: '7ENG.D',    teacher: 'KRIR', room: 'E33',      color: '#ffe600' },
    },
  },
};

// ============================================================
// STATE
// ============================================================

let timetableData = null;
let activeWeek = 'A';
let editMode = false;

// ============================================================
// RENDERING
// ============================================================

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeColor(c) {
  return /^#[0-9a-fA-F]{3,6}$/.test(c) ? c : '#eeeeee';
}

function isDark(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
}

function buildCell(cellData) {
  if (!cellData) return '';
  const subj   = esc(cellData.subject);
  const teacher = esc(cellData.teacher);
  const room   = cellData.room ? esc(cellData.room) : '';
  const detail = [teacher, room].filter(Boolean).join('\u00a0\u00a0');
  const bg     = safeColor(cellData.color);
  const tc     = isDark(bg) ? '#fff' : '#111';
  return `<div class="class-pill" style="border-color:${bg}"><span class="pill-subject" style="background:${bg};color:${tc}">${subj}</span><span class="pill-detail">${detail}</span></div>`;
}

function renderRows(tbodyEl, weekKey) {
  const weekData = timetableData[weekKey] || {};
  tbodyEl.innerHTML = '';

  for (const row of ROWS) {
    const tr = document.createElement('tr');
    tr.dataset.rowKey = row.key;
    if (row.isBreak) tr.classList.add('break-row');
    if (row.key === 'RC') tr.classList.add('rc-row');

    const labelTd = document.createElement('td');
    labelTd.className = 'row-label';
    labelTd.textContent = row.label;
    tr.appendChild(labelTd);

    if (row.isBreak) {
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
        td.addEventListener('click', () => {
          const currentCell = timetableData[weekKey]?.[day]?.[row.key];
          onCellClick(td, currentCell);
        });
        tr.appendChild(td);
      }
    }

    tbodyEl.appendChild(tr);
  }
}

function renderAll() {
  const weekKey = `week${activeWeek}`;
  renderRows(document.getElementById('timetableBody'), weekKey);
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
  editToggle.setAttribute('aria-pressed', String(on));
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

let activeCellEl  = null;
let selectedColor = null;

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

  if (!timetableData[week]) timetableData[week] = {};
  if (!timetableData[week][day]) timetableData[week][day] = {};
  timetableData[week][day][row] = newCell;

  try {
    const ref = doc(db, 'timetable', 'data');
    await setDoc(ref, timetableData);
    activeCellEl.innerHTML = buildCell(newCell);
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
  document.getElementById('loadingMsg').style.display = 'block';
  document.getElementById('mainScroll').style.display = 'none';

  try {
    const ref = doc(db, 'timetable', 'data');
    const snap = await getDoc(ref);

    if (snap.exists()) {
      timetableData = snap.data();
    } else {
      timetableData = SEED_DATA;
    }
  } catch (err) {
    console.error('Failed to load timetable:', err);
    timetableData = SEED_DATA;
  }

  renderAll();

  document.getElementById('loadingMsg').style.display = 'none';
  document.getElementById('mainScroll').style.display = '';
}

init();
