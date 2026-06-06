import { Question } from '@/types';
import { isAnswerCorrect } from '@/utils/examUtils';
import { useCallback, useReducer } from 'react';

// Define the state shape for the exam session
interface ExamSessionState {
    questions: Question[];
    currentIndex: number;
    selectedOptions: string[];
    currentCorrectIds: string[];
    currentIncorrectIds: string[];
    isFinished: boolean;
}

// Define the possible actions
type ExamSessionAction =
    | { type: 'INITIALIZE'; payload: Question[] }
    | { type: 'TOGGLE_OPTION'; payload: { optionId: string; isMultipleChoice: boolean } }
    | { type: 'NEXT_QUESTION' };

// The reducer function handling business logic
function examSessionReducer(state: ExamSessionState, action: ExamSessionAction): ExamSessionState {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                questions: action.payload,
                currentIndex: 0,
                selectedOptions: [],
                currentCorrectIds: [],
                currentIncorrectIds: [],
                isFinished: false,
            };

        case 'TOGGLE_OPTION': {
            const { optionId, isMultipleChoice } = action.payload;

            if (isMultipleChoice) {
                if (state.selectedOptions.includes(optionId)) {
                    return {
                        ...state,
                        selectedOptions: state.selectedOptions.filter((id) => id !== optionId),
                    };
                } else {
                    return {
                        ...state,
                        selectedOptions: [...state.selectedOptions, optionId],
                    };
                }
            } else {
                return {
                    ...state,
                    selectedOptions: [optionId],
                };
            }
        }

        case 'NEXT_QUESTION': {
            if (state.selectedOptions.length === 0) return state; // Prevent advancing without answering

            const currentQuestion = state.questions[state.currentIndex];
            const isCorrect = isAnswerCorrect(currentQuestion.correctAnswers, state.selectedOptions);

            const newCorrectIds = isCorrect ? [...state.currentCorrectIds, currentQuestion.id] : state.currentCorrectIds;
            const newIncorrectIds = !isCorrect ? [...state.currentIncorrectIds, currentQuestion.id] : state.currentIncorrectIds;

            const isLastQuestion = state.currentIndex >= state.questions.length - 1;

            return {
                ...state,
                currentCorrectIds: newCorrectIds,
                currentIncorrectIds: newIncorrectIds,
                currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
                selectedOptions: isLastQuestion ? state.selectedOptions : [],
                isFinished: isLastQuestion,
            };
        }

        default:
            return state;
    }
}

// Initial default state
const initialState: ExamSessionState = {
    questions: [],
    currentIndex: 0,
    selectedOptions: [],
    currentCorrectIds: [],
    currentIncorrectIds: [],
    isFinished: false,
};

/**
 * Custom hook to abstract exam logic using a reducer.
 */
export function useExamSession() {
    const [state, dispatch] = useReducer(examSessionReducer, initialState);

    const initializeExam = useCallback((questions: Question[]) => {
        dispatch({ type: 'INITIALIZE', payload: questions });
    }, []);

    const toggleOption = useCallback((optionId: string, isMultipleChoice: boolean) => {
        dispatch({ type: 'TOGGLE_OPTION', payload: { optionId, isMultipleChoice } });
    }, []);

    const nextQuestion = useCallback(() => {
        dispatch({ type: 'NEXT_QUESTION' });
    }, []);

    const currentQuestion = state.questions.length > 0 ? state.questions[state.currentIndex] : null;

    return {
        state,
        currentQuestion,
        initializeExam,
        toggleOption,
        nextQuestion,
    };
}
