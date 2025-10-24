# TOEIC Writing Test Application - Tài liệu Specification

## 📋 Mục lục
1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Cài đặt và khởi chạy](#cài-đặt-và-khởi-chạy)
4. [Cấu trúc dự án](#cấu-trúc-dự-án)
5. [Chi tiết các trang](#chi-tiết-các-trang)
6. [Chi tiết components](#chi-tiết-components)
7. [Models và Services](#models-và-services)
8. [Giao diện và Styling](#giao-diện-và-styling)
9. [Luồng hoạt động](#luồng-hoạt-động)
10. [Các tính năng cần implement](#các-tính-năng-cần-implement)

---

## 1. Tổng quan dự án

### 1.1 Mô tả
Ứng dụng TOEIC Writing Test là một nền tảng luyện thi Writing online cho kỳ thi TOEIC. Ứng dụng cho phép người dùng:
- Làm bài thi Writing với 8 câu hỏi (3 dạng khác nhau)
- Xem kết quả bài thi sau khi hoàn thành
- Theo dõi thời gian làm bài
- Điều hướng giữa các câu hỏi
- Lưu trữ câu trả lời trong quá trình làm bài

### 1.2 Tech Stack
- **Framework**: Angular 20.3.0 (Standalone Components)
- **Language**: TypeScript 5.9.2
- **Styling**: SCSS
- **State Management**: Angular Signals
- **Server**: Express.js (SSR support)
- **Build Tool**: Angular CLI

---

## 2. Yêu cầu hệ thống

### 2.1 Development Environment
```json
{
  "node": ">=20.0.0",
  "npm": ">=10.0.0",
  "angular-cli": "^20.3.5"
}
```

### 2.2 Dependencies chính
```json
{
  "@angular/common": "^20.3.0",
  "@angular/core": "^20.3.0",
  "@angular/forms": "^20.3.0",
  "@angular/router": "^20.3.0",
  "rxjs": "~7.8.0"
}
```

---

## 3. Cài đặt và khởi chạy

### 3.1 Cài đặt
```bash
# Clone repository
git clone <repo-url>

# Di chuyển vào thư mục dự án
cd writing_test

# Cài đặt dependencies
npm install
```

### 3.2 Development Server
```bash
# Chạy development server
npm start
# hoặc
ng serve

# Truy cập: http://localhost:4200/
```

### 3.3 Build Production
```bash
# Build production
npm run build

# Chạy SSR server
npm run serve:ssr:writing_test
```

---

## 4. Cấu trúc dự án

```
writing_test/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── test/                    # Component trang làm bài thi
│   │   │   │   ├── test.component.ts
│   │   │   │   ├── test.component.html
│   │   │   │   └── test.component.scss
│   │   │   └── result/                  # Component trang kết quả
│   │   │       ├── result.component.ts
│   │   │       ├── result.component.html
│   │   │       └── result.component.scss
│   │   ├── models/
│   │   │   └── question.model.ts        # Data models
│   │   ├── services/
│   │   │   └── test.service.ts          # Service quản lý test
│   │   ├── app.routes.ts                # Routing configuration
│   │   ├── app.ts                       # Root component
│   │   ├── app.html                     # Root template
│   │   └── app.scss                     # Root styles
│   ├── assets/
│   │   └── img/                         # Thư mục chứa ảnh
│   │       ├── logo.png
│   │       ├── VN-2-1024x512.png
│   │       ├── image3.png
│   │       ├── image17.png
│   │       ├── image19.png
│   │       ├── image24.png
│   │       └── image41.png
│   ├── index.html
│   ├── main.ts
│   └── styles.scss                      # Global styles
├── angular.json                          # Angular configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Chi tiết các trang

### 5.1 Routing Configuration (`app.routes.ts`)
```typescript
Routes:
- '' (root) → Redirect to 'test'
- 'test' → TestComponent (lazy loaded)
- 'result' → ResultComponent (lazy loaded)
```

### 5.2 Trang Test (`/test`)
**Chức năng chính:**
- Hiển thị câu hỏi theo tab (Questions 1-5, Questions 6-7, Question 8)
- Cho phép người dùng nhập câu trả lời
- Đếm số từ trong câu trả lời
- Hiển thị đồng hồ đếm ngược
- Điều hướng giữa các câu hỏi
- Lưu câu trả lời tự động
- Nộp bài thi

**Layout:**
- Header: Logo, Navigation Menu, User Profile
- Left Panel: Question Display (chiếm phần lớn màn hình)
- Right Panel: Timer, Answer Input, Navigation (sidebar cố định, width: 360px)

### 5.3 Trang Result (`/result`)
**Chức năng chính:**
- Hiển thị thống kê kết quả bài thi
- Phân tích chi tiết theo từng nhóm câu hỏi
- Cho phép xem đáp án
- Làm lại bài thi
- Thêm bình luận

**Sections:**
- Alert messages (2 alerts về tạo mục tiêu và flashcards)
- Statistics (6 cards thống kê)
- Tips section với các actions
- Tabs phân tích chi tiết (Question 8, Questions 1-5, Questions 6-7, Summary)
- Comments section

---

## 6. Chi tiết Components

### 6.1 TestComponent

#### 6.1.1 Class Properties
```typescript
// Enums
QuestionType = QuestionType  // Export enum để dùng trong template

// Signals
currentQuestion: Signal<Question | null>
currentAnswer: Signal<string>
wordCount: Computed<number>         // Tự động tính từ currentAnswer
remainingTime: Signal<number>
questionsForCurrentGroup: Computed<Question[]>  // Cache questions theo group

// Private
timerInterval: number               // ID của interval timer
platformId: PLATFORM_ID             // Check browser/server environment
```

#### 6.1.2 Lifecycle Methods
```typescript
ngOnInit():
  - Khởi tạo test session (testService.initializeTest())
  - Load câu hỏi đầu tiên (loadCurrentQuestion())
  - Start timer (startTimer())

ngOnDestroy():
  - Clear interval timer nếu đang chạy
```

#### 6.1.3 Methods chính
```typescript
// Navigation
navigateToQuestion(index: number): void
  - Save câu trả lời hiện tại
  - Update currentQuestionIndex trong service
  - Load câu hỏi mới

// Answer Management
onAnswerChange(value: string): void
  - Update currentAnswer signal
  - Save vào service ngay lập tức

saveCurrentAnswer(): void
  - Gọi testService.saveAnswer()

getAnswerForQuestion(questionId: number): string
  - Lấy câu trả lời đã lưu từ service

// Timer
formatTime(seconds: number): string
  - Format: "MM:SS" (ví dụ: "59:30")

updateRemainingTime(): void
  - Cập nhật remainingTime signal mỗi giây
  - Tự động submit khi hết giờ

// Submit
submitTest(): void
  - Save câu trả lời hiện tại
  - Clear timer
  - Navigate to /result

// Helper methods
getQuestionsForCurrentGroup(): Question[]
  - Trả về danh sách câu hỏi theo tab hiện tại

getCurrentQuestionIndex(): number
  - Lấy index câu hỏi hiện tại từ service

isQuestionAnswered(index: number): boolean
  - Check xem câu hỏi có được trả lời chưa
```

#### 6.1.4 Template Structure (test.component.html)

**A. Header Section**
```html
<header class="test-header">
  - Logo (2 images: logo.png và VN-2-1024x512.png)
  - Navigation menu (5 links)
  - User profile icon
</header>
```

**B. Main Content Layout**
```html
<div class="test-content">  <!-- Grid 2 columns: 1fr 360px -->
  <!-- LEFT PANEL -->
  <div class="question-panel">
    <!-- Title & Exit Button -->
    <div class="test-title">
      <h1>TOEIC SW Writing Test 1</h1>
      <button class="exit-btn">Thoát</button>
    </div>

    <!-- Question Tabs -->
    <div class="question-tabs">
      <button [class.active]="getCurrentQuestionIndex() >= 0 && getCurrentQuestionIndex() <= 4">
        Questions 1-5
      </button>
      <button [class.active]="getCurrentQuestionIndex() >= 5 && getCurrentQuestionIndex() <= 6">
        Questions 6-7
      </button>
      <button [class.active]="getCurrentQuestionIndex() === 7">
        Question 8
      </button>
    </div>

    <!-- Question Content -->
    <div class="question-content">
      <!-- Questions 1-5: Write Sentence -->
      <div *ngIf="getCurrentQuestionIndex() >= 0 && getCurrentQuestionIndex() <= 4">
        - Question header (title, number, "Thêm ghi chú" button)
        - Image display (full width, centered)
        - Image caption
      </div>

      <!-- Questions 6-7: Respond to Email -->
      <div *ngIf="getCurrentQuestionIndex() >= 5 && getCurrentQuestionIndex() <= 6">
        - Question header
        - Email container:
          + From, To, Subject, Sent fields
          + Email body (in <pre> tag)
      </div>

      <!-- Question 8: Essay -->
      <div *ngIf="getCurrentQuestionIndex() === 7">
        - Question header
        - Essay prompt (with blue left border)
        - Directions (with yellow background)
      </div>
    </div>
  </div>

  <!-- RIGHT PANEL (Sidebar) -->
  <div class="answer-panel">
    <!-- Timer & Submit -->
    <div class="timer-section">
      <div class="timer">
        <span>Thời gian còn lại:</span>
        <span class="timer-value">{{ formatTime(remainingTime()) }}</span>
      </div>
      <button class="submit-btn" (click)="submitTest()">NỘP BÀI</button>
    </div>

    <!-- Answer Input -->
    <div class="answer-input-section">
      <label>Viết câu trả lời của bạn:</label>
      <textarea 
        [value]="currentAnswer()"
        (input)="onAnswerChange($any($event.target).value)">
      </textarea>
      <div class="word-count">Word count: {{ wordCount() }}</div>
      <button class="next-btn" *ngIf="getCurrentQuestionIndex() < 7">Next</button>
    </div>

    <!-- Navigation -->
    <div class="navigation-section">
      <!-- Questions 1-5 Group -->
      <div class="question-group">
        <h4>Questions 1-5</h4>
        <div class="question-numbers">
          <button *ngFor="let idx of [0,1,2,3,4]"
            [class.active]="getCurrentQuestionIndex() === idx"
            [class.answered]="isQuestionAnswered(idx)">
            {{ idx + 1 }}
          </button>
        </div>
        <span>📌 Từ điển</span>
      </div>

      <!-- Questions 6-7 Group -->
      <div class="question-group">
        <h4>Questions 6-7</h4>
        <div class="question-numbers">
          <button *ngFor="let idx of [5,6]"
            [class.active]="getCurrentQuestionIndex() === idx"
            [class.answered]="isQuestionAnswered(idx)">
            {{ idx + 1 }}
          </button>
        </div>
        <span>💬</span>
      </div>

      <!-- Question 8 Group -->
      <div class="question-group">
        <h4>Question 8</h4>
        <div class="question-numbers">
          <button [class.active]="getCurrentQuestionIndex() === 7"
            [class.answered]="isQuestionAnswered(7)">
            8
          </button>
        </div>
        <span>📝</span>
      </div>
    </div>
  </div>
</div>
```

### 6.2 ResultComponent

#### 6.2.1 Class Properties
```typescript
// Signals
testTitle: Signal<string>
totalQuestions: Signal<number>
correctAnswers: Signal<number>
wrongAnswers: Signal<number>
skippedAnswers: Signal<number>
accuracy: Signal<number>
timeSpent: Signal<string>
questionResults: Signal<QuestionResult[]>
activeTab: Signal<string>
```

#### 6.2.2 Methods
```typescript
ngOnInit():
  - Load test results từ service
  - Tính toán thống kê
  - Chuyển hướng về /test nếu chưa có session

loadTestResults(): void
  - Lấy session từ testService
  - Loop qua tất cả questions
  - Tính toán: correctAnswers, skippedAnswers, accuracy, timeSpent
  - Populate questionResults

setActiveTab(tab: string): void
  - Update activeTab signal

getQuestionsByGroup(group: string): QuestionResult[]
  - Return questions theo group
  - 'questions-1-5': index 0-4
  - 'questions-6-7': index 5-6
  - 'question-8': index 7

countCorrectInGroup(group: string): number
  - Đếm số câu đúng trong group

viewAnswer(questionId: number): void
  - Hiển thị chi tiết đáp án (TODO)

retakeTest(): void
  - Reset test và navigate về /test

goToReview(): void
  - Navigate to review page (TODO)
```

#### 6.2.3 Template Structure (result.component.html)

```html
<div class="result-container">
  <!-- Header (giống TestComponent) -->
  <header class="result-header">...</header>

  <div class="result-content">
    <div class="result-card">
      <!-- Alerts -->
      <div class="alert alert-warning">
        Bạn chưa tạo mục tiêu...
      </div>
      <div class="alert alert-info">
        Chú ý: Bạn có thể tạo flashcards...
      </div>

      <!-- Title & Actions -->
      <div class="result-title-section">
        <h1>Kết quả thi: {{ testTitle() }}</h1>
        <div class="action-buttons">
          <button class="btn btn-primary">Xem đáp án</button>
          <button class="btn btn-secondary">Quay về trang đề thi</button>
        </div>
      </div>

      <!-- Statistics Grid (6 items) -->
      <div class="statistics">
        <div class="stat-item">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <div class="stat-label">Kết quả làm bài</div>
            <div class="stat-value">{{ correctAnswers() }}/{{ totalQuestions() }}</div>
          </div>
        </div>
        <!-- ... 5 stat items khác -->
      </div>

      <!-- Tips Section -->
      <div class="tips-section">
        <div class="tips-header">💡 Đáp án</div>
        <div class="tips-actions">
          <button>Xem chi tiết đáp án</button>
          <button>Làm lại các câu sai</button>
        </div>
      </div>

      <!-- Tips Alert -->
      <div class="alert alert-light">
        Tips: Khi xem chi tiết đáp án...
      </div>

      <!-- Question Details -->
      <div class="question-details-section">
        <h2>Phân tích chi tiết</h2>

        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="activeTab() === 'question-8'">
            Question 8
          </button>
          <button [class.active]="activeTab() === 'questions-1-5'">
            Questions 1-5
          </button>
          <button [class.active]="activeTab() === 'questions-6-7'">
            Questions 6-7
          </button>
          <button [class.active]="activeTab() === 'summary'">
            Tổng quát
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Questions List (for non-summary tabs) -->
          <div *ngIf="activeTab() !== 'summary'" class="questions-list">
            <div class="question-list-header">
              (5 columns: Phần loại câu hỏi, Số câu đúng, Số câu sai, Số câu bỏ qua, Độ chính xác, Danh sách câu hỏi)
            </div>

            <div *ngFor="let question of getQuestionsByGroup(activeTab())">
              <div class="question-number">{{ question.questionId }}</div>
              <div class="question-answer">
                <span class="answer-status">✓/○</span>
                <span>{{ question.userAnswer }}</span>
                <button class="btn-detail">[Chi tiết]</button>
              </div>
            </div>
          </div>

          <!-- Summary Tab -->
          <div *ngIf="activeTab() === 'summary'" class="summary-tab">
            <p>Xem tổng quan về kết quả bài thi của bạn</p>
            <div class="summary-stats">
              <div>Questions 1-5: {{ countCorrectInGroup('questions-1-5') }}/5 đúng</div>
              <div>Questions 6-7: {{ countCorrectInGroup('questions-6-7') }}/2 đúng</div>
              <div>Question 8: {{ countCorrectInGroup('question-8') }}/1 đúng</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>Bình luận</h3>
        <textarea placeholder="Chia sẻ cảm nghĩ của bạn ..."></textarea>
        <button class="btn btn-primary">Gửi</button>
      </div>
    </div>
  </div>
</div>
```

---

## 7. Models và Services

### 7.1 Models (`models/question.model.ts`)

#### QuestionType Enum
```typescript
enum QuestionType {
  WRITE_SENTENCE = 'write-sentence',  // Questions 1-5
  RESPOND_EMAIL = 'respond-email',    // Questions 6-7
  ESSAY = 'essay'                     // Question 8
}
```

#### Question Interface
```typescript
interface Question {
  id: number
  type: QuestionType
  title: string
  content?: string          // Optional text content
  imageUrl?: string         // For WRITE_SENTENCE questions
  prompt?: string           // Image caption hoặc essay prompt
  emailFrom?: string        // For RESPOND_EMAIL questions
  emailTo?: string
  emailSubject?: string
  emailDate?: string
  emailBody?: string
  directions?: string       // Hướng dẫn làm bài
}
```

#### Answer Interface
```typescript
interface Answer {
  questionId: number
  content: string
  wordCount: number
  timestamp: Date
}
```

#### TestSession Interface
```typescript
interface TestSession {
  id: string                          // Format: 'test-{timestamp}'
  startTime: Date
  timeLimit: number                   // in seconds (default: 3600 = 60 minutes)
  questions: Question[]
  answers: Map<number, Answer>        // Map questionId -> Answer
  currentQuestionIndex: number
}
```

### 7.2 TestService (`services/test.service.ts`)

#### Properties
```typescript
private testSession: WritableSignal<TestSession | null>
readonly currentSession: Signal<TestSession | null>  // Readonly view
```

#### Methods

**initializeTest(): void**
- Khởi tạo TestSession mới
- Gọi getSampleQuestions() để load câu hỏi
- Set timeLimit = 3600 seconds (60 minutes)
- Reset answers Map

**getSampleQuestions(): Question[]**
- Return array 8 questions:
  - Questions 1-5: WRITE_SENTENCE type (5 ảnh khác nhau)
  - Questions 6-7: RESPOND_EMAIL type (2 emails khác nhau)
  - Question 8: ESSAY type (1 essay prompt)
- Mỗi question có đầy đủ thông tin theo type

**getCurrentQuestion(): Question | null**
- Return question tại currentQuestionIndex
- Return null nếu không có session

**navigateToQuestion(index: number): void**
- Validate index (0-7)
- Update currentQuestionIndex
- Trigger UI update

**saveAnswer(questionId: number, content: string): void**
- Tạo Answer object với wordCount
- Lưu vào answers Map
- Update testSession signal

**getAnswer(questionId: number): Answer | undefined**
- Return Answer từ Map
- Return undefined nếu chưa có

**countWords(text: string): number**
- Trim whitespace
- Split by \s+ regex
- Return length

**getRemainingTime(): number**
- Tính elapsed time = (now - startTime)
- Return Math.max(0, timeLimit - elapsed)

**submitTest(): void**
- Log session to console (trong thực tế: gửi API)
- Alert "Bài thi đã được nộp thành công!"

---

## 8. Giao diện và Styling

### 8.1 Design System

#### Colors
```scss
// Primary Brand Colors
$primary-green: #56ab2f
$primary-light-green: #a8e063
$gradient-green: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)

// Semantic Colors
$success: #28a745
$danger: #dc3545
$warning: #ffc107
$info: #17a2b8

// Neutral Colors
$text-primary: #333
$text-secondary: #666
$text-muted: #6c757d
$border: #e0e0e0
$bg-light: #f8f9fa
$bg-white: #fff
```

#### Typography
```scss
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif

// Font Sizes
$fs-small: 0.85rem
$fs-normal: 0.95rem
$fs-medium: 1rem
$fs-large: 1.25rem
$fs-xlarge: 1.5rem
$fs-xxlarge: 1.75rem

// Font Weights
$fw-normal: 400
$fw-medium: 500
$fw-semibold: 600
$fw-bold: 700
$fw-extrabold: 800
```

#### Spacing
```scss
$spacing-xs: 0.25rem    // 4px
$spacing-sm: 0.5rem     // 8px
$spacing-md: 0.75rem    // 12px
$spacing-base: 1rem     // 16px
$spacing-lg: 1.5rem     // 24px
$spacing-xl: 2rem       // 32px
```

#### Border Radius
```scss
$radius-sm: 6px
$radius-md: 8px
$radius-lg: 10px
$radius-xl: 12px
$radius-round: 999px
```

#### Shadows
```scss
$shadow-sm: 0 2px 8px rgba(0,0,0,0.06)
$shadow-md: 0 4px 12px rgba(0,0,0,0.1)
$shadow-lg: 0 8px 32px rgba(0,0,0,0.12)
$shadow-green: 0 4px 12px rgba(86, 171, 47, 0.3)
```

### 8.2 Layout Specifications

#### Test Page Layout
```scss
.test-content {
  display: grid
  grid-template-columns: 1fr 360px  // Main content + Sidebar
  gap: 1.5rem
  height: calc(100vh - 100px)
  padding: 1.5rem
  max-width: 1600px
  margin: 0 auto
}

.question-panel {
  background: white
  padding: 1.5rem
  overflow-y: auto
  border-radius: 16px
  box-shadow: $shadow-lg
}

.answer-panel {
  background: white
  padding: 0.9rem
  position: sticky
  top: 18px
  height: calc(100vh - 36px)
  overflow-y: auto
  border-radius: 12px
  box-shadow: $shadow-lg
}
```

#### Header Layout
```scss
.test-header, .result-header {
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0.75rem 2rem
  background: white
  border-bottom: 1px solid #e9ecef
  box-shadow: $shadow-sm

  .logo {
    .logo-img { height: 40px }
    .company-img { height: 56px }
  }

  .nav-menu {
    display: flex
    gap: 1rem
    background: white
    padding: 0.25rem 0.8rem
    border-radius: 999px
    box-shadow: $shadow-sm
  }
}
```

### 8.3 Component-specific Styles

#### Test Component

**Question Tabs**
```scss
.question-tabs {
  .tab-btn {
    padding: 0.75rem 1.5rem
    border: none
    border-bottom: 3px solid transparent
    
    &.active {
      background: gradient text effect
      border-bottom-color: #56ab2f
      font-weight: 700
    }
  }
}
```

**Question Cards**
```scss
.question-header {
  display: flex
  align-items: center
  gap: 1rem
  
  .question-number {
    background: $gradient-green
    color: white
    padding: 0.4rem 0.9rem
    border-radius: 20px
    font-weight: 700
    box-shadow: $shadow-green
  }
  
  .add-note-btn {
    padding: 0.5rem 1rem
    background: rgba(86, 171, 47, 0.1)
    border: 1px solid rgba(86, 171, 47, 0.3)
    border-radius: 8px
  }
}
```

**Image Display**
```scss
.question-image-column {
  img {
    max-width: 100%
    max-height: 380px
    object-fit: contain
    border-radius: 8px
    box-shadow: $shadow-md
  }
  
  .image-caption {
    margin-top: 1rem
    font-size: 1rem
    color: #666
    text-align: center
  }
}
```

**Email Display**
```scss
.email-container {
  background-color: #f9f9f9
  padding: 1.5rem
  border-radius: 8px
  border: 1px solid #e0e0e0
  
  .email-body {
    background-color: white
    padding: 1rem
    border-radius: 4px
    
    pre {
      white-space: pre-wrap
      font-family: inherit
    }
  }
}
```

**Answer Input**
```scss
.answer-input-section {
  .answer-textarea {
    flex: 1
    min-height: 200px
    padding: 0.9rem
    border: 2px solid rgba(86, 171, 47, 0.26)
    border-radius: 10px
    
    &:focus {
      border-color: #56ab2f
      box-shadow: 0 6px 20px rgba(86, 171, 47, 0.2)
    }
  }
  
  .word-count {
    text-align: right
    color: #6b9e3e
    font-weight: 600
  }
}
```

**Navigation Buttons**
```scss
.question-num-btn {
  width: 44px
  height: 44px
  border: 2px solid #e0e0e0
  border-radius: 10px
  
  &.active {
    background: $gradient-green
    color: white
    border-color: transparent
    box-shadow: $shadow-green
  }
  
  &.answered {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)
    color: white
  }
}
```

#### Result Component

**Statistics Cards**
```scss
.statistics {
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))
  gap: 1.5rem
  
  .stat-item {
    display: flex
    align-items: center
    gap: 1rem
    padding: 1.25rem
    background: #f8f9fa
    border-radius: 10px
    border: 2px solid #e9ecef
    
    .stat-icon {
      width: 50px
      height: 50px
      background: white
      border-radius: 10px
      display: flex
      align-items: center
      justify-content: center
    }
    
    .stat-value {
      font-size: 1.25rem
      font-weight: 700
      
      &.green { color: #28a745 }
      &.red { color: #dc3545 }
      &.gray { color: #6c757d }
    }
  }
}
```

**Question List**
```scss
.question-row {
  display: flex
  gap: 1rem
  padding: 1rem
  border-bottom: 1px solid #e9ecef
  
  .question-number {
    width: 50px
    height: 50px
    background: $gradient-green
    color: white
    border-radius: 10px
    display: flex
    align-items: center
    justify-content: center
    font-weight: 700
  }
  
  .answer-status {
    width: 30px
    height: 30px
    border-radius: 50%
    
    &.correct {
      background: #28a745
      color: white
    }
    
    &.skipped {
      background: #6c757d
      color: white
    }
  }
}
```

### 8.4 Responsive Breakpoints
```scss
// Desktop: > 1200px (default)
@media (max-width: 1200px) {
  .test-content {
    grid-template-columns: 1fr 400px
  }
}

// Tablet: <= 992px
@media (max-width: 992px) {
  .test-content {
    grid-template-columns: 1fr
  }
  
  .answer-panel {
    position: static
    border-left: none
    border-top: 1px solid #e0e0e0
  }
  
  .nav-menu {
    display: none  // Hide navigation on mobile
  }
}

// Mobile: <= 768px
@media (max-width: 768px) {
  .statistics {
    grid-template-columns: 1fr
  }
}
```

---

## 9. Luồng hoạt động

### 9.1 User Flow

```
START
  ↓
[Landing] → Redirect to /test
  ↓
[Test Page]
  ↓
1. Khởi tạo session
   - Load 8 questions
   - Start timer (60 minutes)
   - Load question 1
  ↓
2. User làm bài
   - Nhập câu trả lời
   - Word count tự động cập nhật
   - Có thể chuyển câu hỏi bất kỳ
   - Câu trả lời tự động lưu
  ↓
3. Submit test
   - Click "NỘP BÀI" hoặc hết giờ
   - Navigate to /result
  ↓
[Result Page]
  ↓
4. Xem kết quả
   - Statistics overview
   - Chi tiết từng nhóm câu hỏi
   - Có thể làm lại (back to step 1)
  ↓
END
```

### 9.2 State Management Flow

```
TestService (Singleton)
  ↓
testSession (Signal)
  ├── id
  ├── startTime
  ├── timeLimit
  ├── questions[]
  ├── answers (Map)
  └── currentQuestionIndex
  ↓
Components subscribe to signals
  ↓
UI auto-updates on signal changes
```

### 9.3 Answer Saving Flow

```
User types in textarea
  ↓
(input) event triggered
  ↓
onAnswerChange(value) called
  ↓
Update currentAnswer signal
  ↓
saveCurrentAnswer() called
  ↓
testService.saveAnswer(questionId, content)
  ↓
Calculate wordCount
  ↓
Create Answer object
  ↓
Save to answers Map
  ↓
Update testSession signal
  ↓
UI reflects new state
```

### 9.4 Navigation Flow

```
User clicks question number button
  ↓
navigateToQuestion(index) called
  ↓
Save current answer
  ↓
testService.navigateToQuestion(index)
  ↓
Update currentQuestionIndex
  ↓
loadCurrentQuestion()
  ↓
Load saved answer (if exists)
  ↓
UI updates with new question
```

### 9.5 Timer Flow

```
ngOnInit()
  ↓
startTimer()
  ↓
setInterval(1000ms)
  ↓
Every second:
  ├── Calculate remainingTime
  ├── Update signal
  ├── Format time (MM:SS)
  └── If time === 0: submitTest()
  ↓
ngOnDestroy()
  ↓
clearInterval()
```

---

## 10. Các tính năng cần implement

### 10.1 Core Features (REQUIRED)

#### A. Test Component
- [x] Display questions theo type
- [x] Answer input với word count
- [x] Timer countdown
- [x] Navigation giữa questions
- [x] Auto-save answers
- [x] Submit test
- [ ] Exit confirmation dialog
- [ ] "Thêm ghi chú" functionality
- [ ] Dictionary popup (📌 icon)

#### B. Result Component
- [x] Display statistics
- [x] Show question results
- [x] Tab navigation
- [ ] View detailed answers
- [ ] Retake test functionality
- [ ] Comment submission
- [ ] Create flashcards from highlights
- [ ] Create goal functionality

### 10.2 Backend Integration (TODO)

```typescript
// API Endpoints cần implement

// 1. Submit test
POST /api/tests/submit
Body: {
  sessionId: string
  answers: Answer[]
  timeSpent: number
}
Response: {
  testResultId: string
  score: number
}

// 2. Get test result
GET /api/tests/results/:id
Response: {
  testResult: TestResult
  correctAnswers: CorrectAnswer[]
}

// 3. Get questions
GET /api/questions/:testId
Response: {
  questions: Question[]
}

// 4. Save progress
POST /api/tests/progress
Body: {
  sessionId: string
  currentQuestionIndex: number
  answers: Answer[]
}

// 5. Load saved session
GET /api/tests/sessions/:userId/latest
Response: {
  session: TestSession | null
}
```

### 10.3 Image Assets

**Required Images:**
```
src/assets/img/
├── logo.png                    // Logo chính
├── VN-2-1024x512.png          // Company name banner
├── image3.png                  // Question 1 image
├── image17.png                 // Question 2 image
├── image19.png                 // Question 3 image
├── image24.png                 // Question 4 image
└── image41.png                 // Question 5 image
```

**Dimensions:**
- Logo: ~200x100px (transparent background)
- Company banner: 1024x512px
- Question images: ~800x600px (various aspect ratios OK)

### 10.4 Additional Features (NICE TO HAVE)

- [ ] Keyboard shortcuts (Next: N, Previous: P, Submit: Ctrl+Enter)
- [ ] Highlight text functionality
- [ ] Note-taking panel
- [ ] Export results as PDF
- [ ] Share results on social media
- [ ] Progress tracking chart
- [ ] Comparison with other users
- [ ] AI scoring for Writing answers
- [ ] Sample answers library
- [ ] Grammar checker integration

### 10.5 Performance Optimizations

- [ ] Lazy load images
- [ ] Debounce answer saving (currently saves every keystroke)
- [ ] Virtual scrolling cho question list (nếu có nhiều questions)
- [ ] Service Worker cho offline support
- [ ] PWA configuration

### 10.6 Accessibility (A11y)

- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Focus management
- [ ] Color contrast compliance (WCAG AA)
- [ ] Text scaling support

### 10.7 Testing Requirements

```typescript
// Unit Tests cần viết

// TestService
describe('TestService', () => {
  it('should initialize test with 8 questions')
  it('should save answer correctly')
  it('should calculate word count correctly')
  it('should navigate to question')
  it('should calculate remaining time')
})

// TestComponent
describe('TestComponent', () => {
  it('should load first question on init')
  it('should save answer on input change')
  it('should navigate between questions')
  it('should submit test on time end')
  it('should format time correctly')
})

// ResultComponent
describe('ResultComponent', () => {
  it('should load test results')
  it('should calculate statistics correctly')
  it('should filter questions by group')
  it('should switch tabs')
})
```

---

## 11. Development Guidelines

### 11.1 Code Style

```typescript
// Use TypeScript strict mode
"strict": true
"noImplicitAny": true

// Use Angular Signals for state
✓ const count = signal(0)
✗ private count = 0

// Use Standalone Components
✓ @Component({ standalone: true })
✗ @NgModule({ declarations: [...] })

// Use arrow functions
✓ navigateToQuestion = (index: number) => {}
✗ function navigateToQuestion(index: number) {}

// Use template syntax
✓ [class.active]="isActive()"
✗ [ngClass]="{'active': isActive()}"
```

### 11.2 Naming Conventions

```typescript
// Files
component-name.component.ts
service-name.service.ts
model-name.model.ts

// Classes
class TestComponent {}
class TestService {}

// Interfaces
interface Question {}
interface Answer {}

// Enums
enum QuestionType {}

// Constants
const MAX_TIME = 3600

// Signals
const currentQuestion = signal<Question | null>(null)
const wordCount = computed(() => ...)

// Methods
public navigateToQuestion() {}
private loadCurrentQuestion() {}
```

### 11.3 Git Commit Messages

```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- style: Code style changes
- refactor: Code refactoring
- test: Add tests
- docs: Documentation

Examples:
feat(test): add timer countdown functionality
fix(result): correct statistics calculation
style(test): update button colors
refactor(service): optimize answer saving
test(service): add word count tests
docs(readme): update setup instructions
```

---

## 12. Deployment

### 12.1 Build for Production

```bash
# Build với optimization
npm run build

# Output: dist/writing_test/
├── browser/     # Client-side assets
└── server/      # SSR server files
```

### 12.2 Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
}

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
}
```

### 12.3 Deployment Platforms

**Option 1: Vercel / Netlify (Static)**
```bash
npm run build
# Deploy dist/writing_test/browser/
```

**Option 2: Node.js Server (SSR)**
```bash
npm run build
npm run serve:ssr:writing_test
# Server runs on port 4000
```

**Option 3: Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
CMD ["node", "dist/writing_test/server/server.mjs"]
EXPOSE 4000
```

---

## 13. FAQs

**Q: Tại sao dùng Signals thay vì RxJS?**
A: Angular Signals là cách mới và recommended để manage state. Nó đơn giản hơn, performance tốt hơn, và tích hợp tốt với change detection.

**Q: Tại sao không dùng NgModule?**
A: Đây là Angular 20 với Standalone Components pattern. NgModule không còn cần thiết và khiến code phức tạp hơn.

**Q: Làm sao để thêm câu hỏi mới?**
A: Thêm vào method `getSampleQuestions()` trong `TestService`. Mỗi question cần có đầy đủ properties theo interface `Question`.

**Q: Timer có chính xác không?**
A: Timer dùng `setInterval` nên có thể bị lệch vài ms. Để chính xác hơn, nên dùng server time hoặc `requestAnimationFrame`.

**Q: Làm sao để persist answers khi reload page?**
A: Hiện tại answers chỉ lưu trong memory. Cần implement localStorage hoặc backend API để persist.

---

## 14. Support & Contact

- **Documentation**: Xem file này
- **Issues**: Tạo issue trên GitHub
- **Email**: support@yourdomain.com

---

## 15. License

MIT License - Copyright (c) 2025

---

**Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Author**: TrungKienSilly
