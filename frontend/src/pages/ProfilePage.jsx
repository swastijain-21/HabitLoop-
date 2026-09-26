import React, { useState } from 'react';
import { User, Mail, Briefcase, GraduationCap, Laptop, BookOpen, Building, Palette, Clock, LogOut, ArrowLeft, CheckCircle2, Sparkles, Target, Edit3, X, Check, Moon, Droplets, Zap, Apple, HeartHandshake, Smartphone, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppNavigate as useNavigate } from '../context/PageTransitionContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, updateUserName, onboardingData, setOnboardingData, updateUserEmail, signOut } = useUser();

  const routineOptions = [
    { title: 'Student', icon: GraduationCap },
    { title: 'Working Professional', icon: Briefcase },
    { title: 'Remote Worker / Freelancer', icon: Laptop },
    { title: 'Researcher / Academic', icon: BookOpen },
    { title: 'Entrepreneur / Business Owner', icon: Building },
    { title: 'Creative Professional', icon: Palette },
    { title: 'Other / Flexible Routine', icon: Clock },
  ];

  const focusAreasOptions = [
    { id: 'sleep', title: 'Sleep', emoji: '🌙', label: '🌙 Sleep' },
    { id: 'hydration', title: 'Hydration', emoji: '💧', label: '💧 Hydration' },
    { id: 'movement', title: 'Movement', emoji: '🏃', label: '🏃 Movement' },
    { id: 'nutrition', title: 'Nutrition', emoji: '🥗', label: '🥗 Nutrition' },
    { id: 'mind', title: 'Mind & Mood', emoji: '🧠', label: '🧠 Mind & Mood' },
    { id: 'screen', title: 'Screen Time', emoji: '📱', label: '📱 Screen Time' },
    { id: 'study', title: 'Study & Work Balance', emoji: '📚', label: '📚 Study & Work Balance' },
    { id: 'social', title: 'Social Balance', emoji: '👥', label: '👥 Social Balance' }
  ];

  const goalOptions = [
    { id: 'g1', title: 'Improve sleep consistency', icon: '🌙' },
    { id: 'g2', title: 'Drink more water', icon: '💧' },
    { id: 'g3', title: 'Move more throughout the day', icon: '🏃' },
    { id: 'g4', title: 'Take regular breaks', icon: '🧘' },
    { id: 'g5', title: 'Manage stress & fatigue', icon: '🧠' },
    { id: 'g6', title: 'Improve study/work balance', icon: '📚' },
    { id: 'g7', title: 'Spend less time on screens', icon: '📱' }
  ];

  const currentRole = onboardingData?.workStyle || onboardingData?.role || 'Student';
  const currentName = user?.name || '';
  const currentEmail = user?.email || '';
  const currentFocusAreas = onboardingData?.focusAreas || ['🌙 Sleep', '💧 Hydration', '🏃 Movement'];
  const currentGoals = onboardingData?.goals || ['Improve sleep consistency', 'Drink more water'];

  // Active inline field editing state: null | 'name' | 'email' | 'role' | 'focus' | 'goals'
  const [editingField, setEditingField] = useState(null);
  
  // Temporary edit states
  const [tempName, setTempName] = useState(currentName);
  const [tempEmail, setTempEmail] = useState(currentEmail);
  const [tempRole, setTempRole] = useState(currentRole);
  const [tempFocusAreas, setTempFocusAreas] = useState(currentFocusAreas);
  const [tempGoals, setTempGoals] = useState(currentGoals);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // --- SAVE / CANCEL HANDLERS ---
  
  // 1. Save Full Name
  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (!trimmed) {
      showNotification('Name cannot be empty.', true);
      return;
    }
    if (updateUserName) {
      updateUserName(trimmed);
    } else {
      setUser(prev => ({ ...prev, name: trimmed }));
    }
    setEditingField(null);
    showNotification('✓ Full name updated successfully!');
  };

  const handleCancelName = () => {
    setTempName(currentName);
    setEditingField(null);
  };

  // 2. Save Email Address
  const handleSaveEmail = () => {
    if (updateUserEmail) {
      const res = updateUserEmail(tempEmail);
      if (res && res.error) {
        showNotification(res.error, true);
        return;
      }
    } else {
      setUser(prev => ({ ...prev, email: tempEmail.trim() }));
    }
    setEditingField(null);
    showNotification('✓ Email address updated successfully!');
  };

  const handleCancelEmail = () => {
    setTempEmail(currentEmail);
    setEditingField(null);
  };

  // 3. Save Lifestyle / Work Style
  const handleSaveRole = () => {
    setOnboardingData(prev => ({
      ...prev,
      role: tempRole,
      workStyle: tempRole,
    }));
    setEditingField(null);
    showNotification(`✓ Lifestyle updated to ${tempRole}!`);
  };

  const handleCancelRole = () => {
    setTempRole(currentRole);
    setEditingField(null);
  };

  // 4. Save Focus Areas
  const handleToggleFocusArea = (areaLabel) => {
    setTempFocusAreas(prev => 
      prev.includes(areaLabel) ? prev.filter(a => a !== areaLabel) : [...prev, areaLabel]
    );
  };

  const handleSaveFocus = () => {
    if (tempFocusAreas.length === 0) {
      showNotification('Select at least one focus area.', true);
      return;
    }
    setOnboardingData(prev => ({
      ...prev,
      focusAreas: tempFocusAreas,
    }));
    setEditingField(null);
    showNotification('✓ Wellness focus areas updated!');
  };

  const handleCancelFocus = () => {
    setTempFocusAreas(currentFocusAreas);
    setEditingField(null);
  };

  // 5. Save Habit Goals
  const handleToggleGoal = (goalTitle) => {
    setTempGoals(prev => 
      prev.includes(goalTitle) ? prev.filter(g => g !== goalTitle) : [...prev, goalTitle]
    );
  };

  const handleSaveGoals = () => {
    if (tempGoals.length === 0) {
      showNotification('Select at least one habit goal.', true);
      return;
    }
    setOnboardingData(prev => ({
      ...prev,
      goals: tempGoals,
    }));
    setEditingField(null);
    showNotification('✓ Habit goals updated!');
  };

  const handleCancelGoals = () => {
    setTempGoals(currentGoals);
    setEditingField(null);
  };

  const handleSignOut = () => {
    if (signOut) signOut();
    navigate('/');
  };

  const displayName = (user.name && user.name.trim()) ? user.name.trim() : 'Guest User';

  return (
    <div className="app-page-wrapper">
      <div className="app-page-container">
        
        {/* Header */}
        <section className="coach-header">
          <div className="coach-tag">
            <User size={16} />
            <span>MY HABITLOOP ACCOUNT & SETTINGS</span>
          </div>

          <h1 className="coach-title">
            User Profile & Routine 👤
          </h1>

          <p className="coach-subtitle">
            Manage your personal profile, lifestyle context, and loop preferences.
          </p>
        </section>

        {successMsg && (
          <div className="save-success-alert" style={{ marginBottom: '16px' }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="auth-error-alert" style={{ marginBottom: '16px', fontSize: '13.5px', padding: '12px 16px' }}>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="coach-main-card" style={{ gap: '24px' }}>
          
          {/* USER INFO GRID (FULL NAME & EMAIL) */}
          <div className="exp-page-details-grid">
            
            {/* 1. FULL NAME CARD */}
            <div className="exp-page-detail-card" style={{ background: '#ffffff', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#10b981" />
                  <span>FULL NAME</span>
                </span>

                {editingField !== 'name' && (
                  <button
                    type="button"
                    onClick={() => { setTempName(currentName); setEditingField('name'); }}
                    className="profile-field-edit-btn"
                    title="Edit Full Name"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editingField === 'name' ? (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="form-input"
                    style={{ height: '40px', fontSize: '14px' }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={handleCancelName} className="btn-edit-cancel">
                      <X size={13} /> Cancel
                    </button>
                    <button type="button" onClick={handleSaveName} className="btn-edit-save">
                      <Check size={13} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '4px 0 0 0' }}>
                  {displayName}
                </p>
              )}
            </div>

            {/* 2. EMAIL ADDRESS CARD (Account Identity - Read-only to protect key consistency) */}
            <div className="exp-page-detail-card" style={{ background: '#ffffff', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#3b82f6" />
                  <span>EMAIL ADDRESS</span>
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                  Account Identity • Read-only
                </span>
              </div>

              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '4px 0 0 0' }}>
                {user.email || 'guest@habitloop.app'}
              </p>
            </div>

          </div>

          {/* 3. LIFESTYLE / WORK STYLE SELECTION */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Briefcase size={15} color="#8b5cf6" />
                <span>CURRENT LIFESTYLE / WORK STYLE</span>
              </span>

              {editingField !== 'role' && (
                <button
                  type="button"
                  onClick={() => { setTempRole(currentRole); setEditingField('role'); }}
                  className="profile-field-edit-btn"
                >
                  <Edit3 size={13} />
                  <span>Edit Lifestyle</span>
                </button>
              )}
            </div>

            {editingField === 'role' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="onboarding-cards-stack" style={{ gap: '8px' }}>
                  {routineOptions.map((opt) => {
                    const isSelected = tempRole === opt.title;
                    const IconComp = opt.icon;
                    return (
                      <div
                        key={opt.title}
                        onClick={() => setTempRole(opt.title)}
                        className={`selectable-card role-card ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '10px 14px' }}
                      >
                        <div className="card-left-group">
                          <div className={`card-icon-box ${isSelected ? 'box-green' : 'box-slate'}`}>
                            <IconComp size={16} />
                          </div>
                          <h3 className="card-item-title" style={{ fontSize: '13.5px' }}>{opt.title}</h3>
                        </div>

                        <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleCancelRole} className="btn-edit-cancel">
                    <X size={13} /> Cancel
                  </button>
                  <button type="button" onClick={handleSaveRole} className="btn-edit-save">
                    <Check size={13} /> Save Lifestyle
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div className="card-icon-box box-green" style={{ width: '36px', height: '36px' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                    {currentRole}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Influences your AI Coach weekly recommendations
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. FOCUS AREAS */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Target size={15} color="#f59e0b" />
                <span>SELECTED FOCUS AREAS</span>
              </span>

              {editingField !== 'focus' && (
                <button
                  type="button"
                  onClick={() => { setTempFocusAreas(currentFocusAreas); setEditingField('focus'); }}
                  className="profile-field-edit-btn"
                >
                  <Edit3 size={13} />
                  <span>Edit Focus Areas</span>
                </button>
              )}
            </div>

            {editingField === 'focus' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="onboarding-grid-two-col" style={{ gap: '10px' }}>
                  {focusAreasOptions.map((area) => {
                    const isSelected = tempFocusAreas.includes(area.label);
                    return (
                      <div
                        key={area.id}
                        onClick={() => handleToggleFocusArea(area.label)}
                        className={`selectable-card grid-area-card ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '10px 14px' }}
                      >
                        <div className="card-left-group">
                          <span className="emoji-badge" style={{ fontSize: '16px' }}>{area.emoji}</span>
                          <h3 className="card-item-title text-sm" style={{ fontSize: '13px' }}>{area.title}</h3>
                        </div>
                        <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleCancelFocus} className="btn-edit-cancel">
                    <X size={13} /> Cancel
                  </button>
                  <button type="button" onClick={handleSaveFocus} className="btn-edit-save">
                    <Check size={13} /> Save Focus Areas
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {currentFocusAreas.map((area, idx) => (
                  <span key={idx} style={{ padding: '6px 14px', borderRadius: '20px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '12.5px', fontWeight: '700' }}>
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 5. HABIT GOALS */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="exp-page-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Sparkles size={15} color="#10b981" />
                <span>HABIT GOALS</span>
              </span>

              {editingField !== 'goals' && (
                <button
                  type="button"
                  onClick={() => { setTempGoals(currentGoals); setEditingField('goals'); }}
                  className="profile-field-edit-btn"
                >
                  <Edit3 size={13} />
                  <span>Edit Goals</span>
                </button>
              )}
            </div>

            {editingField === 'goals' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="onboarding-cards-stack" style={{ gap: '8px' }}>
                  {goalOptions.map((g) => {
                    const isSelected = tempGoals.includes(g.title);
                    return (
                      <div
                        key={g.id}
                        onClick={() => handleToggleGoal(g.title)}
                        className={`selectable-card goal-card ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '10px 14px' }}
                      >
                        <div className="card-left-group">
                          <span className="emoji-badge" style={{ fontSize: '16px' }}>{g.icon}</span>
                          <h3 className="card-item-title" style={{ fontSize: '13.5px' }}>{g.title}</h3>
                        </div>
                        <div className={`card-check-indicator ${isSelected ? 'check-active' : ''}`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleCancelGoals} className="btn-edit-cancel">
                    <X size={13} /> Cancel
                  </button>
                  <button type="button" onClick={handleSaveGoals} className="btn-edit-save">
                    <Check size={13} /> Save Goals
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentGoals.map((g, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#334155', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <Sparkles size={14} color="#10b981" />
                    <span style={{ fontWeight: '600' }}>{g}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIGN OUT CTA BAR */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-coach-back"
            >
              <ArrowLeft size={15} />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={16} />
              <span>Sign Out ({displayName})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
