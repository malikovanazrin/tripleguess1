import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { colors, spacing, radius } from '@/constants/theme';
import { T } from '@/constants/translations';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const t = T[state.language];

  const handleNewGame = () => {
    dispatch({ type: 'RESET' });
    router.push('/setup');
  };

  const toggleLanguage = () => {
    dispatch({ type: 'SET_LANGUAGE', language: state.language === 'en' ? 'az' : 'en' });
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a1030', '#0f1a2a']} style={styles.container}>
      <View style={styles.content}>
        {/* Language Toggle */}
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Text style={styles.langText}>{state.language === 'en' ? '🇦🇿 AZ' : '🇬🇧 EN'}</Text>
        </TouchableOpacity>

        <View style={styles.topSection}>
          <View style={styles.iconRow}>
            <View style={[styles.dot, { backgroundColor: colors.team1 }]} />
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <View style={[styles.dot, { backgroundColor: colors.team2 }]} />
          </View>
          <Text style={styles.title}>Triple</Text>
          <Text style={styles.titleAccent}>Guess</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <View style={styles.cardsSection}>
          <Text style={styles.describeLabel}>{t.describeCardsWith}</Text>
          <View style={styles.cardsRow}>
            <View style={[styles.miniCard, { transform: [{ rotate: '-8deg' }], backgroundColor: '#ff6b3520' }]}>
              <Text style={styles.miniCardText}>💬</Text>
              <Text style={styles.miniCardLabel}>{t.anyWords}</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: '#ffd16620', zIndex: 1 }]}>
              <Text style={styles.miniCardText}>1️⃣</Text>
              <Text style={styles.miniCardLabel}>{t.oneWord}</Text>
            </View>
            <View style={[styles.miniCard, { transform: [{ rotate: '8deg' }], backgroundColor: '#00c9a720' }]}>
              <Text style={styles.miniCardText}>🤸</Text>
              <Text style={styles.miniCardLabel}>{t.charades}</Text>
            </View>
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
              <Text style={styles.newGameText}>{t.newGame}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.rulesHint}>{t.rulesHint}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.08,
  },
  langBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.bgCard,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: { fontSize: 14, fontWeight: '700', color: colors.text },
  topSection: { alignItems: 'center' },
  iconRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  dot: { width: 12, height: 12, borderRadius: 6 },
  title: { fontSize: 64, fontWeight: '900', color: colors.text, letterSpacing: -2, lineHeight: 68 },
  titleAccent: { fontSize: 64, fontWeight: '900', color: colors.primary, letterSpacing: -2, lineHeight: 68 },
  tagline: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.md, letterSpacing: 0.5 },
  describeLabel: {
    fontSize: 14, color: colors.textSecondary, marginTop: 0, marginBottom: 0,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  cardsSection: { alignItems: 'center', gap: 8 },
  cardsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  miniCard: {
    width: (width - spacing.xl * 2 - spacing.sm * 2) / 3,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniCardText: { fontSize: 32, marginBottom: spacing.xs },
  miniCardLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  bottomSection: { alignItems: 'center', gap: spacing.md },
  newGameBtn: {
    width: '100%', borderRadius: radius.full, overflow: 'hidden',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  newGameGradient: { paddingVertical: spacing.lg + 2, alignItems: 'center' },
  newGameText: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
  rulesHint: { fontSize: 13, color: colors.textMuted, letterSpacing: 0.3 },
});
