import { IncorrectQuestionsList } from '@/components/IncorrectQuestionsList';
import { PieChart } from '@/components/PieChart';
import { AppConfig } from '@/constants/config';
import { Colors } from '@/constants/theme';
import { useExamStore } from '@/stores/useExamStore';
import { getQuestionsByIds } from '@/utils/examUtils';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
    const router = useRouter();
    const lastExamResult = useExamStore((state) => state.lastExamResult);

    useEffect(() => {
        if (!lastExamResult) {
            router.replace('/');
        }
    }, [lastExamResult, router]);

    if (!lastExamResult) return null;

    const { score: numScore, total: numTotal, incorrectIds } = lastExamResult;

    const percentage = Math.round((numScore / numTotal) * 100);
    const isPass = percentage >= AppConfig.PASSING_PERCENTAGE;

    const incorrectQuestions = getQuestionsByIds(incorrectIds);

    const pieChartData = useMemo(() => [
        { label: 'Correct', value: numScore, color: isPass ? Colors.success : Colors.error },
        { label: 'Incorrect', value: numTotal - numScore, color: Colors.border }
    ], [numScore, numTotal, isPass]);

    const headerNode = (
        <View style={styles.card}>
            <Text style={styles.title}>Exam Completed</Text>

            <View style={styles.gaugeContainer}>
                <PieChart
                    data={pieChartData}
                    totalValue={numTotal}
                    radius={80}
                    strokeWidth={16}
                    centerLabel={`${numScore}/${numTotal}`}
                    centerSubLabel={`${percentage}%`}
                    showLegend={false}
                />
            </View>

            <Text style={[styles.statusText, isPass ? styles.statusPass : styles.statusFail]}>
                {isPass ? 'Pass' : 'Failed'}
            </Text>

            <Text style={styles.messageText}>
                {isPass
                    ? 'Great job! Keep up the good work to ensure you are ready for the real test.'
                    : `You need at least ${AppConfig.PASSING_PERCENTAGE}% correct answers to pass. Review your mistakes and try again!`}
            </Text>
        </View>
    );

    const footerNode = (
        <Link href="/" replace asChild>
            <TouchableOpacity
                style={styles.homeButton}
                activeOpacity={0.8}
            >
                <Text style={styles.homeButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.scrollContent}>
                {incorrectQuestions.length > 0 ? (
                    <IncorrectQuestionsList
                        questions={incorrectQuestions}
                        headerComponent={headerNode}
                        footerComponent={footerNode}
                    />
                ) : (
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        {headerNode}
                        {footerNode}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textMain,
        marginBottom: 32,
    },
    gaugeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    statusText: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 16,
    },
    statusPass: {
        color: Colors.success,
    },
    statusFail: {
        color: Colors.error,
    },
    messageText: {
        fontSize: 16,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    }
});
