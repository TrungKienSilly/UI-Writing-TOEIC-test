# TOEIC Writing Test Application

Ứng dụng thi TOEIC Writing với giao diện tương tự Study4.

## Tính năng

- ✅ 8 câu hỏi theo cấu trúc TOEIC Writing Test:
  - Questions 1-5: Write a sentence based on a picture
  - Questions 6-7: Respond to an email
  - Question 8: Write an opinion essay

- ✅ Đếm số từ tự động
- ✅ Đồng hồ đếm ngược
- ✅ Lưu câu trả lời tự động
- ✅ Navigation giữa các câu hỏi
- ✅ Đánh dấu câu đã trả lời
- ✅ Giao diện responsive

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
ng serve
```

Truy cập: http://localhost:4200

## Thêm hình ảnh

Để thêm hình ảnh cho Questions 1-5, đặt các file hình vào thư mục:
```
public/assets/images/
```

Đặt tên file: q1.jpg, q2.jpg, q3.jpg, q4.jpg, q5.jpg

## Cấu trúc dự án

```
src/
├── app/
│   ├── components/
│   │   └── test/
│   │       ├── test.component.ts
│   │       ├── test.component.html
│   │       └── test.component.scss
│   ├── models/
│   │   └── question.model.ts
│   ├── services/
│   │   └── test.service.ts
│   └── ...
└── ...
```

## Tùy chỉnh

- Thời gian thi: Sửa trong `test.service.ts` → `timeLimit` (đơn vị: giây)
- Câu hỏi: Sửa trong `test.service.ts` → `getSampleQuestions()`
