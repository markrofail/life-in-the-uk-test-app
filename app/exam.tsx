import { useExamSession } from '@/hooks/useExamSession';
import { useExamStore } from '@/stores/useExamStore';
import { getRandomExamQuestions } from '@/utils/examUtils';
import { useRouter } from 'expo-router';
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
        initializeExam(getRandomExamQuestions(24, {
            incorrectIds: incorrectQuestionIds,
            correctIds: correctQuestionIds,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to handle finish condition outside of render
    useEffect(() => {
        if (isFinished && questions.length > 0) {
            recordExamResult(currentCorrectIds, currentIncorrectIds);

            router.replace({
                pathname: '/result',
                params: {
                    score: currentCorrectIds.length,
                    total: questions.length,
                    incorrectIds: JSON.stringify(currentIncorrectIds)
                }
            });
        }
    }, [isFinished]);

    if (!currentQuestion || questions.length === 0) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text>Loading Exam...</Text>
            </SafeAreaView>
        );
    }

    // Determine if multiple answers are expected
    const isMultipleChoice = currentQuestion.correctAnswers.length > 1;

    const getOptionStyle = (optionId: string) => {
        const isSelected = selectedOptions.includes(optionId);
        return isSelected ? styles.optionSelected : styles.optionDefault;
    };

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
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleQuit}>
                    <Text style={styles.quitText}>Quit</Text>
                </TouchableOpacity>
                <Text style={styles.progressText}>
                    Question {currentIndex + 1} of {questions.length}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>

                {isMultipleChoice && (
                    <Text style={styles.instructionText}>
                        (Select {currentQuestion.correctAnswers.length} answers)
                    </Text>
                )}

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.optionButton, getOptionStyle(option.id)]}
                            onPress={() => toggleOption(option.id, isMultipleChoice)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedOptions.includes(option.id) ? styles.optionTextSelected : null
                            ]}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#1A1A1A',
    },
    quitText: {
        color: '#FC8181',
        fontSize: 16,
        fontWeight: '600',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A0AEC0',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 8,
        lineHeight: 30,
    },
    instructionText: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        minHeight: 60,
        justifyContent: 'center',
    },
    optionDefault: {
        backgroundColor: '#1E1E1E',
        borderColor: '#333333',
    },
    optionSelected: {
        backgroundColor: '#2C5282',
        borderColor: '#63B3ED',
    },
    optionText: {
        fontSize: 16,
        color: '#E2E8F0',
        lineHeight: 22,
    },
    optionTextSelected: {
        color: '#EBF8FF',
        fontWeight: '600',
    },
    bottomBar: {
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    actionButton: {
        backgroundColor: '#3182CE',
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
