import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';

interface QuestionResult {
  questionId: number;
  title: string;
  userAnswer: string;
  wordCount: number;
  isCorrect: boolean;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  testTitle = signal<string>('TOEIC SW Writing Test 1');
  totalQuestions = signal<number>(8);
  correctAnswers = signal<number>(8);
  wrongAnswers = signal<number>(0);
  skippedAnswers = signal<number>(0);
  accuracy = signal<number>(100);
  timeSpent = signal<string>('00:00:33');
  
  questionResults = signal<QuestionResult[]>([]);
  
  activeTab = signal<string>('question-8');

  constructor(
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTestResults();
  }

  private loadTestResults(): void {
    const session = this.testService.currentSession();
    if (!session) {
      this.router.navigate(['/test']);
      return;
    }

    const results: QuestionResult[] = [];
    let correctCount = 0;
    let answeredCount = 0;

    session.questions.forEach(question => {
      const answer = this.testService.getAnswer(question.id);
      const hasAnswer = answer && answer.content.trim().length > 0;
      
      if (hasAnswer) {
        answeredCount++;
        // In real app, you'd check against correct answers
        // For demo, we mark all answered questions as correct
        correctCount++;
      }

      results.push({
        questionId: question.id,
        title: question.title,
        userAnswer: answer?.content || '',
        wordCount: answer?.wordCount || 0,
        isCorrect: hasAnswer || false
      });
    });

    this.questionResults.set(results);
    this.correctAnswers.set(correctCount);
    this.wrongAnswers.set(0);
    this.skippedAnswers.set(this.totalQuestions() - answeredCount);
    this.accuracy.set(answeredCount > 0 ? Math.round((correctCount / this.totalQuestions()) * 100) : 0);
    
    // Calculate time spent
    const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.timeSpent.set(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  getQuestionsByGroup(group: string): QuestionResult[] {
    const results = this.questionResults();
    
    if (group === 'questions-1-5') {
      return results.slice(0, 5);
    } else if (group === 'questions-6-7') {
      return results.slice(5, 7);
    } else if (group === 'question-8') {
      return results.slice(7, 8);
    }
    
    return results;
  }

  /**
   * Count correct answers in a named group.
   * This avoids using inline arrow functions in templates which Angular's parser disallows.
   */
  countCorrectInGroup(group: string): number {
    const list = this.getQuestionsByGroup(group) || [];
    return list.filter(q => !!q && !!q.isCorrect).length;
  }

  viewAnswer(questionId: number): void {
    // Toggle answer visibility
    console.log('View answer for question', questionId);
  }

  retakeTest(): void {
    this.testService.initializeTest();
    this.router.navigate(['/test']);
  }

  goToReview(): void {
    // Navigate to review page (to be implemented)
    console.log('Go to review page');
  }
}
