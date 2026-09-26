import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Award, Bot, Apple } from 'lucide-react';
import { useUser, OPTION_NUMERIC_MAP } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';
import { WELLNESS_FACTORS, calculateDailyWellnessScore } from './DashboardPage';
import HabitLoopJourneyIndicator from '../components/HabitLoopJourneyIndicator';

export default function EvaluationPage() {
  const navigate = useNavigate();
  const { user, weeklyLogs, analyzeWeeklyPatterns, weeklyContext } = useUser();

  const savedLogs = Object.values(weeklyLogs || {}).filter(l => l && l.saved);
  const completedCount = savedLogs.length;

  // Calculate dynamic weekly score
  const overallScore = completedCount > 0
    ? Math.round(savedLogs.reduce((acc, log) => acc + calculateDailyWellnessScore(log), 0) / completedCount)
    : null;

  // Calculate factor averages
  const factorAverages = WELLNESS_FACTORS.map(factor => {
    let sumScore = 0;
    let sumRaw = 0;
    let count = 0;

    savedLogs.forEach(log => {
      const val = log[factor.id];
      if (val !== null && val !== undefined) {
        sumScore += factor.calcScore(val);
        if (factor.type === 'stepper' || factor.type === 'rating_5' || factor.type === 'emojis_5') {
          sumRaw += Number(val);
        } else if (OPTION_NUMERIC_MAP[factor.id]) {
          sumRaw += OPTION_NUMERIC_MAP[factor.id][val] || 0;
        }
        count++;
      }
    });

    const avgScore = count > 0 ? Math.round(sumScore / count) : 50;
    const avgRaw = count > 0 ? (sumRaw / count).toFixed(1) : 0;

    return {
      ...factor,
      avgScore,
      avgRaw,
      count,
    };
  });

  // Sort factors by avgScore
  const sortedFactors = [...factorAverages].sort((a, b) => b.avgScore - a.avgScore);
  const strongestFactors = sortedFactors.slice(0, 2);
  const improvementAreas = sortedFactors.slice(-2).reverse();

  // Pattern insights & recommendation
  const patternsList = analyzeWeeklyPatterns ? analyzeWeeklyPatterns() : [];

  // Lifestyle context observation
  const { scheduleMealImpact, mealRoutine, hydrationHabits, fruitVegetableFrequency, notes, saved: contextSaved } = weeklyContext || {};
  const watchFactorIds = improvementAreas.map(f => f.id);

  let lifestyleObs = null;
  if (contextSaved) {
    if ((scheduleMealImpact === 'Often' || scheduleMealImpact === 'Very often') && (watchFactorIds.includes('energy') || watchFactorIds.includes('focus') || watchFactorIds.includes('mood'))) {
      lifestyleObs = {
        tag: 'SCHEDULE & MEAL ROUTINE',
        text: 'Your study/work schedule frequently affected your meal routine this week. This occurred alongside several lower-energy or focus-sensitive days.'
      };
    } else if ((mealRoutine === 'Very irregular' || mealRoutine === 'Somewhat irregular') && (watchFactorIds.includes('energy') || watchFactorIds.includes('sleep'))) {
      lifestyleObs = {
        tag: 'MEAL CONSISTENCY',
        text: 'An irregular meal routine was present during days with variable energy or sleep scores.'
      };
    } else if (hydrationHabits === 'Could improve' && (watchFactorIds.includes('focus') || watchFactorIds.includes('energy'))) {
      lifestyleObs = {
        tag: 'HYDRATION ROUTINE',
        text: 'Inconsistent hydration coincided with mid-day focus and energy dips.'
      };
    } else if (fruitVegetableFrequency === 'Rarely' && watchFactorIds.includes('energy')) {
      lifestyleObs = {
        tag: 'NUTRITION VARIETY',
        text: 'Lower fruit and vegetable frequency was logged during this week\'s routine alongside lower energy ratings.'
      };
    } else if (notes && notes.trim().length > 0) {
      lifestyleObs = {
        tag: 'WEEKLY CONTEXT NOTE',
        text: `Weekly context note: "${notes.trim()}"`
      };
    } else {
      lifestyleObs = {
        tag: 'NO CLEAR CONFLICT',
        text: 'Your nutrition and routine responses did not show a clear connection with the main patterns from this week, so HabitLoop will keep the focus on the strongest opportunity identified in your wellness data.'
      };
    }
  } else {
    lifestyleObs = {
      tag: 'CONTEXT NOT ADDED',
      text: 'You have not added nutrition & lifestyle context for this week yet. Adding context helps HabitLoop refine your pattern insights.'
    };
  }

  return (
    <div className="app-page-wrapper">
      <div className="app-page-container">
        
        {/* 1. REUSABLE HABITLOOP JOURNEY INDICATOR */}
        <HabitLoopJourneyIndicator activeStep="review" />

        {/* 2. PAGE HEADER */}
        <section className="eval-header">
          <div className="eval-tag">
            <Sparkles size={14} />
            <span>7-DAY REFLECTION & EVALUATION</span>
          </div>

          <h1 className="eval-title">
            Your Week in Review
          </h1>

          <p className="eval-subtitle">
            See how your week looked, what went well, and where one small change could be worth testing.
          </p>
        </section>

        {/* 3. OVERALL SCORE CARD */}
        <section className="eval-overall-card">
          <div className="eval-overall-row">
            <div className="eval-overall-left">
              <span className="eval-overall-label">
                OVERALL WEEKLY WELLNESS
              </span>
              <div className="eval-overall-score-row">
                <span className="eval-overall-score-num">{overallScore !== null ? overallScore : '—'}</span>
                <span className="eval-overall-denom">/ 100</span>
              </div>
              <p className="eval-overall-days">
                {completedCount} of 7 days tracked
              </p>
            </div>

            <div className="eval-overall-right">
              <div className="eval-status-pill">
                <Award size={14} />
                <span>{completedCount === 0 ? 'Log days on Dashboard to calculate score' : completedCount >= 4 ? 'Strong tracking consistency' : 'Build consistency by logging 4+ days'}</span>
              </div>
              <div className="eval-overall-progress-track">
                <div 
                  className="eval-overall-progress-fill" 
                  style={{ width: `${overallScore !== null ? Math.min(100, Math.max(0, overallScore)) : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. WEEK AT A GLANCE (2-COLUMN GRID: STRONGEST & AREAS TO WATCH) */}
        <section className="eval-grid-two-col">
          
          {/* STRONGEST FACTORS */}
          <div className="eval-factor-card">
            <div className="eval-factor-card-header">
              <div className="eval-factor-title-group strong">
                <CheckCircle2 size={16} />
                <span>STRONGEST FACTORS</span>
              </div>
              <span className="eval-factor-sub-tag">Top Performers</span>
            </div>

            <div className="eval-factor-items-list">
              {strongestFactors.map((f) => (
                <div key={f.id} className="eval-factor-item">
                  <div className="eval-factor-item-left">
                    <div className="eval-factor-emoji-box">{f.icon}</div>
                    <div>
                      <h4 className="eval-factor-name">{f.label}</h4>
                      <span className="eval-factor-badge strong">
                        Strong
                      </span>
                    </div>
                  </div>
                  <div className="eval-factor-item-right">
                    <span className="eval-factor-score">{f.avgScore}</span>
                    <span className="eval-factor-max"> / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN WELLNESS OPPORTUNITIES */}
          <div className="eval-factor-card">
            <div className="eval-factor-card-header">
              <div className="eval-factor-title-group watch">
                <AlertTriangle size={16} />
                <span>MAIN WELLNESS OPPORTUNITIES</span>
              </div>
              <span className="eval-factor-sub-tag">Improvement Target</span>
            </div>

            <div className="eval-factor-items-list">
              {improvementAreas.map((f) => (
                <div key={f.id} className="eval-factor-item">
                  <div className="eval-factor-item-left">
                    <div className="eval-factor-emoji-box">{f.icon}</div>
                    <div>
                      <h4 className="eval-factor-name">{f.label}</h4>
                      <span className="eval-factor-badge watch">
                        Watch
                      </span>
                    </div>
                  </div>
                  <div className="eval-factor-item-right">
                    <span className="eval-factor-score">{f.avgScore}</span>
                    <span className="eval-factor-max"> / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* 5. PATTERN INSIGHTS */}
        <section className="eval-insights-card">
          <div className="eval-insights-header">
            <div className="eval-insights-icon-box">
              <Lightbulb size={18} />
            </div>
            <div>
              <h3 className="eval-insights-title">PATTERN INSIGHTS</h3>
              <p className="eval-insights-sub">What stood out in your week</p>
            </div>
          </div>

          <div className="eval-insights-list">
            {patternsList.map((pat, idx) => (
              <div key={idx} className="eval-insight-row">
                <span className="eval-insight-arrow">
                  {idx % 2 === 0 ? '↗' : '↘'}
                </span>
                <p className="eval-insight-text">
                  {pat}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5b. LIFESTYLE CONTEXT SECTION */}
        <section className="eval-insights-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
          <div className="eval-insights-header">
            <div className="eval-insights-icon-box" style={{ background: '#ecfdf5', color: '#047857' }}>
              <Apple size={18} />
            </div>
            <div>
              <h3 className="eval-insights-title">LIFESTYLE CONTEXT</h3>
              <p className="eval-insights-sub">Nutrition & schedule context in review</p>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            {lifestyleObs.tag && (
              <span className="exp-page-detail-label" style={{ color: '#047857', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                {lifestyleObs.tag}
              </span>
            )}
            <p className="eval-insight-text" style={{ fontSize: '13.5px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
              "{lifestyleObs.text}"
            </p>
          </div>
        </section>

        {/* 6. NEXT STEP / AI COACH CTA */}
        <section className="eval-cta-card">
          <div className="eval-cta-left">
            <span className="eval-cta-tag">
              NEXT STEP
            </span>
            <h3 className="eval-cta-heading">
              You've reviewed your week.
            </h3>
            <p className="eval-cta-sub">
              Now turn one insight into a small 7-day experiment.
            </p>
          </div>

          <button
            onClick={() => navigate('/recommendations')}
            className="btn-eval-cta"
          >
            <Bot size={18} />
            <span>Meet Your AI Coach →</span>
          </button>
        </section>

      </div>
    </div>
  );
}
