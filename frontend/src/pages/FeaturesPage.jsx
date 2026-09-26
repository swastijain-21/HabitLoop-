import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, RefreshCw, Layers, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Forgiving Streak Shield',
      icon: Shield,
      desc: 'Missing a day will never reset your multi-week streak to zero. HabitLoop focuses on your overall 7-day trend.'
    },
    {
      title: 'AI Weekly Insights',
      icon: Sparkles,
      desc: 'Receive automated summaries that connect your sleep and hydration levels with your study productivity.'
    },
    {
      title: 'Weekly Reflection Prompts',
      icon: BookOpen,
      desc: 'Complete a 2-minute Sunday check-in to reflect on what energized you and where you can improve.'
    },
    {
      title: 'Smart Habit Stacking',
      icon: Layers,
      desc: 'Link new wellness goals directly onto your existing daily routines for effortless consistency.'
    },
    {
      title: 'Squad Accountability',
      icon: Users,
      desc: 'Form small accountability loops with friends or classmates to share weekly progress.'
    },
    {
      title: 'Simple Data Sync',
      icon: RefreshCw,
      desc: 'Sync sleep, steps, and active minutes automatically from your favorite health apps.'
    }
  ];

  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="container max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
          HabitLoop Features
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          Simple tools designed to help you build habits that fit your actual life schedule.
        </p>
      </div>

      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <IconComp size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
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
