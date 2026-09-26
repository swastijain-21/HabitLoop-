import React from 'react';
import { Star, Quote, Sparkles, TrendingUp } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Maya Lin',
      role: 'Stanford Student • Bioengineering',
      beforeScore: 58,
      afterScore: 92,
      quote: 'Before HabitLoop, I was failing my daily habit streaks every exam week and quitting. Switching to a weekly loop changed everything. I can take rest days without feeling guilty!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Jordan Rivera',
      role: 'Software Engineer & Distance Runner',
      beforeScore: 64,
      afterScore: 95,
      quote: 'The AI Weekly Evaluation accurately spotted that missing hydration was causing my 3 PM code slumps. Fixed that one habit and my energy shot up 30%.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Priya Sharma',
      role: 'Pre-Med Senior • Squad Leader',
      beforeScore: 61,
      afterScore: 89,
      quote: 'Our dorm squad runs weekly loops together on HabitLoop. Competing for the highest weekly wellness score keeps us accountable during midterms.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="section-tag tag-green">
            <Sparkles size={14} />
            <span>Community Stories</span>
          </div>
          <h2>Loved by 25,000+ Students & Youth</h2>
          <p className="text-slate-600 mt-2 text-lg">
            See how real people swapped rigid daily streak pressure for sustainable weekly habit growth.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="testimonials-grid">
          {reviews.map((r, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span>{r.beforeScore} ➔ {r.afterScore} Score</span>
                  </div>
                </div>

                <p className="text-slate-700 italic text-sm leading-relaxed mb-4">
                  "{r.quote}"
                </p>
              </div>

              <div className="user-profile">
                <img src={r.avatar} alt={r.name} className="avatar-img" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{r.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
