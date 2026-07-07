import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { T } from '@/constants/translations';
import { useBlockBack } from '@/hooks/useBlockBack';

const { height } = Dimensions.get('window');

const ROUND_NAMES = {
  en: { 1: 'Any Words', 2: 'One Word', 3: 'Charades' },
  az: { 1: 'İstənilən söz', 2: 'Bir söz', 3: 'Şarada' },
};

export default function TurnSummaryScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const t = T[state.language];
  const handleLeave = () => { dispatch({ type: 'RESET' }); router.replace('/'); };
  useBlockBack(handleLeave);
  const { currentTeam, currentRound, scores, lastTurnGuessedCount, deckForRound } = state;

  const teamColor = currentTeam === 1 ? colors.team1 : colors.team2;
  const nextTeam: 1 | 2 = currentTeam === 1 ? 2 : 1;
  const roundDone = deckForRound.length === 0;
  const roundName = ROUND_NAMES[state.language][currentRound];

  const handleContinue = () => {
    dispatch({ type: 'NEXT_TURN_OR_ROUND' });
    if (roundDone) {
      if (currentRound === 3) router.replace('/final');
      else router.replace('/round-end');
    } else {
      router.replace('/turn-start');
    }
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>{t.roundLabel(currentRound, roundName)}</Text>
        </View>

        <View style={styles.centerSection}>
          <View style={[styles.teamCircle, { backgroundColor: teamColor + '20' }]}>
            <Text style={styles.teamEmoji}>{currentTeam === 1 ? '🔴' : '🟢'}</Text>
          </View>
          <Text style={styles.teamLabel}>{t.team(currentTeam)}</Text>
          <Text style={styles.guessedNum}>{lastTurnGuessedCount}</Text>
          <Text style={styles.guessedLabel}>{t.cardsGuessedTurn(lastTurnGuessedCount)}</Text>
        </View>

        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>{t.runningTotal}</Text>
          <View style={styles.scoreCards}>
            <LinearGradient
              colors={[colors.team1 + '25', colors.team1 + '10']}
              style={[styles.scoreCard, currentTeam === 1 && styles.scoreCardActive, { borderColor: currentTeam === 1 ? colors.team1 : colors.border }]}
            >
              <Text style={styles.scoreCardLabel}>{t.team1}</Text>
              <Text style={[styles.scoreCardNum, { color: colors.team1 }]}>{scores.team1}</Text>
              <Text style={styles.scoreCardPts}>{t.pts}</Text>
            </LinearGradient>
            <LinearGradient
              colors={[colors.team2 + '25', colors.team2 + '10']}
              style={[styles.scoreCard, currentTeam === 2 && styles.scoreCardActive, { borderColor: currentTeam === 2 ? colors.team2 : colors.border }]}
            >
              <Text style={styles.scoreCardLabel}>{t.team2}</Text>
              <Text style={[styles.scoreCardNum, { color: colors.team2 }]}>{scores.team2}</Text>
              <Text style={styles.scoreCardPts}>{t.pts}</Text>
            </LinearGradient>
          </View>
          {!roundDone && (
            <View style={styles.remainingRow}>
              <Text style={styles.remainingText}>{t.stillInDeck(deckForRound.length)}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
          <LinearGradient
            colors={roundDone ? [colors.accent, '#cc9a00'] : [colors.team2, colors.secondaryDark]}
            style={styles.continueGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={styles.continueText}>
              {roundDone ? (currentRound === 3 ? t.seeFinalResults : t.roundComplete) : t.teamsTurn(nextTeam)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: height * 0.09, paddingBottom: height * 0.07, justifyContent: 'space-between', alignItems: 'center' },
  topBadge: { backgroundColor: colors.bgCard, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs + 2, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  topBadgeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  centerSection: { alignItems: 'center', gap: spacing.sm },
  teamCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  teamEmoji: { fontSize: 48 },
  teamLabel: { fontSize: 20, color: colors.textSecondary, fontWeight: '600' },
  guessedNum: { fontSize: 80, fontWeight: '900', color: colors.text, lineHeight: 88 },
  guessedLabel: { fontSize: 16, color: colors.textSecondary, textAlign: 'center' },
  scoresSection: { width: '100%', gap: spacing.md },
  scoresTitle: { fontSize: 13, color: colors.textMuted, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  scoreCards: { flexDirection: 'row', gap: spacing.md },
  scoreCard: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 2, gap: 2 },
  scoreCardActive: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  scoreCardLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  scoreCardNum: { fontSize: 44, fontWeight: '900', lineHeight: 48 },
  scoreCardPts: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  remainingRow: { backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  remainingText: { fontSize: 13, color: colors.textSecondary },
  continueBtn: { width: '100%', borderRadius: radius.full, overflow: 'hidden', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  continueGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  continueText: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
});
