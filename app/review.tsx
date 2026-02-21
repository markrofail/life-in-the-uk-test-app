import { IncorrectQuestionsList } from '@/components/IncorrectQuestionsList';
import { Colors } from '@/constants/theme';
import { useExamStore } from '@/stores/useExamStore';
import { getQuestionsByIds } from '@/utils/examUtils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
    const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);

    const incorrectQuestions = getQuestionsByIds(incorrectQuestionIds);

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={styles.scrollContent}>
                {incorrectQuestions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>You haven&apos;t gotten any questions wrong yet. Great job!</Text>
                    </View>
                ) : (
                    <IncorrectQuestionsList questions={incorrectQuestions} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: 18,
        textAlign: 'center',
    }
});
