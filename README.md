<div align="center">

# 🚀 AI Blog Generator

### Transform YouTube Videos into SEO-Optimized Blog Posts with AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-FF6B6B?style=for-the-badge)](https://groq.com/)

[Overview](#-overview) • [Screenshots](#-screenshots) • [Features](#-key-features) • [Tech Stack](#️-tech-stack) • [Architecture](#️-architecture) • [API Endpoints](#-api-endpoints) • [Installation](#-installation) • [Technical Highlights](#-key-technical-highlights)

</div>

---

## 📋 Overview

**AI Blog Generator** is a production-ready full-stack SaaS application that leverages cutting-edge AI technology to automatically convert YouTube video content into professional, SEO-optimized blog articles. Built with modern web technologies and enterprise-grade architecture patterns, this project showcases proficiency in both frontend and backend development, API design, containerization, and AI integration.

### 🎯 Problem Statement

Content creators and digital marketers often need to repurpose video content into written format, a time-consuming manual process. This application automates that workflow using AI, reducing production time from hours to seconds.

### 💡 Solution

A robust web platform that:

- Extracts video transcripts automatically using `yt-dlp`
- Processes raw transcripts with Llama 3.3 70B via Groq's lightning-fast LPU inference
- Generates structured, publication-ready Markdown blog posts
- Provides a complete CRUD interface with real-time editing capabilities
- Implements secure authentication and authorization
- Offers multiple export formats (Markdown, HTML)

---

## 📸 Screenshots

### 🏠 Landing Page

![Home](./screenshots/home.jpeg)

### ⚙️ Application Interface

|             **User Dashboard**             |       **Markdown Editor**        |
| :----------------------------------------: | :------------------------------: |
| ![Dashboard](./screenshots/dashboard.jpeg) | ![Edit](./screenshots/edit.jpeg) |

---

## ✨ Key Features

### 🤖 AI-Powered Content Generation

- **Intelligent Transcript Extraction**: Automatically retrieves subtitles from YouTube videos in multiple languages.
- **Advanced NLP Processing**: Utilizes Llama 3.3 70B model to transform raw transcripts into coherent articles.
- **SEO Optimization**: Generated content includes proper heading hierarchy, keywords, and meta descriptions.

### 🔐 Enterprise-Grade Security

- **JWT Authentication**: Secure token-based authentication with refresh token rotation.
- **HttpOnly Cookies**: Prevents XSS attacks by storing tokens in secure, HTTP-only cookies (No LocalStorage).
- **CSRF Protection**: Configured Django middleware for cross-site request forgery prevention.

### 📝 Rich Content Management

- **Full CRUD Operations**: Create, Read, Update, Delete blog posts with RESTful API.
- **Real-Time Editor**: Live Markdown rendering with syntax highlighting.
- **Multi-Format Export**: Download content as Markdown (.md) or styled HTML.

### 🐳 DevOps & Infrastructure

- **Full Dockerization**: Complete containerization of all services (Frontend, Backend, Database).
- **Docker Compose Orchestration**: One-command deployment for entire stack.
- **Volume Persistence**: Database data persists across container restarts.

---

## 🏗️ Architecture

This project follows a decoupled client-server architecture, containerized with Docker.

```mermaid
graph TD
    User[Client Browser] -->|HTTP/HTTPS| Frontend[React + Vite Frontend]
    Frontend -->|REST API Calls| Backend[Django REST Framework]

    subgraph Docker Container Network
        Backend -->|Auth & Data| DB[(PostgreSQL Database)]
        Backend -->|Extract Subtitles| YT[yt-dlp Service]
        Backend -->|AI Inference| Groq[Groq API (Llama 3)]
    end

    subgraph Security Layer
        Backend -- HttpOnly Cookie --> User
        Backend -- CSRF Token --> User
    end
```

---

## 🛠️ Tech Stack

### Frontend Architecture

- **React 19 + TypeScript:** Type-safe component development.
- **Vite:** Lightning-fast build tool & HMR.
- **React Router DOM:** Client-side routing.
- **Tailwind CSS:** Utility-first CSS framework for responsive design.
- **Lucide React:** Modern SVG icon library.

### Backend Architecture

- **Django 5.0 + DRF:** Robust REST API framework.
- **PostgreSQL 15:** ACID-compliant relational database.
- **SimpleJWT:** JWT authentication library.
- **Groq SDK:** LPU-accelerated AI inference (18x faster than standard GPUs).

---

## 🔌 API Endpoints

The API is designed following RESTful principles.

### **Authentication & User Management**

| Method   | Endpoint                    | Description                            | Auth Required |
| :------- | :-------------------------- | :------------------------------------- | :-----------: |
| `POST`   | `/api/signup`               | Register a new user account            |      ❌       |
| `POST`   | `/api/login`                | Login (Obtain Access & Refresh Tokens) |      ❌       |
| `POST`   | `/api/logout`               | Logout (Blacklist token/Clear cookie)  |      ✅       |
| `POST`   | `/api/token/refresh`        | Refresh expired access token           |      ❌       |
| `GET`    | `/api/user/me`              | Retrieve current user profile          |      ✅       |
| `PUT`    | `/api/user/me`              | Update user profile details            |      ✅       |
| `DELETE` | `/api/user/me`              | **Delete user account permanently**    |      ✅       |
| `POST`   | `/api/user/change-password` | Change user password                   |      ✅       |

### **AI Generation & Blog Content**

| Method   | Endpoint                | Description                                    | Auth Required |
| :------- | :---------------------- | :--------------------------------------------- | :-----------: |
| `POST`   | `/api/generate-blog`    | **AI Core:** Generate content from YouTube URL |      ✅       |
| `GET`    | `/api/blog-posts`       | List all created blog posts                    |      ✅       |
| `POST`   | `/api/blog-posts`       | Manually create a blog post                    |      ✅       |
| `GET`    | `/api/blog-posts/{id}/` | Retrieve specific blog details                 |      ✅       |
| `PUT`    | `/api/blog-posts/{id}/` | Update blog content (Save editor changes)      |      ✅       |
| `DELETE` | `/api/blog-posts/{id}/` | Delete a blog post                             |      ✅       |

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Docker Desktop** installed
- **Docker Compose** (1.29+)
- **Groq API Key** - [Get Free Key](https://console.groq.com/)

### Quick Start (Docker - Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/JACS002/BlogGen-ai
cd ai-blog-generator
```

2. **Configure environment variables**

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Required `.env` configuration:

```env
# Django Settings
SECRET_KEY=your-secret-key-here-generate-with-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# AI Service
GROQ_API_KEY=your-groq-api-key-here

```

3. **Launch the application**

```bash
docker-compose up --build
```

This will:

- Build all Docker images
- Start PostgreSQL database
- Run Django migrations
- Start backend server on `http://localhost:8000`
- Start frontend dev server on `http://localhost:5173`

---

## 🎯 Key Technical Highlights

### Full-Stack Proficiency

- **Frontend**: Modern React with TypeScript, demonstrating type-safe component architecture
- **Backend**: RESTful API design with Django, following industry best practices
- **Database**: Relational database (PostgreSQL) design with proper indexing and query optimization
- **DevOps**: Containerization strategy for consistent environments across dev/staging/prod

### Security Awareness

- Implemented HttpOnly cookies to prevent XSS attacks
- CSRF token validation for state-changing operations
- Password hashing with PBKDF2 algorithm
- JWT token authentication with expiration handling
- Environment variable management for sensitive data
- CORS configuration for controlled API access

### AI/ML Integration

- Successfully integrated third-party AI API (Groq)
- Custom prompt engineering for consistent AI output
- Error handling for external API failures
- Rate limiting considerations for API usage
- Cost optimization through efficient transcript processing

### Clean Code Practices

- TypeScript for compile-time type safety
- Component composition and reusability
- Separation of concerns (services, components, pages)
- RESTful API design principles
- Django ORM for database abstraction
- Comprehensive error handling and user feedback

### Performance Optimization

- Vite for fast development builds
- React 19's automatic optimizations
- Database query optimization with select_related
- Lazy loading for routes
- Image optimization strategies

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Joel Cuascota - JACS**

- Portfolio: [jacs.dev](https:/www.jacs.dev)
- LinkedIn: [linkedin.com/in/joel-cuascota](https://linkedin.com/in/joel-cuascota)
- GitHub: [@JACS002](https://github.com/JACS002)
- Email: joel.cuascota@hotmail.com

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ and ☕**

</div>
