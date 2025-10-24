import { Injectable, signal } from '@angular/core';
import { Question, QuestionType, Answer, TestSession } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private testSession = signal<TestSession | null>(null);
  
  readonly currentSession = this.testSession.asReadonly();

  constructor() {}

  initializeTest(): void {
    const questions = this.getSampleQuestions();
    const session: TestSession = {
      id: `test-${Date.now()}`,
      startTime: new Date(),
      timeLimit: 60 * 60, // 60 minutes
      questions: questions,
      answers: new Map(),
      currentQuestionIndex: 0
    };
    this.testSession.set(session);
  }

  private getSampleQuestions(): Question[] {
    return [
      {
        id: 1,
        type: QuestionType.WRITE_SENTENCE,
        title: 'Write a sentence based on a picture',
        imageUrl: 'assets/img/image3.png',
        directions: 'Write ONE sentence that describes what you see in the picture. Use TWO words or phrases from the box.'
      },
      {
        id: 2,
        type: QuestionType.WRITE_SENTENCE,
        title: 'Write a sentence based on a picture',
        imageUrl: 'assets/img/image17.png',
        directions: 'Write ONE sentence that describes what you see in the picture. Use TWO words or phrases from the box.'
      },
      {
        id: 3,
        type: QuestionType.WRITE_SENTENCE,
        title: 'Write a sentence based on a picture',
        imageUrl: 'assets/img/image19.png',
        directions: 'Write ONE sentence that describes what you see in the picture. Use TWO words or phrases from the box.'
      },
      {
        id: 4,
        type: QuestionType.WRITE_SENTENCE,
        title: 'Write a sentence based on a picture',
        imageUrl: 'assets/img/image24.png',
        directions: 'Write ONE sentence that describes what you see in the picture. Use TWO words or phrases from the box.'
      },
      {
        id: 5,
        type: QuestionType.WRITE_SENTENCE,
        title: 'Write a sentence based on a picture',
        imageUrl: 'assets/img/image41.png',
        directions: 'Write ONE sentence that describes what you see in the picture. Use TWO words or phrases from the box.'
      },
      {
        id: 6,
        type: QuestionType.RESPOND_EMAIL,
        title: 'Respond to an email',
        emailFrom: 'update@dailyjobseeker.com',
        emailTo: 'Anna Billings',
        emailSubject: 'Daily Jobseeker update',
        emailDate: 'March 14, 20—',
        emailBody: `Dear Daily Jobseeker subscriber,

Here is the most recent job opening:

Marleyhorne Inc. is looking for an experienced accountant to fill a vacancy in its Accounting Department. The company needs someone with an accounting degree and at least three years of experience. Contact Ralph Kramer, r_kramer@marleyhorne.com.`,
        directions: 'Respond to the e-mail as if you are interested in applying for the position. Make ONE statement about your professional background and TWO requests for information about the job.'
      },
      {
        id: 7,
        type: QuestionType.RESPOND_EMAIL,
        title: 'Respond to an email',
        emailFrom: 'hr@techcompany.com',
        emailTo: 'Job Applicant',
        emailSubject: 'Interview Invitation',
        emailDate: 'March 15, 20—',
        emailBody: `Dear Applicant,

Thank you for your interest in the Software Developer position at Tech Company. We would like to invite you for an interview next week.

Please let us know your availability.

Best regards,
HR Department`,
        directions: 'Respond to the e-mail. Confirm your interest in the interview and provide your availability.'
      },
      {
        id: 8,
        type: QuestionType.ESSAY,
        title: 'Write an opinion essay',
        prompt: 'Many people enjoy spending time playing and watching sports. Why do you think sports are important to people? Give specific reasons and examples to support your opinion.',
        directions: 'In your response, make sure to: • give your opinion; • provide supporting reasons and examples.'
      }
    ];
  }

  getCurrentQuestion(): Question | null {
    const session = this.testSession();
    if (!session) return null;
    return session.questions[session.currentQuestionIndex] || null;
  }

  navigateToQuestion(index: number): void {
    const session = this.testSession();
    if (!session) return;
    
    if (index >= 0 && index < session.questions.length) {
      this.testSession.update(s => s ? { ...s, currentQuestionIndex: index } : null);
    }
  }

  saveAnswer(questionId: number, content: string): void {
    const session = this.testSession();
    if (!session) return;

    const wordCount = this.countWords(content);
    const answer: Answer = {
      questionId,
      content,
      wordCount,
      timestamp: new Date()
    };

    const newAnswers = new Map(session.answers);
    newAnswers.set(questionId, answer);

    this.testSession.update(s => s ? { ...s, answers: newAnswers } : null);
  }

  getAnswer(questionId: number): Answer | undefined {
    const session = this.testSession();
    return session?.answers.get(questionId);
  }

  countWords(text: string): number {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).length;
  }

  getRemainingTime(): number {
    const session = this.testSession();
    if (!session) return 0;

    const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
    const remaining = session.timeLimit - elapsed;
    return Math.max(0, remaining);
  }

  submitTest(): void {
    const session = this.testSession();
    if (!session) return;
    
    console.log('Test submitted:', session);
    // Here you would typically send the answers to a backend
    alert('Bài thi đã được nộp thành công!');
  }
}
