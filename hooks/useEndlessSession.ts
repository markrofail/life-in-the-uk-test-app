import { Question } from '@/types';
import { useCallback, useReducer } from 'react';

// Define the state shape for the endless session
interface EndlessSessionState {
    questions: Question[];
    currentIndex: number;
    selectedOptions: string[];
    isRevealed: boolean;
    isFinished: boolean;
}

// Define the possible actions
type EndlessSessionAction =
    | { type: 'INITIALIZE'; payload: Question[] }
    | { type: 'TOGGLE_OPTION'; payload: { optionId: string; isMultipleChoice: boolean } }
    | { type: 'SUBMIT' }
    | { type: 'NEXT' };

// The reducer function handling business logic
function endlessSessionReducer(
    state: EndlessSessionState,
    action: EndlessSessionAction
): EndlessSessionState {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                questions: action.payload,
                currentIndex: 0,
                selectedOptions: [],
                isRevealed: false,
                isFinished: false,
            };

        case 'TOGGLE_OPTION': {
            if (state.isRevealed) return state;
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
                return { ...state, selectedOptions: [optionId] };
            }
        }

        case 'SUBMIT': {
            if (state.selectedOptions.length === 0 || state.isRevealed) return state;
            return { ...state, isRevealed: true };
        }

        case 'NEXT': {
            if (!state.isRevealed) return state;
            const isLastQuestion = state.currentIndex >= state.questions.length - 1;

            if (isLastQuestion) {
                return { ...state, isFinished: true };
            }

            return {
                ...state,
                currentIndex: state.currentIndex + 1,
                selectedOptions: [],
                isRevealed: false,
            };
        }

        default:
            return state;
    }
}

// Initial default state
const initialState: EndlessSessionState = {
    questions: [],
    currentIndex: 0,
    selectedOptions: [],
    isRevealed: false,
    isFinished: false,
};

/**
 * Custom hook to abstract endless session logic using a reducer.
 * In an endless session, users answer questions one at a time, see the answer revealed,
 * then move to the next question. The session never ends unless explicitly finished.
 */
export function useEndlessSession() {
    const [state, dispatch] = useReducer(endlessSessionReducer, initialState);

    const initializeSession = useCallback((questions: Question[]) => {
        dispatch({ type: 'INITIALIZE', payload: questions });
    }, []);

    const toggleOption = useCallback((optionId: string, isMultipleChoice: boolean) => {
        dispatch({ type: 'TOGGLE_OPTION', payload: { optionId, isMultipleChoice } });
    }, []);

    const submitAnswer = useCallback(() => {
        dispatch({ type: 'SUBMIT' });
    }, []);

    const nextQuestion = useCallback(() => {
        dispatch({ type: 'NEXT' });
    }, []);

    const currentQuestion =
        state.questions.length > 0 ? state.questions[state.currentIndex] : null;

    return {
        state,
        currentQuestion,
        initializeSession,
        toggleOption,
        submitAnswer,
        nextQuestion,
    };
}
