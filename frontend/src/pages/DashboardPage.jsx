import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Minus,
  ChevronRight,
  FlaskConical,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser, OPTION_NUMERIC_MAP } from '../context/UserContext';

// 1. ACTIVE WEEK DAYS DEFINITION (Mon 22 → Sun 28)
const WEEK_DAYS = [
  { dayStr: 'MON', fullDay: 'Monday', dateNum: 22, dateStr: '2026-09-22', isToday: false },
  { dayStr: 'TUE', fullDay: 'Tuesday', dateNum: 23, dateStr: '2026-09-23', isToday: false },
  { dayStr: 'WED', fullDay: 'Wednesday', dateNum: 24, dateStr: '2026-09-24', isToday: true },
  { dayStr: 'THU', fullDay: 'Thursday', dateNum: 25, dateStr: '2026-09-25', isToday: false },
  { dayStr: 'FRI', fullDay: 'Friday', dateNum: 26, dateStr: '2026-09-26', isToday: false },
  { dayStr: 'SAT', fullDay: 'Saturday', dateNum: 27, dateStr: '2026-09-27', isToday: false },
  { dayStr: 'SUN', fullDay: 'Sunday', dateNum: 28, dateStr: '2026-09-28', isToday: false },
];

// 2. PROVISIONAL WEIGHTED WELLNESS FACTORS CONFIGURATION
export const WELLNESS_FACTORS = [
  {
    id: 'sleep',
    label: 'Sleep',
    icon: '🌙',
    weight: 0.20,
    unit: 'Hours',
    type: 'stepper',
    min: 0,
    max: 12,
    step: 0.5,
    defaultVal: 7.5,
    calcScore: (val) => Math.min(100, Math.round(((val || 7.5) / 8.0) * 100)),
  },
  {
    id: 'movement',
    label: 'Movement',
    icon: '🏃',
    weight: 0.15,
    unit: '',
    type: 'options',
    options: ['15m', '30m', '45m', '60m', '90m'],
    defaultVal: '30m',
    calcScore: (val) => {
      const map = { '15m': 40, '30m': 70, '45m': 100, '60m': 100, '90m': 100 };
      return map[val] || 50;
    },
  },
  {
    id: 'screenTime',
    label: 'Screen Time',
    icon: '📱',
    weight: 0.15,
    unit: '',
    type: 'options',
    options: ['<2h', '2–4h', '4–6h', '6–8h', '8h+'],
    defaultVal: '2–4h',
    calcScore: (val) => {
      const map = { '<2h': 100, '2–4h': 85, '4–6h': 65, '6–8h': 45, '8h+': 25 };
      return map[val] || 60;
    },
  },
  {
    id: 'focus',
    label: 'Study & Work Focus',
    icon: '📚',
    weight: 0.15,
    unit: '',
    type: 'options',
    options: ['<1h', '1–2h', '2–4h', '4–6h', '6h+'],
    defaultVal: '2–4h',
    calcScore: (val) => {
      const map = { '<1h': 40, '1–2h': 70, '2–4h': 100, '4–6h': 90, '6h+': 75 };
      return map[val] || 70;
    },
  },
  {
    id: 'energy',
    label: 'Energy Level',
    icon: '⚡',
    weight: 0.10,
    unit: '',
    type: 'rating_5',
    options: [
      { num: 1, label: 'Low' },
      { num: 2, label: 'Fair' },
      { num: 3, label: 'Good' },
      { num: 4, label: 'High' },
      { num: 5, label: 'Peak' }
    ],
    defaultVal: 4,
    calcScore: (val) => (val || 3) * 20,
  },
  {
    id: 'mood',
    label: 'Mood & Well-being',
    icon: '🙂',
    weight: 0.10,
    unit: '',
    type: 'emojis_5',
    options: [
      { val: 1, emoji: '😔', label: 'Down' },
      { val: 2, emoji: '😕', label: 'Low' },
      { val: 3, emoji: '😐', label: 'Okay' },
      { val: 4, emoji: '🙂', label: 'Good' },
      { val: 5, emoji: '😄', label: 'Great' }
    ],
    defaultVal: 4,
    calcScore: (val) => (val || 3) * 20,
  },
  {
    id: 'mindfulness',
    label: 'Mindfulness',
    icon: '🧠',
    weight: 0.05,
    unit: '',
    type: 'options',
    options: ['0m', '5m', '10m', '15m', '20m','25m','30m+'],
    defaultVal: '10m',
    calcScore: (val) => {
      const map = { '0m': 20, '5m': 60, '10m': 80, '15m': 90, '20m': 100, '25m': 100, '30m+': 100 };
      return map[val] || 50;
    },
  },
  {
    id: 'outdoor',
    label: 'Outdoor Time',
    icon: '🌿',
    weight: 0.10,
    unit: '',
    type: 'options',
    options: ['0m', '15m', '30m', '60m+'],
    defaultVal: '30m',
    calcScore: (val) => {
      const map = { '0m': 20, '15m': 65, '30m': 85, '60m+': 100 };
      return map[val] || 50;
    },
  },
];

// Calculate normalized weighted wellness score (0-100) for a given day log
export function calculateDailyWellnessScore(log) {
  if (!log || (!log.saved && !log.partiallyTracked)) return 0;
  let totalScore = 0;
  WELLNESS_FACTORS.forEach(factor => {
    const val = log[factor.id] ?? factor.defaultVal;
    const factorScore = factor.calcScore(val);
    totalScore += factorScore * factor.weight;
  });
  return Math.round(totalScore);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, weeklyLogs, setWeeklyLogs, activeExperiment, calculateExperimentProgress, weeklyContext } = useUser();
  const expProgress = calculateExperimentProgress ? calculateExperimentProgress(activeExperiment) : { trackedDays: 0, totalDays: 7, percentage: 0, isComplete: false };

  // Active selected date state (defaults to Wednesday Sep 24 - Today)
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-24');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Active day object & active log
  const activeDayObj = WEEK_DAYS.find(d => d.dateStr === selectedDateStr) || WEEK_DAYS[2];
  const activeDayLog = weeklyLogs[selectedDateStr] || {
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
  };

  // Calculations
  const isSelectedDayTracked = activeDayLog.saved || activeDayLog.partiallyTracked;
  const selectedDayScore = isSelectedDayTracked ? calculateDailyWellnessScore(activeDayLog) : null;
  const savedLogs = Object.values(weeklyLogs).filter(l => l.saved);
  const completedDaysCount = savedLogs.length;

  const handleFactorChange = (factorId, newVal) => {
    setWeeklyLogs(prev => {
      const existingLog = prev[selectedDateStr] || {};
      const updatedLog = {
        ...existingLog,
        [factorId]: newVal,
        partiallyTracked: true,
      };

      const numMetrics = { ...(existingLog.metrics || {}) };
      if (factorId === 'sleep') numMetrics.sleep_hours = newVal;
      if (factorId === 'movement') numMetrics.movement_minutes = OPTION_NUMERIC_MAP.movement[newVal] || 30;
      if (factorId === 'screenTime') numMetrics.screen_time_hours = OPTION_NUMERIC_MAP.screenTime[newVal] || 4.0;
      if (factorId === 'focus') numMetrics.focus_hours = OPTION_NUMERIC_MAP.focus[newVal] || 3.0;
      if (factorId === 'energy') numMetrics.energy_score = newVal;
      if (factorId === 'mood') numMetrics.mood_score = newVal;
      if (factorId === 'mindfulness') numMetrics.mindfulness_minutes = OPTION_NUMERIC_MAP.mindfulness[newVal] || 10;
      if (factorId === 'outdoor') numMetrics.outdoor_minutes = OPTION_NUMERIC_MAP.outdoor[newVal] || 15;

      updatedLog.metrics = numMetrics;

      return {
        ...prev,
        [selectedDateStr]: updatedLog,
      };
    });
  };

  const handleSaveCurrentDay = () => {
    setWeeklyLogs(prev => {
      const current = prev[selectedDateStr] || {};
      return {
        ...prev,
        [selectedDateStr]: {
          ...current,
          saved: true,
          partiallyTracked: true,
          sleep: current.sleep ?? 7.5,
          movement: current.movement ?? '30m',
          screenTime: current.screenTime ?? '2–4h',
          focus: current.focus ?? '2–4h',
          energy: current.energy ?? 4,
          mood: current.mood ?? 4,
          mindfulness: current.mindfulness ?? '10m',
          outdoor: current.outdoor ?? '30m',
        }
      };
    });

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.75 }
    });

    setSaveSuccessMsg(`✓ ${activeDayObj.fullDay} wellness logged & saved!`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const displayName = (user.name && user.name.trim()) ? user.name.trim() : 'there';

  return (
    <div className="dashboard-page-container">
      
      {/* 1. HEADER */}
      <div className="dashboard-header-clean">
        <div className="dashboard-eyebrow-tag">
          <Sparkles size={12} className="eyebrow-icon" />
          <span>DAILY WELLNESS CHECK-IN</span>
        </div>
        <h1 className="dashboard-main-greeting">
          Good morning, {displayName}!
        </h1>
        <p className="dashboard-main-subtitle">
          Track your day, notice your patterns, and build a better week.
        </p>
      </div>

      {/* 2. COMPACT ACTIVE EXPERIMENT CARD */}
      {activeExperiment && activeExperiment.status !== 'none' && (
        <div className="active-experiment-card">
          {/* Left Column */}
          <div className="exp-col-left">
            <div className="exp-icon-box">
              <FlaskConical size={20} />
            </div>
            <div>
              <span className="exp-badge">
                {expProgress.isComplete ? '✓ EXPERIMENT COMPLETE' : '🧪 ACTIVE EXPERIMENT'}
              </span>
              <h3 className="exp-title">{activeExperiment.title}</h3>
              <p className="exp-desc">"{activeExperiment.changeDescription}"</p>
            </div>
          </div>

          {/* Center Column */}
          <div className="exp-col-center">
            <span className="exp-day-text">
              {expProgress.isComplete ? `${expProgress.trackedDays} of ${expProgress.totalDays} days measured` : `Day ${expProgress.trackedDays} of ${expProgress.totalDays}`}
            </span>
            <div className="exp-progress-track">
              <div 
                className="exp-progress-fill" 
                style={{ width: `${expProgress.percentage}%` }}
              />
            </div>
            <span className="exp-percent-text">
              {expProgress.percentage}% complete
            </span>
          </div>

          {/* Right Column */}
          <div className="exp-col-right">
            <div className="exp-watching-box">
              <span className="exp-watching-label">Watching</span>
              <span className="exp-watching-val">{activeExperiment.watchedMetrics ? activeExperiment.watchedMetrics.join(' + ') : 'sleep + energy'}</span>
            </div>
            <Link to="/experiment" className="btn-exp-action">
              <span>{expProgress.isComplete ? 'View Results →' : 'View Experiment →'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* 3. WELLNESS SNAPSHOT SECTION (TODAY'S WELLNESS + YOUR WEEK) */}
      <div className="wellness-snapshot-grid">
        
        {/* LEFT CARD: TODAY'S WELLNESS */}
        <div className="snapshot-card snapshot-left">
          <div className="snapshot-text-col">
            <span className="snapshot-tag-label">TODAY'S WELLNESS</span>
            <div className="snapshot-score-val">
              {selectedDayScore !== null ? selectedDayScore : '—'} <span className="score-denom-sm">/ 100</span>
            </div>
            <div className="snapshot-status-pill">
              <TrendingUp size={12} />
              <span>{selectedDayScore !== null ? 'Good progress' : 'Not logged yet'}</span>
            </div>
            <p className="snapshot-subtext">
              Today's score based on your tracked factors.
            </p>
          </div>

          <div className="snapshot-badge-icon">
            {selectedDayScore !== null ? selectedDayScore : '?'}
          </div>
        </div>

        {/* RIGHT CARD: YOUR WEEK */}
        <div className="snapshot-card snapshot-right">
          <div className="snapshot-right-header">
            <span className="snapshot-tag-label">YOUR WEEK</span>
            <span className="snapshot-tracked-count">
              {completedDaysCount} of 7 days tracked
            </span>
          </div>

          <div className="week-days-pills-row">
            {WEEK_DAYS.map((day) => {
              const dayLog = weeklyLogs[day.dateStr];
              const isSelected = selectedDateStr === day.dateStr;
              const isCompleted = dayLog && dayLog.saved;
              const isPartial = dayLog && !dayLog.saved && dayLog.partiallyTracked;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  className={`week-day-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="day-btn-label">{day.dayStr}</span>
                  <span className="day-btn-icon">
                    {isCompleted ? (
                      <span className="icon-check">✓</span>
                    ) : isPartial ? (
                      <span className="icon-partial">●</span>
                    ) : (
                      <span className="icon-empty">○</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="week-progress-track">
            <div 
              className="week-progress-fill" 
              style={{ width: `${(completedDaysCount / 7) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* 4. MAIN DAILY CHECK-IN SECTION (8 Factor 2-Col Grid) */}
      <div className="checkin-main-card">
        <div className="checkin-card-header">
          <div>
            <div className="checkin-title-row">
              <h2 className="checkin-main-title">TODAY'S CHECK-IN</h2>
              <span className="checkin-date-badge">
                {activeDayObj.fullDay}, Sep {activeDayObj.dateNum}
              </span>
            </div>
            <p className="checkin-main-subtitle">How did you feel today?</p>
          </div>

          <div className="checkin-status-group">
            {activeDayObj.isToday && <span className="status-badge-today">TODAY</span>}
            {activeDayLog.saved ? (
              <span className="status-badge-saved">✓ Saved</span>
            ) : activeDayLog.partiallyTracked ? (
              <span className="status-badge-draft">● Draft</span>
            ) : (
              <span className="status-badge-untracked">Not tracked</span>
            )}
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="save-success-alert">
            <CheckCircle2 size={18} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="factor-cards-grid">
          {WELLNESS_FACTORS.map((factor) => {
            const currentVal = activeDayLog[factor.id];
            return (
              <FactorCardComponent
                key={factor.id}
                factor={factor}
                value={currentVal}
                onChange={(val) => handleFactorChange(factor.id, val)}
              />
            );
          })}
        </div>

        <div className="checkin-save-footer">
          <span className="save-hint-text">
            {!activeDayLog.saved && !activeDayLog.partiallyTracked
              ? "Select values above to log today's wellness factors."
              : activeDayLog.saved
              ? "Logged cleanly! You can adjust and re-save anytime."
              : "Unsaved changes in draft."}
          </span>
          <button
            type="button"
            onClick={handleSaveCurrentDay}
            className="btn-save-primary"
          >
            <span>Save Today's Progress →</span>
          </button>
        </div>
      </div>

      {/* 5. FOOTER-STYLE CORE LOOP BANNER */}
      <div className="habitloop-engine-card">
        <div className="engine-card-header">
          <span className="engine-tag">
            <Sparkles size={12} className="engine-sparkle" /> THE HABITLOOP ENGINE
          </span>
          <span className="engine-motto">
            TRACK → UNDERSTAND → EXPERIMENT → MEASURE → IMPROVE → REPEAT
          </span>
        </div>

        <div className="engine-steps-grid">
          <div className="engine-step-card">
            <span className="step-num">①</span>
            <span className="step-title">TRACK</span>
            <span className="step-desc">Log your daily data</span>
          </div>
          <div className="engine-step-card">
            <span className="step-num">②</span>
            <span className="step-title">UNDERSTAND</span>
            <span className="step-desc">Find your patterns</span>
          </div>
          <div className="engine-step-card">
            <span className="step-num">③</span>
            <span className="step-title">EXPERIMENT</span>
            <span className="step-desc">Test one change</span>
          </div>
          <div className="engine-step-card">
            <span className="step-num">④</span>
            <span className="step-title">MEASURE</span>
            <span className="step-desc">Compare metrics</span>
          </div>
          <div className="engine-step-card">
            <span className="step-num">⑤</span>
            <span className="step-title">IMPROVE</span>
            <span className="step-desc">Adopt or drop</span>
          </div>
          <div className="engine-step-card">
            <span className="step-num">⑥</span>
            <span className="step-title">REPEAT</span>
            <span className="step-desc">Build momentum</span>
          </div>
        </div>
      </div>

      {/* 6. WEEKLY REVIEW & LIFESTYLE CONTEXT CTA */}
      <div className="weekly-review-card">
        <div className="review-text-col">
          <div className="review-tag-row">
            <Sparkles size={14} /> ✦ {!weeklyContext?.saved ? 'STEP 2 OF 6: ADD LIFESTYLE CONTEXT' : 'STEP 3 OF 6: REVIEW YOUR WEEK'}
          </div>
          <p className="review-desc-text">
            {!weeklyContext?.saved
              ? "Your daily wellness data shows what happened. Add a little context about your nutrition and routine before reviewing your patterns."
              : "Your daily data and weekly context are saved. Discover your pattern insights and personalized AI coach experiment."}
          </p>
        </div>
        {!weeklyContext?.saved ? (
          <button 
            onClick={() => navigate('/checkin')}
            className="btn-review-cta"
          >
            <span>Add Nutrition & Lifestyle Context →</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/evaluation')}
            className="btn-review-cta"
          >
            <span>View Week Evaluation →</span>
          </button>
        )}
      </div>

    </div>
  );
}

// ===================================================
// FACTOR CARD COMPONENT
// ===================================================
function FactorCardComponent({ factor, value, onChange }) {
  const { label, icon, type, min, max, step, options, defaultVal } = factor;

  const currentVal = value ?? defaultVal;
  const isSelected = value !== null && value !== undefined;

  const handleDecrement = () => {
    const next = Math.max(min, parseFloat(((currentVal) - step).toFixed(1)));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, parseFloat(((currentVal) + step).toFixed(1)));
    onChange(next);
  };

  return (
    <div className={`factor-card ${!isSelected ? 'unselected' : ''}`}>
      <div className="factor-card-top">
        <div className="factor-title-group">
          <span className="factor-emoji">{icon}</span>
          <span className="factor-name">{label}</span>
        </div>
        
        <span className={`factor-val-badge ${!isSelected ? 'is-empty' : ''}`}>
          {!isSelected ? 'Select' : (type === 'stepper' ? `${currentVal}h` : currentVal)}
        </span>
      </div>

      <div className="factor-controls-body">
        {/* STEPPER FOR SLEEP */}
        {type === 'stepper' && (
          <div className="stepper-row">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={currentVal <= min}
              className="stepper-btn-action"
            >
              <Minus size={14} />
            </button>
            <span className={`stepper-val-label ${!isSelected ? 'is-empty' : ''}`}>{currentVal} Hours</span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={currentVal >= max}
              className="stepper-btn-action"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        {/* OPTION PILLS */}
        {type === 'options' && (
          <div className="pills-grid-row">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`pill-option-btn ${value === opt ? 'active' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 1-5 RATING PILLS */}
        {type === 'rating_5' && (
          <div className="pills-grid-row">
            {options.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => onChange(item.num)}
                className={`pill-option-btn ${value === item.num ? 'active' : ''}`}
              >
                {item.num}
              </button>
            ))}
          </div>
        )}

        {/* EMOJIS */}
        {type === 'emojis_5' && (
          <div className="emojis-grid-row">
            {options.map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onChange(item.val)}
                className={`emoji-option-btn ${value === item.val ? 'active' : ''}`}
                title={item.label}
              >
                <span>{item.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
