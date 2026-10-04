import { useState, useEffect } from 'react';

/**
 * Reusable configuration for the heading typing animation
 */
export const TYPING_ANIMATION_CONFIG = {
  headingText: 'Sridevi Sarees & Collections',
  typingSpeed: 105,     // ms per character typed
  deletingSpeed: 45,    // ms per character deleted
  pauseDuration: 1800,  // pause for ~1.8 seconds when full text is reached
  restartDelay: 350     // delay before restarting typing
};

/**
 * Helper to compute the next sliced string during typing or deleting
 * @param {string} fullText - The target string
 * @param {number} currentLength - Current character count
 * @param {boolean} isDeleting - Whether currently in deletion phase
 * @returns {string} The next substring to display
 */
export function getNextTypingText(fullText, currentLength, isDeleting) {
  if (!fullText) return '';
  if (!isDeleting) {
    return fullText.slice(0, Math.min(currentLength + 1, fullText.length));
  }
  return fullText.slice(0, Math.max(currentLength - 1, 0));
}

/**
 * Helper to check if user system prefers reduced motion
 * @returns {boolean}
 */
export function checkPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reusable React Hook for continuous single-letter typing and deleting animation
 * 
 * Features:
 * - Types character by character
 * - Pauses on completion
 * - Deletes character by character
 * - Restarts infinitely
 * - Respects prefers-reduced-motion for accessibility
 * - Proper cleanup with clearTimeout to avoid memory leaks
 * 
 * @param {string} targetText - The text to animate
 * @param {object} customConfig - Optional timing overrides
 * @returns {object} { displayedText, isTyping, isDeleting, fullText }
 */
export function useTypingAnimation(
  targetText = TYPING_ANIMATION_CONFIG.headingText,
  customConfig = {}
) {
  const config = {
    ...TYPING_ANIMATION_CONFIG,
    ...customConfig,
    headingText: targetText || TYPING_ANIMATION_CONFIG.headingText
  };

  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Accessibility: Respect user's prefers-reduced-motion OS setting
    if (checkPrefersReducedMotion()) {
      setDisplayedText(config.headingText);
      return;
    }

    let timeoutId;

    if (!isDeleting) {
      // 1. Typing forward character-by-character
      if (displayedText.length < config.headingText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(getNextTypingText(config.headingText, displayedText.length, false));
        }, config.typingSpeed);
      } else {
        // 2. Full text displayed: pause for 1-2 seconds
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, config.pauseDuration);
      }
    } else {
      // 3. Deleting backward character-by-character
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(getNextTypingText(config.headingText, displayedText.length, true));
        }, config.deletingSpeed);
      } else {
        // 4. Completely deleted: restart typing
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
        }, config.restartDelay);
      }
    }

    // Cleanup timer on every step/unmount
    return () => clearTimeout(timeoutId);
  }, [
    displayedText,
    isDeleting,
    config.headingText,
    config.typingSpeed,
    config.deletingSpeed,
    config.pauseDuration,
    config.restartDelay
  ]);

  return {
    displayedText,
    isTyping: !isDeleting,
    isDeleting,
    fullText: config.headingText
  };
}

export default useTypingAnimation;
