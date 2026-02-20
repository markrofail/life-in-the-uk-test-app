import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
    const router = useRouter();
    const { score, total } = useLocalSearchParams();

    const numScore = Number(score) || 0;
    const numTotal = Number(total) || 24;

    const percentage = Math.round((numScore / numTotal) * 100);
    // Life in the UK passes at ~75% (18/24)
    const isPass = numScore >= 18;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Exam Completed</Text>

                <View style={styles.resultCircle}>
                    <Text style={styles.scoreText}>{numScore} / {numTotal}</Text>
                    <Text style={styles.percentageText}>{percentage}%</Text>
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

            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.replace('/(tabs)')}
                activeOpacity={0.8}
            >
                <Text style={styles.homeButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 24,
        justifyContent: 'center',
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
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#E2E8F0',
        marginBottom: 32,
    },
    resultCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 8,
        borderColor: '#333333',
    },
    scoreText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#63B3ED',
        marginBottom: 8,
    },
    percentageText: {
        fontSize: 20,
        color: '#A0AEC0',
        fontWeight: '600',
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
