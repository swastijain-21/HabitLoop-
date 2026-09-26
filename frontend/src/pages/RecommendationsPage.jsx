import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, Clock, Activity, Bot, ArrowLeft, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';
import HabitLoopJourneyIndicator from '../components/HabitLoopJourneyIndicator';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user, getPatternRecommendation, startExperiment } = useUser();

  const rec = getPatternRecommendation ? getPatternRecommendation() : {
    title: '30-minute screen-free wind-down',
    changeDescription: 'Try a 30-minute screen-free wind-down before bedtime.',
    why: 'On days with screen time under 2 hours, your sleep duration averaged 7.8 hours vs 6.2 hours on high screen time days.',
    durationDays: 7,
    targetMetric: 'screenTime',
    watchedMetrics: ['sleep', 'energy'],
    icon: '🌙'
  };

  const handleStartExperiment = () => {
    if (startExperiment) {
      startExperiment({
        title: rec.title,
        goal: rec.goal || `Improve ${(rec.watchedMetrics || ['sleep', 'energy']).join(' & ')}`,
        targetMetric: rec.targetMetric,
        watchedMetrics: rec.watchedMetrics,
        changeDescription: rec.changeDescription,
        durationDays: rec.durationDays || 7,
        baseline: rec.baseline,
        dailyPlan: rec.dailyPlan,
      });
    }
    navigate('/experiment');
  };

  const displayName = (user && user.name && user.name.trim()) ? user.name.trim() : '';

  return (
    <div className="app-page-wrapper">
      <div className="app-page-container">
        
        {/* 1. REUSABLE HABITLOOP JOURNEY INDICATOR */}
        <HabitLoopJourneyIndicator activeStep="one_change" />

        {/* 2. PAGE HEADER */}
        <section className="coach-header">
          <div className="coach-tag">
            <Bot size={16} />
            <span>HABITLOOP AI WELLNESS COACH</span>
          </div>

          <h1 className="coach-title">
            <span>Your Week Has Been Analyzed</span>
            <span>🤖</span>
          </h1>

          <p className="coach-subtitle">
            Instead of changing 10 habits at once, your AI coach recommends <strong>ONE focused micro-experiment</strong>{displayName ? ` for ${displayName}` : ''}.
          </p>
        </section>

        {/* 3. MAIN RECOMMENDATION CARD */}
        <section className="coach-main-card">
          <div className="coach-accent-top-bar" />

          {/* Card Tag & Icon */}
          <div className="coach-card-top-row">
            <div className="coach-card-tag">
              <Sparkles size={14} />
              <span>YOUR ONE CHANGE THIS WEEK</span>
            </div>
            <div className="coach-card-emoji-box">{rec.icon || '🧪'}</div>
          </div>

          {/* Focal Recommendation Title */}
          <div>
            <h2 className="coach-focal-title">
              "{rec.changeDescription}"
            </h2>
          </div>

          {/* WHY THIS RECOMMENDATION (DATA INSIGHTS) */}
          <div className="coach-why-box">
            <div className="coach-why-title">
              <Lightbulb size={15} color="#f59e0b" />
              <span>WHY THIS RECOMMENDATION?</span>
            </div>
            <p className="coach-why-text">
              "{rec.why}"
            </p>
          </div>

          {/* EXPERIMENT DETAILS 3-GRID */}
          <div className="coach-metrics-grid">
            <div className="coach-metric-item-card">
              <span className="coach-metric-item-label">
                <Clock size={13} />
                <span>TRACK FOR</span>
              </span>
              <p className="coach-metric-item-val">
                {rec.durationDays || 7} Days
              </p>
              <p className="coach-metric-item-sub">Daily check-in tracking</p>
            </div>

            <div className="coach-metric-item-card">
              <span className="coach-metric-item-label">
                <Activity size={13} />
                <span>WE'LL WATCH</span>
              </span>
              <p className="coach-metric-item-val" style={{ color: '#34d399', textTransform: 'capitalize' }}>
                {(rec.watchedMetrics || ['sleep', 'energy']).join(' + ')}
              </p>
              <p className="coach-metric-item-sub">Metric correlation</p>
            </div>

            <div className="coach-metric-item-card">
              <span className="coach-metric-item-label">
                <Target size={13} />
                <span>GOAL</span>
              </span>
              <p className="coach-metric-item-val">
                Test 1 Micro-Change
              </p>
              <p className="coach-metric-item-sub">Measurable outcome</p>
            </div>
          </div>

          {/* PRIMARY CTA BAR */}
          <div className="coach-cta-bar">
            <div className="coach-cta-text">
              <span>Ready to test this change in your upcoming 7-day loop?</span>
            </div>

            <button
              onClick={handleStartExperiment}
              className="btn-coach-start"
            >
              <span>Start 7-Day Experiment</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </section>

        {/* 4. FOOTER NAVIGATION & BACK BUTTON */}
        <section className="coach-footer-nav">
          <button
            onClick={() => navigate('/evaluation')}
            className="btn-coach-back"
          >
            <ArrowLeft size={14} />
            <span>Back to Review</span>
          </button>

          <span className="coach-step-hint">
            Step 3 of 5 • AI Coach Micro-Experiment
          </span>
        </section>

      </div>
    </div>
  );
}
