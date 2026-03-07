# System Architecture

## Overview

This document provides a comprehensive overview of the portfolio project's system architecture, including high-level design, component interactions, API design, and database schema.

---

## 1. High-Level Architecture

```
                                    [ Internet ]
                                           |
                    +----------------------+----------------------+
                    |                                              |
              [ Browser (FE) ]                              [ OAuth Providers ]
                    |                                              |
                    |  HTTPS                                        | Google
                    |                                              | GitHub
                    +----------------------+----------------------+
                                           |
                                    [ Load Balancer / Nginx ]
                                           |
                    +----------------------+----------------------+
                    |                                              |
            [ Express Server (BE) ]                         [ MySQL Database ]
            Port: 3000/5000                                     Port: 3306
                    |
                    +----------------------+
                    |                      |
            [ Session Store ]      [ File System ]
            (Memory/Redis)         (Uploads)
```

---

## 2. Component Architecture

### 2.1 Frontend (React)

```
FE Architecture:
+------------------+
|   Browser        |
+--------+---------+
         |
    [ React Router ]
         |
+--------+---------+
|   Pages Layer    |
|  - Home          |
|  - About         |
|  - TechStack     |
|  - Projects      |
|  - Contact       |
|  - Guestbook     |
|  - Admin         |
+--------+---------+
         |
+--------+---------+
| Components Layer |
| - Layout         |
| - Navbar         |
| - ProjectCard    |
| - MessageList    |
+--------+---------+
         |
+--------+---------+
|  Hooks Layer    |
| - useAuth       |
| - useGuestbook  |
| - useProjects   |
+--------+---------+
         |
+--------+---------+
|   API Layer     |
| - Axios Instance|
| - Request/Resp  |
| Interceptors    |
+--------+---------+
         |
+--------+---------+
|   State         |
| - React State   |
| - React Query   |
| (optional)      |
+--------+---------+
```

### 2.2 Backend (Express)

```
BE Architecture:
+------------------+
|  HTTP Requests   |
+--------+---------+
         |
    [ Express App ]
         |
+--------+---------+
|  Middleware      |
| - CORS           |
| - Body Parser    |
| - Session        |
| - Passport       |
| - Custom         |
+--------+---------+
         |
+--------+---------+
|   Routes Layer   |
| - /auth/*        |
| - /api/guestbook |
| - /api/projects |
+--------+---------+
         |
+--------+---------+
| Controllers/    |
| Services Layer  |
| - Auth Logic    |
| - CRUD Ops      |
+--------+---------+
         |
+--------+---------+
|   Data Layer    |
| - Sequelize ORM |
| - MySQL Queries |
+--------+---------+
         |
+--------+---------+
|   Database      |
| - MySQL 8.x     |
| - Users Table   |
| - Projects Tbl  |
| - Guestbook Tbl |
+------------------+
```

---

## 3. Data Flow

### 3.1 OAuth Authentication Flow

```
1. User clicks "Login with Google"
2. FE redirects to BE: GET /auth/google
3. BE redirects to Google OAuth consent screen
4. User grants permission
5. Google redirects to BE: GET /auth/google/callback?code=xxx
6. BE exchanges code for access token
7. BE fetches user profile from Google
8. BE creates/finds user in database
9. BE establishes session
10. BE redirects to FE: /guestbook
11. FE fetches current user: GET /auth/me
12. Session cookie sent automatically
```

### 3.2 Guestbook Message Flow

```
Post Message:
1. User enters message in form
2. FE sends: POST /api/guestbook with message
3. BE checks authentication
4. BE creates message in database
5. BE returns created message with user data
6. FE updates message list
7. UI displays new message
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
+------------------+       +-----------------------+
|      users       |       |    guestbook_messages |
+------------------+       +-----------------------+
| id (PK)          |<------| userId (FK)           |
| provider         |       | id (PK)               |
| providerId       |       | message               |
| name             |       | createdAt             |
| email            |       | updatedAt             |
| avatarUrl        |       +-----------------------+
| isAdmin          |
| createdAt        |       +-----------------------+
| updatedAt        |       |       projects        |
+------------------+       +-----------------------+
                            | id (PK)               |
                            | title                 |
                            | description           |
                            | techStack (JSON)     |
                            | imageUrl             |
                            | demoUrl              |
                            | repoUrl              |
                            | featured             |
                            | displayOrder         |
                            | createdAt            |
                            | updatedAt            |
                            +-----------------------+
```

### 4.2 Table Definitions

#### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  providerId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatarUrl TEXT,
  isAdmin BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider (provider),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Projects Table
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  techStack JSON,
  imageUrl TEXT,
  demoUrl VARCHAR(255),
  repoUrl VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  displayOrder INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured (featured),
  INDEX idx_display_order (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Guestbook Messages Table
```sql
CREATE TABLE guestbook_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (userId),
  INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. API Design

### 5.1 REST API Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| GET | /auth/google | Initiate Google OAuth | No | - | Redirect |
| GET | /auth/google/callback | Google callback | No | - | Redirect |
| GET | /auth/github | Initiate GitHub OAuth | No | - | Redirect |
| GET | /auth/github/callback | GitHub callback | No | - | Redirect |
| GET | /auth/logout | Logout user | No | - | Redirect |
| GET | /auth/me | Get current user | No | - | `{ user: User \| null }` |

#### Guestbook API

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| GET | /api/guestbook | Get all messages | No | - | `[GuestbookMessage]` |
| POST | /api/guestbook | Create message | Yes | `{ message: string }` | `GuestbookMessage` |
| DELETE | /api/guestbook/:id | Delete message | Yes | - | `{ success: boolean }` |

#### Projects API

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| GET | /api/projects | Get all projects | No | - | `[Project]` |
| POST | /api/projects | Create project | Admin | Project fields | `Project` |
| PUT | /api/projects/:id | Update project | Admin | Project fields | `Project` |
| DELETE | /api/projects/:id | Delete project | Admin | - | `{ success: boolean }` |

### 5.2 API Response Formats

#### Success Response
```json
{
  "success": true,
  "data": { }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

#### List Response (with pagination)
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 5.3 Data Models

#### User
```typescript
interface User {
  id: number;
  provider: 'google' | 'github';
  providerId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Project
```typescript
interface Project {
  id: number;
  title: string;
  description?: string;
  techStack?: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

#### GuestbookMessage
```typescript
interface GuestbookMessage {
  id: number;
  userId: number;
  message: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
                    +------------------+
                    |    User Agent    |
                    +--------+---------+
                             |
                             | 1. HTTPS Request
                             v
                    +------------------+
                    |    Nginx         |
                    |  (TLS Term.)    |
                    +--------+---------+
                             |
                             | 2. Proxy to Backend
                             v
                    +------------------+
                    |   Express App    |
                    +--------+---------+
                             |
                    +--------+---------+
                    |  Session Check   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                              |
              v                              v
      +---------------+              +---------------+
      | Not Authenticated      |      | Authenticated |
      +---------------+              +---------------+
              |                              |
              v                              v
      +---------------+              +---------------+
      | Allow Public  |              | Check Required|
      | Endpoints     |              | Permissions   |
      +---------------+              +---------------+
```

### 6.2 Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| Transport | HTTPS | Nginx with TLS 1.3 |
| Network | Firewall | Only ports 80, 443 open |
| Application | CORS | Whitelist FE origin |
| Session | Secure Cookies | httpOnly, secure, sameSite |
| API | Rate Limiting | express-rate-limit |
| Input | Validation | Zod/Joi validators |
| Database | Parameterized Queries | Sequelize ORM |

### 6.3 Environment Configuration

```env
# Server
PORT=3000
NODE_ENV=production
FE_URL=https://your-domain.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio
DB_USER=portfolio_user
DB_PASSWORD=<secure_password>

# Session
SESSION_SECRET=<32_char_minimum>

# Google OAuth
GOOGLE_CLIENT_ID=<from_console>
GOOGLE_CLIENT_SECRET=<from_console>
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback

#GITHUB_CLIENT GitHub OAuth
_ID=<from_settings>
GITHUB_CLIENT_SECRET=<from_settings>
GITHUB_CALLBACK_URL=https://your-domain.com/auth/github/callback
```

---

## 7. Deployment Architecture

### 7.1 Production Setup

```
                    [ Internet ]
                          |
                    [ Cloudflare / DNS ]
                          |
                    [ Nginx (Reverse Proxy) ]
                          |
           +--------------+--------------+
           |                             |
           v                             v
    [ Vercel (FE) ]              [ VPS (BE) ]
    https://your-domain.com     https://api.your-domain.com
                                       |
                                   [ MySQL ]
                                   (RDS/Local)
```

### 7.2 Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Auth Routes
    location /auth/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Pass cookies
        proxy_set_header Cookie $http_cookie;
        proxy_pass_header Set-Cookie;
    }

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

---

## 8. Scalability Considerations

### 8.1 Current Limitations
- In-memory session storage (not production-ready)
- Single MySQL instance
- Single Express server instance

### 8.2 Scaling Recommendations

| Component | Current | Recommended for Scale |
|-----------|---------|----------------------|
| Session Store | Memory | Redis |
| Database | Single MySQL | MySQL read replicas |
| Backend | Single instance | PM2 cluster / Container |
| Static Assets | Local | CDN (CloudFront) |

---

## 9. Monitoring & Logging

### 9.1 Logging Strategy
- Use `morgan` for HTTP request logging
- Use `winston` or `pino` for structured logging
- Log levels: error, warn, info, debug

### 9.2 Health Checks
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

---

## 10. File Structure Summary

```
/home/ret/Portfolio/
├── FE/                           # Frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── BE/                           # Backend
│   ├── src/
│   │   ├── config/             # Configuration
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── strategies/         # OAuth strategies
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilities
│   │   └── server.ts
│   └── package.json
│
└── docs/                         # Documentation
    ├── project-overview-pdr.md
    ├── codebase-summary.md
    ├── code-standards.md
    └── system-architecture.md
```

---

*Document Version: 1.0*
*Last Updated: 2026-03-07*
