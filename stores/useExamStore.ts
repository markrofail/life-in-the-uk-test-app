import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ExamResultSummary {
    score: number;
    total: number;
    incorrectIds: string[];
}

interface ExamStoreState {
    totalAttempts: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;

    // We can track incorrect questions uniquely to avoid double penalizing
    // and perhaps to surface them for a target review later.
    incorrectQuestionIds: string[];

    // Track total unique correctly answered questions to calculate percentage 
    // of the total 1198+ questions in the bank.
    correctQuestionIds: string[];

    // Store the result of the most recently taken exam
    lastExamResult: ExamResultSummary | null;

    // Actions
    recordExamResult: (
        correctQuestions: string[],
        incorrectQuestions: string[]
    ) => void;
    resetStats: () => void;
    recordQuestionResult: (id: string, isCorrect: boolean) => void;
}

export const useExamStore = create<ExamStoreState>()(
    persist(
        (set, get) => ({
            totalAttempts: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            incorrectQuestionIds: [],
            correctQuestionIds: [],
            lastExamResult: null,

            recordExamResult: (correctQuestions, incorrectQuestions) => set((state) => {
                const newIncorrectSet = new Set(state.incorrectQuestionIds);
                incorrectQuestions.forEach(id => newIncorrectSet.add(id));

                const newCorrectSet = new Set(state.correctQuestionIds);
                correctQuestions.forEach(id => newCorrectSet.add(id));

                // Remove questions from incorrect list if they were answered correctly
                correctQuestions.forEach(id => newIncorrectSet.delete(id));

                return {
                    totalAttempts: state.totalAttempts + 1,
                    totalQuestionsAnswered: state.totalQuestionsAnswered + correctQuestions.length + incorrectQuestions.length,
                    totalCorrectAnswers: state.totalCorrectAnswers + correctQuestions.length,
                    incorrectQuestionIds: Array.from(newIncorrectSet),
                    correctQuestionIds: Array.from(newCorrectSet),
                    lastExamResult: {
                        score: correctQuestions.length,
                        total: correctQuestions.length + incorrectQuestions.length,
                        incorrectIds: incorrectQuestions
                    }
                };
            }),

            resetStats: () => set({
                totalAttempts: 0,
                totalQuestionsAnswered: 0,
                totalCorrectAnswers: 0,
                incorrectQuestionIds: [],
                correctQuestionIds: [],
                lastExamResult: null,
            }),

            recordQuestionResult: (id, isCorrect) => set((state) => {
                const newIncorrectSet = new Set(state.incorrectQuestionIds);
                const newCorrectSet = new Set(state.correctQuestionIds);

                if (isCorrect) {
                    newCorrectSet.add(id);
                    newIncorrectSet.delete(id);
                } else {
                    newIncorrectSet.add(id);
                }

                return {
                    incorrectQuestionIds: Array.from(newIncorrectSet),
                    correctQuestionIds: Array.from(newCorrectSet),
                };
            })
        }),
        {
            name: 'life-in-uk-exam-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
