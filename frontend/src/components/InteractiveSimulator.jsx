import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sliders, 
  Sparkles, 
  Moon, 
  Droplet, 
  Brain, 
  Zap, 
  Heart, 
  Award,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function InteractiveSimulator({ onOpenAuth }) {
  const [sleep, setSleep] = useState(7.5);
  const [hydration, setHydration] = useState(2.5);
  const [focus, setFocus] = useState(4.0);
  const [movement, setMovement] = useState(35);
  const [mindfulness, setMindfulness] = useState(20);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Score Calculation Formula
  const sleepPts = Math.min(25, (sleep / 8) * 25);
  const hydroPts = Math.min(20, (hydration / 2.5) * 20);
  const focusPts = Math.min(20, (focus / 4.5) * 20);
  const movePts = Math.min(20, (movement / 45) * 20);
  const mindPts = Math.min(15, (mindfulness / 25) * 15);

  const rawScore = Math.round(sleepPts + hydroPts + focusPts + movePts + mindPts);
  const score = Math.min(100, Math.max(25, rawScore));

  const handleGenerateEvaluation = () => {
    setHasCalculated(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const getRecommendation = () => {
    if (score >= 88) {
      return {
        tier: '🌟 Peak Weekly Loop',
        status: 'Optimal Balance',
        tip: 'Fantastic balance! Your high sleep and hydration levels are protecting you from study fatigue. Maintain this loop for midterms!'
      };
    } else if (score >= 70) {
      return {
        tier: '⚡ Strong Growth Loop',
        status: 'Solid Foundation',
        tip: `Great foundation! Increasing hydration to 2.5L and sleep to 8 hrs could boost your deep focus energy by +24% next week.`
      };
    } else {
      return {
        tier: '🌱 Recovery Loop Needed',
        status: 'High Burnout Warning',
        tip: 'Your schedule is putting pressure on your sleep and rest. HabitLoop recommends prioritizing a 10:30 PM bedtime and 2L water goal.'
      };
    }
  };

  const rec = getRecommendation();

  return (
    <section id="loop-simulator" className="section-padding bg-white">
      <div className="container">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="section-tag tag-orange">
            <Sliders size={14} />
            <span>Interactive Tool</span>
          </div>
          <h2>Weekly Wellness Score Simulator</h2>
          <p className="text-slate-600 mt-2 text-lg">
            Adjust your weekly habit targets below to simulate how HabitLoop calculates your weekly wellness score and generates instant AI feedback.
          </p>
        </div>

        {/* Main Card */}
        <div className="simulator-card">
          {/* Left Controls Column */}
          <div className="slider-group">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders className="text-emerald-500" size={20} />
              <span>Simulate Your Weekly Inputs</span>
            </h3>

            {/* Sleep Slider */}
            <div className="slider-control">
              <div className="slider-label-row">
                <span className="flex items-center gap-2 text-slate-800">
                  <Moon size={18} className="text-blue-500" />
                  <span>Nightly Sleep Duration</span>
                </span>
                <span className="slider-val-badge">{sleep} hrs / night</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="10" 
                step="0.5" 
                value={sleep} 
                onChange={(e) => setSleep(parseFloat(e.target.value))} 
              />
            </div>

            {/* Hydration Slider */}
            <div className="slider-control">
              <div className="slider-label-row">
                <span className="flex items-center gap-2 text-slate-800">
                  <Droplet size={18} className="text-cyan-500" />
                  <span>Daily Water Intake</span>
                </span>
                <span className="slider-val-badge">{hydration} Liters</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="4.0" 
                step="0.25" 
                value={hydration} 
                onChange={(e) => setHydration(parseFloat(e.target.value))} 
              />
            </div>

            {/* Study Focus Slider */}
            <div className="slider-control">
              <div className="slider-label-row">
                <span className="flex items-center gap-2 text-slate-800">
                  <Brain size={18} className="text-purple-500" />
                  <span>Daily Deep Focus / Study</span>
                </span>
                <span className="slider-val-badge">{focus} hrs / day</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="8" 
                step="0.5" 
                value={focus} 
                onChange={(e) => setFocus(parseFloat(e.target.value))} 
              />
            </div>

            {/* Movement Slider */}
            <div className="slider-control">
              <div className="slider-label-row">
                <span className="flex items-center gap-2 text-slate-800">
                  <Zap size={18} className="text-emerald-500" />
                  <span>Active Movement / Exercise</span>
                </span>
                <span className="slider-val-badge">{movement} mins / day</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                step="5" 
                value={movement} 
                onChange={(e) => setMovement(parseInt(e.target.value))} 
              />
            </div>

            {/* Mindfulness Slider */}
            <div className="slider-control">
              <div className="slider-label-row">
                <span className="flex items-center gap-2 text-slate-800">
                  <Heart size={18} className="text-pink-500" />
                  <span>Mindfulness & Unplug Time</span>
                </span>
                <span className="slider-val-badge">{mindfulness} mins / day</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="60" 
                step="5" 
                value={mindfulness} 
                onChange={(e) => setMindfulness(parseInt(e.target.value))} 
              />
            </div>

            <button 
              onClick={handleGenerateEvaluation}
              className="btn btn-primary w-full mt-2"
            >
              <Sparkles size={18} />
              <span>Generate Weekly AI Evaluation</span>
            </button>
          </div>

          {/* Right Output Panel */}
          <div className="sim-output-panel">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Weekly Index Gauge
              </span>
              <p className="text-xs text-slate-400 mt-2">Calculated 7-Day Performance</p>
            </div>

            {/* Circle Score Gauge */}
            <div className="gauge-circle">
              <div className="gauge-score-val">{score}</div>
            </div>

            <div className="w-full">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-emerald-400">{rec.tier}</span>
                  <span className="text-xs font-bold text-slate-300">{rec.status}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.tip}
                </p>
              </div>

              <button 
                onClick={() => onOpenAuth('signup')} 
                className="btn btn-blue w-full btn-sm"
              >
                <span>Lock In This Weekly Goal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
