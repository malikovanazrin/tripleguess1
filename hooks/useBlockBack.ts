import { useEffect, useCallback } from 'react';
import { BackHandler, Platform, Alert } from 'react-native';

export function useBlockBack(onLeave?: () => void) {
  const showConfirm = useCallback(() => {
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
  }, [onLeave]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Warn when user tries to refresh or close the tab
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    } else {
      // Android: intercept hardware back button
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        showConfirm();
        return true;
      });
      return () => sub.remove();
    }
  }, [showConfirm]);
}
