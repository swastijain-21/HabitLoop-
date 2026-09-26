import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const JOURNEY_STEPS = [
  { id: 'review', num: '01', label: 'REVIEW', sub: 'Week Overview' },
  { id: 'understand', num: '02', label: 'UNDERSTAND', sub: 'Patterns' },
  { id: 'one_change', num: '03', label: 'ONE CHANGE', sub: 'AI Coach' },
  { id: 'experiment', num: '04', label: 'EXPERIMENT', sub: '7-Day Test' },
  { id: 'measure', num: '05', label: 'MEASURE', sub: 'Results' },
];

export default function HabitLoopJourneyIndicator({ activeStep = 'review' }) {
  const getStepStatus = (stepId, index) => {
    const activeIndex = JOURNEY_STEPS.findIndex(s => s.id === activeStep);
    if (stepId === activeStep) return 'active';
    if (index < activeIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="journey-indicator-card">
      <div className="journey-indicator-row">
        {JOURNEY_STEPS.map((step, idx) => {
          const status = getStepStatus(step.id, idx);
          const isLast = idx === JOURNEY_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className={`journey-step-item ${status}`}>
                <span className="journey-step-num">
                  {status === 'completed' ? <CheckCircle2 size={13} /> : step.num}
                </span>
                <div className="journey-step-label-group">
                  <span className="journey-step-title">{step.label}</span>
                </div>
              </div>

              {!isLast && (
                <ArrowRight size={13} className="journey-step-arrow" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
