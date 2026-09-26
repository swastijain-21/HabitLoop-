import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Check, 
  TrendingUp, 
  Award, 
  Brain, 
  Moon, 
  Droplets, 
  Zap, 
  Star 
} from 'lucide-react';

export default function Hero({ onOpenAuth }) {
  const [habits, setHabits] = useState([
    { id: 1, title: '7.5 Hrs Restful Sleep', metric: '+12% Rest', completed: true, color: 'pill-blue', icon: Moon },
    { id: 2, title: '2.5L Hydration Goal', metric: '2.5 / 2.5 L', completed: true, color: 'pill-green', icon: Droplets },
    { id: 3, title: '90 Min Study Deep Focus', metric: '+18% Focus', completed: true, color: 'pill-purple', icon: Brain },
    { id: 4, title: '30 Min Active Movement', metric: '420 kcal', completed: false, color: 'pill-orange', icon: Zap }
  ]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        if (nextState) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
        return { ...h, completed: nextState };
      }
      return h;
    }));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const score = Math.round(62 + (completedCount / habits.length) * 34);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Hero Content */}
          <div className="hero-text-col">
            <div className="hero-badge">
              <Sparkles size={16} className="text-emerald-500" />
              <span>The #1 Weekly Feedback Loop for Youth Wellness</span>
            </div>

            <h1>
              Transform Your Habits, One <span className="gradient-text-hero">Weekly Loop</span> at a Time.
            </h1>

            <p className="hero-subtitle">
              Ditch daily streak pressure. HabitLoop replaces rigid guilt with an empowering 7-day feedback loop designed to help you balance study, rest, fitness, and life.
            </p>

            <div className="hero-cta-group">
              <button 
                onClick={() => onOpenAuth('signup')} 
                className="btn btn-primary btn-lg"
              >
                <span>Start Free 7-Day Loop</span>
                <ArrowRight size={18} />
              </button>
              
              <a 
                href="#loop-simulator" 
                className="btn btn-secondary btn-lg"
              >
                <Play size={16} className="fill-slate-800 text-slate-800" />
                <span>Try Live Simulator</span>
              </a>
            </div>

            {/* Social Proof & Metrics */}
            <div className="hero-stats-row">
              <div className="stat-item">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-extrabold text-slate-900 ml-1">4.9/5</span>
                </div>
                <span className="stat-lbl">From 12,000+ Student Reviews</span>
              </div>

              <div className="stat-item">
                <span className="stat-num gradient-text-green">25,000+</span>
                <span className="stat-lbl">Active Weekly Loops</span>
              </div>

              <div className="stat-item">
                <span className="stat-num gradient-text-blue">94%</span>
                <span className="stat-lbl">Weekly Retention Rate</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Hero Live Card */}
          <div className="hero-visual-col">
            <div className="hero-widget-card animate-float">
              <div className="widget-header">
                <div className="widget-title">
                  <TrendingUp className="text-emerald-500" size={20} />
                  <div>
                    <h4 className="text-slate-900 font-extrabold text-base">Weekly Loop Status</h4>
                    <p className="text-xs text-slate-500">Week 4 • 5 Days Tracked</p>
                  </div>
                </div>

                <div className="score-badge">
                  <Award size={16} />
                  <span>{score} / 100</span>
                </div>
              </div>

              {/* Clickable Habit List */}
              <div className="widget-habits-list">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                  <span>Interactive Weekly Habits</span>
                  <span className="text-emerald-600">Click to toggle</span>
                </div>

                {habits.map((h) => {
                  const IconComp = h.icon;
                  return (
                    <div 
                      key={h.id} 
                      className={`habit-interactive-item ${h.completed ? 'completed' : ''}`}
                      onClick={() => toggleHabit(h.id)}
                    >
                      <div className="habit-left">
                        <div className="checkbox-custom">
                          {h.completed && <Check size={14} strokeWidth={3} />}
                        </div>
                        <IconComp size={18} className={h.completed ? 'text-emerald-700' : 'text-slate-400'} />
                        <span className={h.completed ? 'text-slate-900 font-bold' : 'text-slate-600'}>
                          {h.title}
                        </span>
                      </div>
                      <span className={`pill-metric ${h.color}`}>{h.metric}</span>
                    </div>
                  );
                })}
              </div>

              {/* AI Insight Box */}
              <div className="widget-ai-tip">
                <Brain className="tip-icon" size={20} />
                <div>
                  <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wide">AI Loop Co-Pilot</p>
                  <p className="text-xs text-purple-800 mt-0.5 leading-relaxed">
                    {score >= 85 
                      ? "🔥 Peak momentum! You're on track for your highest weekly wellness score this month." 
                      : "💡 Quick tip: Complete your active movement habit to boost your score to 96!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
