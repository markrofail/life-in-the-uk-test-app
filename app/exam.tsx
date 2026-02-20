import { useExamStore } from '@/stores/useExamStore';
import { Question } from '@/types';
import { getRandomExamQuestions } from '@/utils/examUtils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExamScreen() {
    const router = useRouter();
    const recordExamResult = useExamStore((state) => state.recordExamResult);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Track selected option IDs for the current question
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    // Track correctness history for summary: 
    // Map of questionId -> bool
    const [answersStatus, setAnswersStatus] = useState<Record<string, boolean>>({});

    // Has the user submitted the answer for the current question?
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        // Generate a fresh set of 24 questions on mount
        setQuestions(getRandomExamQuestions(24));
    }, []);

    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text>Loading Exam...</Text>
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentIndex];
    // Determine if multiple answers are expected
    const isMultipleChoice = currentQuestion.correctAnswers.length > 1;

    const toggleOption = (optionId: string) => {
        if (isRevealed) return; // Disallow changes after reveal

        if (isMultipleChoice) {
            if (selectedOptions.includes(optionId)) {
                setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
            } else {
                setSelectedOptions([...selectedOptions, optionId]);
            }
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const handleCheckAnswer = () => {
        if (selectedOptions.length === 0) return;

        // Sort logic to make sure arrays match regardless of selection order
        const selectedSorted = [...selectedOptions].sort();
        const correctSorted = [...currentQuestion.correctAnswers].sort();

        const isCorrect =
            selectedSorted.length === correctSorted.length &&
            selectedSorted.every((val, idx) => val === correctSorted[idx]);

        setAnswersStatus((prev) => ({
            ...prev,
            [currentQuestion.id]: isCorrect
        }));

        setIsRevealed(true);
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOptions([]);
            setIsRevealed(false);
        } else {
            handleFinishExam();
        }
    };

    const handleFinishExam = () => {
        const correctIds: string[] = [];
        const incorrectIds: string[] = [];

        questions.forEach((q) => {
            // If true, it was correct. Otherwise incorrect (or skipped, but we force answer here).
            if (answersStatus[q.id]) {
                correctIds.push(q.id);
            } else {
                incorrectIds.push(q.id);
            }
        });

        recordExamResult(correctIds, incorrectIds);

        // Navigate to the result summary
        router.replace({
            pathname: '/result',
            params: {
                score: correctIds.length,
                total: questions.length
            }
        });
    };

    const getOptionStyle = (optionId: string) => {
        const isSelected = selectedOptions.includes(optionId);
        if (!isRevealed) {
            return isSelected ? styles.optionSelected : styles.optionDefault;
        }

        const isCorrectAnswer = currentQuestion.correctAnswers.includes(optionId);

        if (isCorrectAnswer) {
            return styles.optionCorrect;
        }
        if (isSelected && !isCorrectAnswer) {
            return styles.optionIncorrect;
        }
        return styles.optionDefault;
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
                            onPress={() => toggleOption(option.id)}
                            activeOpacity={0.7}
                            disabled={isRevealed}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedOptions.includes(option.id) && !isRevealed ? styles.optionTextSelected : null
                            ]}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {isRevealed && (
                    <View style={styles.explanationBox}>
                        <Text style={styles.explanationTitle}>Explanation</Text>
                        <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Area */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <TouchableOpacity
                        style={[styles.actionButton, selectedOptions.length === 0 && styles.actionButtonDisabled]}
                        onPress={handleCheckAnswer}
                        disabled={selectedOptions.length === 0}
                    >
                        <Text style={styles.actionButtonText}>Check Answer</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleNextQuestion}
                    >
                        <Text style={styles.actionButtonText}>
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
                        </Text>
                    </TouchableOpacity>
                )}
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
    optionCorrect: {
        backgroundColor: '#276749',
        borderColor: '#68D391',
    },
    optionIncorrect: {
        backgroundColor: '#742A2A',
        borderColor: '#FC8181',
    },
    optionText: {
        fontSize: 16,
        color: '#E2E8F0',
        lineHeight: 22,
    },
    optionTextSelected: {
        color: '#EBF8FF', // Highlighted text when selected in dark mode
        fontWeight: '600',
    },
    explanationBox: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#63B3ED',
    },
    explanationTitle: {
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    explanationText: {
        color: '#CBD5E0',
        lineHeight: 22,
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
