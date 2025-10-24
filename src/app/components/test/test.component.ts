import { Component, OnInit, OnDestroy, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { Question, QuestionType } from '../../models/question.model';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit, OnDestroy {
  QuestionType = QuestionType;
  
  currentQuestion = signal<Question | null>(null);
  currentAnswer = signal<string>('');
  wordCount = computed(() => this.testService.countWords(this.currentAnswer()));
  remainingTime = signal<number>(0);
  
  // Cache questions for current group using computed signal
  questionsForCurrentGroup = computed(() => {
    const session = this.testService.currentSession();
    if (!session) return [];

    const currentIndex = session.currentQuestionIndex;
    
    // Questions 1-5
    if (currentIndex >= 0 && currentIndex <= 4) {
      return session.questions.slice(0, 5);
    }
    
    // Questions 6-7
    if (currentIndex >= 5 && currentIndex <= 6) {
      return session.questions.slice(5, 7);
    }
    
    // Question 8
    if (currentIndex === 7) {
      return [session.questions[7]];
    }
    
    return [];
  });
  
  private timerInterval?: number;
  private platformId = inject(PLATFORM_ID);

  constructor(
    public testService: TestService,
    private router: Router
  ) {
    effect(() => {
      const question = this.currentQuestion();
      if (question) {
        const savedAnswer = this.testService.getAnswer(question.id);
        this.currentAnswer.set(savedAnswer?.content || '');
      }
    });
  }

  ngOnInit(): void {
    this.testService.initializeTest();
    this.loadCurrentQuestion();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private loadCurrentQuestion(): void {
    const question = this.testService.getCurrentQuestion();
    this.currentQuestion.set(question);
  }

  private startTimer(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateRemainingTime();
      this.timerInterval = window.setInterval(() => {
        this.updateRemainingTime();
      }, 1000);
    }
  }

  private updateRemainingTime(): void {
    const remaining = this.testService.getRemainingTime();
    this.remainingTime.set(remaining);
    if (remaining === 0) {
      this.submitTest();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  navigateToQuestion(index: number): void {
    this.saveCurrentAnswer();
    this.testService.navigateToQuestion(index);
    this.loadCurrentQuestion();
  }

  private saveCurrentAnswer(): void {
    const question = this.currentQuestion();
    if (question) {
      this.testService.saveAnswer(question.id, this.currentAnswer());
    }
  }

  onAnswerChange(value: string): void {
    this.currentAnswer.set(value);
    this.saveCurrentAnswer();
  }

  onInlineAnswerChange(questionId: number, value: string): void {
    this.testService.saveAnswer(questionId, value);
  }

  getAnswerForQuestion(questionId: number): string {
    const answer = this.testService.getAnswer(questionId);
    return answer?.content || '';
  }

  getWordCountForQuestion(questionId: number): number {
    const answer = this.testService.getAnswer(questionId);
    return answer?.wordCount || 0;
  }

  getQuestionsForCurrentGroup(): Question[] {
    // Use the computed signal instead
    return this.questionsForCurrentGroup();
  }

  trackByQuestionId(index: number, question: Question): number {
    return question.id;
  }

  submitTest(): void {
    console.log('Submit test clicked!');
    this.saveCurrentAnswer();
    if (isPlatformBrowser(this.platformId) && this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    console.log('Navigating to result page...');
    // Navigate to result page
    this.router.navigate(['/result']).then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  getQuestionGroupIndices(): { [key: string]: number[] } {
    const session = this.testService.currentSession();
    if (!session) return {};

    return {
      'Questions 1-5': [0, 1, 2, 3, 4],
      'Questions 6-7': [5, 6],
      'Question 8': [7]
    };
  }

  getCurrentQuestionIndex(): number {
    return this.testService.currentSession()?.currentQuestionIndex || 0;
  }

  isQuestionAnswered(index: number): boolean {
    const session = this.testService.currentSession();
    if (!session) return false;
    const question = session.questions[index];
    const answer = this.testService.getAnswer(question.id);
    return !!answer && answer.content.trim().length > 0;
  }
}
