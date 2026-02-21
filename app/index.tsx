import { PieChart } from '@/components/PieChart';
import { Colors } from '@/constants/theme';
import { useExamStore } from '@/stores/useExamStore';
import { getTotalQuestionCount } from '@/utils/examUtils';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_QUESTION_BANK_SIZE = getTotalQuestionCount();

export default function HomeScreen() {
  const router = useRouter();
  const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);
  const correctQuestionIds = useExamStore((state) => state.correctQuestionIds);
  const resetStats = useExamStore((state) => state.resetStats);

  const correctCount = correctQuestionIds.length;
  const incorrectCount = incorrectQuestionIds.length;
  const unansweredCount = TOTAL_QUESTION_BANK_SIZE - correctCount - incorrectCount;

  const pieChartData = useMemo(() => [
    { label: 'Correct', value: correctCount, color: '#68D391' },
    { label: 'Incorrect', value: incorrectCount, color: '#FC8181' },
    { label: 'Unseen', value: unansweredCount, color: '#333333' }
  ], [correctCount, incorrectCount, unansweredCount]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Life in the UK</Text>
      <Text style={styles.subtitle}>Study Guide & Exam</Text>

      <View style={styles.statsCard}>
        <PieChart
          data={pieChartData}
          totalValue={TOTAL_QUESTION_BANK_SIZE}
          radius={60}
          strokeWidth={14}
          centerLabel={correctCount}
          centerSubLabel="Mastered"
        />
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/exam')}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Take Practice Exam</Text>
      </TouchableOpacity>

      {incorrectQuestionIds.length > 0 && (
        <TouchableOpacity
          style={[styles.startButton, styles.reviewButton]}
          onPress={() => router.push('/review')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Review Incorrect Questions</Text>
        </TouchableOpacity>
      )}

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
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 40,
  },
  statsCard: {
    backgroundColor: Colors.cardBackground,
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
    color: Colors.textMain,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: Colors.textMuted,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  startButton: {
    backgroundColor: Colors.primary,
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
  reviewButton: {
    backgroundColor: '#9B2C2C', // Used specifically here
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
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  }
});
