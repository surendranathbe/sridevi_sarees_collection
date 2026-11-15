import React, { useState, useEffect } from 'react';

/**
 * ScrollProgressCircle
 * Stationary floating circular widget placed at the bottom of the website.
 * Animates a circular SVG progress track showing the percentage (0% - 100%)
 * as the user scrolls from top to bottom.
 * Clicking the circle smoothly scrolls the page back to the top.
 */
const ScrollProgressCircle = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const docElem = document.documentElement;
      const docBody = document.body;
      const scrollHeight = Math.max(
        docElem.scrollHeight,
        docBody.scrollHeight,
        docElem.offsetHeight,
        docBody.offsetHeight,
        docElem.clientHeight
      );
      const clientHeight = window.innerHeight || docElem.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const currentScroll = window.scrollY || docElem.scrollTop || docBody.scrollTop || 0;
      const progress = Math.min(
        100,
        Math.max(0, Math.round((currentScroll / totalScrollable) * 100))
      );
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 21;
  const circumference = 2 * Math.PI * radius; // ~131.95
  const strokeDashoffset = circumference - (circumference * scrollProgress) / 100;

  return (
    <div className="scroll-progress-static-wrap" aria-live="polite">
      <button
        type="button"
        className="scroll-progress-static-btn"
        onClick={handleScrollToTop}
        title={`Page Scrolled: ${scrollProgress}% • Click to return to top`}
        aria-label={`Scroll progress: ${scrollProgress} percent. Click to return to top`}
      >
        <svg
          className="scroll-progress-svg"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="scrollRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfb76c" />
              <stop offset="100%" stopColor="#c6923e" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            className="scroll-track-circle"
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="rgba(223, 183, 108, 0.22)"
            strokeWidth="3.2"
          />

          {/* Animated Progress Ring */}
          <circle
            className="scroll-fill-circle"
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="url(#scrollRingGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 26 26)"
          />
        </svg>

        {/* Center Static Percentage Display */}
        <span className="scroll-progress-percent">
          {scrollProgress}%
        </span>
      </button>
    </div>
  );
};

export default ScrollProgressCircle;
