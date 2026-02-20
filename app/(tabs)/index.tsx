import questionBankData from '@/data/question_bank.json';
import { useExamStore } from '@/stores/useExamStore';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

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

  const masteryPercentage = (correctQuestionIds.length / TOTAL_QUESTION_BANK_SIZE) * 100;
  const displayPercentage = masteryPercentage.toFixed(1);

  // SVG Gauge Variables
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (masteryPercentage / 100) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Life in the UK</Text>
      <Text style={styles.subtitle}>Study Guide & Exam</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Bank Mastery</Text>

        <View style={styles.gaugeContainer}>
          <Svg height="160" width="160" viewBox="0 0 160 160">
            <G rotation="-90" origin="80, 80">
              {/* Background Circle */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#333333"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Foreground Progress Circle */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#63B3ED"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
            {/* Center Text */}
            <SvgText
              x="80"
              y="80"
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize="24"
              fontWeight="bold"
              fill="#E2E8F0"
            >
              {`${displayPercentage}%`}
            </SvgText>
          </Svg>
        </View>

        <View style={styles.statsDivider} />

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
          onPress={() => router.push({ pathname: '/exam', params: { mode: 'review' } })}
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
    textAlign: 'center',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 16,
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
  reviewButton: {
    backgroundColor: '#9B2C2C', // Dark red
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
