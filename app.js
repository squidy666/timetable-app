// ============================================================
// FIREBASE CONFIG — replace REPLACE_ME values with real ones
// from https://console.firebase.google.com after project setup
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

export const SEED_DATA = {
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

function buildCell(cellData) {
  if (!cellData) return '';
  const room = cellData.room ? ` ${esc(cellData.room)}` : '';
  return `
    <div class="subject-pill" style="background:${safeColor(cellData.color)}">
      ${esc(cellData.subject)}
    </div>
    <div class="teacher-room">${esc(cellData.teacher)}${room}</div>
  `;
}

function renderRows(tbodyEl, weekKey) {
  const weekData = timetableData[weekKey] || {};
  tbodyEl.innerHTML = '';

  for (const row of ROWS) {
    const tr = document.createElement('tr');
    if (row.isBreak) tr.classList.add('break-row');

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
