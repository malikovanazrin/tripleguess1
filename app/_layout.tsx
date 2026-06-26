import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GameProvider } from '@/context/GameContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="round-intro" />
        <Stack.Screen name="turn-start" />
        <Stack.Screen name="active-turn" />
        <Stack.Screen name="turn-summary" />
        <Stack.Screen name="round-end" />
        <Stack.Screen name="final" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}
