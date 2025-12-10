// Simple PWA state with localStorage
const STORAGE_KEY = 'kellySpringCottageState_v1';

let appState = {
  daily: {
    morning: {},
    afternoon: {},
    evening: {},
    kellyMoment: {}
  },
  weekly: {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
    sunday: {}
  },
  selfCareNotes: '',
  creativeNotes: ''
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appState = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load state', e);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

loadState();

const main = document.getElementById('main-content');
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.getAttribute('data-view');
    navigate(view);
  });
});

// VIEW RENDERERS
function navigate(view) {
  if (view === 'home') renderHome();
  if (view === 'daily') renderDaily();
  if (view === 'weekly') renderWeekly();
  if (view === 'selfcare') renderSelfCare();
  if (view === 'creative') renderCreative();
}

// Utility to render checklists
function createChecklist(items, section, subsection) {
  return items.map((item, index) => {
    const id = `${section}_${subsection}_${index}`;
    const checked = !!(appState[section] &&
      appState[section][subsection] &&
      appState[section][subsection][id]);

    return `
      <label class="checklist-item">
        <input type="checkbox" data-section="${section}" data-sub="${subsection}" data-id="${id}" ${checked ? 'checked' : ''}>
        <span>${item}</span>
      </label>
    `;
  }).join('');
}

function attachChecklistListeners() {
  main.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const section = chk.dataset.section;
      const sub = chk.dataset.sub;
      const id = chk.dataset.id;
      if (!appState[section]) appState[section] = {};
      if (!appState[section][sub]) appState[section][sub] = {};
      appState[section][sub][id] = chk.checked;
      saveState();
    });
  });
}

// VIEWS
function renderHome() {
  main.innerHTML = `
    <section class="card">
      <h2>Welcome, Kelly 🌷</h2>
      <p class="affirmation">“Today doesn’t need perfection—just peace.”</p>
      <div style="margin-top:0.6rem;">
        <button class="btn" id="btn-start-daily">Start Daily Ritual</button>
        <button class="btn btn-secondary" id="btn-selfcare">Self-care moment</button>
        <button class="btn btn-secondary" id="btn-did-enough">I did enough today 💛</button>
      </div>
    </section>

    <section class="card">
      <h2>Today’s Affirmation</h2>
      <p class="affirmation">
        “Kelly, you are allowed to have a gentle day.”
      </p>
    </section>

    <section class="card">
      <h2>Quick Links</h2>
      <p>Use the icons below to jump between Daily, Weekly, Self-Care, and Creative spaces.</p>
    </section>
  `;

  document.getElementById('btn-start-daily').addEventListener('click', () => {
    document.querySelector('[data-view="daily"]').click();
  });
  document.getElementById('btn-selfcare').addEventListener('click', () => {
    document.querySelector('[data-view="selfcare"]').click();
  });
  document.getElementById('btn-did-enough').addEventListener('click', () => {
    alert('You did enough today, Kelly. It’s okay to rest. 💛');
  });
}

function renderDaily() {
  const morningItems = [
    'Open a window – new air',
    'Light tidy kitchen',
    'Breakfast + hydration',
    'Quick sink wipe',
    'Soft homeschool start'
  ];
  const afternoonItems = [
    'Quick room reset',
    'Laundry moment',
    'Kids calm time',
    'Light sweep'
  ];
  const eveningItems = [
    'Kitchen soften',
    'Wipe surfaces',
    'Calm lights',
    'Prepare tomorrow'
  ];
  const kellyMomentItems = [
    'Quiet drink',
    'Reading',
    'Self-care',
    'Creative time'
  ];

  main.innerHTML = `
    <section class="card">
      <h2>Morning Hearthkeeping</h2>
      ${createChecklist(morningItems, 'daily', 'morning')}
    </section>

    <section class="card">
      <h2>Afternoon Gentle Tend</h2>
      ${createChecklist(afternoonItems, 'daily', 'afternoon')}
    </section>

    <section class="card">
      <h2>Evening Soft Restore</h2>
      ${createChecklist(eveningItems, 'daily', 'evening')}
    </section>

    <section class="card">
      <h2>Kelly’s Moment 🌷</h2>
      ${createChecklist(kellyMomentItems, 'daily', 'kellyMoment')}
      <p class="affirmation" style="margin-top:0.5rem;">
        “Even one tiny moment for yourself matters.”
      </p>
    </section>
  `;
  attachChecklistListeners();
}

function renderWeekly() {
  const days = [
    { key: 'monday', label: 'Monday – Fresh Kitchen', items: ['Counters', 'Sink', 'Stove front'] },
    { key: 'tuesday', label: 'Tuesday – Cozy Living Room', items: ['Tidy', 'Fluff pillows', 'Soft sweep'] },
    { key: 'wednesday', label: 'Wednesday – Quiet Bathrooms', items: ['Mirror', 'Sink', 'Towels'] },
    { key: 'thursday', label: 'Thursday – Calm Bedrooms', items: ['Beds', 'Clothes put away', 'Dust a little'] },
    { key: 'friday', label: 'Friday – Laundry Meadow', items: ['Wash', 'Dry', 'Fold'] },
    { key: 'saturday', label: 'Saturday – Open The Home', items: ['Sweep', 'Windows', 'Declutter 1 thing'] },
    { key: 'sunday', label: 'Sunday – Gentle Rest', items: ['Slow day', 'Family time', 'Nothing pressured'] }
  ];

  main.innerHTML = days.map(day => `
    <section class="card">
      <h2>${day.label}</h2>
      ${createChecklist(day.items, 'weekly', day.key)}
    </section>
  `).join('');

  attachChecklistListeners();
}

function renderSelfCare() {
  main.innerHTML = `
    <section class="card">
      <h2>Daily Self-Care Ritual</h2>
      <label class="checklist-item"><input type="checkbox">Warm shower</label>
      <label class="checklist-item"><input type="checkbox">Skincare</label>
      <label class="checklist-item"><input type="checkbox">Cozy clothes</label>
      <label class="checklist-item"><input type="checkbox">Quiet 10 minutes</label>
      <p class="affirmation" style="margin-top:0.5rem;">
        “Kelly, you deserve gentle rituals every day.”
      </p>
    </section>

    <section class="card">
      <h2>Self-Care Notes</h2>
      <textarea id="selfcare-notes" placeholder="How do you want to take care of yourself this week?"></textarea>
    </section>
  `;

  const textarea = document.getElementById('selfcare-notes');
  textarea.value = appState.selfCareNotes || '';
  textarea.addEventListener('input', () => {
    appState.selfCareNotes = textarea.value;
    saveState();
  });
}

function renderCreative() {
  main.innerHTML = `
    <section class="card">
      <h2>Things Kelly Loves</h2>
      <ul>
        <li>Drawing & painting</li>
        <li>Baking cozy things</li>
        <li>Reading in quiet spaces</li>
        <li>Soft shows or films</li>
      </ul>
    </section>

    <section class="card">
      <h2>What did you create today?</h2>
      <textarea id="creative-notes" placeholder="Even a tiny thing counts."></textarea>
      <p class="affirmation" style="margin-top:0.5rem;">
        “Your creativity matters, even in small moments.”
      </p>
    </section>
  `;

  const textarea = document.getElementById('creative-notes');
  textarea.value = appState.creativeNotes || '';
  textarea.addEventListener('input', () => {
    appState.creativeNotes = textarea.value;
    saveState();
  });
}

// Initial view
renderHome();