import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { T } from '@/constants/translations';
import { useBlockBack } from '@/hooks/useBlockBack';

const { height } = Dimensions.get('window');

export default function RoundEndScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const t = T[state.language];
  const handleLeave = () => { dispatch({ type: 'RESET' }); router.replace('/'); };
  useBlockBack(handleLeave);
  const { currentRound, scores } = state;

  const team1Leading = scores.team1 > scores.team2;
  const team2Leading = scores.team2 > scores.team1;
  const tied = scores.team1 === scores.team2;
  const nextRound = currentRound + 1;

  const handleNextRound = () => {
    dispatch({ type: 'START_NEXT_ROUND' });
    router.replace('/round-intro');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.checkBadge}>
            <Text style={styles.checkIcon}>✅</Text>
          </View>
          <Text style={styles.roundDoneLabel}>{t.roundCompleteTitle(currentRound)}</Text>
          <Text style={styles.subtitle}>{t.allCardsGuessed}</Text>
        </View>

        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>{t.scoresAfterRound(currentRound)}</Text>
          <View style={styles.scoreCards}>
            <LinearGradient
              colors={team1Leading ? [colors.team1 + '30', colors.team1 + '10'] : ['#1c1c30', '#252540']}
              style={[styles.scoreCard, team1Leading && { borderColor: colors.team1 }]}
            >
              {team1Leading && <Text style={styles.leadBadge}>{t.leading}</Text>}
              <Text style={styles.scoreCardLabel}>{t.team1}</Text>
              <Text style={[styles.scoreCardNum, { color: colors.team1 }]}>{scores.team1}</Text>
              <Text style={styles.scoreCardPts}>{t.points}</Text>
            </LinearGradient>
            <LinearGradient
              colors={team2Leading ? [colors.team2 + '30', colors.team2 + '10'] : ['#1c1c30', '#252540']}
              style={[styles.scoreCard, team2Leading && { borderColor: colors.team2 }]}
            >
              {team2Leading && <Text style={styles.leadBadge}>{t.leading}</Text>}
              <Text style={styles.scoreCardLabel}>{t.team2}</Text>
              <Text style={[styles.scoreCardNum, { color: colors.team2 }]}>{scores.team2}</Text>
              <Text style={styles.scoreCardPts}>{t.points}</Text>
            </LinearGradient>
          </View>
          {tied && <View style={styles.tiedBanner}><Text style={styles.tiedText}>{t.itsATie(nextRound)}</Text></View>}
          {!tied && <View style={styles.leadBanner}><Text style={styles.leadText}>{t.teamAhead(team1Leading ? 1 : 2, Math.abs(scores.team1 - scores.team2))}</Text></View>}
        </View>

        <View style={styles.nextRoundInfo}>
          <Text style={styles.nextRoundTitle}>{t.upNext(nextRound)}</Text>
          <Text style={styles.nextRoundSub}>{t.cardsReshuffled(state.originalCards.length)}</Text>
          <Text style={styles.nextRoundSub}>{t.lowestScoreStarts(nextRound)}</Text>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNextRound} activeOpacity={0.85}>
          <LinearGradient colors={[colors.accent, '#cc9a00']} style={styles.nextGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.nextText}>{t.startNextRound(nextRound)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: height * 0.09, paddingBottom: height * 0.07, justifyContent: 'space-between', alignItems: 'center' },
  topSection: { alignItems: 'center', gap: spacing.sm },
  checkBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success + '20', justifyContent: 'center', alignItems: 'center' },
  checkIcon: { fontSize: 40 },
  roundDoneLabel: { fontSize: 32, fontWeight: '900', color: colors.text, letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  scoresSection: { width: '100%', gap: spacing.md },
  scoresTitle: { fontSize: 13, color: colors.textMuted, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  scoreCards: { flexDirection: 'row', gap: spacing.md },
  scoreCard: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 2, borderColor: colors.border, gap: 2, position: 'relative', paddingTop: spacing.xl },
  leadBadge: { position: 'absolute', top: spacing.sm, fontSize: 11, fontWeight: '700', color: colors.accent, textTransform: 'uppercase', letterSpacing: 0.5 },
  scoreCardLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  scoreCardNum: { fontSize: 52, fontWeight: '900', lineHeight: 56 },
  scoreCardPts: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  tiedBanner: { backgroundColor: colors.accent + '20', borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.accent + '40' },
  tiedText: { fontSize: 14, color: colors.accent, fontWeight: '700' },
  leadBanner: { backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  leadText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  nextRoundInfo: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.lg, width: '100%', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  nextRoundTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  nextRoundSub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  nextBtn: { width: '100%', borderRadius: radius.full, overflow: 'hidden', shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  nextGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  nextText: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
