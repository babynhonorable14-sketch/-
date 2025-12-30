
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string; // The letter (A, B, C, D) or text matching an option
}

export enum AppStatus {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  SETTINGS = 'SETTINGS'
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  prizeCode: string;
  requiredCorrect: number;
}
