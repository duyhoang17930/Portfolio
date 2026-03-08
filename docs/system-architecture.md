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
            [ Express Server (BE) ]                         [ MongoDB Database ]
            Port: 3000                                         Connection String
                    |
                    +----------------------+
                    |                      |
            [ Session Store ]      [ Email Service ]
            (MongoDB/Redis)        (Gmail SMTP)
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
| - Sidebar        |
| - ProjectCard    |
| - MessageList    |
| - CursorFollower |
| - TextTransition |
+--------+---------+
         |
+--------+---------+
|   Context Layer |
| - ThemeContext  |
| - CursorFollowerContext |
+--------+---------+
         |
+--------+---------+
|  Hooks Layer    |
| - useAuth       |
| - useGuestbook  |
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
| - Local Hooks   |
| (useState/      |
|  useEffect)     |
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
| - /api/projects  |
| - /api/techstack |
| - /api/contact  |
+--------+---------+
         |
+--------+---------+
|   Data Layer    |
| - Mongoose ODM  |
| - MongoDB Query |
+--------+---------+
         |
+--------+---------+
|   Database      |
| - MongoDB       |
| - Users Coll.   |
| - Projects Coll |
| - Guestbook Coll|
| - TechStack Coll|
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
8. BE creates/finds user in MongoDB
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
4. BE creates message in MongoDB
5. BE returns created message with user data
6. FE updates message list
7. UI displays new message
```

### 3.3 Contact Form Flow

```
Send Contact Email:
1. User fills contact form
2. FE sends: POST /api/contact with form data
3. BE validates input
4. BE uses Nodemailer to send email via Gmail SMTP
5. BE returns success/failure
6. UI displays confirmation
```

---

## 4. Database Schema

### 4.1 MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  provider: "google" | "github",
  providerId: String,
  name: String,
  email: String?,
  avatarUrl: String?,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String?,
  techStack: String[]?,
  imageUrl: String?,
  demoUrl: String?,
  repoUrl: String?,
  featured: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Guestbook Messages Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### TechStack Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  items: String[],
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
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
| GET | /auth/me | Get current user | No | - | `{ user: User | null }` |

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

#### TechStack API

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| GET | /api/techstack | Get all categories | No | - | `[TechStackCategory]` |
| POST | /api/techstack | Create category | Admin | `{ name: string, items: string[] }` | `TechStackCategory` |
| PUT | /api/techstack/:id | Update category | Admin | `{ name?: string, items?: string[] }` | `TechStackCategory` |
| DELETE | /api/techstack/:id | Delete category | Admin | - | `{ success: boolean }` |

#### Contact API

| Method | Endpoint | Description | Auth | Request Body | Response |
|--------|----------|-------------|------|--------------|----------|
| POST | /api/contact | Send contact email | No | `{ name, email, message }` | `{ success: boolean }` |

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
  id: string;
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
  id: string;
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
  id: string;
  userId: string;
  message: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

#### TechStackCategory
```typescript
interface TechStackCategory {
  id: string;
  name: string;
  items: string[];
  displayOrder: number;
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
| Database | Parameterized Queries | Mongoose ODM |

### 6.3 Environment Configuration

```env
# Server
PORT=3000
NODE_ENV=production
FE_URL=https://your-domain.com

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/portfolio

# Session
SESSION_SECRET=<32_char_minimum>

# Google OAuth
GOOGLE_CLIENT_ID=<from_console>
GOOGLE_CLIENT_SECRET=<from_console>
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=<from_settings>
GITHUB_CLIENT_SECRET=<from_settings>
GITHUB_CALLBACK_URL=https://your-domain.com/auth/github/callback

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app_password>
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
                                   [ MongoDB ]
                                   (Atlas/Local)
                                       |
                                   [ Redis ]
                                   (Optional)
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

## 8. Frontend Visual Effects

### 8.1 Custom Cursor Follower
- Implemented using @react-spring/web
- Smooth spring-based animation following mouse position
- Configurable tension and friction

### 8.2 Film Grain Effect
- CSS-based overlay with noise texture
- Applied via fixed position element
- mix-blend-overlay for subtle effect

### 8.3 Chromatic Silhouette Effect
- RGB shift on silhouette images
- Creates chromatic aberration effect
- Applied to hero section imagery

---

## 9. Scalability Considerations

### 9.1 Current Limitations
- Default in-memory session storage (not production-ready)
- Single MongoDB instance
- Single Express server instance

### 9.2 Scaling Recommendations

| Component | Current | Recommended for Scale |
|-----------|---------|----------------------|
| Session Store | Memory | MongoDB store (connect-mongo) or Redis |
| Database | Single MongoDB | MongoDB Atlas cluster |
| Backend | Single instance | PM2 cluster / Container |
| Static Assets | Local | CDN (CloudFront) |

---

## 10. Monitoring & Logging

### 10.1 Logging Strategy
- Use `morgan` for HTTP request logging
- Use `winston` or `pino` for structured logging
- Log levels: error, warn, info, debug

### 10.2 Health Checks
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

## 11. File Structure Summary

```
/home/ret/Portfolio/
├── FE/                           # Frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── layout/         # Layout, Sidebar
│   │   │   ├── guestbook/     # LoginPrompt, MessageForm, MessageList
│   │   │   ├── CursorFollower.tsx
│   │   │   └── TextTransition.tsx
│   │   ├── pages/              # Page components
│   │   ├── contexts/          # ThemeContext, CursorFollowerContext
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities (api.ts, utils.ts)
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── BE/                           # Backend
│   ├── src/
│   │   ├── middleware/         # Admin middleware
│   │   ├── models/            # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── strategies/        # OAuth strategies
│   │   ├── scripts/           # Seed scripts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
└── docs/                         # Documentation
    ├── project-overview-pdr.md
    ├── codebase-summary.md
    ├── code-standards.md
    ├── system-architecture.md
    └── deployment-guide.md
```

---

*Document Version: 1.2*
*Last Updated: 2026-03-08*
