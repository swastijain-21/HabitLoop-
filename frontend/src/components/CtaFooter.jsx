import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Globe,
  MessageSquare,
  Share2,
  Heart
} from 'lucide-react';

export default function CtaFooter({ onOpenAuth }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <>
      {/* CTA Banner */}
      <section className="section-padding bg-slate-50">
        <div className="container">
          <div className="cta-banner">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>Start Your 7-Day Free Trial</span>
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-4">
                Ready to Close Your First Weekly Loop?
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
                Join 25,000+ students building consistent, pressure-free habits that last. No credit card required.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="cta-input-group">
                  <input 
                    type="email" 
                    placeholder="Enter your student or personal email..." 
                    className="cta-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-lg">
                    <span>Get Early Access</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl max-w-md mx-auto text-emerald-200 font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span>🎉 Welcome aboard! Check your inbox to launch your loop.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand info */}
            <div className="pr-4">
              <a href="#" className="logo-brand mb-4 inline-flex">
                <div className="logo-icon">
                  <RotateCcw size={22} />
                </div>
                <span>Habit<span className="gradient-text-green">Loop</span></span>
              </a>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                The weekly wellness feedback loop designed for students and young adults. Transform habits through continuous 7-day iteration.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <a href="#" className="hover:text-emerald-600 transition-colors" title="Global Community">
                  <Globe size={20} />
                </a>
                <a href="#" className="hover:text-emerald-600 transition-colors" title="Share HabitLoop">
                  <Share2 size={20} />
                </a>
                <a href="#" className="hover:text-emerald-600 transition-colors" title="Discord Community">
                  <MessageSquare size={20} />
                </a>
                <a href="#" className="hover:text-emerald-600 transition-colors" title="Wellness Mission">
                  <Heart size={20} />
                </a>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="footer-col">
              <h4 className="font-extrabold text-slate-900">Product</h4>
              <ul className="footer-links">
                <li><a href="#how-it-works">Weekly Loop Cycle</a></li>
                <li><a href="#loop-simulator">Score Simulator</a></li>
                <li><a href="#features">AI Co-Pilot</a></li>
                <li><a href="#pricing">Student Pricing</a></li>
                <li><a href="#pricing">Squad Loops</a></li>
              </ul>
            </div>

            {/* Col 3: Wellness Pillars */}
            <div className="footer-col">
              <h4 className="font-extrabold text-slate-900">Wellness Pillars</h4>
              <ul className="footer-links">
                <li><a href="#wellness-pillars">Mind & Focus</a></li>
                <li><a href="#wellness-pillars">Body & Movement</a></li>
                <li><a href="#wellness-pillars">Sleep & Recovery</a></li>
                <li><a href="#wellness-pillars">Hydration & Fuel</a></li>
                <li><a href="#wellness-pillars">Social & Balance</a></li>
              </ul>
            </div>

            {/* Col 4: Resources & Legal */}
            <div className="footer-col">
              <h4 className="font-extrabold text-slate-900">Resources</h4>
              <ul className="footer-links">
                <li><a href="#faq">FAQ & Support</a></li>
                <li><a href="#">Student Discount</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Campus Ambassadorship</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <p>© {new Date().getFullYear()} HabitLoop Inc. Built with ❤️ for student wellness.</p>
            <p>Designed with vanilla CSS & React Vite.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
