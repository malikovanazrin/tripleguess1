import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

export function useBlockBack() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Push a dummy state so there's something to go "back" to
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        // Push again to prevent going back
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    } else {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }
  }, []);
}
