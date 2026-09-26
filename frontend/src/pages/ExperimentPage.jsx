import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, FlaskConical, Clock, Bot, ThumbsUp, BarChart2, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser, METRIC_CONFIG, generate7DayPlan } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';
import HabitLoopJourneyIndicator from '../components/HabitLoopJourneyIndicator';

export default function ExperimentPage() {
  const navigate = useNavigate();
  const { 
    user, 
    activeExperiment, 
    completeExperiment, 
    experimentLogs,
    experimentHistory,
    logExperimentDay,
    calculateExperimentProgress, 
    calculateExperimentResults 
  } = useUser();

  // If no experiment is active yet, show a clean inactive state prompting user to get a recommendation
  if (!activeExperiment || activeExperiment.status === 'none') {
    return (
      <div className="app-page-wrapper">
        <div className="app-page-container">
          
          {/* 1. REUSABLE HABITLOOP JOURNEY INDICATOR */}
          <HabitLoopJourneyIndicator activeStep="experiment" />

          {/* 2. PAGE HEADER */}
          <section className="exp-page-header">
            <div className="exp-page-tag">
              <FlaskConical size={14} />
              <span>IMPROVEMENT LOOP • 7-DAY EXPERIMENT</span>
            </div>

            <h1 className="exp-page-title">
              My Wellness Experiment 🧪
            </h1>

            <p className="exp-page-subtitle">
              Pick one metric → Establish baseline → 7 Guided Daily Actions → Measure → Keep or Drop
            </p>
          </section>

          {/* INACTIVE STATE CARD */}
          <section className="exp-page-main-card" style={{ textAlign: 'center', alignItems: 'center', padding: '48px 32px' }}>
            <div className="coach-card-emoji-box" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', fontSize: '32px', width: '60px', height: '60px', margin: '0 auto 16px' }}>
              🧪
            </div>
            <h2 className="exp-page-target-title" style={{ fontSize: '22px', marginBottom: '8px' }}>
              No Active Experiment Currently Started
            </h2>
            <p className="exp-page-subtitle" style={{ maxWidth: '520px', marginBottom: '24px' }}>
              Complete your 7-day weekly evaluation to discover your strongest factors, pattern insights, and get a personalized micro-experiment from your AI Wellness Coach.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/evaluation')}
                className="btn-coach-back"
              >
                <span>View Week Evaluation</span>
              </button>
              <button
                onClick={() => navigate('/recommendations')}
                className="btn-eval-cta"
              >
                <Bot size={18} />
                <span>Meet Your AI Coach →</span>
              </button>
            </div>
          </section>

        </div>
      </div>
    );
  }

  const exp = activeExperiment;
  const [decisionState, setDecisionState] = useState(exp.decision || null);
  const [logSuccessMsg, setLogSuccessMsg] = useState('');

  // Dynamic progress & results calculated strictly from experimentLogs
  const expProgress = calculateExperimentProgress 
    ? calculateExperimentProgress(exp) 
    : { trackedDays: 0, totalDays: 7, percentage: 0, isComplete: false };

  const expResults = calculateExperimentResults 
    ? calculateExperimentResults(exp) 
    : { comparisonCards: [], summaryText: '', trackedDays: 0, totalDays: 7 };

  // Current day index derived strictly from completed logged entries
  const currentDayIndex = Math.min(6, Math.max(0, expProgress.trackedDays));
  const currentDayNumber = Math.min(7, expProgress.trackedDays + 1);

  // Retrieve stored 7-day plan from activeExperiment or generate fallback
  const dailyPlanArray = (exp.dailyPlan && exp.dailyPlan.length === 7)
    ? exp.dailyPlan
    : generate7DayPlan(exp.targetMetric, exp.watchedMetrics, exp.baseline);

  const currentPlanItem = dailyPlanArray[currentDayIndex] || {
    day: currentDayNumber,
    action: exp.changeDescription || "Try a daily micro-change.",
    reason: "Testing a daily micro-action helps identify what works best for your body."
  };

  // Unique list of metrics to compare (target metric + watched metrics)
  const watchedMetricKeys = Array.from(new Set([
    exp.targetMetric,
    ...(exp.watchedMetrics || ['sleep', 'energy'])
  ])).filter(m => METRIC_CONFIG[m]);

  // Check-In Form local state for logging today's experiment day
  const [todayCompleted, setTodayCompleted] = useState(true);
  const [todayMetrics, setTodayMetrics] = useState(() => {
    const initial = {};
    watchedMetricKeys.forEach(k => {
      initial[k] = METRIC_CONFIG[k]?.defaultVal ?? 0;
    });
    return initial;
  });

  const handleMetricChange = (metricKey, newVal) => {
    setTodayMetrics(prev => ({
      ...prev,
      [metricKey]: newVal
    }));
  };

  const handleLogDaySubmit = () => {
    if (!logExperimentDay) return;
    
    logExperimentDay(exp.id, {
      completed: todayCompleted,
      ...todayMetrics,
    });

    const dayJustLogged = currentDayNumber;
    setLogSuccessMsg(`✓ Day ${dayJustLogged} complete! Tomorrow you'll try a different small change.`);
    setTimeout(() => setLogSuccessMsg(''), 4000);

    // Check if this log completes the experiment
    if (expProgress.trackedDays + 1 >= expProgress.totalDays) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDecision = (decision) => {
    setDecisionState(decision);
    if (completeExperiment) {
      completeExperiment(decision);
    }

    if (decision === 'keep') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const displayName = (user && user.name && user.name.trim()) ? user.name.trim() : '';

  return (
    <div className="app-page-wrapper">
      <div className="app-page-container">
        
        {/* 1. REUSABLE HABITLOOP JOURNEY INDICATOR */}
        <HabitLoopJourneyIndicator activeStep={expProgress.isComplete ? 'measure' : 'experiment'} />

        {/* 2. PAGE HEADER */}
        <section className="exp-page-header">
          <div className="exp-page-tag">
            <FlaskConical size={14} />
            <span>IMPROVEMENT LOOP • 7-DAY EXPERIMENT</span>
          </div>

          <h1 className="exp-page-title">
            My Wellness Experiment 🧪
          </h1>

          <p className="exp-page-subtitle">
            Pick one metric → Establish baseline → 7 Guided Daily Actions → Measure → Keep or Drop
          </p>
        </section>

        {/* 3. EXPERIMENT SUMMARY CARD WITH PROGRESS BAR & 7-DAY GUIDED PLAN */}
        <section className="exp-page-main-card">
          
          {/* Card Header & Status Badge */}
          <div className="exp-page-card-top">
            <div>
              <span className="exp-page-target-tag">
                TARGET METRIC: {METRIC_CONFIG[exp.targetMetric]?.label || exp.targetMetric}
              </span>
              <h2 className="exp-page-target-title">
                {exp.title}
              </h2>
            </div>

            <div>
              {expProgress.isComplete || exp.status === 'completed' ? (
                <span className="exp-page-status-badge complete">
                  <CheckCircle2 size={16} />
                  <span>7-DAY EXPERIMENT COMPLETE</span>
                </span>
              ) : (
                <span className="exp-page-status-badge active">
                  <Clock size={16} />
                  <span>ACTIVE EXPERIMENT (Day {currentDayNumber} of {expProgress.totalDays})</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar Component */}
          <div className="exp-page-progress-box">
            <div className="exp-page-progress-header">
              <span className="exp-page-progress-label">
                Progress: Day {expProgress.trackedDays} of {expProgress.totalDays}
              </span>
              <span className="exp-page-progress-pct">
                {expProgress.percentage}% Complete
              </span>
            </div>

            <div className="exp-page-progress-track">
              <div
                className="exp-page-progress-fill"
                style={{ width: `${expProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* STABLE EXPERIMENT GOAL CARD */}
          <div className="exp-page-goal-card">
            <span className="exp-page-goal-label">
              EXPERIMENT GOAL
            </span>
            <p className="exp-page-goal-text">
              "{exp.goal || 'Optimize daily wellness through 7 guided daily micro-changes'}"
            </p>
          </div>

          {/* PROMINENT FOCAL CARD: TODAY'S SMALL CHANGE (When active & incomplete) */}
          {!expProgress.isComplete && exp.status !== 'completed' && (
            <div className="exp-page-today-focal-card">
              <div className="exp-page-today-focal-header">
                <span className="exp-page-today-tag">
                  <Sparkles size={13} />
                  <span>DAY {currentDayNumber} OF 7 • TODAY'S SMALL CHANGE</span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                  Guided Micro-Action
                </span>
              </div>

              {/* Prominent Action Title */}
              <h3 className="exp-page-today-action-text">
                "{currentPlanItem.action}"
              </h3>

              {/* Supporting Reason Box */}
              <div className="exp-page-why-box-styled">
                <span className="exp-page-why-label">
                  <Lightbulb size={14} color="#f59e0b" />
                  <span>WHY TODAY'S CHANGE?</span>
                </span>
                <p className="exp-page-why-text-content">
                  "{currentPlanItem.reason}"
                </p>
              </div>
            </div>
          )}

          {/* 7-DAY GUIDED PLAN STEPPER / PILLS ROW */}
          <div className="exp-page-plan-tracker">
            <div className="exp-page-plan-tracker-header">
              <span>7-DAY GUIDED EXPERIMENT PLAN</span>
              <span>{expProgress.trackedDays}/7 Days Completed</span>
            </div>
            <div className="exp-page-plan-pills-grid">
              {dailyPlanArray.map((item, idx) => {
                const dayNum = idx + 1;
                const isDone = idx < expProgress.trackedDays;
                const isActive = idx === currentDayIndex && !expProgress.isComplete;
                
                return (
                  <div 
                    key={dayNum} 
                    className={`plan-day-pill ${isDone ? 'completed' : isActive ? 'active' : 'upcoming'}`}
                    title={item.action}
                  >
                    <span>{isDone ? '✓' : isActive ? '●' : '○'} Day {dayNum}</span>
                    <span style={{ fontSize: '9px', opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {isDone ? 'Done' : isActive ? 'Today' : `Plan`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUCCESS BANNER FOR LOGGED DAY */}
          {logSuccessMsg && (
            <div className="save-success-alert">
              <CheckCircle2 size={18} />
              <span>{logSuccessMsg}</span>
            </div>
          )}

          {/* DAILY EXPERIMENT CHECK-IN FORM (When active & incomplete) */}
          {!expProgress.isComplete && exp.status !== 'completed' && (
            <div className="exp-page-learned-box" style={{ background: '#ffffff', borderColor: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FlaskConical size={16} color="#4f46e5" />
                  <span className="exp-page-detail-label" style={{ color: '#0f172a', fontSize: '12px' }}>
                    LOG EXPERIMENT CHECK-IN • DAY {currentDayNumber} OF {expProgress.totalDays}
                  </span>
                </div>
                <span className="eval-factor-badge watch">
                  In Progress
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '13px', marginBottom: '8px' }}>
                    Did you complete today's action? ("{currentPlanItem.action}")
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setTodayCompleted(true)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: todayCompleted ? '2px solid #10b981' : '1px solid #cbd5e1',
                        background: todayCompleted ? '#ecfdf5' : '#ffffff',
                        color: todayCompleted ? '#065f46' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      ✓ Yes, I completed it
                    </button>
                    <button
                      type="button"
                      onClick={() => setTodayCompleted(false)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: !todayCompleted ? '2px solid #6366f1' : '1px solid #cbd5e1',
                        background: !todayCompleted ? '#e0e7ff' : '#ffffff',
                        color: !todayCompleted ? '#3730a3' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      ✕ Not today
                    </button>
                  </div>
                </div>

                {/* Watched Metrics Logging Row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="exp-page-detail-label" style={{ color: '#475569' }}>
                    Log Actual Values for Day {currentDayNumber}:
                  </span>

                  <div className="exp-page-details-grid">
                    {watchedMetricKeys.map(key => {
                      const conf = METRIC_CONFIG[key];
                      const val = todayMetrics[key] ?? conf.defaultVal;

                      return (
                        <div key={key} className="exp-page-detail-card" style={{ background: '#f8fafc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
                            <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'none', fontSize: '12px' }}>
                              <span>{conf.icon}</span>
                              <span>{conf.label}</span>
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>
                              {conf.formatVal(val)}
                            </span>
                          </div>

                          <div className="stepper-row" style={{ marginTop: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleMetricChange(key, Math.max(conf.min, Number((val - conf.step).toFixed(1))))}
                              className="stepper-btn-action"
                            >
                              -
                            </button>
                            <span className="stepper-val-label">{val}</span>
                            <button
                              type="button"
                              onClick={() => handleMetricChange(key, Math.min(conf.max, Number((val + conf.step).toFixed(1))))}
                              className="stepper-btn-action"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogDaySubmit}
                  className="btn-coach-start"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                >
                  <span>Log Day {currentDayNumber} Experiment Progress →</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. MEASURED RESULTS SECTION (BEFORE VS AFTER CARDS) */}
          <div className="exp-page-comparison-header">
            <div>
              <h3 className="exp-page-comparison-title">
                <BarChart2 size={20} color="#4f46e5" />
                <span>MEASURED RESULTS (Before vs After)</span>
              </h3>
              <p className="exp-page-detail-label" style={{ textTransform: 'none', fontSize: '12px', marginTop: '2px' }}>
                Calculated directly from your actual logged experiment entries
              </p>
            </div>
            <span className="exp-page-status-badge active">
              {expProgress.trackedDays} Days Logged
            </span>
          </div>

          {/* STRUCTURED METRIC COMPARISON CARDS GRID */}
          <div className="exp-page-comparison-grid">
            {expResults.comparisonCards.map(c => {
              const isGood = c.hasData && (c.key === 'screenTime' ? c.diff <= 0 : c.diff >= 0);

              return (
                <div key={c.key} className="exp-page-comp-card">
                  <div className="exp-page-comp-top">
                    <span className="exp-page-comp-metric">
                      <span>{c.icon}</span>
                      <span>{c.label}</span>
                    </span>
                    {c.hasData ? (
                      <span className={`exp-page-comp-diff-pill ${isGood ? 'good' : 'warning'}`}>
                        {c.diff >= 0 ? `+${c.diff}` : c.diff} {c.unit}
                      </span>
                    ) : (
                      <span className="exp-page-comp-diff-pill warning">
                        Pending logs
                      </span>
                    )}
                  </div>

                  <div className="exp-page-comp-values-grid">
                    <div className="exp-page-comp-val-col">
                      <span className="exp-page-comp-val-label">BEFORE (BASELINE)</span>
                      <span className="exp-page-comp-val-num">{c.formatVal(c.beforeVal)}</span>
                    </div>

                    <div className="exp-page-comp-val-col after">
                      <span className="exp-page-comp-val-label" style={{ color: '#4f46e5' }}>AFTER EXPERIMENT</span>
                      <span className="exp-page-comp-val-num after">
                        {c.hasData ? c.formatVal(c.afterVal) : 'Not logged yet'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* OBSERVATIONAL RESULT SUMMARY CARD */}
          <div className="exp-page-learned-box">
            <div className="exp-page-learned-title">
              <Sparkles size={14} />
              <span>WHAT WE LEARNED</span>
            </div>
            <p className="exp-page-learned-text">
              "{expResults.summaryText}"
            </p>
          </div>

          {/* 5. DECISION SECTION ("WHAT DO YOU WANT TO DO NEXT?") */}
          <div className="exp-page-decision-section">
            <div className="exp-page-decision-header">
              <h3 className="exp-page-decision-title">
                WHAT DO YOU WANT TO DO NEXT?
              </h3>
              <p className="exp-page-decision-sub">
                {expProgress.isComplete 
                  ? 'Your 7-day experiment is complete! Decide whether to adopt or drop this habit.'
                  : `Log your remaining ${expProgress.totalDays - expProgress.trackedDays} day(s) above to complete the experiment and unlock your final decision.`}
              </p>
            </div>

            {decisionState ? (
              <div className={`exp-page-result-box ${decisionState === 'keep' ? 'keep' : ''}`}>
                <div className="exp-page-result-title">
                  {decisionState === 'keep' ? (
                    <>
                      <CheckCircle2 color="#10b981" size={24} />
                      <span>Change Adopted! 🎉</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw color="#64748b" size={24} />
                      <span>Change Dropped — Ready for Next Experiment</span>
                    </>
                  )}
                </div>
                <p className="exp-page-result-desc">
                  {decisionState === 'keep'
                    ? `Great job${displayName ? `, ${displayName}` : ''}! "${exp.changeDescription}" is now saved as an adopted habit in your loop history.`
                    : "That's okay! Discarding changes that don't suit you is an essential part of the HabitLoop process."}
                </p>

                <div className="exp-page-result-btn-group">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-coach-back"
                  >
                    Return to Dashboard
                  </button>
                  <button 
                    onClick={() => navigate('/recommendations')}
                    className="btn-eval-cta"
                    style={{ background: '#1e1b4b', color: '#ffffff' }}
                  >
                    <span>Try Another Change</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="exp-page-decision-grid">
                <button
                  type="button"
                  disabled={!expProgress.isComplete}
                  onClick={() => handleDecision('keep')}
                  className="btn-exp-decision-keep"
                  style={{ opacity: !expProgress.isComplete ? 0.6 : 1, cursor: !expProgress.isComplete ? 'not-allowed' : 'pointer' }}
                >
                  <div className="exp-decision-btn-title">
                    <ThumbsUp size={18} />
                    <span>✓ Keep This Change</span>
                  </div>
                  <span className="exp-decision-btn-sub">
                    {expProgress.isComplete ? 'Lock in this habit for future loops' : `Complete all ${expProgress.totalDays} days to unlock`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('drop')}
                  className="btn-exp-decision-drop"
                >
                  <div className="exp-decision-btn-title">
                    <RotateCcw size={18} />
                    <span>Try Another Change →</span>
                  </div>
                  <span className="exp-decision-btn-sub">
                    Discard and test a different change next week
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 6. EXPERIMENT HISTORY & PAST LOOPS */}
          <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FlaskConical size={18} color="#4f46e5" />
                <h3 className="exp-page-decision-title" style={{ fontSize: '15px' }}>
                  PAST EXPERIMENT HISTORY
                </h3>
              </div>
              <span className="exp-page-detail-label" style={{ textTransform: 'none', fontSize: '12px' }}>
                {experimentHistory && experimentHistory.length > 0 ? `${experimentHistory.length} loop(s) logged` : '0 completed loops'}
              </span>
            </div>

            {experimentHistory && experimentHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {experimentHistory.map((past, idx) => (
                  <div key={past.id || idx} className="exp-page-detail-card" style={{ background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                          {past.title}
                        </span>
                        <span className={`exp-page-status-badge ${past.decision === 'keep' ? 'complete' : 'active'}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                          {past.decision === 'keep' ? '✓ Adopted' : '✕ Dropped'}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                        Target: {METRIC_CONFIG[past.targetMetric]?.label || past.targetMetric} • Completed {past.completedDate || 'recently'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  No completed experiment history yet. Complete your current 7-day loop to log your first experiment result here!
                </p>
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}
