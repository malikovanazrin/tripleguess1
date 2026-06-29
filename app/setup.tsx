import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function SetupScreen() {
  const router = useRouter();
  const { dispatch } = useGame();
  const [cardCount, setCardCount] = useState('40');

  const parsed = parseInt(cardCount, 10);
  const isValid = !isNaN(parsed) && parsed >= 1 && parsed <= 115;

  const handleStart = () => {
    if (!isValid) return;
    dispatch({ type: 'START_GAME', cardCount: parsed });
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

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={cardCount}
            onChangeText={setCardCount}
            maxLength={3}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
          />
          <Text style={styles.hint}>Recommended: 40–50 cards</Text>
          {!isValid && cardCount !== '' && (
            <Text style={styles.error}>Please enter a number between 1 and 115</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            All cards are reshuffled and reused in each of the 3 rounds.
          </Text>
          {isValid && (
            <Text style={styles.infoText}>
              A full game with {parsed} cards takes approximately{' '}
              <Text style={styles.infoHighlight}>
                {Math.round((parsed * 3 * 15) / 60)}–{Math.round((parsed * 3 * 30) / 60)} min
              </Text>
              .
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.startBtn, !isValid && styles.startBtnDisabled]}
          onPress={handleStart}
          activeOpacity={0.85}
          disabled={!isValid}
        >
          <LinearGradient
            colors={isValid ? [colors.secondary, colors.secondaryDark] : ['#444', '#333']}
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
  inputSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    width: 140,
    height: 100,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#1c1c30',
    color: colors.text,
    fontSize: 52,
    fontWeight: '900',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    fontSize: 13,
    color: '#ff6b6b',
    marginTop: spacing.xs,
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
  startBtnDisabled: { opacity: 0.5 },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
});