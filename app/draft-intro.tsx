import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { DRAFT_T } from '@/constants/translations';
import { useBlockBack } from '@/hooks/useBlockBack';

const { height } = Dimensions.get('window');

export default function DraftIntroScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const dt = DRAFT_T[state.language];
  useBlockBack();

  const totalCards = state.numberOfPlayers * state.cardsPerPlayer;

  const handleStart = () => {
    dispatch({ type: 'START_DRAFT' });
    router.replace('/draft');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.emoji}>🃏</Text>
          <Text style={styles.title}>{dt.draftIntroTitle}</Text>
          <Text style={styles.desc}>{dt.draftIntroDesc(state.numberOfPlayers, state.cardsPerPlayer)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{state.numberOfPlayers}</Text>
            <Text style={styles.statLabel}>{state.language === 'az' ? 'Oyunçu' : 'Players'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{state.cardsPerPlayer}</Text>
            <Text style={styles.statLabel}>{state.language === 'az' ? 'Kart/oyunçu' : 'Cards/player'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>~{totalCards}</Text>
            <Text style={styles.statLabel}>{state.language === 'az' ? 'Yekun dəst' : 'Final deck'}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {state.language === 'az'
              ? 'Hər oyunçu 10 kart görəcək və onlardan bəzilərini seçəcək. Seçilmiş kartlar oyun dəstini təşkil edəcək.'
              : 'Each player will see 10 cards and pick some of them. Selected cards will form the game deck.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.startGradient}>
            <Text style={styles.startText}>{dt.startDrafting}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: height * 0.1, paddingBottom: height * 0.07, justifyContent: 'space-between', alignItems: 'center' },
  topSection: { alignItems: 'center', gap: spacing.md },
  emoji: { fontSize: 72 },
  title: { fontSize: 36, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  desc: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '900', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  infoBox: { backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  infoText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, textAlign: 'center' },
  startBtn: { width: '100%', borderRadius: radius.full, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
