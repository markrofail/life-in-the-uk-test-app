import { Colors } from '@/constants/theme';
import { Question } from '@/types';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Props {
    questions: Question[];
    title?: string;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
}

export function IncorrectQuestionsList({ questions, title, headerComponent, footerComponent }: Props) {
    if (questions.length === 0) return null;

    const renderItem = ({ item: q, index }: { item: Question; index: number }) => (
        <View style={styles.incorrectItem}>
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
    );

    return (
        <FlatList
            data={questions}
            keyExtractor={(q) => q.id}
            renderItem={renderItem}
            contentContainerStyle={styles.incorrectSummary}
            ListHeaderComponent={
                <View>
                    {headerComponent}
                    {title && <Text style={styles.summaryTitle}>{title}</Text>}
                </View>
            }
            ListFooterComponent={<View>{footerComponent}</View>}
        // we remove scrollEnabled={false} so this FlatList can take over scrolling for the whole page
        />
    );
}

const styles = StyleSheet.create({
    incorrectSummary: {
        marginBottom: 32,
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    incorrectItem: {
        backgroundColor: Colors.navBar,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
    },
    incorrectQuestionText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textMain,
        marginBottom: 12,
        lineHeight: 26,
    },
    correctLabel: {
        fontSize: 14,
        color: Colors.success,
        fontWeight: '700',
        marginBottom: 4,
    },
    correctText: {
        fontSize: 16,
        color: Colors.textMain,
        marginBottom: 4,
        marginLeft: 8,
    },
    explanationBox: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    explanationLabel: {
        fontWeight: '700',
        color: Colors.textMuted,
    },
    explanationText: {
        fontSize: 15,
        color: '#CBD5E0', // Slight off-white for body text context
        lineHeight: 22,
    },
});
