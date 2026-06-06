import { QuestionCard } from '@/components/QuestionCard';
import { AppConfig } from '@/constants/config';
import { Colors } from '@/constants/theme';
import { useExamSession } from '@/hooks/useExamSession';
import { useExamStore } from '@/stores/useExamStore';
import { getRandomExamQuestions } from '@/utils/examUtils';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExamScreen() {
    const router = useRouter();

    const recordExamResult = useExamStore((state) => state.recordExamResult);
    const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);
    const correctQuestionIds = useExamStore((state) => state.correctQuestionIds);

    const {
        state,
        currentQuestion,
        initializeExam,
        toggleOption,
        nextQuestion
    } = useExamSession();

    const {
        currentIndex,
        selectedOptions,
        questions,
        isFinished,
        currentCorrectIds,
        currentIncorrectIds
    } = state;

    useEffect(() => {
        // Generate a fresh set of questions on mount
        initializeExam(getRandomExamQuestions(AppConfig.EXAM_QUESTION_COUNT, {
            incorrectIds: incorrectQuestionIds,
            correctIds: correctQuestionIds,
        }));
        // This effect runs only once on mount to start the exam session
    }, []);

    // Effect to handle finish condition outside of render
    useEffect(() => {
        if (isFinished && questions.length > 0) {
            recordExamResult(currentCorrectIds, currentIncorrectIds);
            router.replace('/result');
        }
    }, [isFinished]);

    if (!currentQuestion || questions.length === 0) {
        return (
            <SafeAreaView style={styles.centerContainer} edges={['bottom', 'left', 'right']}>
                <Stack.Screen options={{ title: 'Loading...' }} />
                <Text>Loading Exam...</Text>
            </SafeAreaView>
        );
    }

    const handleQuit = () => {
        Alert.alert(
            "Quit Exam",
            "Are you sure you want to quit? Your progress won't be saved.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Quit", style: "destructive", onPress: () => router.back() }
            ]
        );
    };

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
                />
            </ScrollView>

            {/* Bottom Action Area */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, selectedOptions.length === 0 && styles.actionButtonDisabled]}
                    onPress={nextQuestion}
                    disabled={selectedOptions.length === 0}
                >
                    <Text style={styles.actionButtonText}>
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
                    </Text>
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
    }
});
