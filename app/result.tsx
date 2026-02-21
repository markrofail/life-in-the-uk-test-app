import { IncorrectQuestionsList } from '@/components/IncorrectQuestionsList';
import questionBankData from '@/data/question_bank.json';
import { Question } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

export default function ResultScreen() {
    const router = useRouter();
    const { score, total, incorrectIds } = useLocalSearchParams();

    const numScore = Number(score) || 0;
    const numTotal = Number(total) || 24;

    const percentage = Math.round((numScore / numTotal) * 100);
    // Life in the UK passes at ~75% (18/24)
    const isPass = numScore >= 18;

    let parsedIncorrectIds: string[] = [];
    if (incorrectIds) {
        try {
            parsedIncorrectIds = JSON.parse(incorrectIds as string);
        } catch (e) {
            console.error("Failed to parse incorrectIds", e);
        }
    }

    const incorrectQuestions = (questionBankData as Question[]).filter(q =>
        parsedIncorrectIds.includes(q.id)
    );

    // SVG Gauge Variables
    const radius = 80; // slightly larger than the dashboard gauge
    const strokeWidth = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.title}>Exam Completed</Text>

                    <View style={styles.gaugeContainer}>
                        <Svg height="200" width="200" viewBox="0 0 200 200">
                            <G rotation="-90" origin="100, 100">
                                {/* Background Circle */}
                                <Circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    stroke="#333333"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                />
                                {/* Foreground Progress Circle */}
                                <Circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    stroke={isPass ? "#68D391" : "#FC8181"} // Green if pass, Red if fail
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </G>
                            {/* Center Text */}
                            <SvgText
                                x="100"
                                y="90"
                                textAnchor="middle"
                                alignmentBaseline="central"
                                fontSize="36"
                                fontWeight="bold"
                                fill="#E2E8F0"
                            >
                                {`${numScore}/${numTotal}`}
                            </SvgText>
                            <SvgText
                                x="100"
                                y="125"
                                textAnchor="middle"
                                alignmentBaseline="central"
                                fontSize="20"
                                fill="#A0AEC0"
                                fontWeight="bold"
                            >
                                {`${percentage}%`}
                            </SvgText>
                        </Svg>
                    </View>

                    <Text style={[styles.statusText, isPass ? styles.statusPass : styles.statusFail]}>
                        {isPass ? 'Pass' : 'Failed'}
                    </Text>

                    <Text style={styles.messageText}>
                        {isPass
                            ? 'Great job! Keep up the good work to ensure you are ready for the real test.'
                            : 'You need at least 18 correct answers to pass. Review your mistakes and try again!'}
                    </Text>
                </View>

                {incorrectQuestions.length > 0 && (
                    <IncorrectQuestionsList questions={incorrectQuestions} />
                )}

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/(tabs)')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.homeButtonText}>Return to Dashboard</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1E1E1E',
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
        color: '#E2E8F0',
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
        color: '#68D391',
    },
    statusFail: {
        color: '#FC8181',
    },
    messageText: {
        fontSize: 16,
        color: '#A0AEC0',
        textAlign: 'center',
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: '#3182CE',
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
