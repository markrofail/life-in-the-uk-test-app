import { PieChart } from '@/components/PieChart';
import { Colors } from '@/constants/theme';
import { useExamStore } from '@/stores/useExamStore';
import { getTotalQuestionCount } from '@/utils/examUtils';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_QUESTION_BANK_SIZE = getTotalQuestionCount();

export default function HomeScreen() {
  const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);
  const correctQuestionIds = useExamStore((state) => state.correctQuestionIds);
  const resetStats = useExamStore((state) => state.resetStats);

  const correctCount = correctQuestionIds.length;
  const incorrectCount = incorrectQuestionIds.length;
  const unansweredCount = TOTAL_QUESTION_BANK_SIZE - correctCount - incorrectCount;

  const pieChartData = useMemo(() => [
    { label: 'Correct', value: correctCount, color: Colors.success },
    { label: 'Incorrect', value: incorrectCount, color: Colors.error },
    { label: 'Unseen', value: unansweredCount, color: Colors.border }
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

      <View style={styles.modeButtonsRow}>
        <Link href="/exam" asChild>
          <TouchableOpacity style={[styles.modeButton, styles.examButton]} activeOpacity={0.8}>
            <Text style={styles.modeButtonText}>Practice Exam</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/endless" asChild>
          <TouchableOpacity style={[styles.modeButton, styles.endlessButton]} activeOpacity={0.8}>
            <Text style={styles.modeButtonText}>Endless Mode</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {incorrectQuestionIds.length > 0 && (
        <Link href="/review" asChild>
          <TouchableOpacity style={styles.reviewButton} activeOpacity={0.8}>
            <Text style={styles.reviewButtonText}>Review Incorrect Questions</Text>
          </TouchableOpacity>
        </Link>
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
  modeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  examButton: {
    backgroundColor: Colors.primary,
  },
  endlessButton: {
    backgroundColor: Colors.secondary,
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.errorSubtle,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewButtonText: {
    color: Colors.error,
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
