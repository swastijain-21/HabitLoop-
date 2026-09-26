import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, BarChart2, Lightbulb, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      num: '01',
      title: 'Weekly Check-in',
      subtitle: 'Set Intentions & Flexible Goals',
      icon: Calendar,
      color: 'bg-emerald-500',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Every Sunday, set realistic 7-day habit intentions based on your upcoming workload, exam schedule, or personal energy levels.',
      details: [
        'Adjust habit intensity based on week difficulty',
        'Set simple targets for sleep, hydration & focus',
        'Zero pressure from past missed days'
      ],
      demoBox: {
        title: 'Sunday Intentions Set',
        badge: 'Example Target',
        items: [
          { label: 'Sleep Goal', val: '7.5 hrs / night' },
          { label: 'Hydration Goal', val: '2.5 Liters / day' },
          { label: 'Study Focus', val: '90 mins / day' }
        ]
      }
    },
    {
      id: 2,
      num: '02',
      title: 'Track Your Week',
      subtitle: 'Simple Daily Micro-Logging',
      icon: Sparkles,
      color: 'bg-blue-500',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'Log your daily metrics in under 30 seconds with clean tap-and-go widgets. No complex forms or endless inputs.',
      details: [
        'Quick 1-tap habit logging',
        'Optional wearable & calendar sync',
        'Track mood and energy slumps effortlessly'
      ],
      demoBox: {
        title: 'Daily Micro-Checkin',
        badge: 'Wednesday • Demo Log',
        items: [
          { label: 'Hydration', val: '2.5 L (Target Met)' },
          { label: 'Pomodoro Focus', val: '2 Sessions (90 mins)' },
          { label: 'Evening Unplug', val: '20 mins rest' }
        ]
      }
    },
    {
      id: 3,
      num: '03',
      title: 'Weekly Evaluation',
      subtitle: 'Clear Summary & Insights',
      icon: BarChart2,
      color: 'bg-purple-500',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
      description: 'At the end of 7 days, HabitLoop calculates your overall Weekly Wellness Index score and highlights what energized your week.',
      details: [
        'Automated 7-day performance breakdown',
        'Early awareness of fatigue & energy drains',
        'Focus on progress over perfection'
      ],
      demoBox: {
        title: 'Weekly Summary Report',
        badge: 'Score: 88 / 100',
        items: [
          { label: 'Sleep Quality', val: '7.8 hrs average' },
          { label: 'Focus Consistency', val: '5 days completed' },
          { label: 'Energy Rating', val: 'High / Stable' }
        ]
      }
    },
    {
      id: 4,
      num: '04',
      title: 'Personalized Recommendations',
      subtitle: '2-3 Tailored Micro-Adjustments',
      icon: Lightbulb,
      color: 'bg-orange-500',
      tagColor: 'bg-orange-50 text-orange-800 border-orange-200',
      description: 'Receive 2 to 3 targeted micro-adjustments custom-tailored for your upcoming week based on your actual data.',
      details: [
        'Hyper-focused weekly action items',
        'Adapted to your personal schedule',
        'Eliminates habit overwhelm'
      ],
      demoBox: {
        title: 'AI Recommendation Demo',
        badge: 'Suggested Adjustments',
        items: [
          { label: 'Bedtime Shift', val: '10:45 PM target' },
          { label: 'Hydration Boost', val: '+500ml pre-study' },
          { label: 'Active Walk', val: '20 mins weekend walk' }
        ]
      }
    },
    {
      id: 5,
      num: '05',
      title: 'Improve & Repeat',
      subtitle: 'Continuous Compound Growth',
      icon: RotateCcw,
      color: 'bg-emerald-600',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Watch your weekly wellness score improve naturally week after week. No broken streak guilt—just steady growth.',
      details: [
        'Streak recovery shield keeps your motivation high',
        'Compound small wins over time',
        'Build lifelong sustainable habits'
      ],
      demoBox: {
        title: 'Habit Mastery Progress',
        badge: 'Week 6 Compound',
        items: [
          { label: 'Active Weekly Loops', val: '6 Consecutive Weeks' },
          { label: 'Average Score', val: '86 / 100' },
          { label: 'Primary Win', val: 'Consistent sleep rhythm' }
        ]
      }
    }
  ];

  const current = steps.find(s => s.id === activeStep);

  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="container max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
          How HabitLoop Works
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          The 5-step weekly improvement loop designed to build sustainable wellness habits without streak anxiety.
        </p>
      </div>

      {/* Step Buttons */}
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-1 min-w-[130px] p-4 rounded-2xl border text-center transition-all ${
                activeStep === s.id 
                  ? 'bg-white border-emerald-500 shadow-sm font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="text-xs font-extrabold text-slate-400 mb-1">{s.num}</div>
              <div className="text-xs font-bold text-slate-900">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Step Display */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${current.tagColor} mb-4`}>
              <span>Step {current.num}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              {current.title}
            </h2>
            <p className="text-sm font-bold text-emerald-600 mb-4">{current.subtitle}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{current.description}</p>

            <ul className="space-y-2.5 mb-6">
              {current.details.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setActiveStep((prev) => (prev % 5) + 1)}
              className="btn btn-secondary btn-sm"
            >
              <span>Next Step ({((activeStep) % 5) + 1} / 5)</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Demo Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <span className="font-extrabold text-sm text-slate-900">{current.demoBox.title}</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {current.demoBox.badge}
              </span>
            </div>

            <div className="space-y-3">
              {current.demoBox.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-900 font-extrabold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container text-center pt-8">
        <Link to="/signup" className="btn btn-primary btn-lg">
          <span>Start Your Loop</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
