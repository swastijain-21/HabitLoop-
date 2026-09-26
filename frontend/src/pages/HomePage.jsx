import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Sparkles, Check, Moon, Droplets, Brain, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [habits, setHabits] = useState([
    { id: 1, title: 'Restful Sleep', value: '7.5 hrs', completed: true, icon: Moon },
    { id: 2, title: 'Hydration Target', value: '2.5 Liters', completed: true, icon: Droplets },
    { id: 3, title: 'Deep Focus Session', value: '90 mins', completed: true, icon: Brain },
    { id: 4, title: 'Active Movement', value: '30 mins', completed: false, icon: Zap }
  ]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        if (nextState) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        }
        return { ...h, completed: nextState };
      }
      return h;
    }));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const score = Math.round(65 + (completedCount / habits.length) * 30);

  return (
    <div className="py-12 md:py-20 space-y-24">
      {/* 1. Hero Section */}
      <section className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>The Weekly Feedback Loop</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Build Better Habits With a <span className="gradient-text-hero">Weekly Loop</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Ditch rigid daily streak anxiety. HabitLoop replaces daily pressure with a calm 7-day feedback loop: Check-in → Track → Evaluate → Adapt.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn btn-primary btn-lg">
              <span>Start Your Loop</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/how-it-works" className="btn btn-secondary btn-lg">
              <span>See How It Works</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Simple Visual Representation of the Weekly Loop */}
      <section className="container max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <RotateCcw size={18} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Weekly Loop Preview</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Interactive Demo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: 4-Step Summary */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Sunday Check-in</h4>
                  <p className="text-xs text-slate-500">Set realistic 7-day habit intentions based on your schedule.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Simple Daily Logging</h4>
                  <p className="text-xs text-slate-500">Log sleep, hydration, and focus in under 30 seconds.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Weekly Evaluation</h4>
                  <p className="text-xs text-slate-500">Get your Weekly Wellness Index score & energy insights.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Adapt & Level Up</h4>
                  <p className="text-xs text-slate-500">Receive 2-3 tailored adjustments for next week.</p>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Card Widget */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400">Demo Week 4 Status</span>
                <span className="text-sm font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  Score: {score} / 100
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tap habits to simulate score:</p>
                {habits.map((h) => {
                  const IconComponent = h.icon;
                  return (
                    <div 
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${h.completed ? 'bg-slate-800 border border-emerald-500/40 text-white' : 'bg-slate-800/40 border border-slate-700 text-slate-400'}`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-semibold">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${h.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'}`}>
                          {h.completed && <Check size={12} strokeWidth={3} />}
                        </div>
                        <IconComponent size={14} className={h.completed ? 'text-emerald-400' : 'text-slate-500'} />
                        <span>{h.title}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{h.value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-400 italic">
                  "No broken streak guilt—just 7 days of continuous learning."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Short Wellness-Focused Closing CTA */}
      <section className="container max-w-3xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            Ready to build a better week?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-lg mx-auto">
            Start your HabitLoop journey today with zero pressure. No credit card required.
          </p>
          <div className="pt-2">
            <Link to="/signup" className="btn btn-primary btn-lg">
              <span>Start Your Free Loop</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
