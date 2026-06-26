import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { dispatch } = useGame();

  const handleNewGame = () => {
    dispatch({ type: 'RESET' });
    router.push('/setup');
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.iconRow}>
            <View style={[styles.dot, { backgroundColor: colors.team1 }]} />
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <View style={[styles.dot, { backgroundColor: colors.team2 }]} />
          </View>
          <Text style={styles.title}>Triple</Text>
          <Text style={styles.titleAccent}>Guess</Text>
          <Text style={styles.tagline}>The 3-round team guessing game</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={[styles.miniCard, { transform: [{ rotate: '-8deg' }], backgroundColor: '#ff6b3520' }]}>
            <Text style={styles.miniCardText}>💬</Text>
            <Text style={styles.miniCardLabel}>Describe It</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: '#ffd16620', zIndex: 1 }]}>
            <Text style={styles.miniCardText}>1️⃣</Text>
            <Text style={styles.miniCardLabel}>One Word</Text>
          </View>
          <View style={[styles.miniCard, { transform: [{ rotate: '8deg' }], backgroundColor: '#00c9a720' }]}>
            <Text style={styles.miniCardText}>🤸</Text>
            <Text style={styles.miniCardLabel}>Charades</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.newGameBtn} onPress={handleNewGame} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.newGameGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.newGameText}>New Game</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.rulesHint}>2 teams · 3 rounds · 60 seconds per turn</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.08,
  },
  topSection: {
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -2,
    lineHeight: 68,
  },
  titleAccent: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -2,
    lineHeight: 68,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  miniCard: {
    width: (width - spacing.xl * 2 - spacing.sm * 2) / 3,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniCardText: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  miniCardLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  newGameBtn: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  newGameGradient: {
    paddingVertical: spacing.lg + 2,
    alignItems: 'center',
  },
  newGameText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  rulesHint: {
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});
