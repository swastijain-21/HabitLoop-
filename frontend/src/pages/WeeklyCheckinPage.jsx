import React, { useState } from 'react';
import { ArrowRight, Apple, Sparkles, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';

export default function WeeklyCheckinPage() {
  const navigate = useNavigate();
  const { weeklyContext, setWeeklyContext } = useUser();

  // Form State initialized from context or defaults
  const [mealRoutine, setMealRoutine] = useState(weeklyContext?.mealRoutine || 'Mostly consistent');
  const [mealVariety, setMealVariety] = useState(weeklyContext?.mealVariety || 'Good variety');
  const [fruitVegetableFrequency, setFruitVegetableFrequency] = useState(weeklyContext?.fruitVegetableFrequency || 'Most days');
  const [hydrationHabits, setHydrationHabits] = useState(weeklyContext?.hydrationHabits || 'Mostly consistent');
  const [scheduleMealImpact, setScheduleMealImpact] = useState(weeklyContext?.scheduleMealImpact || 'Sometimes');
  const [routineManageability, setRoutineManageability] = useState(weeklyContext?.routineManageability || 'Mostly manageable');
  const [notes, setNotes] = useState(weeklyContext?.notes || '');

  const handleFinishCheckin = () => {
    if (setWeeklyContext) {
      setWeeklyContext({
        mealRoutine,
        mealVariety,
        fruitVegetableFrequency,
        hydrationHabits,
        scheduleMealImpact,
        routineManageability,
        notes,
        saved: true,
      });
    }
    navigate('/evaluation');
  };

  return (
    <div className="app-page-wrapper">
      <div className="app-page-container">
        
        {/* Header */}
        <section className="checkin-page-header">
          <span className="checkin-page-tag">
            NUTRITION & LIFESTYLE CONTEXT
          </span>
          <h1 className="checkin-page-title">
            Put Your Wellness Week Into Context
          </h1>
          <p className="checkin-page-subtitle">
            Your daily wellness data shows what happened. A little context about your nutrition and routine helps HabitLoop understand the patterns in your week.
          </p>
        </section>

        {/* Form Card */}
        <div className="checkin-page-card">
          <h2 className="checkin-card-heading">
            <Apple color="#10b981" size={22} />
            <span>Nutrition & Lifestyle Context</span>
          </h2>

          {/* 1. Meal Routine */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              1. How would you describe your meal routine this week?
            </label>
            <div className="checkin-options-grid-4">
              {['Very irregular', 'Somewhat irregular', 'Mostly consistent', 'Very consistent'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMealRoutine(opt)}
                  className={`checkin-option-btn ${mealRoutine === opt ? 'active-green' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Meal Variety */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              2. How varied were your meals?
            </label>
            <div className="checkin-options-grid-4">
              {['Mostly the same foods', 'Some variety', 'Good variety', 'Very varied'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMealVariety(opt)}
                  className={`checkin-option-btn ${mealVariety === opt ? 'active-green' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fruits & Vegetables */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              3. How often did you include fruits or vegetables?
            </label>
            <div className="checkin-options-grid-4">
              {['Rarely', 'Sometimes', 'Most days', 'Every day'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFruitVegetableFrequency(opt)}
                  className={`checkin-option-btn ${fruitVegetableFrequency === opt ? 'active-green' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Hydration Habits */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              4. How would you describe your hydration habits?
            </label>
            <div className="checkin-options-grid-4">
              {['Could improve', 'Sometimes consistent', 'Mostly consistent', 'Very consistent'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setHydrationHabits(opt)}
                  className={`checkin-option-btn ${hydrationHabits === opt ? 'active-green' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Schedule Impact */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              5. How often did your study/work schedule affect your meal routine?
            </label>
            <div className="checkin-options-grid-4">
              {['Rarely', 'Sometimes', 'Often', 'Very often'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setScheduleMealImpact(opt)}
                  className={`checkin-option-btn ${scheduleMealImpact === opt ? 'active-amber' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Routine Manageability */}
          <div className="checkin-field-group">
            <label className="checkin-field-header">
              6. How manageable was your overall eating routine alongside your schedule?
            </label>
            <div className="checkin-options-grid-4">
              {['Difficult to maintain', 'Somewhat difficult', 'Mostly manageable', 'Easy to maintain'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRoutineManageability(opt)}
                  className={`checkin-option-btn ${routineManageability === opt ? 'active-green' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Weekly Context Notes */}
          <div className="checkin-field-group" style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <div className="checkin-field-header" style={{ marginBottom: '2px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={15} color="#6366f1" />
                <span>Anything you'd like HabitLoop to pay attention to this week? (Optional)</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
              For example: a busy schedule, unusual routine, eating out more than usual, or anything else that affected your week.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any extra notes or context about your week..."
              className="checkin-textarea"
            />
          </div>

          {/* Footer CTA */}
          <div className="checkin-footer-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#10b981" />
                <span>Your wellness data and weekly context are ready.</span>
              </span>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>
                Next: Understand Your Week
              </p>
            </div>

            <button 
              type="button"
              onClick={handleFinishCheckin}
              className="btn-checkin-continue"
            >
              <span>Review My Week →</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
