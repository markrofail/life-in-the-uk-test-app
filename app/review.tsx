import { IncorrectQuestionsList } from '@/components/IncorrectQuestionsList';
import questionBankData from '@/data/question_bank.json';
import { useExamStore } from '@/stores/useExamStore';
import { Question } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
    const router = useRouter();
    const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);

    const incorrectQuestions = (questionBankData as Question[]).filter(q =>
        incorrectQuestionIds.includes(q.id)
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {incorrectQuestions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>You haven&apos;t gotten any questions wrong yet. Great job!</Text>
                    </View>
                ) : (
                    <IncorrectQuestionsList questions={incorrectQuestions} title="Your Incorrect Questions" />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    backText: {
        color: '#63B3ED',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E2E8F0',
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
        color: '#A0AEC0',
        fontSize: 18,
        textAlign: 'center',
    }
});
