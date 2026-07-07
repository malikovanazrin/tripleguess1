import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { DRAFT_T } from '@/constants/translations';
import { useBlockBack } from '@/hooks/useBlockBack';
import { Card } from '@/constants/cards';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 2 - spacing.sm * 2) / 3;

export default function DraftScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const dt = DRAFT_T[state.language];
  useBlockBack();

  const currentPlayerIndex = state.draftPlayerIndex;
  const currentCards = state.draftPlayerCards[currentPlayerIndex] ?? [];
  const selected = state.draftSelectedCards;
  const cardsPerPlayer = state.cardsPerPlayer;
  const isRevealed = state.draftRevealed;
  const isDone = selected.length === cardsPerPlayer;

  const handleConfirm = () => {
    dispatch({ type: 'CONFIRM_DRAFT_SELECTION' });
    const isLastPlayer = currentPlayerIndex + 1 >= state.numberOfPlayers;
    if (isLastPlayer) {
      router.replace('/round-intro');
    }
    // Stay on draft screen for next player
  };

  const isSelected = (card: Card) => selected.some(c => c.name === card.name);

  if (!isRevealed) {
    return (
      <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
        <View style={styles.coverScreen}>
          <Text style={styles.playerNum}>{dt.playerTurn(currentPlayerIndex + 1)}</Text>
          <TouchableOpacity style={styles.revealBtn} onPress={() => dispatch({ type: 'REVEAL_DRAFT_CARDS' })} activeOpacity={0.85}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.revealGradient}>
              <Text style={styles.revealIcon}>👁️</Text>
              <Text style={styles.revealText}>{dt.revealCards}</Text>
              <Text style={styles.revealSub}>{dt.revealSub}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.progressRow}>
            {Array.from({ length: state.numberOfPlayers }).map((_, i) => (
              <View key={i} style={[styles.progressDot, i < currentPlayerIndex && styles.progressDotDone, i === currentPlayerIndex && styles.progressDotActive]} />
            ))}
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerPlayer}>{dt.playerTurn(currentPlayerIndex + 1)}</Text>
        <Text style={styles.headerInstruction}>{dt.pickExactly(cardsPerPlayer)}</Text>
        <Text style={[styles.headerCount, isDone && styles.headerCountDone]}>
          {dt.selected(selected.length, cardsPerPlayer)}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => dispatch({ type: 'SELECT_ALL_DRAFT' })}>
          <Text style={styles.quickBtnText}>{dt.selectAll}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => dispatch({ type: 'DESELECT_ALL_DRAFT' })}>
          <Text style={styles.quickBtnText}>{dt.deselectAll}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {currentCards.map((card, idx) => {
          const sel = isSelected(card);
          const displayName = card.name.split('/')[0].trim();
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.card, sel && styles.cardSelected]}
              onPress={() => dispatch({ type: 'TOGGLE_DRAFT_CARD', card })}
              activeOpacity={0.8}
            >
              {sel && <View style={styles.checkBadge}><Text style={styles.checkText}>✓</Text></View>}
              <Text style={styles.cardName} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.6}>
                {displayName}
              </Text>
              {state.showDescriptions && card.description ? (
                <Text style={styles.cardDesc} numberOfLines={2}>{card.description}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !isDone && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!isDone}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={isDone ? [colors.secondary, colors.secondaryDark] : ['#444', '#333']}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmText}>
              {currentPlayerIndex + 1 < state.numberOfPlayers
                ? dt.passToNext(currentPlayerIndex + 2)
                : dt.draftComplete}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  // Cover screen (before reveal)
  coverScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.xl, paddingHorizontal: spacing.xl },
  playerNum: { fontSize: 48, fontWeight: '900', color: colors.text },
  revealBtn: { width: '100%', borderRadius: radius.xl, overflow: 'hidden' },
  revealGradient: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm },
  revealIcon: { fontSize: 48 },
  revealText: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center' },
  revealSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  progressRow: { flexDirection: 'row', gap: spacing.sm },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  progressDotDone: { backgroundColor: colors.success },
  progressDotActive: { backgroundColor: colors.primary, width: 24 },
  // Main draft screen
  header: { paddingHorizontal: spacing.xl, paddingTop: height * 0.06, paddingBottom: spacing.sm, alignItems: 'center', gap: 4 },
  headerPlayer: { fontSize: 24, fontWeight: '900', color: colors.text },
  headerInstruction: { fontSize: 14, color: colors.textSecondary },
  headerCount: { fontSize: 16, fontWeight: '700', color: colors.textMuted },
  headerCountDone: { color: colors.success },
  quickActions: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  quickBtn: { flex: 1, backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xl },
  card: {
    width: CARD_WIDTH, minHeight: 100, backgroundColor: '#1c1c35',
    borderRadius: radius.lg, padding: spacing.sm, borderWidth: 2,
    borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  cardSelected: { borderColor: colors.secondary, backgroundColor: '#1c2535' },
  checkBadge: { position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' },
  checkText: { fontSize: 11, color: '#fff', fontWeight: '900' },
  cardName: { fontSize: 13, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 18 },
  cardDesc: { fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 14 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: height * 0.05, paddingTop: spacing.sm },
  confirmBtn: { borderRadius: radius.full, overflow: 'hidden', shadowColor: colors.secondary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmGradient: { paddingVertical: spacing.lg, alignItems: 'center' },
  confirmText: { fontSize: 17, fontWeight: '800', color: '#fff', textAlign: 'center', paddingHorizontal: spacing.md },
});
