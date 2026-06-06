import { AppConfig } from '@/constants/config';
import questionBankData from '../data/question_bank.json';
import { Question, QuestionBank } from '../types';

const questionBank: QuestionBank = questionBankData as QuestionBank;

export const getTotalQuestionCount = (): number => questionBank.length;

export const getQuestionsByIds = (ids: string[]): Question[] => {
    const idSet = new Set(ids);
    return questionBank.filter(q => idSet.has(q.id));
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Returns true if the question is a True/False or Yes/No question,
 * in which case we should probably NOT shuffle the options to keep them consistent.
 */
function isBooleanQuestion(question: Question): boolean {
    const texts = question.options.map(opt => opt.text.trim().toLowerCase());
    const booleanSets = [
        ['true', 'false'],
        ['yes', 'no']
    ];

    return booleanSets.some(set =>
        texts.length === set.length && texts.every(t => set.includes(t))
    );
}

interface ExamConfig {
    incorrectIds?: string[];
    correctIds?: string[];
}

/**
 * Returns a random sample of `count` questions from the question bank.
 * Prioritizes: Previously Incorrect > Unseen > Mastered
 */
export function getRandomExamQuestions(
    count: number = AppConfig.EXAM_QUESTION_COUNT,
    config: ExamConfig = {}
): Question[] {
    const { incorrectIds = [], correctIds = [] } = config;

    // Categorize questions into 3 priority groups
    const previouslyIncorrectQuestions = questionBank.filter(q =>
        incorrectIds.includes(q.id) && !correctIds.includes(q.id)
    );
    const unseenQuestions = questionBank.filter(q =>
        !incorrectIds.includes(q.id) && !correctIds.includes(q.id)
    );
    const masteredQuestions = questionBank.filter(q =>
        correctIds.includes(q.id)
    );

    // Shuffle each group internally
    const shuffledIncorrect = shuffle(previouslyIncorrectQuestions);
    const shuffledUnseen = shuffle(unseenQuestions);
    const shuffledMastered = shuffle(masteredQuestions);

    // Combine in priority order and take the requested count
    const combined = [...shuffledIncorrect, ...shuffledUnseen, ...shuffledMastered];
    const selected = combined.slice(0, count);

    // Final shuffle so the groups are randomly mixed in the actual exam
    const finalQuestions = shuffle(selected);

    // Return questions with correctly handled option shuffling
    return finalQuestions.map(q => ({
        ...q,
        options: isBooleanQuestion(q) ? q.options : shuffle(q.options)
    }));
}

/**
 * Returns true if the selected option IDs exactly match the correct answers for a question.
 */
export function isAnswerCorrect(correctAnswers: string[], selectedOptions: string[]): boolean {
    if (selectedOptions.length !== correctAnswers.length) return false;
    const selectedSorted = [...selectedOptions].sort();
    const correctSorted = [...correctAnswers].sort();
    return selectedSorted.every((val, idx) => val === correctSorted[idx]);
}
