export interface Option {
    id: string;
    text: string;
}

export interface Question {
    testNumber: number;
    id: string;
    originalId: string;
    question: string;
    options: Option[];
    correctAnswers: string[];
    explanation: string;
}

export type QuestionBank = Question[];

export interface ExamStatistics {
    totalAttempts: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    incorrectQuestionIds: string[];
}
