import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { T } from '@/constants/translations';
import { useBlockBack } from '@/hooks/useBlockBack';

const { height } = Dimensions.get('window');

const ROUND_INFO = {
  en: {
    1: { name: 'Any Words', rule: 'Say anything except the card name', description: 'Use words, sentences, or phrases to describe the card, but never say the actual name!', icon: '💬' },
    2: { name: 'One Word', rule: 'One word only as your clue', description: 'You can only say a single word as your clue. Choose wisely!', icon: '1️⃣' },
    3: { name: 'Charades', rule: 'No words — act it out!', description: 'Silence! No words. Use gestures, body language, and sound effects (within reason), but no talking.', icon: '🤸' },
  },
  az: {
    1: { name: 'İstənilən söz', rule: 'Kartın adından başqa istənilən şey deyə bilərsiniz', description: 'Kartı söz, cümlə və ya ifadə ilə izah edin — ancaq adını deməyin!', icon: '💬' },
    2: { name: 'Bir söz', rule: 'Yalnız bir söz deyə bilərsiniz', description: 'İpucu kimi yalnız bir söz deyə bilərsiniz. Düşünülmüş seçin!', icon: '1️⃣' },
    3: { name: 'Şarada', rule: 'Söz yoxdur — canlandırın!', description: 'Sükut! Söz olmaz. Jest, bədən dili və səs effektlərindən istifadə edin (ağlabatan həddə), amma danışmayın.', icon: '🤸' },
  },
};

export default function RoundIntroScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const t = T[state.language];
  useBlockBack();
  const round = state.currentRound;
  const info = ROUND_INFO[state.language][round];

  const roundColors: Record<number, [string, string]> = {
    1: [colors.primary, colors.primaryDark],
    2: [colors.accent, '#cc9a00'],
    3: [colors.secondary, colors.secondaryDark],
  };

  const handleStart = () => {
    dispatch({ type: 'START_ROUND' });
    router.replace('/turn-start');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.roundBadge}>
          <Text style={styles.roundBadgeText}>{t.roundOf(round)}</Text>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.emoji}>{info.icon}</Text>
          <Text style={styles.roundName}>{info.name}</Text>
          <LinearGradient colors={roundColors[round]} style={styles.rulePill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.ruleText}>{info.rule}</Text>
          </LinearGradient>
          <Text style={styles.description}>{info.description}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{state.deckForRound.length}</Text>
            <Text style={styles.statLabel}>{t.cards}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>60s</Text>
            <Text style={styles.statLabel}>{t.perTurn}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>{t.teams}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient colors={roundColors[round]} style={styles.startGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.startText}>{t.startRound(round)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: height * 0.1, paddingBottom: height * 0.07, justifyContent: 'space-between', alignItems: 'center' },
  roundBadge: { backgroundColor: colors.bgCard, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs + 2, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  roundBadgeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  centerSection: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md },
  emoji: { fontSize: 72 },
  roundName: { fontSize: 42, fontWeight: '900', color: colors.text, letterSpacing: -1, textAlign: 'center' },
  rulePill: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full },
  ruleText: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center' },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '900', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  startBtn: { width: '100%', borderRadius: radius.full, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
