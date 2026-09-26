import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function Pricing({ onOpenAuth }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Student Free',
      price: '$0',
      period: 'Forever free',
      desc: 'Essential weekly loop tracking for individuals starting their wellness journey.',
      features: [
        'Core 7-Day Weekly Loop',
        'Track up to 5 habits',
        'Basic Weekly Evaluation Score',
        '1 Squad Membership',
        '14-Day History Storage'
      ],
      ctaText: 'Start Free Loop',
      buttonStyle: 'btn-secondary',
      featured: false
    },
    {
      name: 'HabitLoop Pro',
      price: annual ? '$3.99' : '$4.99',
      period: annual ? 'per month, billed annually ($47.88/yr)' : 'per month, billed monthly',
      desc: 'Full AI co-pilot, burnout early warnings, and unlimited habit tracking.',
      features: [
        'Everything in Free Plan',
        'AI Weekly Co-Pilot Insights',
        'Burnout Early-Warning Alerts',
        'Unlimited Habits & Custom Pillars',
        'Apple Health & Google Fit Sync',
        'Forgiving Streak Recovery Shield',
        'Unlimited Historical Analytics'
      ],
      ctaText: 'Get Pro 7-Day Free Trial',
      buttonStyle: 'btn-primary',
      featured: true,
      ribbonText: 'Most Popular'
    },
    {
      name: 'Campus Squad',
      price: annual ? '$7.99' : '$9.99',
      period: annual ? 'per month, billed annually' : 'per month, billed monthly',
      desc: 'Designed for dorms, clubs, study groups, and campus athletic teams.',
      features: [
        'Everything in Pro Plan',
        'Up to 10 Squad Members Included',
        'Private Squad Leaderboards',
        'Group Challenge Badges',
        'Weekly Squad AI Digest',
        'Priority 24/7 Support'
      ],
      ctaText: 'Start Squad Loop',
      buttonStyle: 'btn-blue',
      featured: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-slate-50">
      <div className="container">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="section-tag tag-blue">
            <Sparkles size={14} />
            <span>Transparent Pricing</span>
          </div>
          <h2>Invest in Your Weekly Growth</h2>
          <p className="text-slate-600 mt-2 text-lg">
            Start with our generous free plan or unlock the AI Co-pilot with student-friendly pricing.
          </p>

          {/* Billing Toggle */}
          <div className="pricing-toggle">
            <button 
              className={`toggle-option ${!annual ? 'active' : ''}`}
              onClick={() => setAnnual(false)}
            >
              Monthly Billing
            </button>
            <button 
              className={`toggle-option ${annual ? 'active' : ''}`}
              onClick={() => setAnnual(true)}
            >
              Annual Billing <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((p, idx) => (
            <div key={idx} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
              {p.ribbonText && <div className="ribbon">{p.ribbonText}</div>}
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{p.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{p.desc}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                  <span className="text-xs font-semibold text-slate-500">{p.period}</span>
                </div>

                <div className="border-t border-slate-100 my-5 pt-5">
                  <ul className="flex flex-col gap-3">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <Check size={16} className="text-emerald-500 shrink-0" strokeWidth={3} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => onOpenAuth('signup')} 
                className={`btn ${p.buttonStyle} w-full mt-6`}
              >
                <span>{p.ctaText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
