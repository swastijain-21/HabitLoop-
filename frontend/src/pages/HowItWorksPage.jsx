import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  BarChart2, 
  FlaskConical, 
  TrendingUp, 
  Lightbulb, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Utensils,
  Bot,
  CalendarCheck,
  Scale
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStageId, setActiveStageId] = useState(1);

  // Section 2 & 3 Data: The 6 Stages
  const stages = [
    {
      id: 1,
      num: '01',
      title: 'TRACK',
      subtitle: 'Daily Micro-Logging',
      icon: Activity,
      colorTheme: 'stage-green',
      summary: 'Users record their daily wellness factors such as sleep, movement, screen time, focus, energy, mood, mindfulness, and outdoor time.',
      factorsList: ['Sleep Hours', 'Movement', 'Screen Time', 'Study Focus', 'Energy Rating', 'Mood & Wellbeing', 'Mindfulness', 'Outdoor Time'],
      keyTakeaway: 'Fast 30-second daily micro-log with zero guilt if a day is missed.'
    },
    {
      id: 2,
      num: '02',
      title: 'UNDERSTAND',
      subtitle: 'Pattern Identification',
      icon: BarChart2,
      colorTheme: 'stage-blue',
      summary: 'At the end of the week, HabitLoop reviews the user\'s logged data and identifies patterns, stronger areas, and areas that may need attention.',
      factorsList: ['Weekly Score / 100', 'Energy Drain Detection', 'Focus & Sleep Correlation', 'Burnout Early Warning'],
      keyTakeaway: 'Automated 7-day pattern insights showing what energized or drained your week.'
    },
    {
      id: 3,
      num: '03',
      title: 'EXPERIMENT',
      subtitle: 'Single Focus Action',
      icon: FlaskConical,
      colorTheme: 'stage-purple',
      summary: 'HabitLoop suggests one small, practical change based primarily on the user\'s wellness patterns.',
      factorsList: ['1 Micro-Change Focus', 'Tailored AI Suggestion', '7-Day Duration', 'Clear Hypothesis'],
      keyTakeaway: 'Focusing on exactly 1 experiment at a time prevents habit overwhelm.'
    },
    {
      id: 4,
      num: '04',
      title: 'MEASURE',
      subtitle: '7-Day Active Trial',
      icon: TrendingUp,
      colorTheme: 'stage-orange',
      summary: 'The user follows the suggested change for 7 days while continuing to track relevant metrics.',
      factorsList: ['Daily Progress Bar', 'Watched Metrics Tracking', 'Baseline Comparison', '7-Day Trial Window'],
      keyTakeaway: 'Gather real data over 7 days while keeping your daily routine intact.'
    },
    {
      id: 5,
      num: '05',
      title: 'IMPROVE',
      subtitle: 'Baseline vs. Test Analysis',
      icon: Lightbulb,
      colorTheme: 'stage-teal',
      summary: 'HabitLoop compares the experiment period with the user\'s baseline to help the user understand what changed.',
      factorsList: ['Side-by-Side Comparison', 'Objective Impact Score', 'Adopt Habit Option', 'Zero Guilt if Dropped'],
      keyTakeaway: 'Keep changes that work, drop what doesn\'t, and compound 1% weekly gains.'
    },
    {
      id: 6,
      num: '06',
      title: 'REPEAT',
      subtitle: 'Continuous Loop Reset',
      icon: RotateCcw,
      colorTheme: 'stage-emerald',
      summary: 'The user begins the next weekly loop and continues learning from their own data.',
      factorsList: ['Sunday Intentions Reset', 'Streak Armor Active', 'Adaptive Goals', 'Long-Term Compound Growth'],
      keyTakeaway: 'Every Sunday starts a clean new loop—no broken streak penalties.'
    }
  ];

  const activeStage = stages.find(s => s.id === activeStageId) || stages[0];

  // Section 4 Data: Feature Flow Nodes
  const featureNodes = [
    { num: '01', title: 'DAILY TRACKING', desc: 'Log 8 wellness factors daily', icon: Activity, tag: 'Daily' },
    { num: '02', title: 'WEEKLY EVALUATION', desc: 'Aggregate 7-day pattern data', icon: BarChart2, tag: 'Sunday' },
    { num: '03', title: 'AI WELLNESS COACH', desc: 'Analyze trends & correlations', icon: Bot, tag: 'Analysis' },
    { num: '04', title: 'ONE RECOMMENDATION', desc: 'Generate 1 practical micro-change', icon: Lightbulb, tag: 'Insight' },
    { num: '05', title: '7-DAY EXPERIMENT', desc: 'Test target change for 1 week', icon: FlaskConical, tag: 'Active' },
    { num: '06', title: 'BEFORE vs AFTER', desc: 'Compare test metrics to baseline', icon: Scale, tag: 'Result' },
    { num: '07', title: 'NEXT WEEK', desc: 'Adopt win & start fresh loop', icon: RotateCcw, tag: 'Repeat' },
  ];

  // Section 5 Data: Nutrition & Lifestyle Context Flow
  const contextFlowNodes = [
    { title: '8 WELLNESS FACTORS', sub: 'Sleep, Focus, Movement, Energy, Mood, Screen Time, Outdoor, Mindfulness', highlight: false },
    { title: 'MAIN WELLNESS PATTERNS', sub: 'Calculates weekly score & pattern trends', highlight: false },
    { title: 'NUTRITION & LIFESTYLE CONTEXT', sub: 'Adds optional qualitative layer (Hydration, Meals, Caffeine, Routine)', highlight: true },
    { title: 'REFINED RECOMMENDATION', sub: 'Generates hyper-tailored micro-experiments', highlight: false },
    { title: '7-DAY EXPERIMENT', sub: 'Measures exact 1-week impact', highlight: false },
  ];

  return (
    <div className="howitworks-page-wrapper">
      <div className="container">
        
        {/* 1. HOW HABITLOOP WORKS — HERO INTRO */}
        <section className="howitworks-hero-section">
          <div className="howitworks-eyebrow">
            <Sparkles size={14} />
            <span>HOW HABITLOOP WORKS</span>
          </div>
          <h1 className="howitworks-hero-title">
            Understanding the <span className="gradient-text-hero">HabitLoop System</span>
          </h1>
          <p className="howitworks-hero-description">
            HabitLoop is a continuous weekly wellness framework designed to replace streak anxiety with practical, data-driven micro-experiments tailored to your actual life.
          </p>
        </section>

        {/* 2. THE HABITLOOP LOOP — 6 STAGE RIBBON */}
        <section className="howitworks-loop-section">
          <div className="loop-header-clean text-center">
            <h2 className="section-heading-sm">THE HABITLOOP CYCLE</h2>
            <p className="section-sub-sm">
              A continuous 6-stage loop that transforms daily awareness into sustainable habits.
            </p>
          </div>

          {/* 6-Stage Interactive Horizontal Loop Track */}
          <div className="stage-ribbon-grid">
            {stages.map((s, idx) => {
              const StageIcon = s.icon;
              const isSelected = activeStageId === s.id;
              return (
                <div key={s.id} className="stage-ribbon-item">
                  <button
                    type="button"
                    onClick={() => setActiveStageId(s.id)}
                    className={`stage-pill-btn ${s.colorTheme} ${isSelected ? 'active' : ''}`}
                  >
                    <span className="stage-num-tag">{s.num}</span>
                    <StageIcon size={16} className="stage-pill-icon" />
                    <span className="stage-pill-title">{s.title}</span>
                  </button>
                  {idx < stages.length - 1 && <span className="stage-ribbon-arrow">→</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. WHAT HAPPENS AT EACH STAGE */}
        <section className="howitworks-stages-detail-section">
          <div className="section-header-block text-center">
            <h2 className="section-title-lg">What Happens at Each Stage</h2>
            <p className="section-desc-md">
              Select a stage above or explore how each phase builds upon your personal wellness data.
            </p>
          </div>

          {/* Interactive Stage Showcase Box */}
          <div className="stage-detail-card">
            <div className="stage-detail-main">
              <div className="stage-header-badge-row">
                <span className="stage-active-badge">
                  STAGE {activeStage.num} • {activeStage.title}
                </span>
                <span className="stage-subtitle-text">{activeStage.subtitle}</span>
              </div>

              <h3 className="stage-detail-heading">{activeStage.title}: {activeStage.subtitle}</h3>
              <p className="stage-detail-paragraph">{activeStage.summary}</p>

              <div className="stage-takeaway-box">
                <span className="takeaway-label">Key Takeaway:</span>
                <span className="takeaway-text">{activeStage.keyTakeaway}</span>
              </div>

              <div className="stage-nav-buttons">
                <button
                  type="button"
                  onClick={() => setActiveStageId((prev) => (prev % 6) + 1)}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Explore Next Stage ({((activeStageId) % 6) + 1} of 6)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Stage Factor / Highlights List */}
            <div className="stage-detail-sidebar">
              <div className="sidebar-header-title">Stage Components</div>
              <ul className="stage-factors-list">
                {activeStage.factorsList.map((factor, idx) => (
                  <li key={idx} className="stage-factor-item">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6 Grid Cards for Quick Overview of All Stages */}
          <div className="all-stages-grid">
            {stages.map((stg) => {
              const StgIcon = stg.icon;
              return (
                <div 
                  key={stg.id} 
                  onClick={() => setActiveStageId(stg.id)}
                  className={`stage-overview-card ${activeStageId === stg.id ? 'focused' : ''}`}
                >
                  <div className="overview-card-top">
                    <span className="overview-num">{stg.num}</span>
                    <StgIcon size={18} className="overview-icon" />
                  </div>
                  <h4 className="overview-title">{stg.title}</h4>
                  <p className="overview-summary">{stg.summary}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. HOW THE FEATURES CONNECT (VISUAL PRODUCT FLOW) */}
        <section className="howitworks-feature-connect-section">
          <div className="section-header-block text-center">
            <h2 className="section-title-lg">How the Features Connect</h2>
            <p className="section-desc-md">
              From daily micro-logs to 7-day experiments, here is how the application components connect into a unified experience.
            </p>
          </div>

          <div className="feature-flow-container">
            <div className="feature-flow-track">
              {featureNodes.map((node, i) => {
                const NodeIcon = node.icon;
                return (
                  <React.Fragment key={i}>
                    <div className="feature-flow-node">
                      <div className="flow-node-header">
                        <span className="flow-node-num">{node.num}</span>
                        <span className="flow-node-tag">{node.tag}</span>
                      </div>
                      <div className="flow-node-body">
                        <div className="flow-node-icon-box">
                          <NodeIcon size={18} />
                        </div>
                        <h4 className="flow-node-title">{node.title}</h4>
                        <p className="flow-node-desc">{node.desc}</p>
                      </div>
                    </div>
                    {i < featureNodes.length - 1 && (
                      <div className="flow-connector-arrow">
                        <span>→</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. NUTRITION & LIFESTYLE CONTEXT */}
        <section className="howitworks-context-section">
          <div className="context-card-panel">
            <div className="context-header-col">
              <div className="context-tag">
                <Utensils size={14} />
                <span>SUPPORTING CONTEXT LAYER</span>
              </div>
              <h2 className="context-title">Nutrition & Lifestyle Context</h2>
              <p className="context-desc">
                HabitLoop separates your core 8 wellness factors from supporting lifestyle context. Details like hydration, meal balance, caffeine, and workload stress serve as a qualitative layer to refine AI recommendations—without altering your core 8 factor scores.
              </p>
            </div>

            {/* Context Layer Flow Diagram */}
            <div className="context-flow-diagram">
              {contextFlowNodes.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className={`context-flow-item ${item.highlight ? 'context-highlight' : ''}`}>
                    <div className="context-item-top">
                      <span className="context-item-step">0{idx + 1}</span>
                      <span className="context-item-title">{item.title}</span>
                    </div>
                    <span className="context-item-sub">{item.sub}</span>
                  </div>
                  {idx < contextFlowNodes.length - 1 && (
                    <div className="context-arrow-down">↓</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 6. INFORMATIONAL ENDING (BRAND STATEMENT - NO CTA) */}
        <section className="howitworks-ending-section">
          <div className="ending-statement-card">
            <div className="ending-icon-box">
              <RotateCcw size={28} />
            </div>
            <h2 className="ending-statement-quote">
              "Track your week. Understand your patterns. Try one small change. Repeat."
            </h2>
            <div className="ending-divider-line" />
            <span className="ending-brand-subtext">
              The HabitLoop Philosophy • Sustainable Wellness Through Continuous 7-Day Experiments
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}
