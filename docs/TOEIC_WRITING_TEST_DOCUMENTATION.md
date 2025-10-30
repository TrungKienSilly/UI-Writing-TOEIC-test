# TÀI LIỆU HƯỚNG DẪN DỰ ÁN TOEIC WRITING TEST

---

## THÔNG TIN DỰ ÁN

**Tên dự án:** TOEIC Writing Test - Ứng dụng Luyện Thi Viết TOEIC  
**Phiên bản:** 1.0.0  
**Ngày tạo:** October 2025  
**Công nghệ:** Angular 20.3.0 (Standalone Components)  
**Tác giả:** Development Team  
**Mục đích:** Cung cấp nền tảng luyện thi TOEIC Writing trực tuyến với giao diện thân thiện và chức năng đầy đủ

---

## MỤC LỤC

1. [TỔNG QUAN DỰ ÁN](#1-tổng-quan-dự-án)
2. [KIẾN TRÚC HỆ THỐNG](#2-kiến-trúc-hệ-thống)
3. [CÁC TÍNH NĂNG CHÍNH](#3-các-tính-năng-chính)
4. [MÔ HÌNH DỮ LIỆU](#4-mô-hình-dữ-liệu)
5. [GIAO DIỆN NGƯỜI DÙNG](#5-giao-diện-người-dùng)
6. [LUỒNG HOẠT ĐỘNG](#6-luồng-hoạt-động)
7. [HƯỚNG DẪN CÀI ĐẶT](#7-hướng-dẫn-cài-đặt)
8. [HƯỚNG DẪN PHÁT TRIỂN](#8-hướng-dẫn-phát-triển)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Giới Thiệu

TOEIC Writing Test là một ứng dụng web được xây dựng bằng Angular 20.3.0, sử dụng kiến trúc Standalone Components hiện đại. Ứng dụng mô phỏng bài thi TOEIC Writing thực tế, giúp người học luyện tập và cải thiện kỹ năng viết tiếng Anh.

### 1.2. Mục Tiêu

- ✅ Cung cấp trải nghiệm thi thử TOEIC Writing chân thực
- ✅ Hỗ trợ 3 dạng câu hỏi: Write a Sentence, Respond to Email, Essay
- ✅ Tính thời gian làm bài tự động
- ✅ Lưu trữ và xem lại kết quả
- ✅ Giao diện thân thiện, responsive
- ✅ Hỗ trợ đếm từ tự động

### 1.3. Phạm Vi

Dự án bao gồm:
- Trang chủ (tự động chuyển hướng đến trang thi)
- Trang làm bài thi (Test Component)
- Trang xem kết quả (Result Component)
- Service quản lý trạng thái bài thi
- Models định nghĩa cấu trúc dữ liệu

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Angular | 20.3.0 | Framework chính |
| TypeScript | 5.9.2 | Ngôn ngữ lập trình |
| SCSS | Latest | Styling |
| Angular Signals | Built-in | Quản lý state |
| Express.js | 4.21.2 | Server-side rendering |
| RxJS | 7.8.0 | Reactive programming |

### 2.2. Cấu Trúc Thư Mục

```
writing_test/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── test/              # Component làm bài thi
│   │   │   │   ├── test.component.ts
│   │   │   │   ├── test.component.html
│   │   │   │   └── test.component.scss
│   │   │   └── result/            # Component xem kết quả
│   │   │       ├── result.component.ts
│   │   │       ├── result.component.html
│   │   │       └── result.component.scss
│   │   ├── services/
│   │   │   └── test.service.ts    # Service quản lý state
│   │   ├── models/
│   │   │   └── question.model.ts  # Định nghĩa models
│   │   ├── app.routes.ts          # Cấu hình routing
│   │   └── app.ts                 # Root component
│   ├── styles.scss                # Global styles
│   └── index.html                 # HTML entry point
├── angular.json                   # Angular configuration
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript configuration
```

### 2.3. Kiến Trúc Components

```
┌─────────────────────────────────────────┐
│          App Component (Root)           │
│         Routing: /, /test, /result      │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌───────────────────┐   ┌──────────────────┐
│  Test Component   │   │ Result Component │
│  - Làm bài thi    │   │ - Xem kết quả    │
│  - Timer          │   │ - Thống kê       │
│  - Navigation     │   │ - Chi tiết câu   │
└─────────┬─────────┘   └────────┬─────────┘
          │                      │
          └──────────┬───────────┘
                     ▼
              ┌──────────────┐
              │ Test Service │
              │ - State mgmt │
              │ - Data logic │
              └──────────────┘
```

---

## 3. CÁC TÍNH NĂNG CHÍNH

### 3.1. Chức Năng Làm Bài Thi

#### 3.1.1. Quản Lý Thời Gian
- **Timer tự động**: Đếm ngược từ 60 phút
- **Hiển thị thời gian**: Format MM:SS (ví dụ: 59:45)
- **Cảnh báo**: Màu đỏ khi còn < 5 phút
- **Tự động submit**: Khi hết thời gian

#### 3.1.2. Điều Hướng Câu Hỏi
- **Next Button**: Chuyển sang câu tiếp theo
- **Previous Button**: Quay lại câu trước
- **Sidebar Navigation**: Click vào số thứ tự câu
- **Keyboard Shortcuts**: 
  - `Ctrl + →` : Next
  - `Ctrl + ←` : Previous

#### 3.1.3. Tự Động Lưu
- Lưu câu trả lời khi người dùng gõ (debounce 500ms)
- Lưu vào LocalStorage
- Không mất dữ liệu khi refresh trang

#### 3.1.4. Đếm Từ
- Đếm số từ real-time
- Hiển thị số từ cho từng câu
- Cảnh báo nếu không đủ số từ yêu cầu

### 3.2. Chức Năng Xem Kết Quả

#### 3.2.1. Thống Kê Tổng Quan
- Tổng số câu hỏi: 8
- Số câu đã trả lời
- Tỷ lệ hoàn thành (%)
- Điểm ước tính (0-200)
- Thời gian hoàn thành
- Tổng số từ đã viết

#### 3.2.2. Chi Tiết Từng Dạng Câu
**Questions 1-5 (Write a Sentence)**
- Số câu: 5
- Yêu cầu: Viết 1 câu từ từ cho sẵn
- Thời gian gợi ý: 8 phút
- Số từ tối thiểu: 10-15 từ/câu

**Questions 6-7 (Respond to Email)**
- Số câu: 2
- Yêu cầu: Trả lời email
- Thời gian gợi ý: 10 phút/câu
- Số từ yêu cầu: ≥ 25 từ/câu

**Question 8 (Essay)**
- Số câu: 1
- Yêu cầu: Viết bài luận
- Thời gian gợi ý: 30 phút
- Số từ yêu cầu: ≥ 300 từ

#### 3.2.3. Tabs Hiển Thị
1. **Question-8 Tab**: Hiển thị bài luận
2. **Questions 1-5 Tab**: Hiển thị 5 câu viết câu
3. **Questions 6-7 Tab**: Hiển thị 2 email
4. **Summary Tab**: Tổng hợp nhận xét

---

## 4. MÔ HÌNH DỮ LIỆU

### 4.1. QuestionType Enum

```typescript
export enum QuestionType {
  WRITE_SENTENCE = 'WRITE_SENTENCE',    // Câu 1-5
  RESPOND_EMAIL = 'RESPOND_EMAIL',      // Câu 6-7
  ESSAY = 'ESSAY'                       // Câu 8
}
```

### 4.2. Question Interface

```typescript
export interface Question {
  id: number;                    // ID câu hỏi (1-8)
  type: QuestionType;            // Loại câu hỏi
  title: string;                 // Tiêu đề câu hỏi
  description: string;           // Mô tả yêu cầu
  imageUrl?: string;             // URL hình ảnh (nếu có)
  words?: string[];              // Từ cho sẵn (WRITE_SENTENCE)
  emailContent?: string;         // Nội dung email (RESPOND_EMAIL)
  minWords: number;              // Số từ tối thiểu
  suggestedTime: number;         // Thời gian gợi ý (phút)
}
```

### 4.3. Answer Interface

```typescript
export interface Answer {
  questionId: number;            // ID câu hỏi
  content: string;               // Nội dung câu trả lời
  wordCount: number;             // Số từ đã viết
  timeSpent: number;             // Thời gian làm bài (giây)
  isCompleted: boolean;          // Đã hoàn thành chưa
}
```

### 4.4. TestSession Interface

```typescript
export interface TestSession {
  sessionId: string;             // ID phiên thi
  startTime: Date;               // Thời gian bắt đầu
  endTime?: Date;                // Thời gian kết thúc
  totalTime: number;             // Tổng thời gian (3600s)
  remainingTime: number;         // Thời gian còn lại
  currentQuestionId: number;     // Câu hỏi hiện tại
  answers: Map<number, Answer>;  // Map câu trả lời
  isSubmitted: boolean;          // Đã submit chưa
  estimatedScore?: number;       // Điểm ước tính
}
```

---

## 5. GIAO DIỆN NGƯỜI DÙNG

### 5.1. Màu Sắc Chủ Đạo

```scss
// Primary Colors
$primary-green-start: #56ab2f;
$primary-green-end: #a8e063;

// Background
$bg-light: #f5f7fa;
$bg-white: #ffffff;
$bg-hover: #f0f0f0;

// Text
$text-dark: #2c3e50;
$text-gray: #666666;
$text-light: #999999;

// Status Colors
$answered: #4caf50;
$current: #2196f3;
$warning: #ff9800;
$danger: #f44336;
```

### 5.2. Layout Test Page

```
┌────────────────────────────────────────────────────────────┐
│                       HEADER                               │
│  Logo | TOEIC Writing Test | Timer: 59:45 | Submit        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────┐  ┌────────────────────────┐ │
│  │                          │  │   QUESTION SIDEBAR     │ │
│  │   MAIN CONTENT AREA      │  │                        │ │
│  │                          │  │  Q1 ● Q2 ● Q3 ●       │ │
│  │   - Question Title       │  │  Q4 ● Q5 ● Q6 ●       │ │
│  │   - Question Desc        │  │  Q7 ● Q8 ●            │ │
│  │   - Image (if any)       │  │                        │ │
│  │   - Answer Textarea      │  │  Legend:               │ │
│  │   - Word Count           │  │  ● Answered            │ │
│  │                          │  │  ○ Not answered        │ │
│  │   [Previous] [Next]      │  │  ◉ Current             │ │
│  │                          │  │                        │ │
│  └──────────────────────────┘  └────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 5.3. Layout Result Page

```
┌────────────────────────────────────────────────────────────┐
│                       HEADER                               │
│  Logo | Test Results | [Back to Test] [New Test]          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────── STATISTICS ─────────────────────┐    │
│  │                                                    │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │    │
│  │  │  8   │  │  7   │  │ 87.5 │  │ 165  │          │     │      │  │      │  │      │  │      │
│  │  │Total │  │Answer│  │  %   │  │Score │          │    │
│  │  └──────┘  └──────┘  └──────┘  └──────┘          │    │
│  │                                                    │    │
│  │  ┌──────┐  ┌──────┐                               │    │
│  │  │55:30 │  │ 1250 │                               │    │
│  │  │ Time │  │Words │                               │    │
│  │  └──────┘  └──────┘                               │    │
│  │                                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────── TABS ──────────────────────────┐     │
│  │ [Question-8] [Questions 1-5] [Questions 6-7] [📊] │     │
│  ├───────────────────────────────────────────────────┤     │
│  │                                                   │     │
│  │         TAB CONTENT AREA                          │     │
│  │         - Question details                        │     │
│  │         - Your answer                             │     │
│  │         - Word count                              │     │
│  │         - Comments                                │     │
│  │                                                   │     │
│  └───────────────────────────────────────────────────┘     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 6. LUỒNG HOẠT ĐỘNG

### 6.1. User Flow Diagram

```
START (/)
    │
    ├─ Auto Redirect
    │
    ▼
[TEST PAGE] (/test)
    │
    ├─ Initialize Test
    │   ├─ Load Questions
    │   ├─ Start Timer
    │   └─ Set Current Question = 1
    │
    ├─ User Actions
    │   ├─ Type Answer → Auto Save (debounce 500ms)
    │   ├─ Click Next → Go to Next Question
    │   ├─ Click Previous → Go to Previous Question
    │   ├─ Click Sidebar Number → Jump to Question
    │   └─ Timer = 0 → Auto Submit
    │
    ├─ Click Submit Button
    │   ├─ Confirm Dialog
    │   └─ Yes → Save Session
    │
    ▼
[RESULT PAGE] (/result)
    │
    ├─ Load Test Results
    │   ├─ Calculate Statistics
    │   ├─ Estimate Score
    │   └─ Render Tabs
    │
    ├─ User Actions
    │   ├─ Switch Tabs → Show Details
    │   ├─ Click Back → Return to Test
    │   └─ Click New Test → Reset & Start New
    │
    ▼
END
```

### 6.2. State Management Flow

```
┌─────────────────────────────────────────────┐
│           TestService (Singleton)           │
├─────────────────────────────────────────────┤
│                                             │
│  Signals (Reactive State):                  │
│  ├─ questions: WritableSignal<Question[]>   │
│  ├─ currentQuestion: Computed<Question>     │
│  ├─ answers: WritableSignal<Map>            │
│  ├─ session: WritableSignal<TestSession>    │
│  └─ remainingTime: WritableSignal<number>   │
│                                             │
│  Methods:                                   │
│  ├─ initializeTest()                        │
│  ├─ saveAnswer(questionId, content)         │
│  ├─ goToNext()                              │
│  ├─ goToPrevious()                          │
│  ├─ submitTest()                            │
│  ├─ calculateScore()                        │
│  └─ getResults()                            │
│                                             │
└─────────────────────────────────────────────┘
        │                          │
        ▼                          ▼
┌──────────────┐          ┌──────────────┐
│ TestComponent│          │ResultComponent│
│  - Subscribe │          │  - Subscribe │
│  - Update UI │          │  - Display   │
└──────────────┘          └──────────────┘
```

### 6.3. Timer Flow

```
Test Start
    │
    ▼
┌──────────────────────┐
│ Set Total Time       │
│ = 60 minutes         │
│ = 3600 seconds       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Start setInterval    │
│ Every 1 second       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Remaining Time -= 1  │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ Time > 0?    │
    └──┬────────┬──┘
       │ YES    │ NO
       │        │
       ▼        ▼
   ┌────────┐  ┌───────────┐
   │Continue│  │Auto Submit│
   │Loop    │  │Test       │
   └────────┘  └───────────┘
```

---

## 7. HƯỚNG DẪN CÀI ĐẶT

### 7.1. Yêu Cầu Hệ Thống

- **Node.js**: >= 18.19.0
- **npm**: >= 10.2.3
- **Browser**: Chrome, Firefox, Safari, Edge (latest)
- **OS**: Windows, macOS, Linux

### 7.2. Các Bước Cài Đặt

#### Bước 1: Clone Project
```bash
git clone <repository-url>
cd writing_test
```

#### Bước 2: Install Dependencies
```bash
npm install
```

#### Bước 3: Run Development Server
```bash
npm start
# hoặc
ng serve
```

#### Bước 4: Mở Trình Duyệt
```
http://localhost:4200
```

### 7.3. Build Production

```bash
# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Serve SSR
npm run serve:ssr
```

### 7.4. Cấu Trúc Package.json

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch",
    "test": "ng test",
    "serve:ssr": "node dist/writing_test/server/server.mjs"
  },
  "dependencies": {
    "@angular/animations": "^20.3.0",
    "@angular/common": "^20.3.0",
    "@angular/compiler": "^20.3.0",
    "@angular/core": "^20.3.0",
    "@angular/forms": "^20.3.0",
    "@angular/platform-browser": "^20.3.0",
    "@angular/router": "^20.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  }
}
```

---

## 8. HƯỚNG DẪN PHÁT TRIỂN

### 8.1. Coding Standards

#### TypeScript
- Sử dụng TypeScript strict mode
- Đặt tên biến theo camelCase
- Đặt tên class/interface theo PascalCase
- Sử dụng arrow functions khi có thể
- Comment cho functions phức tạp

#### HTML
- Sử dụng semantic HTML
- Indent 2 spaces
- Attributes trên nhiều dòng nếu quá dài
- Sử dụng Angular directives hợp lý

#### SCSS
- Sử dụng BEM naming convention
- Tổ chức theo components
- Sử dụng variables cho colors, sizes
- Mobile-first responsive design

### 8.2. Component Development

#### Tạo Component Mới
```bash
ng generate component components/my-component --standalone
```

#### Component Structure
```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss']
})
export class MyComponent implements OnInit {
  // Signals
  data = signal<any>(null);
  
  // Lifecycle
  ngOnInit() {}
  
  // Methods
  handleAction() {}
}
```

### 8.3. Service Development

#### Tạo Service Mới
```bash
ng generate service services/my-service
```

#### Service Structure
```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {
  // Private signals
  private _data = signal<any>(null);
  
  // Public readonly signals
  readonly data = this._data.asReadonly();
  
  constructor() {}
  
  // Public methods
  updateData(value: any) {
    this._data.set(value);
  }
}
```

### 8.4. Routing Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    loadComponent: () => 
      import('./components/test/test.component')
        .then(m => m.TestComponent)
  },
  {
    path: 'result',
    loadComponent: () => 
      import('./components/result/result.component')
        .then(m => m.ResultComponent)
  }
];
```

### 8.5. Testing Guidelines

#### Unit Tests
```bash
ng test
```

#### E2E Tests
```bash
ng e2e
```

#### Test Coverage
```bash
ng test --code-coverage
```

### 8.6. Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request
# Review & Merge
```

### 8.7. Best Practices

1. **Performance**
   - Sử dụng OnPush change detection
   - Lazy load routes
   - Optimize images
   - Minimize bundle size

2. **Accessibility**
   - Sử dụng semantic HTML
   - Thêm ARIA labels
   - Keyboard navigation support
   - Color contrast ratio >= 4.5:1

3. **Security**
   - Sanitize user inputs
   - Use Angular's built-in XSS protection
   - Validate data on client & server
   - Use HTTPS in production

4. **Code Quality**
   - Follow Angular style guide
   - Write clean, readable code
   - Add comments for complex logic
   - Regular code reviews

---

## PHỤ LỤC

### A. Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| Ctrl + → | Next Question |
| Ctrl + ← | Previous Question |
| Ctrl + Enter | Submit Test |
| Esc | Cancel Dialog |

### B. Browser Support

| Browser | Version |
|---------|---------|
| Chrome | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |
| Edge | >= 90 |

### C. API Reference

**TestService Methods:**

```typescript
// Initialize test
initializeTest(): void

// Navigate
goToNext(): void
goToPrevious(): void
goToQuestion(id: number): void

// Save answer
saveAnswer(questionId: number, content: string): void

// Submit
submitTest(): void

// Get results
getResults(): TestSession
calculateScore(): number
```

### D. File Naming Conventions

```
components/     → kebab-case
services/       → kebab-case
models/         → kebab-case
interfaces/     → PascalCase.ts
classes/        → PascalCase.ts
```

### E. Deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Build production: `npm run build`
- [ ] Check bundle size
- [ ] Test on multiple browsers
- [ ] Verify responsive design
- [ ] Check accessibility
- [ ] Update version number
- [ ] Create release notes
- [ ] Deploy to server
- [ ] Monitor for errors

---

## KẾT LUẬN

Tài liệu này cung cấp hướng dẫn chi tiết về dự án TOEIC Writing Test, từ kiến trúc hệ thống đến các tính năng cụ thể. Developers có thể sử dụng tài liệu này để:

- Hiểu rõ cấu trúc và luồng hoạt động của ứng dụng
- Phát triển các tính năng mới một cách nhất quán
- Maintain và scale ứng dụng trong tương lai
- Onboard các thành viên mới vào team

Để biết thêm chi tiết về chức năng các nút, vui lòng tham khảo file `BUTTON_FLOWS.md` trong thư mục `docs/`.

---

**© 2025 TOEIC Writing Test Project. All rights reserved.**
