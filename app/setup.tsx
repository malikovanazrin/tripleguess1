import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

const CARD_OPTIONS = [30, 50, 80, 115] as const;

export default function SetupScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [selected, setSelected] = React.useState<number>(30);

  const handleStart = () => {
    dispatch({ type: 'START_GAME', cardCount: selected });
    router.replace('/round-intro');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Game Setup</Text>
          <Text style={styles.subtitle}>How many cards do you want to play with?</Text>
        </View>

        <View style={styles.optionsGrid}>
          {CARD_OPTIONS.map((count) => {
            const isSelected = selected === count;
            return (
              <TouchableOpacity
                key={count}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelected(count)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? [colors.primary, colors.primaryDark]
                      : ['#1c1c30', '#252540']
                  }
                  style={styles.optionGradient}
                >
                  <Text style={[styles.optionNumber, isSelected && styles.optionNumberSelected]}>
                    {count}
                  </Text>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    cards
                  </Text>
                  {isSelected && <View style={styles.checkDot} />}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            All cards are reshuffled and reused in each of the 3 rounds.
          </Text>
          <Text style={styles.infoText}>
            A full game with {selected} cards takes approximately{' '}
            <Text style={styles.infoHighlight}>
              {Math.round((selected * 3 * 15) / 60)} – {Math.round((selected * 3 * 30) / 60)} min
            </Text>
            .
          </Text>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryDark]}
            style={styles.startGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.startText}>Start Game</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

import React from 'react';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: height * 0.07,
    paddingBottom: height * 0.06,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: spacing.lg },
  backText: { color: colors.textSecondary, fontSize: 16 },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  optionCard: {
    width: '45%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  optionGradient: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  optionNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.textSecondary,
    lineHeight: 52,
  },
  optionNumberSelected: { color: colors.text },
  optionLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  optionLabelSelected: { color: 'rgba(255,255,255,0.8)' },
  checkDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  infoBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  infoHighlight: { color: colors.accent, fontWeight: '700' },
  startBtn: {
    borderRadius: radius.full,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
});
