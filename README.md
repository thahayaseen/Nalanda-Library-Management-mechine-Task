# 📚 Nalanda Library Management System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)
![Redis](https://img.shields.io/badge/Redis-7.0+-red.svg)

*A modern, full-stack library management platform built with cutting-edge technologies*

[🚀 Demo](#-getting-started) • [📖 Documentation](#-api-documentation) • [🤝 Contributing](#-contributing) • [📧 Contact](#-author)

</div>

---

## 🌟 Overview

Nalanda Library Management System is a comprehensive, scalable library management platform designed to streamline library operations. Built with modern web technologies and following industry best practices, it provides a seamless experience for both librarians and library members.

### ✨ Key Highlights

- 🏗️ **Scalable Architecture** - Built using Controller-Service-Repository pattern
- 🔐 **Secure Authentication** - JWT-based access control with role-based permissions
- 📧 **Email Integration** - Automated notifications and OTP verification
- ⚡ **High Performance** - Redis-powered caching and session management
- 📱 **Responsive Design** - Modern UI built with Next.js and Tailwind CSS
- 🔄 **Real-time Operations** - Instant book borrowing and return tracking

---

## 🛠️ Tech Stack

<div align="center">

| **Backend** | **Frontend** | **Database & Cache** | **Other Tools** |
|-------------|--------------|---------------------|-----------------|
| Node.js     | Next.js      | MongoDB             | JWT             |
| Express.js  | TypeScript   | Redis               | Nodemailer      |
| TypeScript  | Tailwind CSS | Mongoose            | Multer          |
| Zod         | React        | -                   | Bcrypt          |

</div>

---

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** - Secure access and refresh token management
- **OTP Verification** - Email-based two-factor authentication
- **Role-Based Access** - Granular permissions for Admin and Member roles
- **Session Management** - Redis-powered secure session handling

### 📚 Book Management
- **CRUD Operations** - Complete book lifecycle management
- **Image Upload** - Book cover image support with Multer
- **Search & Filter** - Advanced book discovery capabilities
- **Pagination** - Efficient large dataset handling

### 📖 Borrowing System
- **Book Borrowing** - Seamless checkout process for members
- **Return Management** - Track and manage book returns
- **Borrowing History** - Complete audit trail of transactions
- **Admin Dashboard** - Comprehensive borrowing analytics

### 📧 Communication
- **Email Notifications** - Automated emails for key events
- **OTP Delivery** - Secure email-based verification codes
- **Custom Templates** - Professional email formatting

---

## 📁 Project Structure

```
nalanda-library/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Environment & DB configurations
│   │   ├── 📁 constants/       # HTTP codes & status messages
│   │   ├── 📁 controller/      # Route handlers
│   │   ├── 📁 di/              # Dependency injection
│   │   ├── 📁 dto/             # Data Transfer Objects
│   │   ├── 📁 middleware/      # Auth guards & error handlers
│   │   ├── 📁 models/          # Mongoose schemas
│   │   ├── 📁 provider/        # Redis, Email, OTP services
│   │   ├── 📁 repositories/    # Data access layer
│   │   ├── 📁 router/          # Express route definitions
│   │   ├── 📁 schema/          # Zod validation schemas
│   │   ├── 📁 services/        # Business logic layer
│   │   └── 📁 utils/           # Helper functions
│   ├── 📁 shared/types/        # Shared TypeScript interfaces
│   └── 📁 public/uploads/      # Book cover images
├── 📁 frontend/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 admin/           # Admin dashboard pages
│   │   ├── 📁 auth/            # Authentication pages
│   │   ├── 📁 books/           # Book listing & details
│   │   ├── 📁 profile/         # User profile management
│   │   └── 📄 layout.tsx       # Root layout component
│   ├── 📁 components/          # Reusable UI components
│   ├── 📁 contexts/            # React Context providers
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 services/            # API service layer
│   └── 📁 styles/              # Global CSS styles
└── 📄 README.md
```

---

## ⚙️ Environment Setup

Create a `.env` file in the `/backend` directory:

```env
# Server Configuration
PORT=4000

# Database
MONGO_URL=mongodb://localhost:27017/nalanda

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secure_access_secret_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here

# Redis Cache
REDIS_URL=redis://localhost:6379

# Email Service
NodeMailEmail=your_email@example.com
MAILPASS=your_email_app_password

# OTP Configuration
OTPTIME=300          # OTP expiry time in seconds
USERTIMELIMIT=86400  # User session limit in seconds
```

> **Security Note**: Never commit your `.env` file. Use strong, unique secrets in production.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **Redis** (v7.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thahayaseen/Library-Management-mechine-Task.git
   cd Library-Management-mechine-Task
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   - Copy the environment configuration from the [Environment Setup](#️-environment-setup) section
   - Create `.env` file in the backend directory
   - Update the values according to your setup

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   *Server runs on: http://localhost:4000*

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   *Application runs on: http://localhost:3000*

---

## 📖 API Documentation

### Base URL
```
http://localhost:4000/api
```

### 🔑 Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/auth/signup` | Create new user account | Public |
| `POST` | `/auth/login` | User authentication | Public |
| `GET`  | `/auth/me` | Get current user info | Protected |
| `POST` | `/auth/verify-otp` | Verify OTP code | Public |

### 📚 Book Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/books` | Get all books (paginated) | Public |
| `GET` | `/books/:id` | Get book by ID | Public |
| `POST` | `/books` | Add new book | Admin Only |
| `PUT` | `/books/:id` | Update book | Admin Only |
| `DELETE` | `/books/:id` | Delete book | Admin Only |

### 📖 Borrowing System

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/borrow` | Borrow a book | Member |
| `POST` | `/borrow/return` | Return a book | Member |
| `GET` | `/borrow/my-books` | Get user's borrowed books | Member |
| `GET` | `/borrow/all` | Get all borrowing records | Admin Only |

---

## 🎨 Screenshots

<div align="center">

*Screenshots will be added soon*

| Dashboard | Book Management | Borrowing System |
|-----------|-----------------|------------------|
| 🖼️ Coming Soon | 🖼️ Coming Soon | 🖼️ Coming Soon |

</div>

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm run test

# Run frontend tests
cd frontend
npm run test

# Run e2e tests
npm run test:e2e
```

---

## 🚀 Deployment

### Docker Support (Coming Soon)

```bash
# Build and run with Docker
docker-compose up --build
```

### Manual Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start production backend:
   ```bash
   cd backend
   npm start
   ```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

```bash
# Format code
npm run lint

# Run type check
npm run type-check

# Run all tests
npm run test
```

---

## 📋 Roadmap

- [ ] **Docker Integration** - Containerization for easy deployment
- [ ] **API Documentation** - Interactive Swagger/OpenAPI docs
- [ ] **Mobile App** - React Native companion app
- [ ] **Advanced Analytics** - Library usage insights and reports
- [ ] **Notification System** - Real-time notifications for overdue books
- [ ] **Multi-library Support** - Manage multiple library branches
- [ ] **Book Recommendation** - AI-powered book suggestions

---

## 🐛 Issues & Support

Found a bug or need help? Please check our [Issues](https://github.com/thahayaseen/Library-Management-mechine-Task/issues) page or create a new issue.

**Before creating an issue:**
- Check if the issue already exists
- Provide clear reproduction steps
- Include relevant error messages and screenshots

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Thaha Yaseen K**
- GitHub: [@thahayaseen](https://github.com/thahayaseen)
- LinkedIn: [Connect with me](https://linkedin.com/in/thahayaseen)
- Email: thahayaseen@example.com

---

## 🙏 Acknowledgments

- Built as a learning project to demonstrate modern web development practices
- Inspired by real-world library management needs
- Thanks to the open-source community for the amazing tools and libraries

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Made with ❤️ by [Thaha Yaseen](https://github.com/thahayaseen)*

</div>

---

## 📞 Contact

Have questions or suggestions? Feel free to reach out:

- 📧 Email: thahayaseen@example.com
- 💬 GitHub Discussions: [Start a discussion](https://github.com/thahayaseen/Library-Management-mechine-Task/discussions)
- 🐛 Bug Reports: [Create an issue](https://github.com/thahayaseen/Library-Management-mechine-Task/issues)

---

*Last updated: August 2025*
