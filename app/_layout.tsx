import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GameProvider } from '@/context/GameContext';

const BG = '#0f0f1a';
const screenOpts = { contentStyle: { backgroundColor: BG } };

export default function RootLayout() {
  useFrameworkReady();

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <GameProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: BG } }}>
          <Stack.Screen name="index" options={screenOpts} />
          <Stack.Screen name="setup" options={screenOpts} />
          <Stack.Screen name="draft-intro" options={screenOpts} />
          <Stack.Screen name="draft" options={screenOpts} />
          <Stack.Screen name="round-intro" options={screenOpts} />
          <Stack.Screen name="turn-start" options={screenOpts} />
          <Stack.Screen name="active-turn" options={screenOpts} />
          <Stack.Screen name="turn-summary" options={screenOpts} />
          <Stack.Screen name="round-end" options={screenOpts} />
          <Stack.Screen name="final" options={screenOpts} />
          <Stack.Screen name="+not-found" options={screenOpts} />
        </Stack>
        <StatusBar style="light" />
      </GameProvider>
    </View>
  );
}
