import { Colors } from '@/constants/theme';
import { Question } from '@/types';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    question: Question;
    selectedOptions: string[];
    onOptionToggle: (optionId: string, isMultipleChoice: boolean) => void;
}

export const QuestionCard = memo(function QuestionCard({ question, selectedOptions, onOptionToggle }: Props) {
    const isMultipleChoice = question.correctAnswers.length > 1;

    const getOptionStyle = (optionId: string) => {
        const isSelected = selectedOptions.includes(optionId);
        return isSelected ? styles.optionSelected : styles.optionDefault;
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
});
