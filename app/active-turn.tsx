import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { ROUND_INFO, TURN_DURATION } from '@/constants/game';
import { colors, spacing, radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function ActiveTurnScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const { currentTeam, currentRound, activeDeck, scores, deckForRound } = state;
  const info = ROUND_INFO[currentRound];

  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const [paused, setPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const teamColor = currentTeam === 1 ? colors.team1 : colors.team2;
  const currentCard = activeDeck[0] ?? null;
  const cardsLeft = deckForRound.length;

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (timerDone) {
      dispatch({ type: 'TURN_ENDED' });
    }
  }, [timerDone]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePause = () => {
    pausedRef.current = true;
    setPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    pausedRef.current = false;
    setPaused(false);
    setShowPauseModal(false);
  };

  const handleLeaveGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch({ type: 'RESET' });
    router.replace('/');
  };

  const handleGotIt = () => {
    if (activeDeck.length === 0) return;
    dispatch({ type: 'CARD_GUESSED' });
  };

  const handleSkip = () => {
    if (activeDeck.length === 0) return;
    dispatch({ type: 'CARD_SKIPPED' });
  };

  useEffect(() => {
    if (state.phase === 'turn-summary') {
      if (timerRef.current) clearInterval(timerRef.current);
      router.replace('/turn-summary');
    }
  }, [state.phase]);

  const timePercent = timeLeft / TURN_DURATION;
  const timerBarColor =
    timeLeft <= 10 ? colors.timerBarLow : timeLeft <= 20 ? colors.warning : colors.timerBar;

  const timerDisplay = String(timeLeft).padStart(2, '0');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f0f1a', '#1a1030']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.teamDot, { backgroundColor: teamColor }]} />
          <Text style={styles.headerTeam}>Team {currentTeam}</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerRound}>{info.icon} {info.rule}</Text>
        </View>
        <TouchableOpacity style={styles.pauseBtn} onPress={handlePause}>
          <Text style={styles.pauseIcon}>⏸</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Bar */}
      <View style={styles.timerBarBg}>
        <View
          style={[
            styles.timerBarFill,
            {
              width: `${timePercent * 100}%`,
              backgroundColor: timerBarColor,
            },
          ]}
        />
      </View>

      {/* Timer Display */}
      <View style={styles.timerRow}>
        <Text style={[styles.timerText, timeLeft <= 10 && styles.timerTextUrgent]}>
          {timerDisplay}s
        </Text>
        <Text style={styles.cardsLeft}>{cardsLeft} card{cardsLeft !== 1 ? 's' : ''} left</Text>
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <View style={[styles.card, { borderColor: teamColor + '60' }]}>
          <LinearGradient
            colors={['#1c1c35', '#252550']}
            style={styles.cardInner}
          >
            <Text style={styles.cardName} numberOfLines={3} adjustsFontSizeToFit>
              {currentCard?.name ?? ''}
            </Text>
            {state.showDescriptions && currentCard?.description ? (
              <Text style={styles.cardDescription}>{currentCard.description}</Text>
            ) : null}
          </LinearGradient>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsArea}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <View style={styles.skipBtnInner}>
            <Text style={styles.skipIcon}>⏭</Text>
            <Text style={styles.skipText}>Skip</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gotItBtn}
          onPress={handleGotIt}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.success, '#04a87e']}
            style={styles.gotItGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.gotItIcon}>✅</Text>
            <Text style={styles.gotItText}>Got it!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Score bar at bottom */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <View style={[styles.scoreDot, { backgroundColor: colors.team1 }]} />
          <Text style={styles.scoreItemLabel}>Team 1</Text>
          <Text style={[styles.scoreItemNum, { color: colors.team1 }]}>{scores.team1}</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <View style={[styles.scoreDot, { backgroundColor: colors.team2 }]} />
          <Text style={styles.scoreItemLabel}>Team 2</Text>
          <Text style={[styles.scoreItemNum, { color: colors.team2 }]}>{scores.team2}</Text>
        </View>
      </View>

      {/* Pause Modal */}
      <Modal visible={showPauseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Game Paused</Text>
            <Text style={styles.modalSub}>Time remaining: {timerDisplay}s</Text>

            <TouchableOpacity style={styles.modalResumeBtn} onPress={handleResume} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.secondary, colors.secondaryDark]}
                style={styles.modalBtnGradient}
              >
                <Text style={styles.modalBtnText}>Resume</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalLeaveBtn} onPress={handleLeaveGame} activeOpacity={0.85}>
              <Text style={styles.modalLeaveText}>Leave Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.06,
    paddingBottom: spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  teamDot: { width: 10, height: 10, borderRadius: 5 },
  headerTeam: { color: colors.text, fontSize: 14, fontWeight: '700' },
  headerCenter: { flex: 2, alignItems: 'center' },
  headerRound: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  pauseBtn: {
    flex: 1,
    alignItems: 'flex-end',
    padding: spacing.xs,
  },
  pauseIcon: { fontSize: 22 },
  timerBarBg: {
    height: 6,
    backgroundColor: colors.bgCardAlt,
    marginHorizontal: spacing.lg,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  timerTextUrgent: { color: colors.error },
  cardsLeft: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  cardInner: {
    minHeight: height * 0.28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  cardName: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  actionsArea: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  skipBtn: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  skipBtnInner: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  skipIcon: { fontSize: 28 },
  skipText: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  gotItBtn: {
    flex: 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  gotItGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  gotItIcon: { fontSize: 28 },
  gotItText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: height * 0.04,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  scoreDot: { width: 8, height: 8, borderRadius: 4 },
  scoreItemLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  scoreItemNum: { fontSize: 18, fontWeight: '900' },
  scoreDivider: { width: 1, height: 28, backgroundColor: colors.border },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { fontSize: 28, fontWeight: '900', color: colors.text },
  modalSub: { fontSize: 15, color: colors.textSecondary },
  modalResumeBtn: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  modalBtnGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  modalLeaveBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  modalLeaveText: { fontSize: 15, color: colors.error, fontWeight: '600' },
});
