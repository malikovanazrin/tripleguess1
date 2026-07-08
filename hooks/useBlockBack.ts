import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useBlockBack(onLeave?: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Warn on refresh / tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Trap the back button: push a sentinel state on mount
    window.history.pushState({ tgGuard: true }, '');

    const handlePopState = (event: PopStateEvent) => {
      // A back press consumed our sentinel. Ask the user.
      const leave = window.confirm(
        'Are you sure you want to leave the game? Your progress will be lost.'
      );
      if (leave) {
        // Clean up listeners first
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        // Reset game state (onLeave does dispatch RESET). We ignore its router
        // navigation on web and instead let the browser go back naturally.
        if (onLeave) onLeave();
      } else {
        // Stay: re-push the sentinel so the next back press is caught again
        window.history.pushState({ tgGuard: true }, '');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onLeave]);
}
