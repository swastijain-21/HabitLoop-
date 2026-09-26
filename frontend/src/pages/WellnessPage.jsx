import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon, 
  Droplets, 
  Zap, 
  Apple, 
  HeartHandshake, 
  Smartphone, 
  BookOpen, 
  Users,
  ArrowRight
} from 'lucide-react';

export default function WellnessPage() {
  const areas = [
    {
      title: 'Sleep',
      icon: Moon,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
      description: 'Track nightly sleep duration, bedtime consistency, and wake-up alertness.'
    },
    {
      title: 'Hydration',
      icon: Droplets,
      color: 'text-cyan-500 bg-cyan-50 border-cyan-200',
      description: 'Maintain daily water targets to avoid afternoon fatigue and maintain focus.'
    },
    {
      title: 'Movement',
      icon: Zap,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      description: 'Monitor physical activity through workouts, daily steps, and posture breaks.'
    },
    {
      title: 'Nutrition',
      icon: Apple,
      color: 'text-orange-500 bg-orange-50 border-orange-200',
      description: 'Build balanced meal routines and stable energy throughout the day.'
    },
    {
      title: 'Mood & Mindfulness',
      icon: HeartHandshake,
      color: 'text-pink-500 bg-pink-50 border-pink-200',
      description: 'Practice short mental check-ins, breathing exercises, and stress awareness.'
    },
    {
      title: 'Screen Time',
      icon: Smartphone,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      description: 'Manage digital detoxes and bedtime phone unplugging for better rest.'
    },
    {
      title: 'Study & Work Balance',
      icon: BookOpen,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      description: 'Organize deep focus study blocks while preventing academic burnout.'
    },
    {
      title: 'Social Balance',
      icon: Users,
      color: 'text-teal-500 bg-teal-50 border-teal-200',
      description: 'Reserve dedicated guilt-free downtime with friends, family, and hobbies.'
    }
  ];

  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="container max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Wellness Areas
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          Focus on the 8 key pillars that shape your daily energy, focus, and overall wellbeing.
        </p>
      </div>

      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, idx) => {
            const IconComp = area.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 transition-all hover:shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${area.color}`}>
                  <IconComp size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{area.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container text-center pt-6">
        <Link to="/signup" className="btn btn-primary btn-lg">
          <span>Start Your Loop</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
