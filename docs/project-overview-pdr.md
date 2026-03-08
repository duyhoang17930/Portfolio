# Portfolio Project - Product Development Requirements (PDR)

## 1. Project Overview

**Project Name:** Fullstack Portfolio with OAuth Guestbook
**Project Type:** Full-stack web application
**Status:** In Development
**Priority:** P1
**Estimated Effort:** 20 hours

### Description

A personal portfolio website featuring 7 tabs (Home, About, TechStack, Projects, Contact, Guestbook, Admin) with OAuth authentication via Google and GitHub. The project includes an admin dashboard for managing portfolio projects and techstack categories, a guestbook where visitors can leave messages after signing in, and a contact form for reaching out.

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool |
| Tailwind CSS | 4.2.1 | Styling |
| React Router | 7.13.1 | Client-side routing |
| Axios | 1.13.6 | HTTP client |
| @react-spring/web | 10.0.3 | Animation library |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class name utility |
| lucide-react | 0.577.0 | Icons |
| react-icons | 5.6.0 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.2.1 | Web framework |
| TypeScript | 5.9.3 | Type safety |
| Node.js | ES2020 | Runtime |
| MongoDB | Latest | Database |
| Mongoose | 9.2.4 | ODM |
| Passport.js | 0.7.0 | OAuth authentication |
| express-session | 1.19.0 | Session management |
| Nodemailer | 8.0.1 | Email sending |
| connect-mongo | 6.0.0 | MongoDB session store |
| connect-redis | 9.0.0 | Redis session store |
| redis | 5.11.0 | Redis client |

---

## 3. Core Features

### 3.1 Public Pages (7 Tabs)

1. **Home** - Hero section with name, title, and introduction
2. **About** - Personal background and experience
3. **TechStack** - Skills and technologies displayed from API
4. **Projects** - Portfolio projects fetched from API (publicly viewable)
5. **Contact** - Contact form for reaching out (sends email via Nodemailer)
6. **Guestbook** - Message board for visitor interactions
7. **Admin** - Dashboard for managing content (admin only)

### 3.2 Authentication

- **OAuth Providers:** Google and GitHub
- **Session Management:** express-session with secure cookies in production
- **Session Store:** MongoDB (connect-mongo) or Redis (connect-redis) for production
- **User Data Stored:** Provider, providerId, name, email, avatarUrl, isAdmin flag

### 3.3 Admin Dashboard

- **Access:** Restricted to users with `isAdmin = true`
- **Features:**
  - Create new projects
  - Edit existing projects
  - Delete projects
  - Create new techstack categories
  - Edit techstack categories
  - Delete techstack categories
  - View all guestbook messages

### 3.4 Visual Effects

- **Custom Cursor Follower** - Spring-based animation following mouse position using @react-spring/web
- **Film Grain Effect** - CSS overlay with noise texture
- **Chromatic Silhouette Effect** - RGB shift on hero imagery

### 3.5 Theme Support

- **Dark/Light Mode** - Toggle via ThemeContext
- **localStorage Persistence** - Theme preference saved in localStorage

---

## 4. Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  provider: "google" | "github",
  providerId: String,
  name: String,
  email: String,
  avatarUrl: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  techStack: String[],
  imageUrl: String,
  demoUrl: String,
  repoUrl: String,
  featured: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Guestbook Messages Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

### TechStack Categories Collection
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

## 5. API Endpoints

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

### TechStack API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/techstack | Get all categories | No |
| POST | /api/techstack | Create category | Admin only |
| PUT | /api/techstack/:id | Update category | Admin only |
| DELETE | /api/techstack/:id | Delete category | Admin only |

### Contact API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/contact | Send contact email | No |

---

## 6. Functional Requirements

### F1: Public Portfolio Display
- All 7 tabs must be accessible without authentication
- Projects page fetches data from `/api/projects` endpoint
- TechStack page fetches data from `/api/techstack` endpoint

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
- Full CRUD operations for techstack categories
- Visual indication of admin status in UI

### F5: Contact Form
- Public contact form for visitors
- Form data sent via Nodemailer using Gmail SMTP

### F6: Theme Switching
- Dark/light mode toggle available
- Theme preference persisted in localStorage

### F7: Visual Effects
- Custom cursor follower animation
- Film grain overlay effect
- Chromatic silhouette effect on hero

---

## 7. Non-Functional Requirements

### N1: Performance
- Frontend initial load under 3 seconds
- API responses under 500ms

### N2: Security
- HTTPS in production
- Secure session cookies (httpOnly, secure flag)
- CORS configured for frontend origin only
- Input validation on all API endpoints
- Environment variables for all secrets

### N3: Maintainability
- TypeScript for type safety
- ESLint + Prettier for code consistency
- Modular component structure
- Environment-based configuration

### N4: Scalability
- Session store supports MongoDB and Redis
- Docker support for containerization

---

## 8. Implementation Phases

### Phase 1: Project Setup
- [x] Install FE dependencies (Tailwind, React Router, Axios)
- [x] Install BE dependencies (Passport.js, Mongoose, express-session)
- [x] Configure TypeScript and build tools
- [x] Setup MongoDB connection

### Phase 2: Backend Development
- [x] Setup Express server with TypeScript
- [x] Configure MongoDB connection with Mongoose
- [x] Create User, Project, GuestbookMessage, TechStackCategory models
- [x] Implement Passport.js OAuth (Google + GitHub)
- [x] Create API endpoints for guestbook
- [x] Create Projects API (CRUD for admin)
- [x] Create TechStack API (CRUD for admin)
- [x] Create Contact API (email sending)
- [x] Add Redis session store support
- [x] Add Docker configuration

### Phase 3: Frontend Development
- [x] Setup React Router with tab navigation
- [x] Create layout with navigation
- [x] Build 7 pages (Home, About, TechStack, Projects, Contact, Guestbook, Admin)
- [x] Implement OAuth login flow
- [x] Connect to backend API
- [x] Create Projects page with API data
- [x] Create TechStack page with API data
- [x] Implement Admin dashboard for project management
- [x] Implement Admin dashboard for techstack management
- [x] Add ThemeContext for dark/light mode
- [x] Add CursorFollowerContext for custom cursor
- [x] Add visual effects (cursor, film grain, chromatic)

### Phase 4: Deployment
- [x] Dockerize backend
- [ ] Configure Nginx with SSL
- [ ] Deploy to Vercel (FE) and VPS (BE)

---

## 9. Acceptance Criteria

### AC1: Application Launch
- [x] Frontend starts on port 5173
- [x] Backend starts on port 3000
- [x] Database connection established

### AC2: Authentication
- [x] Google OAuth flow completes successfully
- [x] GitHub OAuth flow completes successfully
- [x] User session persists on page refresh
- [x] Logout clears session

### AC3: Guestbook
- [x] Messages load without authentication
- [x] Authenticated users can post messages
- [x] Users can delete their own messages
- [x] Unauthenticated users see login prompt

### AC4: Admin Dashboard
- [x] Admin-only access enforced
- [x] CRUD operations for projects work correctly
- [x] CRUD operations for techstack work correctly
- [x] Non-admins cannot access endpoints

### AC5: Projects Page
- [x] Projects load from API
- [x] Featured projects displayed first
- [x] Links to demo and repo work

### AC6: TechStack Page
- [x] Categories load from API
- [x] Items displayed under categories

### AC7: Contact Form
- [x] Form submits successfully
- [x] Email sent via Nodemailer

### AC8: Theme
- [x] Dark/light mode toggle works
- [x] Theme preference persists

### AC9: Visual Effects
- [x] Custom cursor follower animates smoothly
- [x] Film grain overlay visible
- [x] Chromatic effect applied to hero

---

## 10. Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
FE_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# Session
SESSION_SECRET=your_session_secret_min_32_chars

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Email (Nodemailer)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
CONTACT_TO_EMAIL=your-email@gmail.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## 11. Roadmap

### v1.0.0 (Initial Release)
- [x] 7 tab portfolio with OAuth guestbook
- [x] Admin dashboard for project management
- [x] Admin dashboard for techstack management
- [x] Contact form with email sending
- [x] Dark/light theme toggle
- [x] Visual effects (cursor, film grain, chromatic)
- [x] Docker support for backend
- [ ] Production deployment

### Future Enhancements
- Blog functionality
- Project filtering and search
- Real-time guestbook updates (WebSocket)
- Analytics dashboard
- Performance optimization
- PWA support

---

*Document Version: 1.2*
*Last Updated: 2026-03-08*
*Status: Active*
