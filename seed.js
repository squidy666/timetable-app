// seed.js — run once in browser to populate Firestore with initial timetable data
//
// HOW TO USE:
// 1. Open index.html in the browser (must be served, not file://)
// 2. Open DevTools → Console
// 3. Paste and run: import('/seed.js')
// 4. You should see: ✅ Seed complete!
// 5. Verify in Firebase Console → Firestore → timetable/data document

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getFirestore, doc, setDoc }
  from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

// Re-use existing Firebase app if already initialised (avoids duplicate app error)
const existingApps = getApps();
const firebaseApp = existingApps.length > 0
  ? existingApps[0]
  : initializeApp(window._firebaseConfig || {});

const db = getFirestore(firebaseApp);

// Import seed data from app.js module
const { SEED_DATA } = await import('./app.js').catch(() => {
  throw new Error('Could not import app.js. Make sure the page is open first.');
});

async function seed() {
  const ref = doc(db, 'timetable', 'data');
  await setDoc(ref, SEED_DATA);
  console.log('✅ Seed complete! Firestore now has timetable/data.');
}

seed().catch(err => console.error('❌ Seed failed:', err));
