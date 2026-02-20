import questionBankData from '../data/question_bank.json';
import { Question, QuestionBank } from '../types';

const questionBank: QuestionBank = questionBankData as QuestionBank;

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

export interface ExamConfig {
    incorrectIds: string[];
    correctIds: string[];
    onlyIncorrect?: boolean;
}

/**
 * Returns a random sample of `count` questions from the question bank.
 */
export function getRandomExamQuestions(count: number = 24, config?: ExamConfig): Question[] {
    if (config?.onlyIncorrect) {
        let pool = questionBank.filter(q => config.incorrectIds.includes(q.id));
        const shuffled = shuffle(pool);
        const selected = shuffled.slice(0, count);
        return selected.map(q => ({ ...q, options: shuffle(q.options) }));
    }

    if (config) {
        // Group A: Incorrect previously, but not yet mastered
        const groupA = questionBank.filter(q => config.incorrectIds.includes(q.id) && !config.correctIds.includes(q.id));
        // Group B: Unseen
        const groupB = questionBank.filter(q => !config.incorrectIds.includes(q.id) && !config.correctIds.includes(q.id));
        // Group C: Previously answered correctly
        const groupC = questionBank.filter(q => config.correctIds.includes(q.id));

        const shuffledA = shuffle(groupA);
        const shuffledB = shuffle(groupB);
        const shuffledC = shuffle(groupC);

        const combined = [...shuffledA, ...shuffledB, ...shuffledC];
        const selected = combined.slice(0, count);

        // Shuffle the selected array so the groups are randomly mixed in the actual exam
        const finalQuestions = shuffle(selected);
        return finalQuestions.map(q => ({ ...q, options: shuffle(q.options) }));
    }

    const shuffled = shuffle(questionBank);
    const selected = shuffled.slice(0, count);

    return selected.map(q => ({
        ...q,
        options: shuffle(q.options)
    }));
}
