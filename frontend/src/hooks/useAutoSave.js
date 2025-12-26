import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debounced auto-save functionality
 * @param {Function} saveFunction - Function to call for saving
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 */
export const useAutoSave = (saveFunction, delay = 500) => {
  const timeoutRef = useRef(null);

  const debouncedSave = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveFunction(...args);
      }, delay);
    },
    [saveFunction, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
};
