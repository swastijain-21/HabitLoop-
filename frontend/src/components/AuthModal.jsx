import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, RotateCcw, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleReset}>
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Brand Header */}
            <div className="text-center mb-6">
              <div className="logo-icon mx-auto mb-3">
                <RotateCcw size={22} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {mode === 'signup' ? 'Start Your 7-Day Loop' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signup' 
                  ? 'Join 25,000+ students building consistent wellness habits.' 
                  : 'Log in to view your weekly evaluation report.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-full mb-5 text-xs font-bold">
              <button 
                className={`flex-1 py-2 rounded-full transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                onClick={() => setMode('signup')}
              >
                Sign Up (Free)
              </button>
              <button 
                className={`flex-1 py-2 rounded-full transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
            </div>

            {/* Mock Social Buttons */}
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={handleSubmit} 
                className="btn btn-secondary w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Or with email</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="student@university.edu" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2">
                <span>{mode === 'signup' ? 'Create Free Account' : 'Log In to HabitLoop'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
              <Shield size={12} className="text-emerald-500" />
              <span>Free 7-day trial • No credit card required</span>
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome to HabitLoop!</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Your weekly wellness loop account has been created. Get ready for your first Sunday Check-in!
            </p>
            <button onClick={handleReset} className="btn btn-primary w-full">
              <span>Go to My Dashboard Demo</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
