import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { T } from '@/constants/translations';
import { DRAFT_T } from '@/constants/translations';

const { height } = Dimensions.get('window');

export default function SetupScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const t = T[state.language];
  const dt = DRAFT_T[state.language];

  const [cardCount, setCardCount] = useState('40');
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [draftingEnabled, setDraftingEnabled] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState('4');
  const [cardsPerPlayer, setCardsPerPlayer] = useState(String(Math.ceil(40 / 4)));

  const parsedCardCount = parseInt(cardCount, 10);
  const parsedPlayers = parseInt(numberOfPlayers, 10);
  const parsedCardsPerPlayer = parseInt(cardsPerPlayer, 10);

  const isCardCountValid = !isNaN(parsedCardCount) && parsedCardCount >= 1 && parsedCardCount <= 200;
  const isPlayersValid = !isNaN(parsedPlayers) && parsedPlayers >= 2;
  const isCardsPerPlayerValid = !isNaN(parsedCardsPerPlayer) && parsedCardsPerPlayer >= 1 && parsedCardsPerPlayer <= 10;

  const isValid = draftingEnabled
    ? isPlayersValid && isCardsPerPlayerValid
    : isCardCountValid;

  // Auto-calculate cards per player when number of players changes
  const handlePlayersChange = (val: string) => {
    setNumberOfPlayers(val);
    const p = parseInt(val, 10);
    if (!isNaN(p) && p >= 2) {
      setCardsPerPlayer(String(Math.ceil(40 / p)));
    }
  };

  const totalDraftCards = parsedPlayers * parsedCardsPerPlayer;

  const handleStart = () => {
    if (!isValid) return;
    dispatch({
      type: 'START_GAME',
      cardCount: parsedCardCount,
      showDescriptions,
      draftingEnabled,
      numberOfPlayers: parsedPlayers,
      cardsPerPlayer: parsedCardsPerPlayer,
    });
    router.replace(draftingEnabled ? '/draft-intro' : '/round-intro');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t.gameSetup}</Text>

        {/* Drafting Toggle */}
        <TouchableOpacity
          style={[styles.toggleBtn, draftingEnabled && styles.toggleBtnOn]}
          onPress={() => setDraftingEnabled(prev => !prev)}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, draftingEnabled && styles.toggleTextOn]}>
            {draftingEnabled ? dt.draftingOn : dt.draftingOff}
          </Text>
          <Text style={styles.toggleSub}>{dt.draftingSub}</Text>
        </TouchableOpacity>

        {draftingEnabled ? (
          /* Drafting options */
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>{dt.numberOfPlayers}</Text>
                <TextInput
                  style={styles.inputSmall}
                  keyboardType="number-pad"
                  value={numberOfPlayers}
                  onChangeText={handlePlayersChange}
                  maxLength={2}
                  selectionColor={colors.primary}
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>{dt.cardsPerPlayer}</Text>
                <TextInput
                  style={styles.inputSmall}
                  keyboardType="number-pad"
                  value={cardsPerPlayer}
                  onChangeText={setCardsPerPlayer}
                  maxLength={2}
                  selectionColor={colors.primary}
                />
              </View>
            </View>
            {isPlayersValid && isCardsPerPlayerValid && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{dt.calculatedFrom(totalDraftCards)}</Text>
                <Text style={styles.infoText}>{dt.recommended4050}</Text>
              </View>
            )}
          </View>
        ) : (
          /* Normal card count */
          <View style={styles.section}>
            <Text style={styles.inputLabel}>{t.howManyCards}</Text>
            <View style={styles.inputCenter}>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={cardCount}
                onChangeText={setCardCount}
                maxLength={3}
                selectionColor={colors.primary}
              />
            </View>
            <Text style={styles.hint}>{t.recommended}</Text>
            {!isCardCountValid && cardCount !== '' && (
              <Text style={styles.error}>{t.cardError}</Text>
            )}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{t.allCardsreshuffled}</Text>
            </View>
          </View>
        )}

        {/* Fun descriptions toggle */}
        <TouchableOpacity
          style={[styles.toggleBtn, showDescriptions && styles.toggleBtnOn]}
          onPress={() => setShowDescriptions(prev => !prev)}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, showDescriptions && styles.toggleTextOn]}>
            {showDescriptions ? t.funDescOn : t.funDescOff}
          </Text>
          <Text style={styles.toggleSub}>{t.funDescSub}</Text>
        </TouchableOpacity>

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
            <Text style={styles.startText}>{t.startGame}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: height * 0.07, paddingBottom: spacing.xl, gap: spacing.lg },
  backBtn: { alignSelf: 'flex-start' },
  backText: { color: colors.textSecondary, fontSize: 16 },
  title: { fontSize: 36, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  section: { gap: spacing.md },
  inputLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', numberOfLines: 1 },
  inputRow: { flexDirection: 'row', gap: spacing.md },
  inputBlock: { flex: 1, gap: spacing.sm },
  inputSmall: {
    height: 64, borderRadius: radius.md, borderWidth: 2, borderColor: colors.primary,
    backgroundColor: '#1c1c30', color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center',
  },
  inputCenter: { alignItems: 'center' },
  input: {
    width: 140, height: 100, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.primary,
    backgroundColor: '#1c1c30', color: colors.text, fontSize: 52, fontWeight: '900', textAlign: 'center',
  },
  hint: { fontSize: 14, color: colors.textMuted },
  error: { fontSize: 13, color: '#ff6b6b' },
  infoBox: { backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: 4 },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  toggleBtn: { borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bgCard, padding: spacing.md, alignItems: 'center', gap: 4 },
  toggleBtnOn: { borderColor: colors.primary, backgroundColor: '#1c1c40' },
  toggleText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  toggleTextOn: { color: colors.primary },
  toggleSub: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  startBtn: { borderRadius: radius.full, overflow: 'hidden', shadowColor: colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  startBtnDisabled: { opacity: 0.5 },
  startGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  startText: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
});
