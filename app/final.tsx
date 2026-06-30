import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function FinalScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const { scores } = state;

  const team1Wins = scores.team1 > scores.team2;
  const team2Wins = scores.team2 > scores.team1;
  const tied = scores.team1 === scores.team2;

  const winnerColor = team1Wins ? colors.team1 : team2Wins ? colors.team2 : colors.accent;
  const winnerLabel = tied ? "It's a Tie!" : `Team ${team1Wins ? 1 : 2} Wins!`;
  const diff = Math.abs(scores.team1 - scores.team2);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET' });
    router.replace('/setup');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Text style={styles.trophyEmoji}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={[styles.winnerLabel, { color: winnerColor }]}>{winnerLabel}</Text>
          {!tied && (
            <Text style={styles.winnerSub}>
              by {diff} point{diff !== 1 ? 's' : ''}
            </Text>
          )}
          {tied && (
            <Text style={styles.winnerSub}>Both teams scored equally. Remarkable!</Text>
          )}
        </View>

        <View style={styles.podium}>
          {/* Team 2 */}
          <View style={styles.podiumTeam}>
            <LinearGradient
              colors={[colors.team2 + '30', colors.team2 + '10']}
              style={[
                styles.podiumCard,
                team2Wins && styles.podiumCardWinner,
                { borderColor: team2Wins ? colors.team2 : colors.border },
              ]}
            >
              {team2Wins && <Text style={styles.podiumCrown}>👑</Text>}
              <Text style={styles.podiumTeamLabel}>Team 2</Text>
              <Text style={[styles.podiumScore, { color: colors.team2 }]}>{scores.team2}</Text>
              <Text style={styles.podiumPts}>pts</Text>
            </LinearGradient>
          </View>

          {/* VS */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Team 1 */}
          <View style={styles.podiumTeam}>
            <LinearGradient
              colors={[colors.team1 + '30', colors.team1 + '10']}
              style={[
                styles.podiumCard,
                team1Wins && styles.podiumCardWinner,
                { borderColor: team1Wins ? colors.team1 : colors.border },
              ]}
            >
              {team1Wins && <Text style={styles.podiumCrown}>👑</Text>}
              <Text style={styles.podiumTeamLabel}>Team 1</Text>
              <Text style={[styles.podiumScore, { color: colors.team1 }]}>{scores.team1}</Text>
              <Text style={styles.podiumPts}>pts</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Final Scoreboard</Text>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.team1 }]} />
              <Text style={styles.breakdownLabel}>Team 1</Text>
              <Text style={[styles.breakdownScore, { color: colors.team1 }]}>{scores.team1} pts</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: colors.team2 }]} />
              <Text style={styles.breakdownLabel}>Team 2</Text>
              <Text style={[styles.breakdownScore, { color: colors.team2 }]}>{scores.team2} pts</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.playAgainBtn} onPress={handlePlayAgain} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.playAgainGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.playAgainText}>Play Again</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: height * 0.1,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
    alignItems: 'center',
  },
  topSection: { alignItems: 'center', gap: spacing.sm },
  trophyEmoji: { fontSize: 80 },
  winnerLabel: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
  winnerSub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: spacing.sm,
  },
  podiumTeam: { flex: 1 },
  podiumCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    gap: 2,
    paddingTop: spacing.xl + spacing.sm,
    position: 'relative',
  },
  podiumCardWinner: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  podiumCrown: {
    position: 'absolute',
    top: spacing.sm,
    fontSize: 22,
  },
  podiumTeamLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  podiumScore: {
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 60,
  },
  podiumPts: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  vsContainer: {
    width: 36,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textMuted,
  },
  breakdownSection: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  breakdownTitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  breakdownDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  breakdownScore: { fontSize: 20, fontWeight: '900' },
  breakdownDivider: { width: 1, height: 28, backgroundColor: colors.border },
  playAgainBtn: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  playAgainGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  playAgainText: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  bottomSpacer: { height: spacing.xl },
});
