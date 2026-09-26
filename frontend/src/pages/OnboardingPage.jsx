import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, GraduationCap, Briefcase, Laptop, BookOpen, Building, Palette, Clock, Moon, Droplets, Zap, Apple, HeartHandshake, Smartphone, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setOnboardingData } = useUser();
  const [step, setStep] = useState(1);

  // Step 1 State: Lifestyle / Work Style Routine Selection
  const routineOptions = [
    {
      id: 'student',
      title: 'Student',
      subtitle: 'Studying full-time or part-time at school, college, or university',
      icon: GraduationCap,
    },
    {
      id: 'professional',
      title: 'Working Professional',
      subtitle: 'Navigating an office, corporate, or structured workday routine',
      icon: Briefcase,
    },
    {
      id: 'remote',
      title: 'Remote Worker / Freelancer',
      subtitle: 'Working remotely, from home, or managing freelance time',
      icon: Laptop,
    },
    {
      id: 'researcher',
      title: 'Researcher / Academic',
      subtitle: 'Conducting research, scholarly writing, or academic study',
      icon: BookOpen,
    },
    {
      id: 'entrepreneur',
      title: 'Entrepreneur / Business Owner',
      subtitle: 'Building a startup, company, or managing daily operations',
      icon: Building,
    },
    {
      id: 'creative',
      title: 'Creative Professional',
      subtitle: 'Focused on design, writing, media, arts, or creative output',
      icon: Palette,
    },
    {
      id: 'other',
      title: 'Other / Flexible Routine',
      subtitle: 'Balancing a unique, hybrid, or non-traditional daily schedule',
      icon: Clock,
    }
  ];
  const [selectedRole, setSelectedRole] = useState('Student');

  // Step 2 State: Wellness Focus Areas
  const focusAreasOptions = [
    { id: 'sleep', title: 'Sleep', icon: Moon, emoji: '🌙', desc: 'Restful sleep & night routines' },
    { id: 'hydration', title: 'Hydration', icon: Droplets, emoji: '💧', desc: 'Daily water intake & energy' },
    { id: 'movement', title: 'Movement', icon: Zap, emoji: '🏃', desc: 'Workouts, steps & active breaks' },
    { id: 'nutrition', title: 'Nutrition', icon: Apple, emoji: '🥗', desc: 'Balanced meals & steady fuel' },
    { id: 'mind', title: 'Mind & Mood', icon: HeartHandshake, emoji: '🧠', desc: 'Mindfulness & mental check-ins' },
    { id: 'screen', title: 'Screen Time', icon: Smartphone, emoji: '📱', desc: 'Digital detox & bedtime unplug' },
    { id: 'study', title: 'Study & Work Balance', icon: BookOpen, emoji: '📚', desc: 'Deep focus & study breaks' },
    { id: 'social', title: 'Social Balance', icon: Users, emoji: '👥', desc: 'Time with friends & hobbies' }
  ];
  const [selectedAreas, setSelectedAreas] = useState(['🌙 Sleep', '💧 Hydration', '📚 Study & Work Balance']);

  // Step 3 State: Habit Goals
  const goalOptions = [
    { id: 'g1', title: 'Improve sleep consistency', icon: '🌙' },
    { id: 'g2', title: 'Drink more water', icon: '💧' },
    { id: 'g3', title: 'Move more throughout the day', icon: '🏃' },
    { id: 'g4', title: 'Take regular breaks', icon: '🧘' },
    { id: 'g5', title: 'Manage stress & fatigue', icon: '🧠' },
    { id: 'g6', title: 'Improve study/work balance', icon: '📚' },
    { id: 'g7', title: 'Spend less time on screens', icon: '📱' }
  ];
  const [selectedGoals, setSelectedGoals] = useState(['Improve sleep consistency', 'Drink more water']);

  const toggleArea = (areaTitle) => {
    setSelectedAreas(prev => 
      prev.includes(areaTitle) ? prev.filter(a => a !== areaTitle) : [...prev, areaTitle]
    );
  };

  const toggleGoal = (goalTitle) => {
    setSelectedGoals(prev => 
      prev.includes(goalTitle) ? prev.filter(g => g !== goalTitle) : [...prev, goalTitle]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setOnboardingData({
        role: selectedRole,
        workStyle: selectedRole,
        focusAreas: selectedAreas,
        goals: selectedGoals,
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="onboarding-page-wrapper">
      <div className="onboarding-card-container">
        <div className="onboarding-card">
          
          {/* Progress Indicator Component */}
          <div className="onboarding-progress-header">
            <div className="progress-info-row">
              <span className="progress-tag">Personal Setup</span>
              <span className="progress-step-text">Step {step} of 3</span>
            </div>

            {/* Stepper Node Line */}
            <div className="progress-stepper-bar">
              <div className={`stepper-node ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`stepper-line ${step >= 2 ? 'active' : ''}`} />
              <div className={`stepper-node ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className={`stepper-line ${step >= 3 ? 'active' : ''}`} />
              <div className={`stepper-node ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>
          </div>

          {/* STEP 1: Tell us about yourself */}
          {step === 1 && (
            <div className="onboarding-step-content">
              <div className="onboarding-step-header">
                <h1 className="onboarding-title">Tell us about yourself</h1>
                <p className="onboarding-subtitle">This helps us personalize your weekly HabitLoop.</p>
              </div>

              <div className="onboarding-section-label">What best describes your current routine?</div>

              <div className="onboarding-cards-stack">
                {routineOptions.map((opt) => {
                  const isSelected = selectedRole === opt.title;
                  const IconComp = opt.icon;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedRole(opt.title)}
                      className={`selectable-card role-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="card-left-group">
                        <div className={`card-icon-box ${isSelected ? 'box-green' : 'box-slate'}`}>
                          <IconComp size={20} />
                        </div>
                        <div>
                          <h3 className="card-item-title">{opt.title}</h3>
                          <p className="card-item-sub">{opt.subtitle}</p>
                        </div>
                      </div>

                      <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: What would you like to focus on? */}
          {step === 2 && (
            <div className="onboarding-step-content">
              <div className="onboarding-step-header">
                <h1 className="onboarding-title">What would you like to focus on?</h1>
                <p className="onboarding-subtitle">Choose the wellness areas that matter most to you.</p>
              </div>

              <div className="onboarding-section-label">Select wellness areas (multi-select)</div>

              <div className="onboarding-grid-two-col">
                {focusAreasOptions.map((area) => {
                  const areaLabel = `${area.emoji} ${area.title}`;
                  const isSelected = selectedAreas.includes(areaLabel);
                  return (
                    <div
                      key={area.id}
                      onClick={() => toggleArea(areaLabel)}
                      className={`selectable-card grid-area-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="card-left-group">
                        <span className="emoji-badge">{area.emoji}</span>
                        <div>
                          <h3 className="card-item-title text-sm">{area.title}</h3>
                          <p className="card-item-sub text-xs">{area.desc}</p>
                        </div>
                      </div>

                      <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: What would you like to improve? */}
          {step === 3 && (
            <div className="onboarding-step-content">
              <div className="onboarding-step-header">
                <h1 className="onboarding-title">What would you like to improve?</h1>
                <p className="onboarding-subtitle">Choose a few goals you'd like to work on this week.</p>
              </div>

              <div className="onboarding-section-label">Select habit goals for your loop</div>

              <div className="onboarding-cards-stack">
                {goalOptions.map((g) => {
                  const isSelected = selectedGoals.includes(g.title);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.title)}
                      className={`selectable-card goal-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="card-left-group">
                        <span className="emoji-badge">{g.icon}</span>
                        <h3 className="card-item-title">{g.title}</h3>
                      </div>

                      <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Navigation Footer */}
          <div className="onboarding-card-footer">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary btn-sm btn-back"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary btn-sm btn-continue"
            >
              <span>{step === 3 ? 'Complete Setup' : 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
