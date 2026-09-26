import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, RotateCcw, Calendar, Activity, BarChart2, Lightbulb, RefreshCw } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      {/* 1. HERO SECTION — DESKTOP TWO-COLUMN LAYOUT */}
      <section className="hero-landing-section">
        <div className="container">
          <div className="hero-grid-two-col">
            
            {/* LEFT COLUMN — HABITLOOP CYCLE VISUAL */}
            <div className="hero-left-col">
              <div className="cycle-flow-card">
                <div className="cycle-card-header">
                  <div className="cycle-header-title">
                    <div className="cycle-header-icon">
                      <RotateCcw size={16} />
                    </div>
                    <span>The HabitLoop Cycle</span>
                  </div>
                  <span className="cycle-header-badge">
                    5-Step Loop
                  </span>
                </div>

                {/* 5-Node Flow */}
                <div className="stage-nodes-list">
                  {/* Node 1 */}
                  <div className="stage-node node-green">
                    <div className="node-content-left">
                      <div className="node-num num-green">01</div>
                      <div>
                        <h4 className="node-title">CHECK IN</h4>
                        <p className="node-desc">Set your weekly baseline</p>
                      </div>
                    </div>
                    <Calendar size={18} className="node-icon icon-green" />
                  </div>

                  <div className="flow-arrow">↓</div>

                  {/* Node 2 */}
                  <div className="stage-node node-blue">
                    <div className="node-content-left">
                      <div className="node-num num-blue">02</div>
                      <div>
                        <h4 className="node-title">TRACK</h4>
                        <p className="node-desc">Record your daily habits</p>
                      </div>
                    </div>
                    <Activity size={18} className="node-icon icon-blue" />
                  </div>

                  <div className="flow-arrow">↓</div>

                  {/* Node 3 */}
                  <div className="stage-node node-purple">
                    <div className="node-content-left">
                      <div className="node-num num-purple">03</div>
                      <div>
                        <h4 className="node-title">REFLECT</h4>
                        <p className="node-desc">Understand your week</p>
                      </div>
                    </div>
                    <BarChart2 size={18} className="node-icon icon-purple" />
                  </div>

                  <div className="flow-arrow">↓</div>

                  {/* Node 4 */}
                  <div className="stage-node node-orange">
                    <div className="node-content-left">
                      <div className="node-num num-orange">04</div>
                      <div>
                        <h4 className="node-title">IMPROVE</h4>
                        <p className="node-desc">Get practical suggestions</p>
                      </div>
                    </div>
                    <Lightbulb size={18} className="node-icon icon-orange" />
                  </div>

                  <div className="flow-arrow">↓</div>

                  {/* Node 5 */}
                  <div className="stage-node node-yellow">
                    <div className="node-content-left">
                      <div className="node-num num-yellow">05</div>
                      <div>
                        <h4 className="node-title">REPEAT</h4>
                        <p className="node-desc">Start your next week</p>
                      </div>
                    </div>
                    <RefreshCw size={18} className="node-icon icon-yellow" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — MAIN MESSAGE */}
            <div className="hero-right-col">
              {/* Eyebrow */}
              <div className="hero-eyebrow">
                <Sparkles size={14} />
                <span>YOUR WEEKLY WELLNESS COMPANION</span>
              </div>

              {/* Main Controlled Sized Headline */}
              <h1 className="hero-heading">
                Build a Better Week, <br />
                One <span className="accent-text">Loop</span> at a Time.
              </h1>

              {/* Short Supporting Paragraph */}
              <p className="hero-description">
                HabitLoop helps you understand your weekly wellness patterns, track healthy habits, and discover practical ways to improve your next week.
              </p>

              {/* Action Button — ONE Primary Hero CTA */}
              <div className="hero-btn-group">
                <Link to="/signup" className="btn btn-primary btn-lg btn-hero-pulse">
                  <span>Start My HabitLoop</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COMPACT SECTION BELOW THE HERO */}
      <section className="below-hero-section">
        <div className="container">
          <div className="below-hero-header">
            <h2 className="below-hero-title">
              Your week. Your patterns. Your next step.
            </h2>
            <p className="below-hero-subtitle">
              Three simple steps to build habits that fit your actual schedule.
            </p>
          </div>

          <div className="below-hero-grid">
            {/* Card 1 */}
            <div className="compact-card card-green">
              <div className="compact-badge badge-green">01</div>
              <h3 className="compact-title">CHECK IN</h3>
              <p className="compact-desc">
                Tell HabitLoop about your week and set realistic 7-day wellness baselines.
              </p>
            </div>

            {/* Card 2 */}
            <div className="compact-card card-blue">
              <div className="compact-badge badge-blue">02</div>
              <h3 className="compact-title">TRACK</h3>
              <p className="compact-desc">
                Build daily awareness through small, frictionless micro-actions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="compact-card card-purple">
              <div className="compact-badge badge-purple">03</div>
              <h3 className="compact-title">IMPROVE</h3>
              <p className="compact-desc">
                Use your weekly insights and personalized recommendations to plan your next week.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
