import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Sparkles, 
  BarChart3, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Lightbulb
} from 'lucide-react';

export default function LoopCycle() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Sunday Check-in',
      subtitle: 'Set Intentions & Flexible Goals',
      color: 'tag-green',
      icon: CalendarCheck,
      description: 'Start every week fresh. Pick 3-5 focus habits aligned with your upcoming exam schedule, work commitments, or wellness goals.',
      highlights: [
        'Adjust habit intensity based on week difficulty',
        'Set micro-goals for sleep, hydration & focus',
        'Zero pressure from past missed days'
      ],
      mockCard: {
        title: 'Sunday Intentions Set',
        badge: 'Week 5 Target',
        items: [
          { name: 'Sleep Target', val: '7.5 hrs/night', tag: 'High Priority' },
          { name: 'Study Focus', val: '14 hrs total', tag: 'Midterm Prep' },
          { name: 'Hydration', val: '2.5 Liters/day', tag: 'Daily Habit' }
        ],
        footerText: '🎯 Goal alignment complete! 7 days to close your loop.'
      }
    },
    {
      id: 2,
      number: '02',
      title: 'Track Your Week',
      subtitle: 'Effortless Micro-Logging',
      color: 'tag-blue',
      icon: Sparkles,
      description: 'Log your metrics in under 30 seconds a day with tap-and-go widgets, widget integrations, or micro-checkins.',
      highlights: [
        'Quick 1-tap habit logging',
        'Apple Health & Google Fit auto-sync',
        'Track mood & energy slumps effortlessly'
      ],
      mockCard: {
        title: 'Daily Micro-Tracking',
        badge: 'Wednesday • 9:30 PM',
        items: [
          { name: 'Hydration', val: '2.4L / 2.5L', tag: '96% Met' },
          { name: 'Pomodoro Focus', val: '4 Sessions', tag: '100 mins' },
          { name: 'Unplug Time', val: '25 mins', tag: 'Rest' }
        ],
        footerText: '⚡ 4 out of 5 daily micro-habits logged cleanly!'
      }
    },
    {
      id: 3,
      number: '03',
      title: 'Weekly Evaluation',
      subtitle: 'AI & Data-Driven Insights',
      color: 'tag-purple',
      icon: BarChart3,
      description: 'At week end, HabitLoop calculates your overall Wellness Index Score (0-100) and reveals hidden correlations between your sleep, hydration, and study productivity.',
      highlights: [
        'Automated 7-day performance breakdown',
        'Burnout early-warning detection',
        'Identifies energy drainers vs focus boosters'
      ],
      mockCard: {
        title: 'Weekly Evaluation Report',
        badge: 'Score: 89/100 (+11 pts)',
        items: [
          { name: 'Sleep Quality', val: '8.1 hrs avg', tag: 'Top Tier' },
          { name: 'Burnout Risk', val: 'Low (12%)', tag: 'Optimal' },
          { name: 'Focus Hours', val: '16.5 hrs', tag: '+3.5 hrs' }
        ],
        footerText: '📊 Key Insight: Nights with 8+ hours sleep boosted focus by 28%!'
      }
    },
    {
      id: 4,
      number: '04',
      title: 'Personalized Plan',
      subtitle: 'Tailored Next-Week Actions',
      color: 'tag-orange',
      icon: Target,
      description: 'Receive 3 hyper-focused micro-adjustments for next week based on your actual data, ensuring continuous growth without overwhelming your schedule.',
      highlights: [
        '3 tailored weekly action items',
        'Algorithmically adapted to your schedule',
        'Eliminates habit overwhelm'
      ],
      mockCard: {
        title: 'AI Action Plan for Next Week',
        badge: '3 Micro-Adjustments',
        items: [
          { name: 'Shift Bedtime', val: '10:45 PM', tag: 'Sleep Boost' },
          { name: 'Pre-Study Hydration', val: '500ml Water', tag: 'Focus Hack' },
          { name: 'Weekend Walk', val: '20 Mins', tag: 'Recovery' }
        ],
        footerText: '💡 Small changes, massive cumulative results.'
      }
    },
    {
      id: 5,
      number: '05',
      title: 'Level Up & Repeat',
      subtitle: 'Continuous Compound Growth',
      color: 'tag-green',
      icon: TrendingUp,
      description: 'Watch your weekly wellness score compound over time. Unlock reward badges, squad achievements, and long-term vitality.',
      highlights: [
        'Streak recovery shield (Never lose progress)',
        'Level up wellness rank (Bronze to Diamond)',
        'Build habits that last for life'
      ],
      mockCard: {
        title: 'Habit Mastery Ranking',
        badge: 'Rank: Gold Tier Loop',
        items: [
          { name: 'Consecutive Loops', val: '6 Weeks', tag: 'Active Streak' },
          { name: 'Total Wellness Pts', val: '4,850 XP', tag: 'Level 12' },
          { name: 'Squad Ranking', val: '#2 in Campus', tag: 'Top 5%' }
        ],
        footerText: '🏆 You earned the "Consistency King" badge this week!'
      }
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep);

  return (
    <section id="how-it-works" className="section-padding cycle-section">
      <div className="container">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="section-tag tag-green">
            <Sparkles size={14} />
            <span>The Weekly Wellness Loop</span>
          </div>
          <h2>How HabitLoop Works</h2>
          <p className="text-slate-600 mt-2 text-lg">
            Say goodbye to rigid 30-day streak rules. HabitLoop uses a natural 7-day feedback cycle that adapts to your life, exams, and personal energy.
          </p>
        </div>

        {/* Horizontal Step Tabs */}
        <div className="cycle-steps-nav">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`cycle-step-tab ${activeStep === step.id ? 'active' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="step-num">{step.number}</div>
              <div className="step-title-tab">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Display Card for Active Step */}
        <div className="cycle-display-card">
          {/* Left Text */}
          <div>
            <div className={`section-tag ${currentStep.color}`}>
              <currentStep.icon size={14} />
              <span>Phase {currentStep.number}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              {currentStep.title} — <span className="text-emerald-600 font-semibold">{currentStep.subtitle}</span>
            </h3>

            <p className="text-slate-600 text-base leading-relaxed mb-6">
              {currentStep.description}
            </p>

            <ul className="flex flex-col gap-3 mb-6">
              {currentStep.highlights.map((point, i) => (
                <li key={i} className="flex items-center gap-2.5 font-semibold text-slate-800 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveStep((prev) => (prev % 5) + 1)}
                className="btn btn-secondary btn-sm"
              >
                <span>Next Phase ({((activeStep) % 5) + 1} / 5)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Live Interactive Mockup Card */}
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <currentStep.icon className="text-emerald-500" size={20} />
                  <span>{currentStep.mockCard.title}</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 font-extrabold px-3 py-1 rounded-full">
                  {currentStep.mockCard.badge}
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {currentStep.mockCard.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-sm text-slate-800">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{item.val}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Lightbulb size={16} className="shrink-0 text-emerald-600" />
                <span>{currentStep.mockCard.footerText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
