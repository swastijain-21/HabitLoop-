import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const UserContext = createContext();

// Value conversion mapping helpers for time-series backend readiness
export const OPTION_NUMERIC_MAP = {
  movement: { '15m': 15, '30m': 30, '45m': 45, '60m': 60, '90m': 90 },
  screenTime: { '<2h': 1.5, '2–4h': 3.0, '4–6h': 5.0, '6–8h': 7.0, '8h+': 9.0 },
  focus: { '<1h': 0.5, '1–2h': 1.5, '2–4h': 3.0, '4–6h': 5.0, '6h+': 7.0 },
  mindfulness: { '0m': 0, '5m': 5, '10m': 10, '15m': 15, '20m': 20, '25m': 25, '30m+': 35 },
  outdoor: { '0m': 0, '15m': 15, '30m': 30, '60m+': 60 },
};

// Metric configuration mapping helper
export const METRIC_CONFIG = {
  sleep: { label: 'Sleep Duration', icon: '🌙', unit: 'hrs avg', key: 'avgSleep', formatVal: (v) => `${v}h`, min: 4, max: 12, step: 0.5, defaultVal: 8.0 },
  movement: { label: 'Movement', icon: '🏃', unit: 'mins avg', key: 'avgMovement', formatVal: (v) => `${v}m`, min: 0, max: 120, step: 15, defaultVal: 30 },
  screenTime: { label: 'Screen Time', icon: '📱', unit: 'hrs avg', key: 'avgScreen', formatVal: (v) => `${v}h`, min: 0.5, max: 12, step: 0.5, defaultVal: 2.0 },
  focus: { label: 'Focus Time', icon: '📚', unit: 'hrs avg', key: 'avgFocus', formatVal: (v) => `${v}h`, min: 0.5, max: 10, step: 0.5, defaultVal: 3.0 },
  energy: { label: 'Energy Level', icon: '⚡', unit: 'rating', key: 'avgEnergy', formatVal: (v) => `${v} / 5`, min: 1, max: 5, step: 1, defaultVal: 4 },
  mood: { label: 'Mood & Well-being', icon: '🙂', unit: 'rating', key: 'avgMood', formatVal: (v) => `${v} / 5`, min: 1, max: 5, step: 1, defaultVal: 4 },
  mindfulness: { label: 'Mindfulness', icon: '🧠', unit: 'mins avg', key: 'avgMindfulness', formatVal: (v) => `${v}m`, min: 0, max: 60, step: 5, defaultVal: 15 },
  outdoor: { label: 'Outdoor Time', icon: '🌿', unit: 'mins avg', key: 'avgOutdoor', formatVal: (v) => `${v}m`, min: 0, max: 120, step: 15, defaultVal: 30 },
};

// Calculate experiment progress based strictly on ACTUAL logged experiment days
export function calculateExperimentProgress(experimentLogs, activeExperiment) {
  if (!activeExperiment || !activeExperiment.id || activeExperiment.status === 'none') {
    return { trackedDays: 0, totalDays: 7, percentage: 0, isComplete: false, loggedEntries: [] };
  }
  
  const expId = activeExperiment.id;
  const expLogs = Object.values(experimentLogs?.[expId] || {});
  const loggedEntries = expLogs.filter(entry => entry && entry.completed !== undefined);
  const trackedDays = loggedEntries.length;
  const totalDays = activeExperiment.durationDays || 7;
  const percentage = Math.min(100, Math.round((trackedDays / totalDays) * 100));
  const isComplete = trackedDays >= totalDays || activeExperiment.status === 'completed';

  return {
    trackedDays,
    totalDays,
    percentage,
    isComplete,
    loggedEntries,
  };
}

// Calculate Before vs After results from baseline and actual logged experiment entries
export function calculateExperimentResults(experimentLogs, activeExperiment, weeklyLogs) {
  if (!activeExperiment || !activeExperiment.id || activeExperiment.status === 'none') {
    return { comparisonCards: [], summaryText: 'No active experiment.', trackedDays: 0, totalDays: 7, isComplete: false };
  }

  const expId = activeExperiment.id;
  const expLogs = Object.values(experimentLogs?.[expId] || {});
  const validEntries = expLogs.filter(l => l && l.completed !== undefined);
  const trackedDays = validEntries.length;
  const totalDays = activeExperiment.durationDays || 7;
  const isComplete = trackedDays >= totalDays || activeExperiment.status === 'completed';

  const preMetrics = calculateWeeklyMetrics(weeklyLogs);

  const watchedKeys = Array.from(new Set([
    activeExperiment.targetMetric,
    ...(activeExperiment.watchedMetrics || ['sleep', 'energy'])
  ])).filter(m => METRIC_CONFIG[m]);

  const comparisonCards = watchedKeys.map(key => {
    const config = METRIC_CONFIG[key];
    
    // BEFORE (Baseline)
    let beforeVal = activeExperiment.baseline?.[key];
    if (beforeVal === undefined || beforeVal === null) {
      if (key === 'sleep') beforeVal = preMetrics.avgSleep;
      else if (key === 'energy') beforeVal = preMetrics.avgEnergy;
      else if (key === 'screenTime') beforeVal = preMetrics.avgScreen;
      else if (key === 'movement') beforeVal = preMetrics.avgMovement;
      else if (key === 'focus') beforeVal = preMetrics.avgFocus;
      else if (key === 'mood') beforeVal = preMetrics.avgMood;
      else if (key === 'mindfulness') beforeVal = preMetrics.avgMindfulness;
      else if (key === 'outdoor') beforeVal = preMetrics.avgOutdoor;
      else beforeVal = 0;
    }

    // AFTER (Experiment Period Average)
    const metricEntries = validEntries.filter(entry => entry[key] !== undefined && entry[key] !== null);
    
    let afterVal = null;
    let diff = null;
    let hasData = false;

    if (metricEntries.length > 0) {
      hasData = true;
      const sum = metricEntries.reduce((acc, entry) => acc + Number(entry[key]), 0);
      afterVal = Number((sum / metricEntries.length).toFixed(1));
      diff = Number((afterVal - beforeVal).toFixed(1));
    }

    return {
      key,
      ...config,
      beforeVal,
      afterVal,
      diff,
      hasData,
    };
  });

  // Pure observational summary wording
  const loggedWithData = comparisonCards.filter(c => c.hasData);
  let summaryText = '';

  if (loggedWithData.length > 0) {
    const observations = loggedWithData.map(c => {
      let comparisonWord = 'was consistent with';
      if (c.diff > 0) comparisonWord = 'was higher during the experiment period';
      else if (c.diff < 0) comparisonWord = 'was lower during the experiment period';

      return `your average ${c.label.toLowerCase()} ${comparisonWord} (${c.formatVal(c.afterVal)} vs ${c.formatVal(c.beforeVal)} baseline)`;
    });
    summaryText = `Over ${trackedDays} logged experiment day${trackedDays > 1 ? 's' : ''}, ${observations.join(', and ')}.`;
  } else {
    summaryText = 'No experiment check-in entries logged yet. Log your daily experiment progress below to calculate Before vs After metrics.';
  }

  return {
    trackedDays,
    totalDays,
    isComplete,
    comparisonCards,
    summaryText,
  };
}

// Calculate overall weekly metrics helper
export function calculateWeeklyMetrics(weeklyLogs) {
  const savedLogs = Object.values(weeklyLogs || {}).filter(l => l && l.saved);
  const count = savedLogs.length || 1;

  let totalSleep = 0, totalEnergy = 0, totalMood = 0, totalScreen = 0, totalMovement = 0, totalFocus = 0, totalMindfulness = 0, totalOutdoor = 0;

  savedLogs.forEach(l => {
    totalSleep += Number(l.sleep || 7.5);
    totalEnergy += Number(l.energy || 4);
    totalMood += Number(l.mood || 4);
    totalScreen += OPTION_NUMERIC_MAP.screenTime[l.screenTime] ?? 3.0;
    totalMovement += OPTION_NUMERIC_MAP.movement[l.movement] ?? 30;
    totalFocus += OPTION_NUMERIC_MAP.focus[l.focus] ?? 3.0;
    totalMindfulness += OPTION_NUMERIC_MAP.mindfulness[l.mindfulness] ?? 10;
    totalOutdoor += OPTION_NUMERIC_MAP.outdoor[l.outdoor] ?? 30;
  });

  return {
    count: savedLogs.length,
    savedLogs,
    avgSleep: Number((totalSleep / count).toFixed(1)),
    avgEnergy: Number((totalEnergy / count).toFixed(1)),
    avgMood: Number((totalMood / count).toFixed(1)),
    avgScreen: Number((totalScreen / count).toFixed(1)),
    avgMovement: Math.round(totalMovement / count),
    avgFocus: Number((totalFocus / count).toFixed(1)),
    avgMindfulness: Math.round(totalMindfulness / count),
    avgOutdoor: Math.round(totalOutdoor / count),
  };
}

// Generate data-backed pattern observations helper
export function analyzeWeeklyPatterns(weeklyLogs) {
  const metrics = calculateWeeklyMetrics(weeklyLogs);
  const patterns = [];

  if (metrics.avgSleep >= 7.5) {
    patterns.push(`Higher-energy days (${metrics.avgEnergy}/5 avg) tended to coincide with longer sleep duration (${metrics.avgSleep}h avg).`);
  } else {
    patterns.push(`Lower sleep duration (${metrics.avgSleep}h avg) was associated with reduced energy scores.`);
  }

  if (metrics.avgScreen >= 3.0) {
    patterns.push(`Higher evening screen-time ranges (~${metrics.avgScreen}h avg) appeared alongside lower energy ratings.`);
  } else {
    patterns.push(`Moderate screen-time limits coincided with stabilized evening focus.`);
  }

  if (metrics.avgOutdoor >= 30) {
    patterns.push(`30m+ outdoor time was associated with elevated mood ratings (${metrics.avgMood}/5 avg).`);
  } else if (metrics.avgMovement >= 30) {
    patterns.push(`Consistent movement (~${metrics.avgMovement}m/day) was associated with higher overall mood scores.`);
  } else {
    patterns.push(`Lower movement time appeared alongside mid-tier daily energy levels.`);
  }

  return patterns;
}

// Generate tailored 7-day guided experiment plans based on target metrics
export function generate7DayPlan(targetMetric, watchedMetrics = [], baseline = {}) {
  const metricKey = targetMetric || 'screenTime';

  const plans = {
    mindfulness: [
      { day: 1, action: "Do a 5-minute breathing exercise before your first study session.", reason: "Starting your study block with calm focus sets a peaceful tone for the day." },
      { day: 2, action: "Do a 5-minute guided mindfulness session after waking up.", reason: "Morning mindfulness helps reduce stress before checking messages or social media." },
      { day: 3, action: "Spend 10 minutes outdoors without using your phone.", reason: "A brief phone-free outdoor break resets mental fatigue and improves mood." },
      { day: 4, action: "Write down 3 things that went well today before going to bed.", reason: "Gratitude reflection shifts evening focus to positive events and lowers stress." },
      { day: 5, action: "Take a 5-minute quiet break between two study sessions.", reason: "Mid-day pauses prevent mental burnout during long focus blocks." },
      { day: 6, action: "Spend 15 minutes doing an enjoyable activity without multitasking.", reason: "Single-tasking an activity you love deepens relaxation and focus." },
      { day: 7, action: "Do 5 minutes of mindfulness followed by 10 minutes outdoors, then reflect on your week.", reason: "Combining mindfulness with nature provides a complete weekly wellness reset." }
    ],
    mood: [
      { day: 1, action: "Take a 10-minute relaxing morning walk or stretch.", reason: "Gentle morning movement stimulates positive neurotransmitters early in the day." },
      { day: 2, action: "Spend 15 minutes doing a favorite hobby or creative activity.", reason: "Dedicated time for joy protects your mood against daily academic/work pressure." },
      { day: 3, action: "Connect with a friend or family member for a short positive conversation.", reason: "Social connection is one of the strongest drivers of daily mood." },
      { day: 4, action: "Spend 15 minutes outside in natural sunlight during lunch or study break.", reason: "Natural daylight regulates mood and enhances evening sleep quality." },
      { day: 5, action: "Write down 3 things you are grateful for today before bedtime.", reason: "Reflecting on positives trains your mind to notice encouraging moments." },
      { day: 6, action: "Disconnect from news and social media during your evening meal.", reason: "Mindful eating without digital clutter promotes relaxation." },
      { day: 7, action: "Engage in 20 minutes of your favorite relaxing weekend activity.", reason: "Consolidating your weekly mood wins helps sustain long-term wellness." }
    ],
    movement: [
      { day: 1, action: "Take a 10-minute brisk walk after your morning routine.", reason: "A quick morning walk boosts circulation and wakes up your body." },
      { day: 2, action: "Do a 5-minute stretch routine between study or work blocks.", reason: "Stretching relieves physical tension from prolonged sitting." },
      { day: 3, action: "Take a 15-minute walk outside after lunch.", reason: "Post-meal walks aid digestion and prevent afternoon energy slumps." },
      { day: 4, action: "Do 10 minutes of light bodyweight exercises or yoga.", reason: "Short strength or mobility breaks increase focus and stamina." },
      { day: 5, action: "Take a 5-minute active movement break for every 50 minutes of focused work.", reason: "Regular short breaks keep your energy levels steady throughout the day." },
      { day: 6, action: "Enjoy a 20-minute continuous outdoor walk or active hobby.", reason: "Longer movement sessions build endurance and release endorphins." },
      { day: 7, action: "Complete a 15-minute full-body stretch and reflect on your movement week.", reason: "Recovery movement keeps your muscles refreshed for the upcoming week." }
    ],
    sleep: [
      { day: 1, action: "Start a consistent wind-down routine 20 minutes before bedtime.", reason: "Signaling your body that rest is approaching helps you fall asleep faster." },
      { day: 2, action: "Put your phone away during the final 20 minutes before sleep.", reason: "Reducing blue light allows melatonin production to rise naturally." },
      { day: 3, action: "Dim room lights and listen to calming audio or read 15 minutes before bed.", reason: "Soft lighting and quiet activities prepare your mind for deep sleep." },
      { day: 4, action: "Aim to be in bed within a 15-minute target bedtime window.", reason: "Consistent sleep timing strengthens your natural circadian rhythm." },
      { day: 5, action: "Avoid caffeine after 2:00 PM and keep your bedroom cool.", reason: "Managing late-day stimulants improves night sleep continuity." },
      { day: 6, action: "Do a 5-minute evening breathing or muscle relaxation exercise in bed.", reason: "Physical relaxation reduces nighttime racing thoughts." },
      { day: 7, action: "Maintain your target bedtime window and review how your energy feels.", reason: "Consolidating 7 days of sleep habits locks in lasting restorative sleep." }
    ],
    screenTime: [
      { day: 1, action: "Keep your phone in another room or out of reach during one 45-minute study block.", reason: "Removing visual phone cues eliminates impulse checking." },
      { day: 2, action: "Turn off all non-essential phone notifications for the evening.", reason: "Fewer pings reduce digital anxiety and reclaim mental focus." },
      { day: 3, action: "No phone usage during the final 30 minutes before bedtime.", reason: "Cutting late-night screen exposure dramatically improves sleep readiness." },
      { day: 4, action: "Replace one 20-minute social media scrolling break with an offline activity.", reason: "Trading screen scrolling for reading or walking refreshes your mind." },
      { day: 5, action: "Keep your phone away from the dining table during all meals today.", reason: "Screen-free meals promote mindful eating and better social presence." },
      { day: 6, action: "Take a 2-hour digital detox during the afternoon or evening.", reason: "Extended screen breaks lower eye strain and mental fatigue." },
      { day: 7, action: "Enforce your 30-minute pre-bed screen shutdown and reflect on your mental clarity.", reason: "Stabilizing your digital boundaries sustains longer focus and better sleep." }
    ],
    focus: [
      { day: 1, action: "Complete one 25-minute uninterrupted focus block with phone on silent.", reason: "Single-tasking for 25 minutes builds concentration momentum." },
      { day: 2, action: "Take a planned 5-minute screen-free break after your first focus session.", reason: "Giving your brain a true break restores focus capacity for the next session." },
      { day: 3, action: "Write down your top 2 study priorities before starting your main focus block.", reason: "Clear targets prevent task-switching and hesitation." },
      { day: 4, action: "Complete two 25-minute Pomodoro focus blocks with a 5-minute rest between.", reason: "Interval focusing increases output without causing mental fatigue." },
      { day: 5, action: "Clear your desk workspace of unnecessary clutter before studying.", reason: "A clean physical environment minimizes visual distractions." },
      { day: 6, action: "Complete a 45-minute deep focus block without opening unnecessary tabs.", reason: "Extended deep focus trains sustained mental endurance." },
      { day: 7, action: "Review your weekly focus wins and plan your focus strategy for next week.", reason: "Reflecting on your productive sessions reinforces effective study habits." }
    ],
    outdoor: [
      { day: 1, action: "Spend 10 minutes outdoors right after your morning study or work session.", reason: "Fresh air and daylight immediately clear post-study brain fog." },
      { day: 2, action: "Take a 10-minute outdoor walk without looking at your phone.", reason: "Observing nature without screen distractions boosts mood." },
      { day: 3, action: "Sit outside in a quiet spot for 15 minutes during lunch or break.", reason: "Outdoor relaxation lowers cortisol and stress levels." },
      { day: 4, action: "Take a 15-minute outdoor stroll in the late afternoon daylight.", reason: "Late afternoon light helps synchronize your circadian clock." },
      { day: 5, action: "Have your morning coffee, tea, or snack outdoors for 10 minutes.", reason: "Pairing daily routines with outdoor time makes the habit effortless." },
      { day: 6, action: "Enjoy 20 minutes in a park or green space on your break.", reason: "Green space exposure significantly elevates overall sense of well-being." },
      { day: 7, action: "Take a 15-minute mindful outdoor walk and reflect on how your week felt.", reason: "Ending the week outdoors consolidates your mental wellness gains." }
    ],
    energy: [
      { day: 1, action: "Drink a full glass of water first thing in the morning and take a short stretch.", reason: "Morning hydration and movement trigger instant alertness." },
      { day: 2, action: "Take a 5-minute active walk break when you notice mid-afternoon sluggishness.", reason: "Light physical activity boosts blood flow faster than caffeine." },
      { day: 3, action: "Eat a balanced protein or fruit snack instead of sugary processed snacks.", reason: "Stable blood sugar prevents mid-day energy spikes and crashes." },
      { day: 4, action: "Step outside for 10 minutes of natural daylight during your mid-day break.", reason: "Daylight exposure optimizes your body's natural alertness cycle." },
      { day: 5, action: "Take a 5-minute breathing break to recharge between major tasks.", reason: "Deep breathing increases oxygenation and reduces mental fatigue." },
      { day: 6, action: "Refrain from heavy late-night meals or late caffeine.", reason: "Proper evening digestion allows deeper recovery sleep." },
      { day: 7, action: "Reflect on which energy habits made you feel most vitalized this week.", reason: "Identifying top energy drivers helps build sustainable vitality." }
    ],
    mealRoutine: [
      { day: 1, action: "Prepare one easy meal or snack option before your busiest study period.", reason: "Pre-planning snacks prevents skipping meals when your schedule gets intense." },
      { day: 2, action: "Keep a healthy, portable snack in your bag during study hours.", reason: "Having food ready prevents energy crashes during long study blocks." },
      { day: 3, action: "Eat a balanced morning meal or breakfast before your first class or work block.", reason: "Starting with proper fuel stabilizes morning focus and mood." },
      { day: 4, action: "Take a full 15-minute meal break away from your desk or screen.", reason: "Eating without distraction improves digestion and resets mental energy." },
      { day: 5, action: "Prepare a simple evening meal in advance to avoid late-night fast food.", reason: "Consistent evening nutrition supports restorative night sleep." },
      { day: 6, action: "Hydrate with a glass of water before each main meal today.", reason: "Pre-meal hydration supports healthy digestion and steady alertness." },
      { day: 7, action: "Review your busy study days and plan 2 quick meal options for next week.", reason: "Sustaining a routine keeps your energy steady during high-pressure weeks." }
    ],
    hydration: [
      { day: 1, action: "Keep a full water bottle at your desk during your first study block.", reason: "Having water in sight builds an effortless drinking habit." },
      { day: 2, action: "Drink one full glass of water immediately after waking up.", reason: "Morning hydration rehydrates your body after 7+ hours of sleep." },
      { day: 3, action: "Finish one full water bottle during your afternoon study period.", reason: "Afternoon hydration prevents mid-day headaches and brain fog." },
      { day: 4, action: "Take 2 sips of water every time you complete a study topic.", reason: "Anchoring hydration to study milestones keeps your intake consistent." },
      { day: 5, action: "Replace one extra coffee or sugary drink with water today.", reason: "Swapping excess caffeine for water prevents energy jitters." },
      { day: 6, action: "Keep a water bottle beside you during all study and leisure activities.", reason: "Continuous hydration sustains high mental focus." },
      { day: 7, action: "Reflect on how regular hydration affected your focus and energy levels.", reason: "Noticing hydration benefits reinforces long-term consistency." }
    ]
  };

  return plans[metricKey] || plans.screenTime;
}

// Initial structured weekly time-series logs
const initialWeeklyLogs = {
  '2026-09-22': {
    dateStr: '2026-09-22',
    timestamp: '2026-09-22T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 8.0,
    movement: '45m',
    screenTime: '2–4h',
    focus: '2–4h',
    energy: 4,
    mood: 4,
    mindfulness: '10m',
    outdoor: '30m',
    metrics: {
      sleep_hours: 8.0,
      movement_minutes: 45,
      screen_time_hours: 3.0,
      focus_hours: 3.0,
      energy_score: 4,
      mood_score: 4,
      mindfulness_minutes: 10,
      outdoor_minutes: 30,
    },
  },
  '2026-09-23': {
    dateStr: '2026-09-23',
    timestamp: '2026-09-23T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 7.5,
    movement: '30m',
    screenTime: '4–6h',
    focus: '2–4h',
    energy: 3,
    mood: 4,
    mindfulness: '10m',
    outdoor: '15m',
    metrics: {
      sleep_hours: 7.5,
      movement_minutes: 30,
      screen_time_hours: 5.0,
      focus_hours: 3.0,
      energy_score: 3,
      mood_score: 4,
      mindfulness_minutes: 10,
      outdoor_minutes: 15,
    },
  },
  '2026-09-24': {
    dateStr: '2026-09-24',
    timestamp: '2026-09-24T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 7.0,
    movement: '30m',
    screenTime: '4–6h',
    focus: '4–6h',
    energy: 3,
    mood: 3,
    mindfulness: '5m',
    outdoor: '15m',
    metrics: {
      sleep_hours: 7.0,
      movement_minutes: 30,
      screen_time_hours: 5.0,
      focus_hours: 5.0,
      energy_score: 3,
      mood_score: 3,
      mindfulness_minutes: 5,
      outdoor_minutes: 15,
    },
  },
  '2026-09-25': {
    dateStr: '2026-09-25',
    timestamp: '2026-09-25T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 7.5,
    movement: '45m',
    screenTime: '2–4h',
    focus: '2–4h',
    energy: 4,
    mood: 4,
    mindfulness: '15m',
    outdoor: '30m',
    metrics: {
      sleep_hours: 7.5,
      movement_minutes: 45,
      screen_time_hours: 3.0,
      focus_hours: 3.0,
      energy_score: 4,
      mood_score: 4,
      mindfulness_minutes: 15,
      outdoor_minutes: 30,
    },
  },
  '2026-09-26': {
    dateStr: '2026-09-26',
    timestamp: '2026-09-26T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 8.0,
    movement: '60m',
    screenTime: '<2h',
    focus: '1–2h',
    energy: 5,
    mood: 5,
    mindfulness: '20m',
    outdoor: '60m+',
    metrics: {
      sleep_hours: 8.0,
      movement_minutes: 60,
      screen_time_hours: 1.5,
      focus_hours: 1.5,
      energy_score: 5,
      mood_score: 5,
      mindfulness_minutes: 20,
      outdoor_minutes: 60,
    },
  },
  '2026-09-27': {
    dateStr: '2026-09-27',
    timestamp: '2026-09-27T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 8.5,
    movement: '45m',
    screenTime: '<2h',
    focus: '1–2h',
    energy: 4,
    mood: 5,
    mindfulness: '15m',
    outdoor: '60m+',
    metrics: {
      sleep_hours: 8.5,
      movement_minutes: 45,
      screen_time_hours: 1.5,
      focus_hours: 1.5,
      energy_score: 4,
      mood_score: 5,
      mindfulness_minutes: 15,
      outdoor_minutes: 60,
    },
  },
  '2026-09-28': {
    dateStr: '2026-09-28',
    timestamp: '2026-09-28T00:00:00.000Z',
    saved: true,
    partiallyTracked: true,
    sleep: 7.5,
    movement: '30m',
    screenTime: '2–4h',
    focus: '4–6h',
    energy: 4,
    mood: 4,
    mindfulness: '10m',
    outdoor: '30m',
    metrics: {
      sleep_hours: 7.5,
      movement_minutes: 30,
      screen_time_hours: 3.0,
      focus_hours: 5.0,
      energy_score: 4,
      mood_score: 4,
      mindfulness_minutes: 10,
      outdoor_minutes: 30,
    },
  },
};

// Storage keys & isolated per-user state helpers
const ACTIVE_USER_EMAIL_KEY = 'habitloop_active_user_email';

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function getStorageKeyForEmail(email) {
  const norm = normalizeEmail(email);
  if (!norm) return 'habitloop_guest_user';
  const cleanEmail = norm.replace(/[^a-z0-9_]/g, '_');
  return `habitloop_user_${cleanEmail}`;
}

export function createEmptyWeeklyLogs() {
  const days = ['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28'];
  const logs = {};
  days.forEach(d => {
    logs[d] = {
      dateStr: d,
      timestamp: `${d}T00:00:00.000Z`,
      saved: false,
      partiallyTracked: false,
      sleep: null,
      movement: null,
      screenTime: null,
      focus: null,
      energy: null,
      mood: null,
      mindfulness: null,
      outdoor: null,
      metrics: null,
    };
  });
  return logs;
}

export function createFreshUserState(userInfo = {}) {
  const normEmail = normalizeEmail(userInfo.email);
  const role = userInfo.role || userInfo.workStyle || 'Student';
  return {
    user: {
      name: userInfo.name || (normEmail ? normEmail.split('@')[0] : ''),
      email: normEmail,
      isLoggedIn: true,
    },
    onboardingData: {
      role: role,
      workStyle: role,
      focusAreas: ['🌙 Sleep', '💧 Hydration', '🏃 Movement', '📚 Study & Work Balance'],
      goals: ['Improve sleep consistency', 'Drink more water', 'Take regular breaks'],
    },
    weeklyLogs: createEmptyWeeklyLogs(),
    weeklyContext: {
      mealRoutine: 'Mostly consistent',
      mealVariety: 'Good variety',
      fruitVegetableFrequency: 'Most days',
      hydrationHabits: 'Mostly consistent',
      scheduleMealImpact: 'Sometimes',
      routineManageability: 'Mostly manageable',
      notes: '',
      saved: false,
    },
    activeExperiment: null,
    experimentLogs: {},
    experimentHistory: [],
  };
}

export function UserProvider({ children }) {
  const isHydratingRef = useRef(false);

  // Initial state hydration from localStorage if active session exists
  const initialData = (() => {
    try {
      const activeEmail = localStorage.getItem(ACTIVE_USER_EMAIL_KEY);
      if (activeEmail) {
        const norm = normalizeEmail(activeEmail);
        const key = getStorageKeyForEmail(norm);
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.user && parsed.user.isLoggedIn) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Error loading initial user state:', e);
    }
    return null;
  })();

  const [user, setUser] = useState(initialData?.user || { name: '', email: '', isLoggedIn: false });
  const [onboardingData, setOnboardingData] = useState(initialData?.onboardingData || {
    role: 'Student',
    workStyle: 'Student',
    focusAreas: ['🌙 Sleep', '💧 Hydration', '🏃 Movement', '📚 Study & Work Balance'],
    goals: ['Improve sleep consistency', 'Drink more water', 'Take regular breaks'],
  });

  const [weeklyCheckin, setWeeklyCheckin] = useState({
    sleepHours: 7.5,
    hydrationLiters: 2.0,
    movementMins: 30,
    nutritionRating: 'Good',
    moodScore: 4,
    stressLevel: 2,
    screenTimeHrs: 5.5,
    studyWorkRating: 'Balanced',
  });

  const [dailyActivities, setDailyActivities] = useState([
    { id: 'water', label: 'Hydration', unit: 'Liters', val: 2.0, target: 2.5, icon: '💧', color: 'blue' },
    { id: 'sleep', label: 'Sleep', unit: 'Hours', val: 7.5, target: 8.0, icon: '🌙', color: 'indigo' },
    { id: 'movement', label: 'Movement', unit: 'Minutes', val: 35, target: 45, icon: '🏃', color: 'emerald' },
    { id: 'mindfulness', label: 'Mindfulness', unit: 'Minutes', val: 10, target: 15, icon: '🧠', color: 'purple' },
    { id: 'screenBreak', label: 'Screen Break', unit: 'Breaks', val: 3, target: 4, icon: 'pink' },
    { id: 'studyBreak', label: 'Study Break', unit: 'Sessions', val: 2, target: 3, icon: '📚', color: 'amber' },
  ]);

  // Structured time-series weekly daily logs (Empty for new users, isolated per email)
  const [weeklyLogs, setWeeklyLogs] = useState(initialData?.weeklyLogs || createEmptyWeeklyLogs());

  // Weekly Nutrition + Lifestyle Context state
  const [weeklyContext, setWeeklyContext] = useState(initialData?.weeklyContext || {
    mealRoutine: 'Mostly consistent',
    mealVariety: 'Good variety',
    fruitVegetableFrequency: 'Most days',
    hydrationHabits: 'Mostly consistent',
    scheduleMealImpact: 'Sometimes',
    routineManageability: 'Mostly manageable',
    notes: '',
    saved: false,
  });

  // Experiment logs state
  const [experimentLogs, setExperimentLogs] = useState(initialData?.experimentLogs || {});

  // Active Improvement Experiment state
  const [activeExperiment, setActiveExperiment] = useState(initialData?.activeExperiment || null);

  const [experimentHistory, setExperimentHistory] = useState(initialData?.experimentHistory || []);

  // Login / Signup User helper for multi-account state isolation
  const loginOrSignupUser = (userInfo = {}) => {
    const rawEmail = userInfo.email || user.email || '';
    const normEmail = normalizeEmail(rawEmail);
    if (!normEmail) return;

    const storageKey = getStorageKeyForEmail(normEmail);
    const existingRaw = localStorage.getItem(storageKey);

    let newUserState;
    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        newUserState = {
          user: {
            name: (parsed.user && parsed.user.name && parsed.user.name.trim()) ? parsed.user.name.trim() : (userInfo.name || normEmail.split('@')[0]),
            email: normEmail,
            isLoggedIn: true,
          },
          onboardingData: parsed.onboardingData || {
            role: userInfo.role || userInfo.workStyle || 'Student',
            workStyle: userInfo.role || userInfo.workStyle || 'Student',
            focusAreas: ['🌙 Sleep', '💧 Hydration', '🏃 Movement', '📚 Study & Work Balance'],
            goals: ['Improve sleep consistency', 'Drink more water', 'Take regular breaks'],
          },
          weeklyLogs: parsed.weeklyLogs || createEmptyWeeklyLogs(),
          weeklyContext: parsed.weeklyContext || {
            mealRoutine: 'Mostly consistent',
            mealVariety: 'Good variety',
            fruitVegetableFrequency: 'Most days',
            hydrationHabits: 'Mostly consistent',
            scheduleMealImpact: 'Sometimes',
            routineManageability: 'Mostly manageable',
            notes: '',
            saved: false,
          },
          activeExperiment: parsed.activeExperiment || null,
          experimentLogs: parsed.experimentLogs || {},
          experimentHistory: parsed.experimentHistory || [],
        };
      } catch (e) {
        newUserState = createFreshUserState({ ...userInfo, email: normEmail });
      }
    } else {
      newUserState = createFreshUserState({ ...userInfo, email: normEmail });
    }

    isHydratingRef.current = true;

    setUser(newUserState.user);
    setOnboardingData(newUserState.onboardingData);
    setWeeklyLogs(newUserState.weeklyLogs);
    setWeeklyContext(newUserState.weeklyContext);
    setActiveExperiment(newUserState.activeExperiment);
    setExperimentLogs(newUserState.experimentLogs);
    setExperimentHistory(newUserState.experimentHistory);

    localStorage.setItem(ACTIVE_USER_EMAIL_KEY, normEmail);
    localStorage.setItem(storageKey, JSON.stringify(newUserState));

    setTimeout(() => {
      isHydratingRef.current = false;
    }, 50);
  };

  // Update user name helper for instant persistence to user-specific localStorage key
  const updateUserName = (newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed) return { success: false, error: 'Name cannot be empty.' };

    setUser(prev => {
      const updatedUser = { ...prev, name: trimmed };
      if (prev.isLoggedIn && prev.email) {
        const normEmail = normalizeEmail(prev.email);
        const storageKey = getStorageKeyForEmail(normEmail);
        const payload = {
          user: updatedUser,
          onboardingData,
          weeklyLogs,
          weeklyContext,
          activeExperiment,
          experimentLogs,
          experimentHistory,
        };
        try {
          localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch (e) {
          console.error('Error persisting updated user name:', e);
        }
      }
      return updatedUser;
    });

    return { success: true };
  };

  // Update active user email safely with localStorage key migration
  const updateUserEmail = (newEmail) => {
    const cleanNew = normalizeEmail(newEmail);
    if (!cleanNew) return { success: false, error: 'Email cannot be empty.' };

    const oldEmail = normalizeEmail(user.email);
    if (cleanNew === oldEmail) {
      return { success: true };
    }

    const oldKey = getStorageKeyForEmail(oldEmail);
    const newKey = getStorageKeyForEmail(cleanNew);

    const existingTarget = localStorage.getItem(newKey);
    if (existingTarget) {
      try {
        const parsedTarget = JSON.parse(existingTarget);
        if (parsedTarget.user && parsedTarget.user.email && normalizeEmail(parsedTarget.user.email) !== oldEmail) {
          return { success: false, error: 'An account with this email already exists.' };
        }
      } catch (e) {
        // ignore
      }
    }

    // Move state payload to new key
    const payload = {
      user: { ...user, email: cleanNew },
      onboardingData,
      weeklyLogs,
      weeklyContext,
      activeExperiment,
      experimentLogs,
      experimentHistory,
    };

    localStorage.setItem(newKey, JSON.stringify(payload));
    localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanNew);
    if (oldKey !== newKey && oldKey !== 'habitloop_guest_user') {
      localStorage.removeItem(oldKey);
    }

    setUser(prev => ({ ...prev, email: cleanNew }));
    return { success: true };
  };

  // Auto-persist active user state to user-specific localStorage key
  useEffect(() => {
    if (isHydratingRef.current) return;
    if (user.isLoggedIn && user.email) {
      const normEmail = normalizeEmail(user.email);
      const storageKey = getStorageKeyForEmail(normEmail);
      const payload = {
        user: { ...user, email: normEmail },
        onboardingData,
        weeklyLogs,
        weeklyContext,
        activeExperiment,
        experimentLogs,
        experimentHistory,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, normEmail);
    }
  }, [user, onboardingData, weeklyLogs, weeklyContext, activeExperiment, experimentLogs, experimentHistory]);

  // Increment activity action
  const incrementActivity = (id, amount = 1) => {
    setDailyActivities(prev =>
      prev.map(act => (act.id === id ? { ...act, val: parseFloat((act.val + amount).toFixed(1)) } : act))
    );
  };

  // Log a daily experiment check-in entry
  const logExperimentDay = (experimentId, dayLogData) => {
    const expId = experimentId || activeExperiment?.id;
    if (!expId) return;

    setExperimentLogs(prev => {
      const currentExpLogs = prev[expId] || {};
      const existingDaysCount = Object.keys(currentExpLogs).length;
      const nextDayNum = existingDaysCount + 1;
      const dayKey = `day_${nextDayNum}`;

      const newLogEntry = {
        dayNumber: nextDayNum,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        completed: dayLogData?.completed ?? true,
        ...dayLogData,
      };

      return {
        ...prev,
        [expId]: {
          ...currentExpLogs,
          [dayKey]: newLogEntry,
        }
      };
    });
  };

  // Start new experiment (ONLY called when user explicitly clicks "Start 7-Day Experiment")
  const startExperiment = (experimentConfig) => {
    const newExpId = `exp_${Date.now()}`;
    const baselineData = experimentConfig.baseline || {};
    const targetMetric = experimentConfig.targetMetric || 'screenTime';
    const watchedMetrics = experimentConfig.watchedMetrics || ['sleep', 'energy'];
    
    // Store daily plan directly inside activeExperiment ONCE
    const dailyPlan = experimentConfig.dailyPlan || generate7DayPlan(targetMetric, watchedMetrics, baselineData);

    const newExp = {
      id: newExpId,
      title: experimentConfig.title || 'Wellness Micro-Experiment',
      goal: experimentConfig.goal || 'Optimize daily wellness through 7 guided daily micro-changes',
      targetMetric: targetMetric,
      watchedMetrics: watchedMetrics,
      changeDescription: experimentConfig.changeDescription || (dailyPlan[0] ? dailyPlan[0].action : 'Try a daily micro-change.'),
      durationDays: experimentConfig.durationDays || 7,
      baseline: baselineData,
      dailyPlan: dailyPlan,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      decision: null,
    };

    setActiveExperiment(newExp);
    setExperimentLogs(prev => ({
      ...prev,
      [newExpId]: {} // 0 logged days initialized
    }));
  };

  // Complete experiment with decision
  const completeExperiment = (decision) => {
    if (!activeExperiment) return;
    const finishedExp = {
      ...activeExperiment,
      status: 'completed',
      decision, // 'keep' | 'drop'
      completedDate: new Date().toISOString().split('T')[0],
    };
    setActiveExperiment(finishedExp);
    setExperimentHistory(prev => [finishedExp, ...prev]);
  };

  // Helper to calculate 0-100 scores for all 8 primary wellness factors from weekly logs
  const getFactorScores = (logs) => {
    const savedLogs = Object.values(logs || {}).filter(l => l && l.saved);
    const count = savedLogs.length || 1;

    const scores = {
      sleep: 0,
      movement: 0,
      screenTime: 0,
      focus: 0,
      energy: 0,
      mood: 0,
      mindfulness: 0,
      outdoor: 0,
    };

    savedLogs.forEach(l => {
      scores.sleep += Math.min(100, Math.round(((Number(l.sleep) || 7.5) / 8.0) * 100));

      const movMap = { '15m': 40, '30m': 70, '45m': 100, '60m': 100, '90m': 100 };
      scores.movement += movMap[l.movement] || 50;

      const scrMap = { '<2h': 100, '2–4h': 85, '4–6h': 65, '6–8h': 45, '8h+': 25 };
      scores.screenTime += scrMap[l.screenTime] || 60;

      const focMap = { '<1h': 40, '1–2h': 70, '2–4h': 100, '4–6h': 90, '6h+': 75 };
      scores.focus += focMap[l.focus] || 70;

      scores.energy += (Number(l.energy) || 4) * 20;
      scores.mood += (Number(l.mood) || 4) * 20;

      const minMap = { '0m': 20, '5m': 40, '10m': 60, '15m': 80, '20m': 100, '25m': 100, '30m+': 100 };
      scores.mindfulness += minMap[l.mindfulness] || 60;

      const outMap = { '0m': 20, '15m': 50, '30m': 80, '60m+': 100 };
      scores.outdoor += outMap[l.outdoor] || 60;
    });

    return {
      sleep: Math.round(scores.sleep / count),
      movement: Math.round(scores.movement / count),
      screenTime: Math.round(scores.screenTime / count),
      focus: Math.round(scores.focus / count),
      energy: Math.round(scores.energy / count),
      mood: Math.round(scores.mood / count),
      mindfulness: Math.round(scores.mindfulness / count),
      outdoor: Math.round(scores.outdoor / count),
    };
  };

  // Deterministic pattern-based recommendation engine (Pure function, does NOT mutate state)
  // HIERARCHY:
  // 1. Evaluate the 8 primary wellness factors first -> Identify primaryTarget factor
  // 2. Inspect Nutrition & Lifestyle context -> Refine recommendation IF relevant
  // 3. Inspect Lifestyle / Work Style -> Tailor action copy & daily plan for routine
  // 4. Target metric MUST ALWAYS be one of the 8 primary factors
  const getPatternRecommendation = () => {
    const metrics = calculateWeeklyMetrics(weeklyLogs);
    const scores = getFactorScores(weeklyLogs);
    const historyTargetMetrics = (experimentHistory || []).map(h => h.targetMetric);

    // 1. EVALUATE 8 PRIMARY FACTORS FIRST (Rank from lowest score to highest)
    const sortedFactors = Object.keys(scores)
      .filter(k => METRIC_CONFIG[k])
      .sort((a, b) => scores[a] - scores[b]);

    // Pick lowest-scoring wellness factor not recently targeted
    const primaryTarget = sortedFactors.find(f => !historyTargetMetrics.includes(f)) || sortedFactors[0] || 'energy';

    // 2. INSPECT NUTRITION & LIFESTYLE CONTEXT
    const { scheduleMealImpact, hydrationHabits, mealRoutine, saved: contextSaved } = weeklyContext || {};

    // 3. INSPECT LIFESTYLE / WORK STYLE
    const userRole = onboardingData?.workStyle || onboardingData?.role || 'Student';

    // Role-specific phrasing helper
    const getRoleContextPrefix = (role) => {
      switch (role) {
        case 'Student': return 'As a Student balancing study sessions';
        case 'Working Professional': return 'As a Working Professional managing office/meeting blocks';
        case 'Remote Worker / Freelancer': return 'As a Remote Worker balancing home workspace boundaries';
        case 'Researcher / Academic': return 'As a Researcher engaging in deep academic sessions';
        case 'Entrepreneur / Business Owner': return 'As an Entrepreneur navigating a dynamic schedule';
        case 'Creative Professional': return 'As a Creative Professional balancing deep output';
        default: return 'For your daily routine';
      }
    };

    const roleTag = getRoleContextPrefix(userRole);

    // 4. BUILD RECOMMENDATION FOR THE PRIMARY WELLNESS FACTOR
    if (primaryTarget === 'energy') {
      const targetMetric = 'energy';
      const watchedMetrics = ['energy', 'focus'];
      let goal = 'Boost daily energy levels and eliminate mid-day slumps.';
      let changeDescription = 'Take a 5-minute active walk break when you notice mid-afternoon sluggishness.';
      let why = `Your 8 wellness factors identified energy as your primary opportunity for improvement (${metrics.avgEnergy}/5 avg). ${roleTag}, short active breaks help maintain peak afternoon vitality.`;
      let dailyPlan = generate7DayPlan('energy', watchedMetrics, metrics);

      if (userRole === 'Student') {
        goal = 'Sustain study block energy and prevent afternoon fatigue.';
        changeDescription = 'Take a 5-minute hydration and walk break between study sessions.';
      } else if (userRole === 'Working Professional') {
        goal = 'Prevent afternoon workplace slumps between meeting blocks.';
        changeDescription = 'Take a 5-minute active walking pause between afternoon meetings or work blocks.';
      } else if (userRole === 'Remote Worker / Freelancer') {
        goal = 'Reset physical energy away from your home desk.';
        changeDescription = 'Step away from your home workspace for a 5-minute movement break mid-afternoon.';
      } else if (userRole === 'Researcher / Academic') {
        goal = 'Maintain mental stamina during extended research sessions.';
        changeDescription = 'Do a 5-minute physical reset break after each deep research block.';
      } else if (userRole === 'Entrepreneur / Business Owner') {
        goal = 'Sustain high vitality across demanding daily tasks.';
        changeDescription = 'Drink a full glass of water and take a 5-minute active pause before your peak afternoon tasks.';
      } else if (userRole === 'Creative Professional') {
        goal = 'Refresh creative energy and clear mental fatigue.';
        changeDescription = 'Take a 5-minute phone-free outdoor movement break between creative blocks.';
      }

      if (contextSaved && (scheduleMealImpact === 'Often' || scheduleMealImpact === 'Very often')) {
        goal = `Support consistent energy during busy ${userRole.toLowerCase()} schedule days.`;
        changeDescription = 'Prepare one easy meal or snack option before your busiest work period.';
        why = `Your 8 wellness factors identified energy as your main area to watch. Your schedule frequently affected your meal routine alongside lower-energy days.`;
        dailyPlan = generate7DayPlan('mealRoutine', watchedMetrics, metrics);
      } else if (contextSaved && hydrationHabits === 'Could improve') {
        goal = 'Sustain steady energy and prevent afternoon slumps with consistent hydration.';
        changeDescription = 'Drink a full glass of water at the start of each major task block.';
        why = `Energy was identified as your primary target area. Inconsistent hydration coincided with mid-day energy dips.`;
        dailyPlan = generate7DayPlan('hydration', watchedMetrics, metrics);
      }

      return {
        id: 'rec_energy',
        icon: '⚡',
        title: 'Energy Support Micro-Experiment',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { energy: metrics.avgEnergy, focus: metrics.avgFocus, sleep: metrics.avgSleep },
        dailyPlan,
      };
    }

    if (primaryTarget === 'sleep') {
      const targetMetric = 'sleep';
      const watchedMetrics = ['sleep', 'energy'];
      let goal = 'Improve sleep duration and consistency for refreshed morning energy.';
      let changeDescription = 'Start a consistent wind-down routine 20 minutes before bedtime.';
      let why = `Your 8 wellness factors identified sleep as your primary target area (${metrics.avgSleep}h avg). ${roleTag}, a reliable bedtime window strengthens daily focus and recovery.`;
      let dailyPlan = generate7DayPlan('sleep', watchedMetrics, metrics);

      if (userRole === 'Student') {
        goal = 'Protect bedtime consistency for refreshed morning lectures and study blocks.';
        changeDescription = 'Set a 20-minute phone-free wind-down routine before your target bedtime.';
      } else if (userRole === 'Working Professional') {
        goal = 'Establish an evening boundary to transition from workday stress into rest.';
        changeDescription = 'Turn off work notifications 30 minutes before bedtime and start a calming wind-down.';
      } else if (userRole === 'Remote Worker / Freelancer') {
        goal = 'Establish clear evening boundaries between home workspace and rest.';
        changeDescription = 'Shut down your home workspace 30 minutes before bed and follow a gentle wind-down.';
      } else if (userRole === 'Researcher / Academic') {
        goal = 'Allow brain recovery after intensive analytical study and research.';
        changeDescription = 'Stop reading research materials 30 minutes before bed and engage in a quiet activity.';
      } else if (userRole === 'Entrepreneur / Business Owner') {
        goal = 'Secure a manageable bedtime window despite a dynamic daily schedule.';
        changeDescription = 'Maintain a 20-minute quiet evening wind-down at a consistent target hour.';
      } else if (userRole === 'Creative Professional') {
        goal = 'Unplug creative thought loops before sleep.';
        changeDescription = 'Dim lights and do a 15-minute phone-free wind-down before bed.';
      }

      if (contextSaved && (scheduleMealImpact === 'Often' || mealRoutine === 'Very irregular')) {
        goal = 'Promote restorative sleep by establishing a steady evening wind-down.';
        changeDescription = 'Start a 20-minute phone-free wind-down routine at a consistent time before bed.';
        why = `Sleep was identified as your primary factor to watch. An irregular daily schedule coincided with lower evening sleep readiness.`;
      }

      return {
        id: 'rec_sleep',
        icon: '🌙',
        title: 'Consistent Bedtime Window',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { sleep: metrics.avgSleep, energy: metrics.avgEnergy },
        dailyPlan,
      };
    }

    if (primaryTarget === 'screenTime') {
      const targetMetric = 'screenTime';
      const watchedMetrics = ['screenTime', 'sleep'];
      let goal = 'Reduce evening screen exposure to boost sleep quality and morning clarity.';
      let changeDescription = 'Keep your phone out of reach during your final 30 minutes before bedtime.';
      let why = `Your 8 wellness factors identified screen time as your primary opportunity to improve (~${metrics.avgScreen}h avg). ${roleTag}, cutting pre-bed screen exposure frees up mental clarity.`;

      if (userRole === 'Working Professional' || userRole === 'Remote Worker / Freelancer') {
        goal = 'Disconnect from work and personal screens before bedtime for deeper rest.';
        changeDescription = 'Put away work and personal screens 30 minutes before bed.';
      } else if (userRole === 'Researcher / Academic') {
        goal = 'Give your eyes and brain a break from screen-based research before sleeping.';
        changeDescription = 'Swap late-night reading on screens for offline relaxation 30 minutes before bed.';
      } else if (userRole === 'Entrepreneur / Business Owner') {
        goal = 'Protect evening downtime from late-night message and email checking.';
        changeDescription = 'Enforce a screen-free wind-down 30 minutes before your target bedtime.';
      }

      return {
        id: 'rec_screenTime',
        icon: '📱',
        title: '30-Minute Screen-Free Wind-Down',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { screenTime: metrics.avgScreen, sleep: metrics.avgSleep },
        dailyPlan: generate7DayPlan('screenTime', watchedMetrics, metrics),
      };
    }

    if (primaryTarget === 'focus') {
      const targetMetric = 'focus';
      const watchedMetrics = ['focus', 'energy'];
      let goal = 'Build concentration momentum with structured single-task focus blocks.';
      let changeDescription = 'Complete one 25-minute uninterrupted focus block with phone on silent.';
      let why = `Your 8 wellness factors identified focus time as your primary target area (~${metrics.avgFocus}h avg). ${roleTag}, single-tasking protects your highest-priority goals.`;
      let dailyPlan = generate7DayPlan('focus', watchedMetrics, metrics);

      if (userRole === 'Student') {
        goal = 'Build study concentration momentum with structured single-task focus blocks.';
        changeDescription = 'Complete one 25-minute uninterrupted study block with phone on silent.';
      } else if (userRole === 'Working Professional') {
        goal = 'Protect deep work time from continuous workplace notifications.';
        changeDescription = 'Schedule one 30-minute quiet focus block for your top priority work task.';
      } else if (userRole === 'Remote Worker / Freelancer') {
        goal = 'Structure independent work hours with dedicated focus intervals.';
        changeDescription = 'Complete one 25-minute focus session without switching tabs or checking messages.';
      } else if (userRole === 'Researcher / Academic') {
        goal = 'Protect uninterrupted deep reading and writing sessions.';
        changeDescription = 'Set a timer for one 45-minute deep focus block with notifications silenced.';
      } else if (userRole === 'Entrepreneur / Business Owner') {
        goal = 'Carve out distraction-free time for core business priorities.';
        changeDescription = 'Complete one 25-minute quiet focus session on your highest-leverage task.';
      } else if (userRole === 'Creative Professional') {
        goal = 'Protect dedicated, uninterrupted creative focus blocks.';
        changeDescription = 'Spend 30 minutes on a single creative project without checking social media.';
      }

      if (contextSaved && (scheduleMealImpact === 'Often' || scheduleMealImpact === 'Very often')) {
        goal = 'Maintain steady focus during high-pressure schedule days.';
        changeDescription = 'Take a planned 5-minute quiet break between focus sessions.';
        why = `Focus time was identified as your primary factor to improve, and a busy schedule frequently interrupted work blocks.`;
      }

      return {
        id: 'rec_focus',
        icon: '📚',
        title: 'Structured Single-Task Focus',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { focus: metrics.avgFocus, energy: metrics.avgEnergy },
        dailyPlan,
      };
    }

    if (primaryTarget === 'movement') {
      const targetMetric = 'movement';
      const watchedMetrics = ['movement', 'energy'];
      let goal = 'Incorporate regular movement breaks to elevate physical energy and focus.';
      let changeDescription = 'Take a 10-minute brisk walk after your morning routine.';
      let why = `Your 8 wellness factors identified movement as your primary area to improve (${metrics.avgMovement}m/day avg). ${roleTag}, short active breaks prevent sedentary fatigue.`;

      if (userRole === 'Working Professional') {
        goal = 'Break up sedentary office hours with active movement intervals.';
        changeDescription = 'Take a 10-minute walk break after lunch or between work meetings.';
      } else if (userRole === 'Remote Worker / Freelancer') {
        goal = 'Incorporate regular physical movement into your work-from-home routine.';
        changeDescription = 'Take a 10-minute outdoor or indoor walk break midway through your workday.';
      } else if (userRole === 'Researcher / Academic') {
        goal = 'Relieve physical stiffness during extended research sessions.';
        changeDescription = 'Do a 5-minute stretch and short walk break after each long research session.';
      }

      return {
        id: 'rec_movement',
        icon: '🏃',
        title: 'Daily Movement Break',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { movement: metrics.avgMovement, energy: metrics.avgEnergy },
        dailyPlan: generate7DayPlan('movement', watchedMetrics, metrics),
      };
    }

    if (primaryTarget === 'mindfulness') {
      const targetMetric = 'mindfulness';
      const watchedMetrics = ['mindfulness', 'mood'];
      let goal = 'Improve mindfulness and support mental calm.';
      let changeDescription = 'Do a 5-minute guided mindfulness session after waking up.';
      let why = `Your 8 wellness factors identified mindfulness as your top opportunity for improvement (${metrics.avgMindfulness}m/day avg). ${roleTag}, brief morning resets lower daily stress.`;

      if (userRole === 'Working Professional') {
        goal = 'Create a calm mental buffer before diving into daily work demands.';
        changeDescription = 'Spend 5 minutes in quiet breathing before opening morning work emails.';
      } else if (userRole === 'Remote Worker / Freelancer') {
        goal = 'Center your mind before launching into independent work tasks.';
        changeDescription = 'Practice 5 minutes of quiet mindfulness at your desk before starting your workday.';
      }

      return {
        id: 'rec_mindfulness',
        icon: '🧠',
        title: 'Daily Mindfulness Reset',
        goal,
        changeDescription,
        why,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { mindfulness: metrics.avgMindfulness, mood: metrics.avgMood },
        dailyPlan: generate7DayPlan('mindfulness', watchedMetrics, metrics),
      };
    }

    if (primaryTarget === 'outdoor') {
      const targetMetric = 'outdoor';
      const watchedMetrics = ['outdoor', 'mood'];
      return {
        id: 'rec_outdoor',
        icon: '🌿',
        title: 'Outdoor Refresh Break',
        goal: 'Increase daily outdoor exposure to boost mood and mental clarity.',
        changeDescription: 'Spend 10 minutes outdoors right after your morning study or work session.',
        why: `Your 8 wellness factors identified outdoor time as your primary target area (${metrics.avgOutdoor}m/day avg). ${roleTag}, natural daylight clears brain fog.`,
        durationDays: 7,
        targetMetric,
        watchedMetrics,
        baseline: { outdoor: metrics.avgOutdoor, mood: metrics.avgMood },
        dailyPlan: generate7DayPlan('outdoor', watchedMetrics, metrics),
      };
    }

    // Default Fallback: mood
    const targetMetric = 'mood';
    const watchedMetrics = ['mood', 'outdoor'];
    return {
      id: 'rec_mood',
      icon: '🙂',
      title: 'Morning Sunshine & Well-being',
      goal: 'Support daily mood with morning light and a relaxing stretch.',
      changeDescription: 'Spend 15 minutes outside in natural sunlight during lunch or work break.',
      why: `Your 8 wellness factors identified mood as your primary factor to watch (${metrics.avgMood}/5 avg). ${roleTag}, morning sunlight regulates daily well-being.`,
      durationDays: 7,
      targetMetric,
      watchedMetrics,
      baseline: { mood: metrics.avgMood, outdoor: metrics.avgOutdoor },
      dailyPlan: generate7DayPlan('mood', watchedMetrics, metrics),
    };
  };

  // Shared Sign Out action (resets session and user state for any role)
  const signOut = () => {
    isHydratingRef.current = true;
    try {
      localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    } catch (e) {
      console.error('Error clearing active user email:', e);
    }
    setUser({
      name: '',
      email: '',
      isLoggedIn: false,
    });
    setOnboardingData({
      role: 'Student',
      workStyle: 'Student',
      focusAreas: ['🌙 Sleep', '💧 Hydration', '🏃 Movement', '📚 Study & Work Balance'],
      goals: ['Improve sleep consistency', 'Drink more water', 'Take regular breaks'],
    });
    setWeeklyLogs(createEmptyWeeklyLogs());
    setWeeklyContext({
      mealRoutine: 'Mostly consistent',
      mealVariety: 'Good variety',
      fruitVegetableFrequency: 'Most days',
      hydrationHabits: 'Mostly consistent',
      scheduleMealImpact: 'Sometimes',
      routineManageability: 'Mostly manageable',
      notes: '',
      saved: false,
    });
    setActiveExperiment(null);
    setExperimentLogs({});
    setExperimentHistory([]);

    setTimeout(() => {
      isHydratingRef.current = false;
    }, 50);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUserName,
        loginOrSignupUser,
        updateUserEmail,
        signOut,
        onboardingData,
        setOnboardingData,
        weeklyCheckin,
        setWeeklyCheckin,
        weeklyContext,
        setWeeklyContext,
        dailyActivities,
        incrementActivity,
        weeklyLogs,
        setWeeklyLogs,
        experimentLogs,
        setExperimentLogs,
        logExperimentDay,
        activeExperiment,
        setActiveExperiment,
        experimentHistory,
        startExperiment,
        completeExperiment,
        getPatternRecommendation,
        calculateExperimentProgress: (exp) => calculateExperimentProgress(experimentLogs, exp || activeExperiment),
        calculateExperimentResults: (exp) => calculateExperimentResults(experimentLogs, exp || activeExperiment, weeklyLogs),
        calculateWeeklyMetrics: () => calculateWeeklyMetrics(weeklyLogs),
        analyzeWeeklyPatterns: () => analyzeWeeklyPatterns(weeklyLogs),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
