# Portfolio Project - Product Development Requirements (PDR)

## 1. Project Overview

**Project Name:** Fullstack Portfolio with OAuth Guestbook
**Project Type:** Full-stack web application
**Status:** In Development
**Priority:** P2
**Estimated Effort:** 8 hours

### Description

A personal portfolio website featuring 6 main tabs (Home, About, TechStack, Projects, Contact, Guestbook) with OAuth authentication via Google and GitHub. The project includes an admin dashboard for managing portfolio projects and a guestbook where visitors can leave messages after signing in.

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | ~5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool |
| Tailwind CSS | 4.2.1 | Styling |
| React Router | Latest | Client-side routing |
| Axios | Latest | HTTP client |
| shadcn/ui | Latest | Component library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.2.1 | Web framework |
| TypeScript | 5.9.3 | Type safety |
| Node.js | Latest | Runtime |
| Passport.js | Latest | OAuth authentication |
| Sequelize | Latest | ORM for MySQL |
| MySQL | 8.x | Database |
| express-session | Latest | Session management |

### Development Tools
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| ts-node-dev | TypeScript development |
| tsx | TypeScript executor |

---

## 3. Core Features

### 3.1 Public Pages (6 Tabs)

1. **Home** - Hero section with name, title, and introduction
2. **About** - Personal background and experience
3. **TechStack** - Skills and technologies used
4. **Projects** - Portfolio projects fetched from API (publicly viewable)
5. **Contact** - Contact form for reaching out
6. **Guestbook** - Message board for visitor interactions

### 3.2 Authentication

- **OAuth Providers:** Google and GitHub
- **Session Management:** express-session with secure cookies in production
- **User Data Stored:** Provider, providerId, name, email, avatarUrl, isAdmin flag

### 3.3 Admin Dashboard

- **Access:** Restricted to users with `isAdmin = true`
- **Features:**
  - Create new projects
  - Edit existing projects
  - Delete projects
  - View all guestbook messages

### 3.4 Database Schema

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
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
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
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Guestbook Messages Table
```sql
CREATE TABLE guestbook_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 4. API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /auth/google | Initiate Google OAuth | No |
| GET | /auth/google/callback | Google OAuth callback | No |
| GET | /auth/github | Initiate GitHub OAuth | No |
| GET | /auth/github/callback | GitHub OAuth callback | No |
| GET | /auth/logout | Logout user | No |
| GET | /auth/me | Get current user | No |

### Guestbook API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/guestbook | Get all messages | No |
| POST | /api/guestbook | Create message | Yes |
| DELETE | /api/guestbook/:id | Delete own message | Yes |

### Projects API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/projects | Get all projects | No |
| POST | /api/projects | Create project | Admin only |
| PUT | /api/projects/:id | Update project | Admin only |
| DELETE | /api/projects/:id | Delete project | Admin only |

---

## 5. Functional Requirements

### F1: Public Portfolio Display
- All 6 tabs must be accessible without authentication
- Projects page fetches data from `/api/projects` endpoint
- TechStack page displays static technology list

### F2: OAuth Authentication
- Users can sign in with Google or GitHub
- First-time users are automatically registered in the database
- Session persists across page refreshes (with credentials)

### F3: Guestbook Functionality
- Anyone can view guestbook messages
- Only authenticated users can post messages
- Users can only delete their own messages

### F4: Admin Dashboard
- Only accessible to users with `isAdmin = true`
- Full CRUD operations for projects
- Visual indication of admin status in UI

### F5: Contact Form
- Public contact form for visitors
- Form data logged or sent to configured email service

---

## 6. Non-Functional Requirements

### N1: Performance
- Frontend initial load under 3 seconds
- API responses under 500ms

### N2: Security
- HTTPS in production
- Secure session cookies (httpOnly, secure flag)
- CORS configured for frontend origin only
- Input validation on all API endpoints

### N3: Maintainability
- TypeScript for type safety
- ESLint + Prettier for code consistency
- Modular component structure
- Environment-based configuration

---

## 7. Implementation Phases

### Phase 1: Project Setup
- Install FE dependencies (shadcn/ui, Tailwind, React Router, Axios)
- Install BE dependencies (Passport.js, Sequelize, MySQL, express-session)
- Configure TypeScript and build tools

### Phase 2: Backend Development
- Setup Express server with TypeScript
- Configure MySQL connection with Sequelize
- Create User, Project, and GuestbookMessage models
- Implement Passport.js OAuth (Google + GitHub)
- Create API endpoints for guestbook and projects

### Phase 3: Frontend Development
- Setup React Router with tab navigation
- Create layout with navigation
- Build 7 pages (Home, About, TechStack, Projects, Contact, Guestbook, Admin)
- Implement OAuth login flow
- Connect to backend API

### Phase 4: Deployment
- Dockerize backend
- Configure Nginx with SSL
- Deploy to Vercel (FE) and VPS (BE)

---

## 8. Acceptance Criteria

### AC1: Application Launch
- [ ] Frontend starts on port 5173
- [ ] Backend starts on port 3000
- [ ] Database connection established

### AC2: Authentication
- [ ] Google OAuth flow completes successfully
- [ ] GitHub OAuth flow completes successfully
- [ ] User session persists on page refresh
- [ ] Logout clears session

### AC3: Guestbook
- [ ] Messages load without authentication
- [ ] Authenticated users can post messages
- [ ] Users can delete their own messages
- [ ] Unauthenticated users see login prompt

### AC4: Admin Dashboard
- [ ] Admin-only access enforced
- [ ] CRUD operations work correctly
- [ ] Non-admins cannot access endpoints

### AC5: Projects Page
- [ ] Projects load from API
- [ ] Featured projects displayed first
- [ ] Links to demo and repo work

---

## 9. Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
FE_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio
DB_USER=root
DB_PASSWORD=your_password

SESSION_SECRET=your_session_secret_min_32_chars

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## 10. Roadmap

### v1.0.0 (Initial Release)
- 6 tab portfolio with OAuth guestbook
- Admin dashboard for project management
- Basic deployment

### Future Enhancements
- Blog functionality
- Project filtering and search
- Real-time guestbook updates (WebSocket)
- Analytics dashboard
- Dark/light theme toggle

---

*Document Version: 1.0*
*Last Updated: 2026-03-07*
*Status: Active*
