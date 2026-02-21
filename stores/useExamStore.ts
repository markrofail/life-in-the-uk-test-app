import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

                // Remove questions from incorrect list if they were answered correctly
                correctQuestions.forEach(id => newIncorrectSet.delete(id));

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
