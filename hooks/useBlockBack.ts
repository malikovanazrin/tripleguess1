import { useEffect } from 'react';
import { BackHandler, Platform, Alert } from 'react-native';

export function useBlockBack(onLeave?: () => void) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: do nothing — can't reliably block browser back without breaking router
      // The active-turn screen handles this separately with pause modal
      return;
    } else {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (onLeave) {
          Alert.alert(
            'Leave Game?',
            'Are you sure you want to leave? Your progress will be lost.',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Leave', style: 'destructive', onPress: onLeave },
            ]
          );
        }
        return true; // always block, alert handles navigation
      });
      return () => sub.remove();
    }
  }, [onLeave]);
}
