import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  // Minimal footer on onboarding page
  if (isOnboarding) {
    return (
      <footer className="py-6 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© {new Date().getFullYear()} HabitLoop. Personal Setup Flow.</p>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <Link to="/" className="logo-brand">
            <div className="logo-icon">
              <RotateCcw size={20} />
            </div>
            <span>Habit<span className="gradient-text-green">Loop</span></span>
          </Link>

          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</Link>
            <Link to="/login" className="hover:text-emerald-600 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-emerald-600 transition-colors">Sign Up</Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} HabitLoop. Designed for weekly habit reflection and growth.</p>
          <p className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 font-medium">Demo Interactive Frontend</p>
        </div>
      </div>
    </footer>
  );
}
