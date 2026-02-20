import questionBankData from '@/data/question_bank.json';
import { useExamStore } from '@/stores/useExamStore';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_QUESTION_BANK_SIZE = questionBankData.length;

export default function HomeScreen() {
  const router = useRouter();
  const {
    totalAttempts,
    totalCorrectAnswers,
    incorrectQuestionIds,
    correctQuestionIds,
    resetStats
  } = useExamStore();

  const avgCorrect = totalAttempts > 0
    ? (totalCorrectAnswers / totalAttempts).toFixed(1)
    : 0;

  const percentageCorrectOfTotal = (
    (correctQuestionIds.length / TOTAL_QUESTION_BANK_SIZE) * 100
  ).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Life in the UK</Text>
      <Text style={styles.subtitle}>Study Guide & Exam</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Progress</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Exam Attempts:</Text>
          <Text style={styles.statValue}>{totalAttempts}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Avg Correct per Attempt:</Text>
          <Text style={styles.statValue}>{avgCorrect} / 24</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Incorrect Answers (Unique):</Text>
          <Text style={styles.statValue}>{incorrectQuestionIds.length}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Bank Mastery:</Text>
          <Text style={styles.statValue}>{percentageCorrectOfTotal}%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/exam')}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Take Practice Exam</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetStats}
      >
        <Text style={styles.resetButtonText}>Reset Statistics</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E2E8F0', // Light text
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0AEC0', // Subtle light text
    textAlign: 'center',
    marginBottom: 40,
  },
  statsCard: {
    backgroundColor: '#1E1E1E', // Darker card background
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 40,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333', // Dark border
    paddingBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#A0AEC0',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#63B3ED', // Brighter blue for dark mode
  },
  startButton: {
    backgroundColor: '#3182CE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FC8181', // Brighter red for dark mode
    fontSize: 16,
    fontWeight: '600',
  }
});
