import React from 'react';
import { 
  ShieldCheck, 
  Brain, 
  Users, 
  RefreshCw, 
  PenTool, 
  Layers, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      title: 'Forgiving Streak Shield',
      desc: 'Never suffer broken-streak anxiety again. HabitLoop accounts for exam weeks, travel, and rest days so missing one day doesn’t erase your hard-earned progress.'
    },
    {
      icon: Brain,
      iconColor: 'text-purple-500 bg-purple-50 border-purple-200',
      title: 'AI Burnout Early Warning',
      desc: 'Our predictive algorithm analyzes sleep dips and study overload to warn you 3 days before a burnout crash occurs.'
    },
    {
      icon: Users,
      iconColor: 'text-blue-500 bg-blue-50 border-blue-200',
      title: 'Campus & Squad Loops',
      desc: 'Form accountability squads with friends, roommates, or study partners. Compare weekly scores, share wins, and send encouragement.'
    },
    {
      icon: RefreshCw,
      iconColor: 'text-cyan-500 bg-cyan-50 border-cyan-200',
      title: 'Calendar & Wearable Sync',
      desc: 'Auto-sync sleep, step counts, and active minutes from Apple Health, Google Fit, Garmin, and Notion study planners.'
    },
    {
      icon: PenTool,
      iconColor: 'text-orange-500 bg-orange-50 border-orange-200',
      title: '2-Minute Weekly Reflection',
      desc: 'Sunday check-ins include micro-prompts to capture what energized you, what drained your focus, and how you felt.'
    },
    {
      icon: Layers,
      iconColor: 'text-pink-500 bg-pink-50 border-pink-200',
      title: 'Smart Habit Stacking',
      desc: 'Link new wellness goals directly onto existing daily routines (e.g., "After 1st morning coffee ➔ drink 500ml hydration glass").'
    }
  ];

  return (
    <section id="features" className="section-padding bg-slate-50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="section-tag tag-purple">
            <Sparkles size={14} />
            <span>Built for Real Life</span>
          </div>
          <h2>Features Engineered for Growth</h2>
          <p className="text-slate-600 mt-2 text-lg">
            HabitLoop isn't built for perfect robots. It’s engineered specifically for students and young adults navigating unpredictable schedules.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <div key={idx} className="feature-card">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${f.iconColor}`}>
                  <IconComp size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
