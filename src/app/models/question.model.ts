export enum QuestionType {
  WRITE_SENTENCE = 'write-sentence', // Questions 1-5
  RESPOND_EMAIL = 'respond-email',   // Questions 6-7
  ESSAY = 'essay'                     // Question 8
}

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  content?: string;
  imageUrl?: string;
  prompt?: string;
  emailFrom?: string;
  emailTo?: string;
  emailSubject?: string;
  emailDate?: string;
  emailBody?: string;
  directions?: string;
}

export interface Answer {
  questionId: number;
  content: string;
  wordCount: number;
  timestamp: Date;
}

export interface TestSession {
  id: string;
  startTime: Date;
  timeLimit: number; // in seconds
  questions: Question[];
  answers: Map<number, Answer>;
  currentQuestionIndex: number;
}
