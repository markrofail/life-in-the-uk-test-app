import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ExamStoreState {
    totalAttempts: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;

    // We can track incorrect questions uniquely to avoid double penalizing
    // and perhaps to surface them for a target review later.
    incorrectQuestionIds: string[];

    // Track total unique correctly answered questions to calculate percentage 
    // of the total 1198+ questions in the bank.
    correctQuestionIds: string[];

    // Actions
    recordExamResult: (
        correctQuestions: string[],
        incorrectQuestions: string[]
    ) => void;
    resetStats: () => void;
}

export const useExamStore = create<ExamStoreState>()(
    persist(
        (set, get) => ({
            totalAttempts: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            incorrectQuestionIds: [],
            correctQuestionIds: [],

            recordExamResult: (correctQuestions, incorrectQuestions) => set((state) => {
                const newIncorrectSet = new Set(state.incorrectQuestionIds);
                incorrectQuestions.forEach(id => newIncorrectSet.add(id));

                const newCorrectSet = new Set(state.correctQuestionIds);
                correctQuestions.forEach(id => newCorrectSet.add(id));

                // If a previously missed question is now correct, we could remove it
                // from incorrectSet, but usually we just want to know what they've 
                // ever gotten wrong. Let's keep it simple and just track history.

                return {
                    totalAttempts: state.totalAttempts + 1,
                    totalQuestionsAnswered: state.totalQuestionsAnswered + correctQuestions.length + incorrectQuestions.length,
                    totalCorrectAnswers: state.totalCorrectAnswers + correctQuestions.length,
                    incorrectQuestionIds: Array.from(newIncorrectSet),
                    correctQuestionIds: Array.from(newCorrectSet),
                };
            }),

            resetStats: () => set({
                totalAttempts: 0,
                totalQuestionsAnswered: 0,
                totalCorrectAnswers: 0,
                incorrectQuestionIds: [],
                correctQuestionIds: [],
            })
        }),
        {
            name: 'life-in-ul-exam-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
