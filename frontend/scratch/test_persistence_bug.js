// Simulated localStorage for Node environment
const localStorageMap = new Map();
const localStorage = {
  getItem: (key) => localStorageMap.get(key) || null,
  setItem: (key, val) => localStorageMap.set(key, String(val)),
  removeItem: (key) => localStorageMap.delete(key),
  clear: () => localStorageMap.clear(),
};

const ACTIVE_USER_EMAIL_KEY = 'habitloop_active_user_email';

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function getStorageKeyForEmail(email) {
  const clean = normalizeEmail(email);
  if (!clean) return 'habitloop_guest_user';
  const sanitized = clean.replace(/[^a-z0-9_]/g, '_');
  return `habitloop_user_${sanitized}`;
}

function createEmptyWeeklyLogs() {
  const days = ['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28'];
  const logs = {};
  days.forEach(d => {
    logs[d] = { dateStr: d, saved: false, sleep: null, movement: null, energy: null };
  });
  return logs;
}

function createFreshUserState(userInfo = {}) {
  const email = normalizeEmail(userInfo.email);
  const role = userInfo.role || userInfo.workStyle || 'Student';
  return {
    user: {
      name: userInfo.name || (email ? email.split('@')[0] : ''),
      email: email,
      isLoggedIn: true,
    },
    onboardingData: {
      role: role,
      workStyle: role,
      focusAreas: ['🌙 Sleep', '💧 Hydration'],
      goals: ['Improve sleep consistency'],
    },
    weeklyLogs: createEmptyWeeklyLogs(),
    weeklyContext: { saved: false },
    activeExperiment: null,
    experimentLogs: {},
    experimentHistory: [],
  };
}

// Simulated App State Manager
class HabitLoopState {
  constructor() {
    this.user = { name: '', email: '', isLoggedIn: false };
    this.onboardingData = { role: 'Student', workStyle: 'Student', focusAreas: [], goals: [] };
    this.weeklyLogs = createEmptyWeeklyLogs();
    this.weeklyContext = { saved: false };
    this.activeExperiment = null;
    this.experimentLogs = {};
    this.experimentHistory = [];
    this.isHydrating = false;
  }

  loginOrSignupUser(userInfo) {
    const cleanEmail = normalizeEmail(userInfo.email);
    if (!cleanEmail) return;

    this.isHydrating = true;
    const storageKey = getStorageKeyForEmail(cleanEmail);
    const existingRaw = localStorage.getItem(storageKey);

    let newState;
    if (existingRaw) {
      const parsed = JSON.parse(existingRaw);
      newState = {
        user: {
          name: userInfo.name || parsed.user?.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          isLoggedIn: true,
        },
        onboardingData: {
          role: parsed.onboardingData?.role || userInfo.role || 'Student',
          workStyle: parsed.onboardingData?.workStyle || userInfo.workStyle || 'Student',
          focusAreas: parsed.onboardingData?.focusAreas || ['🌙 Sleep'],
          goals: parsed.onboardingData?.goals || ['Improve sleep consistency'],
        },
        weeklyLogs: parsed.weeklyLogs || createEmptyWeeklyLogs(),
        weeklyContext: parsed.weeklyContext || { saved: false },
        activeExperiment: parsed.activeExperiment || null,
        experimentLogs: parsed.experimentLogs || {},
        experimentHistory: parsed.experimentHistory || [],
      };
    } else {
      newState = createFreshUserState({ ...userInfo, email: cleanEmail });
    }

    this.user = newState.user;
    this.onboardingData = newState.onboardingData;
    this.weeklyLogs = newState.weeklyLogs;
    this.weeklyContext = newState.weeklyContext;
    this.activeExperiment = newState.activeExperiment;
    this.experimentLogs = newState.experimentLogs;
    this.experimentHistory = newState.experimentHistory;

    localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
    localStorage.setItem(storageKey, JSON.stringify(newState));
  }

  saveDayWellness(dateStr, data) {
    this.weeklyLogs[dateStr] = { ...this.weeklyLogs[dateStr], ...data, saved: true };
    this.autoPersist();
  }

  signOut() {
    localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    this.user = { name: '', email: '', isLoggedIn: false };
    this.onboardingData = { role: 'Student', workStyle: 'Student', focusAreas: [], goals: [] };
    this.weeklyLogs = createEmptyWeeklyLogs();
    this.weeklyContext = { saved: false };
    this.activeExperiment = null;
    this.experimentLogs = {};
    this.experimentHistory = [];
  }

  autoPersist() {
    if (this.isHydrating) {
      this.isHydrating = false;
      return;
    }
    if (this.user.isLoggedIn && this.user.email) {
      const key = getStorageKeyForEmail(this.user.email);
      const payload = {
        user: this.user,
        onboardingData: this.onboardingData,
        weeklyLogs: this.weeklyLogs,
        weeklyContext: this.weeklyContext,
        activeExperiment: this.activeExperiment,
        experimentLogs: this.experimentLogs,
        experimentHistory: this.experimentHistory,
      };
      localStorage.setItem(key, JSON.stringify(payload));
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, this.user.email);
    }
  }
}

// RUN TESTS
console.log('=== RUNNING PERSISTENCE TEST SUITE ===');

const app = new HabitLoopState();

// STEP 1: ACCOUNT A LOGIN & SAVE
console.log('\n--- Step 1: Account A Login & Save ---');
app.loginOrSignupUser({ email: 'studentA@test.com', name: 'Student A', role: 'Student' });
app.saveDayWellness('2026-09-24', { sleep: 6.0, movement: '30m', energy: 2, mood: 2 });
console.log('Account A logged day Sep 24:', app.weeklyLogs['2026-09-24']);

const storedA = JSON.parse(localStorage.getItem('habitloop_user_studenta_test_com'));
console.log('Stored Account A in localStorage sleep:', storedA.weeklyLogs['2026-09-24'].sleep);
if (storedA.weeklyLogs['2026-09-24'].sleep !== 6.0) throw new Error('Account A save failed!');

// STEP 2: SIGN OUT
console.log('\n--- Step 2: Sign Out ---');
app.signOut();
console.log('React memory after Sign Out isLoggedIn:', app.user.isLoggedIn);
console.log('React memory after Sign Out weeklyLogs Sep 24:', app.weeklyLogs['2026-09-24'].sleep);
console.log('localStorage habitloop_user_studenta_test_com STILL EXISTS:', !!localStorage.getItem('habitloop_user_studenta_test_com'));

// STEP 3: RELOGIN ACCOUNT A
console.log('\n--- Step 3: Re-login Account A ---');
app.loginOrSignupUser({ email: 'studentA@test.com', name: 'Student A' });
app.autoPersist(); // simulate useEffect run after render
console.log('Restored Account A weeklyLogs Sep 24 sleep:', app.weeklyLogs['2026-09-24'].sleep);
if (app.weeklyLogs['2026-09-24'].sleep !== 6.0) throw new Error('Account A re-login restore failed!');

// STEP 4: SIGN OUT & LOGIN ACCOUNT B
console.log('\n--- Step 4: Sign Out & Login Account B ---');
app.signOut();
app.loginOrSignupUser({ email: 'professionalB@test.com', name: 'Professional B', role: 'Working Professional' });
console.log('Account B initial Sep 24 sleep (should be null):', app.weeklyLogs['2026-09-24'].sleep);
if (app.weeklyLogs['2026-09-24'].sleep !== null) throw new Error('Account B inherited Account A data!');

app.saveDayWellness('2026-09-24', { sleep: 8.5, movement: '60m', energy: 5, mood: 5 });
console.log('Account B saved Sep 24 sleep:', app.weeklyLogs['2026-09-24'].sleep);

// STEP 5: SIGN OUT & SWITCH BACK TO ACCOUNT A
console.log('\n--- Step 5: Switch back to Account A ---');
app.signOut();
app.loginOrSignupUser({ email: 'studentA@test.com' });
app.autoPersist();
console.log('Account A Sep 24 sleep (should still be 6.0):', app.weeklyLogs['2026-09-24'].sleep);
if (app.weeklyLogs['2026-09-24'].sleep !== 6.0) throw new Error('Account A data lost after switching back!');

// STEP 6: SWITCH BACK TO ACCOUNT B
console.log('\n--- Step 6: Switch back to Account B ---');
app.signOut();
app.loginOrSignupUser({ email: 'professionalB@test.com' });
app.autoPersist();
console.log('Account B Sep 24 sleep (should still be 8.5):', app.weeklyLogs['2026-09-24'].sleep);
if (app.weeklyLogs['2026-09-24'].sleep !== 8.5) throw new Error('Account B data lost after switching back!');

console.log('\n✅ ALL PERSISTENCE TESTS PASSED CLEANLY!');
