# Student Management System

Hệ thống quản lý sinh viên được xây dựng với Vue.js 3 (Frontend) và Node.js/Express (Backend).

## Tính năng

### Dành cho Giáo viên:

- 🔐 Đăng nhập hệ thống
- 📊 Xem dashboard thống kê
- 👥 Quản lý danh sách sinh viên
- ➕ Thêm sinh viên mới
- ✏️ Chỉnh sửa thông tin sinh viên
- 🗑️ Xóa sinh viên
- 🔍 Tìm kiếm và lọc sinh viên

### Dành cho Sinh viên:

- 🔐 Đăng nhập hệ thống
- 📋 Xem thông tin cá nhân
- 📈 Xem điểm CPA và tín chỉ

## Công nghệ sử dụng

### Frontend:

- Vue.js 3
- Vue Router
- Pinia (State Management)
- Element Plus (UI Library)
- Axios (HTTP Client)
- Vite (Build Tool)

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (Password Hashing)

## Cài đặt và chạy dự án

### Yêu cầu hệ thống:

- Node.js 16+
- MongoDB

### Backend:

\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### Frontend:

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### Tạo tài khoản mẫu:

\`\`\`bash

# Tạo tài khoản giáo viên

cd server
npm run create-teacher

# Tạo tài khoản sinh viên

npm run create-student
\`\`\`

## Tài khoản mặc định

### Giáo viên:

- Username: `admin`
- Password: `admin123`

### Sinh viên:

- Username: `student`
- Password: `student123`

## Cấu trúc dự án

\`\`\`
student-management/
├── client/ # Frontend (Vue.js)
│ ├── src/
│ │ ├── components/
│ │ ├── views/
│ │ ├── stores/
│ │ └── router/
│ └── package.json
├── server/ # Backend (Node.js)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── package.json
└── README.md
\`\`\`

## API Endpoints

### Authentication:

- `POST /api/auth/login` - Đăng nhập

### Students:

- `GET /api/students` - Lấy danh sách sinh viên
- `POST /api/students` - Thêm sinh viên mới
- `PUT /api/students/:id` - Cập nhật thông tin sinh viên
- `DELETE /api/students/:id` - Xóa sinh viên
- `GET /api/students/by-student-id/:studentId` - Lấy thông tin theo MSSV

### Statistics:

- `GET /api/statistics` - Lấy thống kê tổng quan

## Môi trường phát triển

Tạo file `.env` trong thư mục `server`:
\`\`\`
MONGO_URI=mongodb://localhost:27017/student-management
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
\`\`\`

Tạo file `.env` trong thư mục `client`:
\`\`\`
VITE_API_URL=http://localhost:3000/api
\`\`\`

## Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- Email: your-email@example.com
- Project Link: [https://github.com/yourusername/student-management](https://github.com/yourusername/student-management)
