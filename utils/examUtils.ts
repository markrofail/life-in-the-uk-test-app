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

/**
 * Returns a random sample of `count` questions from the question bank.
 */
export function getRandomExamQuestions(count: number = 24): Question[] {
    const shuffled = shuffle(questionBank);
    const selected = shuffled.slice(0, count);

    return selected.map(q => ({
        ...q,
        options: shuffle(q.options)
    }));
}
