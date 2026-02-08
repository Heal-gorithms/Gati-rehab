
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';

/**
 * Hook to automatically log out user after a period of inactivity
 * @param {number} timeoutMs - Timeout in milliseconds (default 30 minutes)
 */
export const useSessionTimeout = (timeoutMs = 30 * 60 * 1000) => {
  const { user, logout } = useAuth();
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (user) {
      timerRef.current = setTimeout(() => {
        console.log('[SessionTimeout] User inactive for 30 minutes. Logging out.');
        logout();
      }, timeoutMs);
    }
  }, [user, logout, timeoutMs]);

  useEffect(() => {
    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Set initial timer
    resetTimer();

    // List of events to listen for
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, resetTimer]);
};

export default useSessionTimeout;
