import { QuestionCard } from '@/components/QuestionCard';
import { Colors } from '@/constants/theme';
import { useEndlessSession } from '@/hooks/useEndlessSession';
import { useExamStore } from '@/stores/useExamStore';
import { getRandomExamQuestions, getTotalQuestionCount, isAnswerCorrect } from '@/utils/examUtils';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EndlessScreen() {
    const router = useRouter();
    const recordQuestionResult = useExamStore((state) => state.recordQuestionResult);
    const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);
    const correctQuestionIds = useExamStore((state) => state.correctQuestionIds);

    const { state, currentQuestion, initializeSession, toggleOption, submitAnswer, nextQuestion } =
        useEndlessSession();

    const { currentIndex, selectedOptions, questions, isRevealed, isFinished } = state;

    useEffect(() => {
        initializeSession(
            getRandomExamQuestions(getTotalQuestionCount(), {
                incorrectIds: incorrectQuestionIds,
                correctIds: correctQuestionIds,
            })
        );
        // This effect runs only once on mount to start the endless session
    }, []);

    useEffect(() => {
        if (isFinished) {
            router.replace('/');
        }
        // router is stable; navigate home once the session is complete
    }, [isFinished]);

    if (!currentQuestion) {
        return (
            <SafeAreaView style={styles.centerContainer} edges={['bottom', 'left', 'right']}>
                <Stack.Screen options={{ title: 'Loading...' }} />
                <Text style={styles.loadingText}>Loading questions...</Text>
            </SafeAreaView>
        );
    }

    const handleQuit = () => {
        Alert.alert(
            'Quit Endless Mode',
            'Are you sure? Your progress so far has been saved.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Quit', style: 'destructive', onPress: () => router.replace('/') },
            ]
        );
    };

    const handleSubmit = () => {
        if (!currentQuestion || selectedOptions.length === 0) return;
        const isCorrect = isAnswerCorrect(currentQuestion.correctAnswers, selectedOptions);
        // Commit result to store before dispatching SUBMIT so stats are persisted before reveal
        recordQuestionResult(currentQuestion.id, isCorrect);
        submitAnswer();
    };

    const isLastQuestion = currentIndex >= questions.length - 1;
    const buttonLabel = isRevealed ? (isLastQuestion ? 'Finish' : 'Next Question') : 'Submit';
    const buttonDisabled = !isRevealed && selectedOptions.length === 0;
    const buttonAction = isRevealed ? nextQuestion : handleSubmit;

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: `Question ${currentIndex + 1} of ${questions.length}`,
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleQuit} style={{ paddingLeft: 8 }}>
                            <Ionicons name="close" size={28} color={Colors.error} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <QuestionCard
                    question={currentQuestion}
                    selectedOptions={selectedOptions}
                    onOptionToggle={toggleOption}
                    revealed={isRevealed}
                    explanation={currentQuestion.explanation}
                />
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, buttonDisabled && styles.actionButtonDisabled]}
                    onPress={buttonAction}
                    disabled={buttonDisabled}
                >
                    <Text style={styles.actionButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    loadingText: {
        color: Colors.textMuted,
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    bottomBar: {
        padding: 20,
        backgroundColor: Colors.navBar,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    actionButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonDisabled: {
        backgroundColor: '#4A5568',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
