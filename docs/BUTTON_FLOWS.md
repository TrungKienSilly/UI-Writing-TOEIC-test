# Button Flows & Functionality Documentation

## 📚 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Test Page - Buttons & Interactions](#test-page---buttons--interactions)
3. [Result Page - Buttons & Interactions](#result-page---buttons--interactions)
4. [Flow Diagrams](#flow-diagrams)
5. [State Management](#state-management)
6. [Error Handling](#error-handling)

---

## 1. Tổng quan

### 1.1 Scope
Tài liệu này mô tả chi tiết:
- Chức năng từng button trong ứng dụng
- Luồng xử lý khi user tương tác
- State changes và side effects
- Validation và error handling
- User feedback mechanisms

### 1.2 Button Categories

| Category | Location | Count | Purpose |
|----------|----------|-------|---------|
| Navigation | Test Page | 11 | Di chuyển giữa các câu hỏi |
| Action | Test Page | 3 | Submit, Exit, Next |
| Utility | Test Page | 3 | Thêm ghi chú, Dictionary icons |
| Tab Control | Both Pages | 7 | Chuyển đổi views |
| Result Actions | Result Page | 5 | Xem đáp án, Làm lại, Comment |

---

## 2. Test Page - Buttons & Interactions

### 2.1 Header Buttons

#### 2.1.1 Exit Button ("Thoát")

**Location**: `test-header > test-title > exit-btn`

**Visual Properties**:
```scss
.exit-btn {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(86, 171, 47, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(86, 171, 47, 0.4);
  }
}
```

**Functionality**:
```typescript
Function: onExitClick()

Purpose: Exit test session với confirmation

Flow:
┌─────────────────┐
│ User clicks     │
│ "Thoát" button  │
└────────┬────────┘
         ↓
┌─────────────────────────────────┐
│ Show confirmation dialog:       │
│ "Bạn có chắc muốn thoát?        │
│  Tiến trình sẽ không được lưu." │
└────────┬────────────────────────┘
         ↓
    ┌────┴────┐
    ↓         ↓
┌────────┐  ┌──────────┐
│ Cancel │  │ Confirm  │
└────────┘  └─────┬────┘
                  ↓
         ┌────────────────┐
         │ Clear session  │
         │ Clear timer    │
         │ Navigate to /  │
         └────────────────┘
```

**Implementation**:
```typescript
onExitClick(): void {
  const confirmed = confirm(
    'Bạn có chắc muốn thoát?\n' +
    'Tiến trình sẽ không được lưu.'
  );
  
  if (!confirmed) return;
  
  // Cleanup
  this.saveCurrentAnswer();
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
  }
  
  // Optional: Save progress to localStorage
  this.testService.saveProgress();
  
  // Navigate
  this.router.navigate(['/']);
}
```

**State Changes**:
- Timer stopped
- Session may be saved to localStorage
- Navigation to home

**User Feedback**:
- Confirmation dialog
- No toast/notification (immediate navigation)

---

### 2.2 Tab Navigation Buttons

#### 2.2.1 Questions 1-5 Tab

**Location**: `question-tabs > tab-btn[0]`

**HTML**:
```html
<button 
  class="tab-btn"
  [class.active]="getCurrentQuestionIndex() >= 0 && getCurrentQuestionIndex() <= 4"
  (click)="navigateToQuestion(0)">
  Questions 1-5
</button>
```

**Functionality**:
```typescript
Function: navigateToQuestion(0)

Purpose: Chuyển đến câu hỏi đầu tiên trong group 1-5

Preconditions:
- Test session exists
- Questions loaded

Flow:
┌──────────────────┐
│ User clicks tab  │
│ "Questions 1-5"  │
└────────┬─────────┘
         ↓
┌─────────────────────────┐
│ saveCurrentAnswer()     │
│ (Lưu câu trả lời hiện   │
│  tại nếu đang viết)     │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ testService.navigate    │
│ ToQuestion(0)           │
│ - Update session.index  │
│ - Trigger signal update │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ loadCurrentQuestion()   │
│ - Load question data    │
│ - Load saved answer     │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ UI Updates:             │
│ - Tab becomes active    │
│ - Question content      │
│ - Answer textarea       │
│ - Word count reset      │
└─────────────────────────┘
```

**State Changes**:
```typescript
Before:
{
  currentQuestionIndex: 5,  // Question 6
  currentAnswer: "Email response...",
  wordCount: 45
}

After:
{
  currentQuestionIndex: 0,  // Question 1
  currentAnswer: "Saved answer for Q1" || "",
  wordCount: 12 || 0
}
```

**Active State Logic**:
```typescript
isActive(): boolean {
  const index = getCurrentQuestionIndex();
  return index >= 0 && index <= 4;
}
```

**Visual Feedback**:
- Tab highlight (green gradient text + bottom border)
- Content panel transitions
- Sidebar highlights update

#### 2.2.2 Questions 6-7 Tab

**Functionality**: Tương tự Questions 1-5, nhưng navigate đến index 5

```typescript
(click)="navigateToQuestion(5)"

isActive(): boolean {
  const index = getCurrentQuestionIndex();
  return index >= 5 && index <= 6;
}
```

#### 2.2.3 Question 8 Tab

**Functionality**: Navigate đến essay question

```typescript
(click)="navigateToQuestion(7)"

isActive(): boolean {
  return getCurrentQuestionIndex() === 7;
}
```

---

### 2.3 Question Number Buttons

#### 2.3.1 Individual Question Navigation

**Location**: `navigation-section > question-group > question-numbers > question-num-btn`

**HTML Template**:
```html
<button 
  *ngFor="let idx of [0, 1, 2, 3, 4]"
  class="question-num-btn"
  [class.active]="getCurrentQuestionIndex() === idx"
  [class.answered]="isQuestionAnswered(idx)"
  (click)="navigateToQuestion(idx)">
  {{ idx + 1 }}
</button>
```

**Visual States**:

```scss
.question-num-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-weight: 700;
  
  // Default state - Chưa trả lời, chưa active
  border: 2px solid #e0e0e0;
  background-color: white;
  color: #666;
  
  // Hover state
  &:hover {
    border-color: #56ab2f;
    color: #56ab2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(86, 171, 47, 0.2);
  }
  
  // Active state - Đang xem câu này
  &.active {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 16px rgba(86, 171, 47, 0.4);
  }
  
  // Answered state - Đã trả lời
  &.answered {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
  
  // Active + Answered - Đang xem câu đã trả lời
  &.active.answered {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
    color: white;
  }
}
```

**State Determination Logic**:

```typescript
isQuestionAnswered(index: number): boolean {
  const session = this.testService.currentSession();
  if (!session) return false;
  
  const question = session.questions[index];
  const answer = this.testService.getAnswer(question.id);
  
  // Coi như đã trả lời nếu có content và không phải empty string
  return !!answer && answer.content.trim().length > 0;
}
```

**Click Flow**:

```typescript
navigateToQuestion(index: number): void {
  // 1. Validate index
  if (index < 0 || index > 7) {
    console.error('Invalid question index:', index);
    return;
  }
  
  // 2. Save current work
  this.saveCurrentAnswer();
  
  // 3. Update service state
  this.testService.navigateToQuestion(index);
  
  // 4. Load new question
  this.loadCurrentQuestion();
  
  // 5. Scroll to top (optional)
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**State Transition Example**:

```
Button State Transitions:

┌─────────────┐  User types answer   ┌──────────────┐
│ Default     │ ──────────────────→  │ Answered     │
│ (gray)      │                      │ (green)      │
└─────────────┘                      └──────────────┘
      ↓                                     ↓
      │ User clicks button                  │ User clicks button
      ↓                                     ↓
┌─────────────┐                      ┌──────────────┐
│ Active      │                      │ Active +     │
│ (gradient)  │                      │ Answered     │
└─────────────┘                      │ (gradient)   │
                                     └──────────────┘
```

---

### 2.4 Answer Input Controls

#### 2.4.1 Answer Textarea

**Location**: `answer-input-section > answer-textarea`

**HTML**:
```html
<textarea 
  class="answer-textarea"
  [value]="currentAnswer()"
  (input)="onAnswerChange($any($event.target).value)"
  placeholder="Nhập câu trả lời của bạn...">
</textarea>
```

**Functionality**:

```typescript
onAnswerChange(value: string): void {
  // 1. Update signal immediately (for reactivity)
  this.currentAnswer.set(value);
  
  // 2. Word count auto-updates via computed signal
  // wordCount = computed(() => this.testService.countWords(this.currentAnswer()))
  
  // 3. Auto-save to service
  this.saveCurrentAnswer();
}

saveCurrentAnswer(): void {
  const question = this.currentQuestion();
  if (!question) return;
  
  const content = this.currentAnswer();
  
  // Save to service (updates answers Map)
  this.testService.saveAnswer(question.id, content);
  
  // Optional: Debounced localStorage save
  this.debouncedLocalStorageSave();
}
```

**Debounced Save Implementation**:

```typescript
private saveTimeout?: number;

debouncedLocalStorageSave(): void {
  if (this.saveTimeout) {
    clearTimeout(this.saveTimeout);
  }
  
  this.saveTimeout = window.setTimeout(() => {
    const session = this.testService.currentSession();
    if (session) {
      localStorage.setItem('test-session', JSON.stringify({
        id: session.id,
        startTime: session.startTime,
        answers: Array.from(session.answers.entries())
      }));
    }
  }, 1000); // Save after 1 second of no typing
}
```

**Auto-save Flow**:

```
User types in textarea
         ↓
(input) event fires (every keystroke)
         ↓
onAnswerChange(value) called
         ↓
┌────────────────────────────────┐
│ 1. Update currentAnswer signal │
│    → UI word count updates     │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 2. saveCurrentAnswer()         │
│    → Save to service Map       │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 3. debouncedLocalStorageSave() │
│    → Save to localStorage      │
│      after 1s idle             │
└────────────────────────────────┘
```

#### 2.4.2 Next Button

**Location**: `answer-input-section > next-btn`

**HTML**:
```html
<button 
  class="next-btn" 
  *ngIf="getCurrentQuestionIndex() < 7"
  (click)="navigateToQuestion(getCurrentQuestionIndex() + 1)">
  Next
</button>
```

**Visibility Logic**:
```typescript
// Button chỉ hiện khi KHÔNG phải câu cuối (Question 8)
*ngIf="getCurrentQuestionIndex() < 7"

// Questions 0-6: Show button
// Question 7: Hide button (replace with Submit logic)
```

**Functionality**:
```typescript
Function: navigateToQuestion(currentIndex + 1)

Purpose: Di chuyển đến câu hỏi tiếp theo

Flow:
┌────────────────┐
│ User clicks    │
│ Next button    │
└───────┬────────┘
        ↓
┌───────────────────────┐
│ Calculate next index  │
│ = current + 1         │
└───────┬───────────────┘
        ↓
┌───────────────────────┐
│ Same as navigation    │
│ flow (see above)      │
└───────────────────────┘
```

**Edge Cases**:
```typescript
// On Question 7 (last question):
// - Button is hidden
// - User must use Submit button instead

// On Questions 0-6:
// - Button is visible
// - Clicking navigates to next question
// - Previous answer is auto-saved
```

---

### 2.5 Timer & Submit Section

#### 2.5.1 Submit Button ("NỘP BÀI")

**Location**: `timer-section > submit-btn`

**HTML**:
```html
<button 
  class="submit-btn" 
  (click)="submitTest()">
  NỘP BÀI
</button>
```

**Visual Design**:
```scss
.submit-btn {
  padding: 0.55rem 1.6rem;
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(86, 171, 47, 0.28);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(86, 171, 47, 0.36);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

**Functionality - Full Flow**:

```typescript
submitTest(): void {
  console.log('Submit test clicked!');
  
  // 1. Save current answer
  this.saveCurrentAnswer();
  
  // 2. Stop timer
  if (isPlatformBrowser(this.platformId) && this.timerInterval) {
    clearInterval(this.timerInterval);
  }
  
  // 3. Optional: Show confirmation
  const confirmed = confirm(
    'Bạn có chắc muốn nộp bài?\n' +
    'Bạn sẽ không thể chỉnh sửa sau khi nộp.'
  );
  
  if (!confirmed) {
    // Restart timer if user cancels
    this.startTimer();
    return;
  }
  
  // 4. Calculate final statistics
  const session = this.testService.currentSession();
  if (!session) {
    console.error('No session found');
    return;
  }
  
  const stats = {
    totalQuestions: session.questions.length,
    answeredQuestions: session.answers.size,
    timeSpent: Math.floor((Date.now() - session.startTime.getTime()) / 1000),
    completionRate: (session.answers.size / session.questions.length) * 100
  };
  
  console.log('Test Statistics:', stats);
  
  // 5. Optional: Send to API
  // await this.testService.submitToAPI(session);
  
  // 6. Navigate to result page
  console.log('Navigating to result page...');
  this.router.navigate(['/result']).then(success => {
    console.log('Navigation success:', success);
  }).catch(error => {
    console.error('Navigation error:', error);
  });
}
```

**Submit Flow Diagram**:

```
┌────────────────────┐
│ User clicks        │
│ "NỘP BÀI"         │
└─────────┬──────────┘
          ↓
┌─────────────────────────┐
│ Save current answer     │
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│ Stop timer              │
└─────────┬───────────────┘
          ↓
┌─────────────────────────────────┐
│ Show confirmation dialog        │
│ "Bạn có chắc muốn nộp bài?"    │
└─────────┬───────────────────────┘
          ↓
     ┌────┴─────┐
     ↓          ↓
┌─────────┐  ┌──────────────────┐
│ Cancel  │  │ Confirm          │
│ (Restart│  └────────┬─────────┘
│  timer) │           ↓
└─────────┘  ┌──────────────────┐
             │ Calculate stats  │
             └────────┬─────────┘
                      ↓
             ┌──────────────────┐
             │ Optional: API    │
             │ submission       │
             └────────┬─────────┘
                      ↓
             ┌──────────────────┐
             │ Navigate to      │
             │ /result          │
             └──────────────────┘
```

**Triggers for Auto-Submit**:

```typescript
// Timer reaches 0
updateRemainingTime(): void {
  const remaining = this.testService.getRemainingTime();
  this.remainingTime.set(remaining);
  
  if (remaining === 0) {
    // Auto-submit without confirmation
    alert('Hết giờ! Bài thi sẽ được nộp tự động.');
    this.submitTest();
  }
}
```

**State Changes on Submit**:

```typescript
Before Submit:
{
  timerInterval: 12345,
  remainingTime: 1234,
  currentQuestionIndex: 7,
  answers: Map(8) { ... }
}

After Submit:
{
  timerInterval: null,  // Cleared
  remainingTime: 0,     // Frozen
  route: '/result',     // Navigated
  session: {...}        // Preserved for result page
}
```

---

### 2.6 Utility Buttons

#### 2.6.1 "Thêm ghi chú / dán ý" Button

**Location**: `question-header > add-note-btn`

**HTML**:
```html
<button class="add-note-btn">Thêm ghi chú / dán ý</button>
```

**Current Status**: 🚧 Not Implemented

**Planned Functionality**:

```typescript
onAddNoteClick(): void {
  // Open note-taking dialog/panel
  const dialogRef = this.dialog.open(NoteDialogComponent, {
    width: '600px',
    data: {
      questionId: this.currentQuestion()?.id,
      existingNote: this.getNoteForQuestion()
    }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.saveNoteForQuestion(result);
    }
  });
}
```

**Expected Flow**:

```
┌────────────────┐
│ User clicks    │
│ "Thêm ghi chú" │
└───────┬────────┘
        ↓
┌───────────────────────┐
│ Open modal/panel      │
│ - Rich text editor    │
│ - Save/Cancel buttons │
└───────┬───────────────┘
        ↓
   ┌────┴────┐
   ↓         ↓
┌────────┐ ┌──────────┐
│ Cancel │ │ Save     │
└────────┘ └─────┬────┘
                 ↓
        ┌────────────────┐
        │ Save note to:  │
        │ - Service Map  │
        │ - localStorage │
        └────────┬───────┘
                 ↓
        ┌────────────────┐
        │ Show indicator │
        │ (note exists)  │
        └────────────────┘
```

#### 2.6.2 Dictionary Icons (📌)

**Location**: `question-group > review-icon`

**HTML**:
```html
<span class="review-icon">📌 Từ điển</span>
<span class="review-icon">💬</span>
<span class="review-icon">📝</span>
```

**Current Status**: 🚧 Not Implemented (Display only)

**Planned Functionality**:

```typescript
onDictionaryClick(): void {
  // Open dictionary lookup panel
  this.showDictionary = true;
}

// Dictionary panel features:
// - Word lookup
// - Pronunciation
// - Examples
// - Add to vocabulary list
```

---

## 3. Result Page - Buttons & Interactions

### 3.1 Action Buttons

#### 3.1.1 "Xem đáp án" Button

**Location**: `result-title-section > action-buttons > btn-primary`

**HTML**:
```html
<button 
  class="btn btn-primary" 
  (click)="viewAnswer(0)">
  Xem đáp án
</button>
```

**Current Implementation**:
```typescript
viewAnswer(questionId: number): void {
  // Toggle answer visibility
  console.log('View answer for question', questionId);
  
  // TODO: Implement answer detail view
}
```

**Planned Full Implementation**:

```typescript
viewAnswer(questionId: number): void {
  // 1. Navigate to detail view
  this.router.navigate(['/result/detail', questionId]);
  
  // OR: Show modal with answer
  const dialogRef = this.dialog.open(AnswerDetailComponent, {
    width: '800px',
    data: {
      questionId,
      userAnswer: this.getUserAnswer(questionId),
      correctAnswer: this.getCorrectAnswer(questionId),
      feedback: this.getFeedback(questionId)
    }
  });
}
```

**Flow**:

```
┌────────────────┐
│ User clicks    │
│ "Xem đáp án"  │
└───────┬────────┘
        ↓
┌───────────────────────┐
│ Open answer modal     │
│ ┌─────────────────┐  │
│ │ Your Answer     │  │
│ │ [text]          │  │
│ ├─────────────────┤  │
│ │ Sample Answer   │  │
│ │ [text]          │  │
│ ├─────────────────┤  │
│ │ Feedback        │  │
│ │ - Grammar: ✓    │  │
│ │ - Vocabulary: ✓ │  │
│ │ - Structure: ✓  │   │
│ └─────────────────┘   │
└───────────────────────┘
```

#### 3.1.2 "Quay về trang đề thi" Button

**Location**: `result-title-section > action-buttons > btn-secondary`

**HTML**:
```html
<button 
  class="btn btn-secondary"
  (click)="backToTestList()">
  Quay về trang đề thi
</button>
```

**Implementation**:

```typescript
backToTestList(): void {
  // Navigate to test list/home page
  this.router.navigate(['/tests']);
  
  // OR: Navigate to home
  this.router.navigate(['/']);
}
```

**Flow**:
```
Result Page → Home/Test List Page
```

---

### 3.2 Tips Section Buttons

#### 3.2.1 "Xem chi tiết đáp án" Button

**Location**: `tips-section > tips-actions > btn-tip[0]`

**HTML**:
```html
<button class="btn-tip" (click)="viewDetailedAnswers()">
  Xem chi tiết đáp án
</button>
```

**Implementation**:

```typescript
viewDetailedAnswers(): void {
  // Scroll to question details section
  const element = document.querySelector('.question-details-section');
  element?.scrollIntoView({ behavior: 'smooth' });
  
  // Switch to first tab
  this.setActiveTab('question-8');
  
  // Expand all answers
  this.expandAllAnswers = true;
}
```

#### 3.2.2 "Làm lại các câu sai" Button

**Location**: `tips-section > tips-actions > btn-tip[1]`

**HTML**:
```html
<button class="btn-tip" (click)="retakeWrongQuestions()">
  Làm lại các câu sai
</button>
```

**Planned Implementation**:

```typescript
retakeWrongQuestions(): void {
  // 1. Get wrong/skipped questions
  const wrongQuestions = this.questionResults()
    .filter(q => !q.isCorrect || !q.userAnswer)
    .map(q => q.questionId);
  
  // 2. Create new session with only wrong questions
  this.testService.initializeRetakeSession(wrongQuestions);
  
  // 3. Navigate to test
  this.router.navigate(['/test'], {
    queryParams: { mode: 'retake' }
  });
}
```

**Flow**:

```
┌────────────────────┐
│ User clicks        │
│ "Làm lại câu sai" │
└─────────┬──────────┘
          ↓
┌─────────────────────────┐
│ Filter wrong questions  │
│ [2, 5, 7]               │
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│ Create retake session   │
│ - Only wrong questions  │
│ - Reset answers         │
│ - New timer             │
└─────────┬───────────────┘
          ↓
┌─────────────────────────┐
│ Navigate to /test       │
│ with mode=retake        │
└─────────────────────────┘
```

---

### 3.3 Tab Navigation Buttons

#### 3.3.1 Tab Buttons

**Location**: `question-details-section > tabs > tab-btn`

**HTML**:
```html
<button 
  class="tab-btn"
  [class.active]="activeTab() === 'question-8'"
  (click)="setActiveTab('question-8')">
  Question 8
</button>
```

**Implementation**:

```typescript
setActiveTab(tab: string): void {
  // Update active tab signal
  this.activeTab.set(tab);
  
  // Content area will reactively update based on signal
}
```

**Tabs**:
- `'question-8'` - Show essay question result
- `'questions-1-5'` - Show sentences questions results
- `'questions-6-7'` - Show email questions results
- `'summary'` - Show overall summary

**Content Switching Logic**:

```typescript
// In template
<div *ngIf="activeTab() !== 'summary'" class="questions-list">
  <!-- Show question list -->
  <div *ngFor="let question of getQuestionsByGroup(activeTab())">
    ...
  </div>
</div>

<div *ngIf="activeTab() === 'summary'" class="summary-tab">
  <!-- Show summary statistics -->
  ...
</div>
```

---

### 3.4 Question Detail Buttons

#### 3.4.1 "[Chi tiết]" Button

**Location**: `question-row > question-answer > btn-detail`

**HTML**:
```html
<button 
  class="btn-detail" 
  (click)="viewAnswer(question.questionId)">
  [Chi tiết]
</button>
```

**Implementation**: Same as "Xem đáp án" button (section 3.1.1)

---

### 3.5 Comment Section

#### 3.5.1 "Gửi" Button (Submit Comment)

**Location**: `comments-section > btn-primary`

**HTML**:
```html
<button 
  class="btn btn-primary"
  (click)="submitComment()">
  Gửi
</button>
```

**Planned Implementation**:

```typescript
comment = signal<string>('');

submitComment(): void {
  const commentText = this.comment();
  
  if (!commentText.trim()) {
    alert('Vui lòng nhập bình luận');
    return;
  }
  
  // 1. Validate
  if (commentText.length > 500) {
    alert('Bình luận không được quá 500 ký tự');
    return;
  }
  
  // 2. Submit to API
  this.commentService.addComment({
    testResultId: this.testResult()?.id,
    content: commentText,
    timestamp: new Date()
  }).subscribe({
    next: () => {
      // Success
      alert('Cảm ơn bạn đã gửi bình luận!');
      this.comment.set('');  // Clear textarea
    },
    error: (err) => {
      console.error('Error submitting comment:', err);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });
}
```

**Flow**:

```
┌────────────────┐
│ User types     │
│ in textarea    │
└───────┬────────┘
        ↓
┌────────────────┐
│ User clicks    │
│ "Gửi"         │
└───────┬────────┘
        ↓
┌────────────────────┐
│ Validate content   │
│ - Not empty        │
│ - Max length       │
└───────┬────────────┘
        ↓
   ┌────┴────┐
   ↓         ↓
┌──────┐  ┌──────────┐
│ Fail │  │ Success  │
└──────┘  └─────┬────┘
                ↓
       ┌────────────────┐
       │ Submit to API  │
       └────────┬───────┘
                ↓
       ┌────────────────┐
       │ Show success   │
       │ message        │
       │ Clear textarea │
       └────────────────┘
```

---

## 4. Flow Diagrams

### 4.1 Complete Test Taking Flow

```
┌──────────────────────────────────────────────────────────┐
│                    START APPLICATION                      │
└────────────────────────┬─────────────────────────────────┘
                         ↓
                ┌────────────────┐
                │ Route: /       │
                │ Redirect to    │
                │ /test          │
                └────────┬───────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│                   TEST PAGE LOADED                         │
│ ┌────────────────────────────────────────────────────┐    │
│ │ ngOnInit()                                         │    │
│ │ 1. initializeTest()                                │    │
│ │ 2. loadCurrentQuestion()                           │    │
│ │ 3. startTimer()                                    │    │
│ └────────────────────────────────────────────────────┘    │
└────────────────────────┬───────────────────────────────────┘
                         ↓
         ┌──────────────────────────────┐
         │   USER INTERACTION LOOP      │
         │                              │
         │  Available Actions:          │
         │  ┌──────────────────────┐    │
         │  │ Navigate Questions   │    │
         │  │ - Tabs               │    │
         │  │ - Number buttons     │    │
         │  │ - Next button        │    │
         │  └──────────────────────┘    │
         │                              │
         │  ┌──────────────────────┐    │
         │  │ Input Answers        │    │
         │  │ - Type in textarea   │    │
         │  │ - Auto-save          │    │
         │  │ - Word count update  │    │
         │  └──────────────────────┘    │
         │                              │
         │  ┌──────────────────────┐    │
         │  │ Utility Actions      │    │
         │  │ - Add notes          │    │
         │  │ - Dictionary lookup  │    │
         │  └──────────────────────┘    │
         └───────────────┬──────────────┘
                         ↓
              ┌──────────────────┐
              │ Timer reaches 0  │
              │      OR          │
              │ User clicks      │
              │ "NỘP BÀI"        │
              └────────┬─────────┘
                       ↓
         ┌─────────────────────────┐
         │ submitTest()            │
         │ 1. Save answer          │
         │ 2. Stop timer           │
         │ 3. Confirm              │
         │ 4. Navigate to /result  │
         └─────────┬───────────────┘
                   ↓
┌──────────────────────────────────────────────────────────┐
│                  RESULT PAGE LOADED                       │
│ ┌──────────────────────────────────────────────────┐    │
│ │ ngOnInit()                                       │    │
│ │ 1. loadTestResults()                             │    │
│ │ 2. Calculate statistics                          │    │
│ │ 3. Display results                               │    │
│ └──────────────────────────────────────────────────┘    │
└────────────────────┬─────────────────────────────────────┘
                     ↓
      ┌─────────────────────────────┐
      │  USER ACTIONS ON RESULT     │
      │                             │
      │  ┌────────────────────┐     │
      │  │ View Answers       │     │
      │  │ - Modal/Detail     │     │
      │  └────────────────────┘     │
      │                             │
      │  ┌────────────────────┐     │
      │  │ Retake Test        │     │
      │  │ - All questions    │     │
      │  │ - Wrong only       │     │
      │  └────────────────────┘     │
      │                             │
      │  ┌────────────────────┐     │
      │  │ Add Comments       │     │
      │  └────────────────────┘     │
      │                             │
      │  ┌────────────────────┐     │
      │  │ Back to Test List  │     │
      │  └────────────────────┘     │
      └─────────────────────────────┘
                     ↓
                  [END]
```

### 4.2 Answer Auto-Save Flow

```
┌─────────────────────┐
│ User types in       │
│ textarea            │
│ (keystroke)         │
└──────────┬──────────┘
           ↓
┌──────────────────────────────┐
│ (input) event                │
│ Fires on EVERY keystroke     │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ onAnswerChange(value)        │
│ - Immediate signal update    │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ currentAnswer.set(value)     │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ wordCount (computed signal)  │
│ Automatically recalculates   │
│ → UI updates instantly       │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ saveCurrentAnswer()          │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ testService.saveAnswer()     │
│ - Create Answer object       │
│ - Calculate wordCount        │
│ - Save to Map                │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ debouncedLocalStorageSave()  │
│ - Clear previous timeout     │
│ - Set new timeout (1s)       │
└──────────┬───────────────────┘
           ↓
       [Wait 1s]
           ↓
┌──────────────────────────────┐
│ If no new keystroke:         │
│ Save to localStorage         │
└──────────────────────────────┘
```

### 4.3 Question Navigation Flow

```
┌─────────────────────────────┐
│ User clicks navigation      │
│ (Tab, Number, or Next btn)  │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│ navigateToQuestion(index)   │
│ called with target index    │
└─────────────┬───────────────┘
              ↓
         ┌────────────┐
         │ Validate   │
         │ index      │
         │ (0-7)      │
         └─────┬──────┘
               ↓
          ┌────┴────┐
          │ Valid?  │
          └────┬────┘
               ↓
        No ←───┴───→ Yes
        ↓              ↓
    ┌────────┐   ┌──────────────────┐
    │ Return │   │ saveCurrentAnswer│
    │ Error  │   │ (preserve work)  │
    └────────┘   └────────┬─────────┘
                          ↓
                 ┌────────────────────┐
                 │ testService.       │
                 │ navigateToQuestion │
                 │ (index)            │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ Update session:    │
                 │ currentQuestion    │
                 │ Index = index      │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ loadCurrentQuestion│
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ Get question data  │
                 │ from questions[]   │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ Load saved answer  │
                 │ (if exists)        │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ Update UI signals: │
                 │ - currentQuestion  │
                 │ - currentAnswer    │
                 │ - wordCount        │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ UI Auto-updates:   │
                 │ - Tab highlight    │
                 │ - Content panel    │
                 │ - Button states    │
                 │ - Sidebar badges   │
                 └────────────────────┘
```

---

## 5. State Management

### 5.1 Signal-Based State

```typescript
// Test Component Signals
currentQuestion: Signal<Question | null>
currentAnswer: Signal<string>
wordCount: Computed<number>
remainingTime: Signal<number>
questionsForCurrentGroup: Computed<Question[]>

// Result Component Signals
testTitle: Signal<string>
correctAnswers: Signal<number>
questionResults: Signal<QuestionResult[]>
activeTab: Signal<string>
```

### 5.2 State Synchronization

```
Component Signal
       ↓
Service Signal (testSession)
       ↓
Persistent Storage (localStorage)
       ↓
Backend API (future)
```

### 5.3 State Update Flow

```typescript
User Action
    ↓
Component Method
    ↓
Signal.set() / Signal.update()
    ↓
Computed Signals Auto-recalculate
    ↓
Template Reactively Updates
    ↓
DOM Re-renders
```

---

## 6. Error Handling

### 6.1 Navigation Errors

```typescript
navigateToQuestion(index: number): void {
  try {
    // Validate
    if (index < 0 || index > 7) {
      throw new Error(`Invalid question index: ${index}`);
    }
    
    const session = this.testService.currentSession();
    if (!session) {
      throw new Error('No active test session');
    }
    
    // Proceed with navigation
    this.saveCurrentAnswer();
    this.testService.navigateToQuestion(index);
    this.loadCurrentQuestion();
    
  } catch (error) {
    console.error('Navigation error:', error);
    
    // User feedback
    alert('Không thể chuyển câu hỏi. Vui lòng thử lại.');
    
    // Fallback: Stay on current question
    return;
  }
}
```

### 6.2 Save Errors

```typescript
saveCurrentAnswer(): void {
  try {
    const question = this.currentQuestion();
    if (!question) {
      console.warn('No current question to save answer for');
      return;
    }
    
    const content = this.currentAnswer();
    this.testService.saveAnswer(question.id, content);
    
  } catch (error) {
    console.error('Error saving answer:', error);
    
    // Silent fail - don't interrupt user
    // But log for debugging
  }
}
```

### 6.3 Submit Errors

```typescript
async submitTest(): Promise<void> {
  try {
    // Save and stop timer
    this.saveCurrentAnswer();
    clearInterval(this.timerInterval);
    
    // Confirm
    const confirmed = confirm('Bạn có chắc muốn nộp bài?');
    if (!confirmed) {
      this.startTimer(); // Resume
      return;
    }
    
    // Submit to API (if implemented)
    const session = this.testService.currentSession();
    if (!session) {
      throw new Error('No session found');
    }
    
    // await this.api.submitTest(session);
    
    // Navigate
    await this.router.navigate(['/result']);
    
  } catch (error) {
    console.error('Submit error:', error);
    
    // User feedback
    alert(
      'Có lỗi xảy ra khi nộp bài.\n' +
      'Vui lòng kiểm tra kết nối và thử lại.'
    );
    
    // Restart timer
    this.startTimer();
  }
}
```

### 6.4 Timer Errors

```typescript
private startTimer(): void {
  if (!isPlatformBrowser(this.platformId)) {
    console.warn('Timer not started: Not in browser environment');
    return;
  }
  
  try {
    this.updateRemainingTime();
    
    this.timerInterval = window.setInterval(() => {
      try {
        this.updateRemainingTime();
      } catch (error) {
        console.error('Timer update error:', error);
        // Continue running timer despite error
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error starting timer:', error);
    alert('Không thể khởi động đồng hồ. Vui lòng reload trang.');
  }
}
```

---

## 7. Performance Considerations

### 7.1 Debouncing

```typescript
// Auto-save with debounce
private saveTimeout?: number;

debouncedSave(): void {
  if (this.saveTimeout) {
    clearTimeout(this.saveTimeout);
  }
  
  this.saveTimeout = window.setTimeout(() => {
    this.saveToLocalStorage();
  }, 1000); // Wait 1s after last keystroke
}
```

### 7.2 Computed Signals

```typescript
// Efficient re-calculation only when dependencies change
wordCount = computed(() => {
  return this.testService.countWords(this.currentAnswer());
});

// Not recalculated on every change detection cycle
```

### 7.3 Change Detection Optimization

```typescript
@Component({
  selector: 'app-test',
  changeDetection: ChangeDetectionStrategy.OnPush, // Only update when signals change
  ...
})
```

---

## 8. Accessibility (A11y)

### 8.1 Keyboard Navigation

```typescript
@HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent): void {
  // Navigate with arrow keys
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    this.navigateToQuestion(this.getCurrentQuestionIndex() + 1);
  }
  
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    this.navigateToQuestion(this.getCurrentQuestionIndex() - 1);
  }
  
  // Submit with Ctrl+Enter
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    this.submitTest();
  }
}
```

### 8.2 ARIA Labels

```html
<!-- Navigation buttons -->
<button 
  class="question-num-btn"
  [attr.aria-label]="'Câu hỏi ' + (idx + 1)"
  [attr.aria-current]="getCurrentQuestionIndex() === idx ? 'true' : null">
  {{ idx + 1 }}
</button>

<!-- Submit button -->
<button 
  class="submit-btn"
  aria-label="Nộp bài thi">
  NỘP BÀI
</button>
```

### 8.3 Focus Management

```typescript
navigateToQuestion(index: number): void {
  // ... navigation logic
  
  // Focus on answer textarea after navigation
  setTimeout(() => {
    const textarea = document.querySelector('.answer-textarea') as HTMLTextAreaElement;
    textarea?.focus();
  }, 100);
}
```

---

## 9. Testing Checklist

### 9.1 Button Click Tests

```typescript
describe('Test Component Buttons', () => {
  it('should navigate to next question on Next button click', () => {
    // Arrange
    component.testService.initializeTest();
    component.ngOnInit();
    
    // Act
    const nextBtn = fixture.debugElement.query(By.css('.next-btn'));
    nextBtn.nativeElement.click();
    
    // Assert
    expect(component.getCurrentQuestionIndex()).toBe(1);
  });
  
  it('should submit test on Submit button click with confirmation', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.router, 'navigate');
    
    // Act
    const submitBtn = fixture.debugElement.query(By.css('.submit-btn'));
    submitBtn.nativeElement.click();
    
    // Assert
    expect(component.router.navigate).toHaveBeenCalledWith(['/result']);
  });
  
  it('should toggle tab on tab button click', () => {
    // Act
    const tab = fixture.debugElement.queryAll(By.css('.tab-btn'))[1];
    tab.nativeElement.click();
    
    // Assert
    expect(component.getCurrentQuestionIndex()).toBe(5);
  });
});
```

### 9.2 State Change Tests

```typescript
describe('State Management', () => {
  it('should update wordCount signal when answer changes', () => {
    // Arrange
    const textarea = fixture.debugElement.query(By.css('.answer-textarea'));
    
    // Act
    textarea.nativeElement.value = 'This is a test answer';
    textarea.nativeElement.dispatchEvent(new Event('input'));
    
    // Assert
    expect(component.wordCount()).toBe(5);
  });
  
  it('should save answer to service on input', () => {
    // Arrange
    spyOn(component.testService, 'saveAnswer');
    const textarea = fixture.debugElement.query(By.css('.answer-textarea'));
    
    // Act
    component.onAnswerChange('test answer');
    
    // Assert
    expect(component.testService.saveAnswer).toHaveBeenCalled();
  });
});
```

---

## 10. Future Enhancements

### 10.1 Planned Button Features

- [ ] **Bulk Actions**: Select multiple questions and perform actions
- [ ] **Quick Review**: Button to jump to unanswered questions
- [ ] **Save & Exit**: Save progress and exit without submitting
- [ ] **Highlight Text**: Button to highlight important text in questions
- [ ] **Flag for Review**: Mark questions for later review
- [ ] **Export Results**: Button to download results as PDF
- [ ] **Share Results**: Social media sharing buttons

### 10.2 UX Improvements

- [ ] Loading states for async operations
- [ ] Success/Error toasts instead of alerts
- [ ] Smooth transitions between questions
- [ ] Progress indicators
- [ ] Undo/Redo for answer edits
- [ ] Auto-save indicators

---

**Document Version**: 1.0.0  
**Last Updated**: October 28, 2025  
**Maintained By**: TrungKienSilly
