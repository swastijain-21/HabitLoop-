import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { RotateCcw, Menu, X, ArrowRight, User, Sparkles, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  const isOnboarding = location.pathname === '/onboarding';
  const isAppDashboardFlow = ['/dashboard', '/checkin', '/evaluation', '/recommendations', '/experiment', '/profile'].includes(location.pathname);

  const displayName = (user.name && user.name.trim()) ? user.name.trim() : 'there';
  const isLoggedInState = user.isLoggedIn || isAppDashboardFlow;

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    setMobileMenuOpen(false);
    if (signOut) signOut();
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container">
        <div className="navbar-inner">
          {/* LEFT: Brand Logo */}
          <Link to="/" className="logo-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon">
              <RotateCcw size={22} />
            </div>
            <span>Habit<span className="gradient-text-green">Loop</span></span>
          </Link>

          {/* CENTER: Navigation Links */}
          {isOnboarding ? (
            <div className="setup-nav-indicator">
              <Sparkles size={14} className="text-emerald-500" />
              <span>Personal Setup</span>
            </div>
          ) : !isLoggedInState ? (
            <nav className="nav-links">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                How It Works
              </NavLink>
            </nav>
          ) : (
            <nav className="nav-links">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/checkin" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Weekly Check-in
              </NavLink>
              <NavLink 
                to="/evaluation" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Review
              </NavLink>
              <NavLink 
                to="/experiment" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Experiment
              </NavLink>
            </nav>
          )}

          {/* RIGHT: Log In & Sign Up / User Profile & Sign Out */}
          <div className="nav-actions">
            {isOnboarding ? (
              <span className="setup-badge">Guided Setup</span>
            ) : !isLoggedInState ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <div className="user-profile-actions-group">
                <Link to="/profile" className="btn btn-primary btn-sm user-badge-link" title="My Profile & Settings">
                  <User size={16} />
                  <span>{displayName}'s Loop</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSignOutModal(true)}
                  className="btn btn-secondary btn-sm btn-signout-trigger"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle (Only if not onboarding) */}
            {!isOnboarding && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && !isOnboarding && (
        <div className="mobile-drawer">
          <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</NavLink>
          {isLoggedInState && <NavLink to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>}
          <div className="mobile-drawer-actions">
            {isLoggedInState ? (
              <button
                onClick={() => { setMobileMenuOpen(false); setShowSignOutModal(true); }}
                className="btn btn-secondary w-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', borderColor: '#fca5a5' }}
              >
                <LogOut size={16} />
                <span>Sign Out ({displayName})</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>Sign Up →</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION DIALOG */}
      {showSignOutModal && (
        <div className="signout-modal-backdrop" onClick={() => setShowSignOutModal(false)}>
          <div className="signout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="signout-modal-icon">
              <LogOut size={22} />
            </div>
            <h3 className="signout-modal-title">Sign out of HabitLoop?</h3>
            <p className="signout-modal-text">
              Are you sure you want to sign out? You can log back in anytime to continue your loop.
            </p>
            <div className="signout-modal-actions">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="btn btn-primary btn-sm btn-danger-signout"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
