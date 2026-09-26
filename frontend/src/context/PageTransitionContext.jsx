import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { RotateCcw, Sparkles } from 'lucide-react';

const PageTransitionContext = createContext();

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("Keeping your loop moving...");
  const [subText, setSubText] = useState("Preparing your next step...");

  const reactRouterNavigate = useReactRouterNavigate();
  const location = useLocation();
  const currentPathRef = useRef(location.pathname);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  // Primary navigation method with smooth HabitLoop transition
  const navigateWithTransition = (to, options = {}) => {
    if (isNavigatingRef.current) return; // Prevent double clicks during transition

    const targetPath = typeof to === 'string' ? to : to?.pathname;

    // If target path is identical to current path, do not trigger transition
    if (targetPath && targetPath === currentPathRef.current) return;

    // Respect user prefers-reduced-motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      reactRouterNavigate(to, options);
      return;
    }

    isNavigatingRef.current = true;
    setIsTransitioning(true);

    if (options.customText) {
      setTransitionText(options.customText);
    } else {
      setTransitionText("Keeping your loop moving...");
    }

    if (options.customSubText) {
      setSubText(options.customSubText);
    } else {
      setSubText("Preparing your next step...");
    }

    // Sequence timing (~0.95 second total):
    // 0ms: Overlay covers current screen cleanly
    // 350ms: Change route behind overlay
    // 950ms: Fade out overlay and complete transition
    setTimeout(() => {
      reactRouterNavigate(to, options);
    }, 350);

    setTimeout(() => {
      setIsTransitioning(false);
      isNavigatingRef.current = false;
    }, 950);
  };

  // Global anchor click interceptor for internal links (<Link>, <NavLink>, <a href="...">)
  useEffect(() => {
    const handleAnchorClick = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Check if it is an internal path link (starts with / and not external/hash)
      if (href && href.startsWith('/') && !href.startsWith('//') && anchor.target !== '_blank') {
        if (href !== currentPathRef.current) {
          e.preventDefault();
          navigateWithTransition(href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, navigateWithTransition }}>
      {children}
      <HabitLoopTransitionOverlay
        isTransitioning={isTransitioning}
        text={transitionText}
        subText={subText}
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

// Custom hook to replace useNavigate() for global page transitions
export function useAppNavigate() {
  const { navigateWithTransition } = usePageTransition();
  return navigateWithTransition;
}

// Visual HabitLoop Transition Overlay Component
function HabitLoopTransitionOverlay({ isTransitioning, text, subText }) {
  if (!isTransitioning) return null;

  return (
    <div
      className={`habitloop-transition-overlay ${isTransitioning ? 'active' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading next page"
    >
      <div className="habitloop-transition-card">
        {/* Animated Loop Ring Centerpiece */}
        <div className="habitloop-loop-container">
          <div className="habitloop-outer-glow" />
          <div className="habitloop-spinning-ring" />
          <div className="habitloop-spinning-ring-reverse" />
          <div className="habitloop-center-icon-box">
            <RotateCcw className="habitloop-icon-pulse" size={24} />
          </div>
        </div>

        {/* Text Hierarchy */}
        <div className="habitloop-transition-text-group">
          <div className="habitloop-transition-tag">
            <Sparkles size={13} />
            <span>HABITLOOP</span>
          </div>
          <h3 className="habitloop-transition-main-text">{text}</h3>
          <p className="habitloop-transition-sub-text">{subText}</p>
        </div>

        {/* Cycle Pill Bar */}
        <div className="habitloop-cycle-pill-bar">
          <span className="pill-step text-emerald">TRACK</span>
          <span className="pill-dot">•</span>
          <span className="pill-step text-teal">UNDERSTAND</span>
          <span className="pill-dot">•</span>
          <span className="pill-step text-purple">IMPROVE</span>
          <span className="pill-dot">•</span>
          <span className="pill-step text-amber">REPEAT</span>
        </div>
      </div>
    </div>
  );
}
