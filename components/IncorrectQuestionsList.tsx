import { Question } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    questions: Question[];
    title?: string;
}

export function IncorrectQuestionsList({ questions, title = "Incorrect Answers Review" }: Props) {
    if (questions.length === 0) return null;

    return (
        <View style={styles.incorrectSummary}>
            <Text style={styles.summaryTitle}>{title}</Text>
            {questions.map((q, index) => (
                <View key={q.id} style={styles.incorrectItem}>
                    <Text style={styles.incorrectQuestionText}>
                        {index + 1}. {q.question}
                    </Text>

                    <Text style={styles.correctLabel}>Correct Answer(s):</Text>
                    {q.options
                        .filter(opt => q.correctAnswers.includes(opt.id))
                        .map(opt => (
                            <Text key={opt.id} style={styles.correctText}>
                                • {opt.text}
                            </Text>
                        ))}

                    <View style={styles.explanationBox}>
                        <Text style={styles.explanationText}>
                            <Text style={styles.explanationLabel}>Explanation: </Text>
                            {q.explanation}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    incorrectSummary: {
        marginBottom: 32,
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    incorrectItem: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FC8181',
    },
    incorrectQuestionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E2E8F0',
        marginBottom: 12,
        lineHeight: 26,
    },
    correctLabel: {
        fontSize: 14,
        color: '#68D391',
        fontWeight: '700',
        marginBottom: 4,
    },
    correctText: {
        fontSize: 16,
        color: '#E2E8F0',
        marginBottom: 4,
        marginLeft: 8,
    },
    explanationBox: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    explanationLabel: {
        fontWeight: '700',
        color: '#A0AEC0',
    },
    explanationText: {
        fontSize: 15,
        color: '#CBD5E0',
        lineHeight: 22,
    },
});
