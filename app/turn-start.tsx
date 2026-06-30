import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { ROUND_INFO } from '@/constants/game';
import { colors, spacing, radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function TurnStartScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const { currentTeam, currentRound, scores, deckForRound } = state;
  const info = ROUND_INFO[currentRound];

  const teamColor = currentTeam === 1 ? colors.team1 : colors.team2;
  const teamColorDark = currentTeam === 1 ? colors.primaryDark : colors.secondaryDark;
  const teamScore = currentTeam === 1 ? scores.team1 : scores.team2;

  const handleStart = () => {
    dispatch({ type: 'START_TURN' });
    router.replace('/active-turn');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.roundPill}>
          <Text style={styles.roundPillText}>
            Round {currentRound} · {info.name}
          </Text>
        </View>

        <View style={styles.centerSection}>
          <LinearGradient
            colors={[teamColor + '30', teamColor + '10']}
            style={styles.teamCircle}
          >
            <Text style={styles.teamEmoji}>{currentTeam === 1 ? '🔴' : '🟢'}</Text>
          </LinearGradient>
          <Text style={styles.label}>Pass the phone to the next player from</Text>
          <Text style={[styles.teamName, { color: teamColor }]}>Team {currentTeam}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Current score:</Text>
            <Text style={[styles.scoreValue, { color: teamColor }]}>{teamScore} pts</Text>
          </View>
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>{info.icon}</Text>
            <View>
              <Text style={styles.infoCardTitle}>This round</Text>
              <Text style={styles.infoCardRule}>{info.rule}</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🃏</Text>
            <View>
              <Text style={styles.infoCardTitle}>Cards remaining</Text>
              <Text style={styles.infoCardRule}>{deckForRound.length} cards in deck</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={[teamColor, teamColorDark]}
            style={styles.startGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.startText}>Start Turn</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.07,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundPill: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roundPillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  centerSection: { alignItems: 'center', gap: spacing.md },
  teamCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamEmoji: { fontSize: 56 },
  label: { fontSize: 18, color: colors.textSecondary },
  teamName: { fontSize: 52, fontWeight: '900', letterSpacing: -1 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scoreLabel: { fontSize: 16, color: colors.textSecondary },
  scoreValue: { fontSize: 22, fontWeight: '800' },
  infoCards: { width: '100%', gap: spacing.sm },
  infoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: { fontSize: 28 },
  infoCardTitle: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  infoCardRule: { fontSize: 14, color: colors.text, fontWeight: '600' },
  startBtn: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
