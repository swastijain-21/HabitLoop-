import React from 'react';
import { 
  Brain, 
  Dumbbell, 
  Moon, 
  Droplet, 
  Users, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function WellnessPillars() {
  const pillars = [
    {
      id: 'mind',
      name: 'Mind & Focus',
      category: 'Mental Balance',
      colorClass: 'pillar-purple',
      icon: Brain,
      barColor: 'bg-purple-500',
      progress: 88,
      stats: '4.5 hrs Deep Focus / Day',
      description: 'Train your mental focus with Pomodoro study sessions, mindfulness check-ins, and intentional digital detoxes.',
      habits: ['90-min Deep Study', '10-min Mindfulness', 'No Phone Before Bed']
    },
    {
      id: 'body',
      name: 'Body & Movement',
      category: 'Physical Vitality',
      colorClass: 'pillar-green',
      icon: Dumbbell,
      barColor: 'bg-emerald-500',
      progress: 92,
      stats: '10,200 Steps & Active Cal',
      description: 'Keep your energy high with daily movement goals, strength training, quick posture breaks, and stretching.',
      habits: ['30-min Workout', '7.5k Daily Steps', 'Post-Study Stretch']
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery',
      category: 'Circadian Rest',
      colorClass: 'pillar-blue',
      icon: Moon,
      barColor: 'bg-blue-500',
      progress: 84,
      stats: '7.8 hrs Avg Sleep Quality',
      description: 'Recover faster and wake up sharp by optimizing bedtime consistency, sleep environment, and rest scores.',
      habits: ['Consistent Bedtime', 'Dark Room Temp', 'Magnesium / Herbal Tea']
    },
    {
      id: 'hydration',
      name: 'Hydration & Fuel',
      category: 'Cellular Energy',
      colorClass: 'pillar-blue',
      icon: Droplet,
      barColor: 'bg-cyan-500',
      progress: 95,
      stats: '2.5 Liters Water Tracked',
      description: 'Fuel your brain and avoid afternoon fatigue with water reminders, clean meals, and balanced energy habits.',
      habits: ['Morning 500ml Water', '2.5L Daily Hydration', 'Clean Whole Meal']
    },
    {
      id: 'balance',
      name: 'Social & Balance',
      category: 'Burnout Shield',
      colorClass: 'pillar-orange',
      icon: Users,
      barColor: 'bg-orange-500',
      progress: 79,
      stats: '3 hrs Friend & Hobby Time',
      description: 'Prevent burnout by reserving dedicated time for friends, family, outdoor walks, and guilt-free downtime.',
      habits: ['Dinner with Friends', 'Weekend Outdoors', 'Guilt-Free Gaming/Hobby']
    }
  ];

  return (
    <section id="wellness-pillars" className="section-padding bg-slate-50">
      <div className="container">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="section-tag tag-blue">
            <Sparkles size={14} />
            <span>Holistic Habit Ecosystem</span>
          </div>
          <h2>5 Pillars of Youth Wellness</h2>
          <p className="text-slate-600 mt-2 text-lg">
            True wellness isn't just about gym sessions or drinking water. HabitLoop connects the 5 core pillars that dictate how you feel, learn, and perform.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="pillars-grid">
          {pillars.map((p) => {
            const IconComponent = p.icon;
            return (
              <div key={p.id} className={`pillar-card ${p.colorClass}`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div className="pillar-icon-wrapper">
                      <IconComponent size={28} />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{p.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.habits.map((h, idx) => (
                      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Metric Bar */}
                <div className="pillar-metric-bar">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                    <span>Weekly Target Completion</span>
                    <span className="text-emerald-700 font-extrabold">{p.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className={`progress-fill ${p.barColor}`} 
                      style={{ width: `${p.progress}%` }} 
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1">
                    <ArrowUpRight size={14} className="text-emerald-500" />
                    <span>{p.stats}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
