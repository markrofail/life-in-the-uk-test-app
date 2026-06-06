import { Colors } from '@/constants/theme';
import { Question } from '@/types';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    question: Question;
    selectedOptions: string[];
    onOptionToggle: (optionId: string, isMultipleChoice: boolean) => void;
    revealed?: boolean;
    explanation?: string;
}

export const QuestionCard = memo(function QuestionCard({
    question,
    selectedOptions,
    onOptionToggle,
    revealed = false,
    explanation,
}: Props) {
    const isMultipleChoice = question.correctAnswers.length > 1;

    const getOptionStyle = (optionId: string) => {
        if (revealed) {
            const isCorrect = question.correctAnswers.includes(optionId);
            const isSelected = selectedOptions.includes(optionId);
            if (isCorrect) return styles.optionCorrect;
            if (isSelected) return styles.optionWrong;
            return styles.optionDefault;
        }
        return selectedOptions.includes(optionId) ? styles.optionSelected : styles.optionDefault;
    };

    const getOptionTextStyle = (optionId: string) => {
        if (!revealed) {
            return selectedOptions.includes(optionId) ? styles.optionTextSelected : null;
        }
        const isCorrect = question.correctAnswers.includes(optionId);
        const isSelected = selectedOptions.includes(optionId);
        if (isCorrect) return styles.optionTextCorrect;
        if (isSelected) return styles.optionTextWrong;
        return null;
    };

    return (
        <View>
            <Text style={styles.questionText}>{question.question}</Text>

            {isMultipleChoice && (
                <Text style={styles.instructionText}>
                    (Select {question.correctAnswers.length} answers)
                </Text>
            )}

            <View style={styles.optionsContainer}>
                {question.options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.optionButton, getOptionStyle(option.id)]}
                        onPress={() => onOptionToggle(option.id, isMultipleChoice)}
                        activeOpacity={0.7}
                        disabled={revealed}
                    >
                        <Text style={[styles.optionText, getOptionTextStyle(option.id)]}>
                            {option.text}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {revealed && explanation && (
                <View style={styles.explanationContainer}>
                    <Text style={styles.explanationLabel}>Explanation</Text>
                    <Text style={styles.explanationText}>{explanation}</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 8,
        lineHeight: 30,
    },
    instructionText: {
        fontSize: 14,
        color: Colors.textMuted,
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
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.border,
    },
    optionSelected: {
        backgroundColor: Colors.primaryHover,
        borderColor: Colors.primaryLight,
    },
    optionText: {
        fontSize: 16,
        color: Colors.textMain,
        lineHeight: 22,
    },
    optionTextSelected: {
        color: Colors.textSelect,
        fontWeight: '600',
    },
    optionCorrect: {
        backgroundColor: 'rgba(104, 211, 145, 0.15)',
        borderColor: '#68D391',
    },
    optionWrong: {
        backgroundColor: 'rgba(252, 129, 129, 0.15)',
        borderColor: '#FC8181',
    },
    optionTextCorrect: {
        color: '#68D391',
        fontWeight: '600',
    },
    optionTextWrong: {
        color: '#FC8181',
        fontWeight: '600',
    },
    explanationContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#3182CE',
    },
    explanationLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#63B3ED',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    explanationText: {
        fontSize: 14,
        color: '#A0AEC0',
        lineHeight: 22,
    },
});
