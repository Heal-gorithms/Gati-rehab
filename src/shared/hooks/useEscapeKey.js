import { useEffect } from 'react';

/**
 * Hook that listens for the 'Escape' key and calls a callback function.
 * @param {Function} onClose - The callback function to call when 'Escape' is pressed.
 * @param {boolean} isOpen - Only listen for 'Escape' when this is true.
 */
export const useEscapeKey = (onClose, isOpen) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
};

export default useEscapeKey;
