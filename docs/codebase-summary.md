# Codebase Summary

## Overview

This document summarizes the current state of the portfolio project codebase. It provides an overview of the frontend (FE) and backend (BE) directories, their structures, and current implementation status.

---

## Project Directory Structure

```
/home/ret/Portfolio/
├── BE/                     # Backend (Express + MongoDB + TypeScript)
│   ├── src/
│   │   ├── server.ts       # Express server entry point
│   │   ├── middleware/
│   │   │   └── admin.ts   # Admin check middleware
│   │   ├── models/
│   │   │   └── index.ts   # Mongoose models
│   │   ├── routes/
│   │   │   ├── auth.ts        # OAuth routes
│   │   │   ├── guestbook.ts   # Guestbook CRUD
│   │   │   ├── projects.ts    # Projects CRUD
│   │   │   ├── techstack.ts   # TechStack CRUD
│   │   │   └── contact.ts     # Contact email
│   │   ├── strategies/
│   │   │   ├── google.ts      # Google OAuth strategy
│   │   │   └── github.ts      # GitHub OAuth strategy
│   │   └── scripts/
│   │       ├── seed-admin.ts
│   │       ├── seed-projects.ts
│   │       └── seed-techstack.ts
│   ├── Dockerfile          # Docker build configuration
│   ├── docker-compose.yml  # Docker Compose setup
│   ├── .env.example        # Environment template
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── node_modules/
├── FE/                     # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   ├── App.tsx         # Main App component
│   │   ├── index.css       # Global styles (Tailwind CSS 4)
│   │   ├── components/     # React components
│   │   │   ├── layout/     # Layout.tsx, Sidebar.tsx
│   │   │   ├── guestbook/  # LoginPrompt.tsx, MessageForm.tsx, MessageList.tsx
│   │   │   ├── CursorFollower.tsx
│   │   │   └── TextTransition.tsx
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # ThemeContext, CursorFollowerContext
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # api.ts, utils.ts with cn()
│   │   └── types/          # TypeScript types
│   ├── public/             # Public assets
│   ├── .env.example        # Environment template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── eslint.config.js    # ESLint configuration
│   └── index.html          # HTML entry point
├── docs/                   # Project documentation
├── repomix-output.xml      # Codebase compaction
└── README.md               # Project README
```

---

## Frontend (FE) - Current State

### Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool |
| Tailwind CSS | 4.2.1 | Styling |
| @tailwindcss/vite | 4.2.1 | Tailwind Vite plugin |
| React Router DOM | 7.13.1 | Client-side routing |
| axios | 1.13.6 | HTTP client |
| @react-spring/web | 10.0.3 | Animation library |
| clsx | 2.1.1 | Class name utility |
| tailwind-merge | 3.5.0 | Tailwind merge utility |
| lucide-react | 0.577.0 | Icons |
| react-icons | 5.6.0 | Icons |

### Frontend Source Structure

#### `/home/ret/Portfolio/FE/src/main.tsx`
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### `/home/ret/Portfolio/FE/src/App.tsx`
- Main application component
- Uses React Router for navigation
- Contains ThemeProvider wrapper

#### `/home/ret/Portfolio/FE/src/index.css`
- Tailwind CSS imports via `@tailwindcss/vite`
- Custom CSS variables for theming

### Frontend Patterns

#### cn() Utility (Class Name Merger)
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Visual Effects
- Custom cursor follower using @react-spring/web
- Film grain overlay effect
- Chromatic aberration silhouette effect

### Frontend Status: COMPLETE

The frontend includes:
- React 19.2.0 with Vite 7.3.1
- Tailwind CSS 4.2.1 with custom configuration
- React Router for navigation (7 pages: Home, About, TechStack, Projects, Contact, Guestbook, Admin)
- ThemeContext for dark/light mode switching
- CursorFollowerContext for custom cursor
- Custom cursor follower with @react-spring/web
- Visual effects (film grain, chromatic silhouette)
- Axios API client with credentials

---

## Backend (BE) - Current State

### Technology Stack
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

### Backend Source Structure

```
BE/src/
├── server.ts              # Express server entry point
├── middleware/
│   └── admin.ts          # Admin check middleware
├── models/
│   └── index.ts          # Mongoose models (User, Project, GuestbookMessage, TechStackCategory)
├── routes/
│   ├── auth.ts           # OAuth routes (google, github, logout, me)
│   ├── guestbook.ts      # Guestbook CRUD routes
│   ├── projects.ts       # Projects CRUD routes
│   ├── techstack.ts      # TechStack CRUD routes
│   └── contact.ts        # Contact email route
├── strategies/
│   ├── google.ts         # Google OAuth strategy
│   └── github.ts         # GitHub OAuth strategy
└── scripts/
    ├── seed-admin.ts     # Create admin user
    ├── seed-projects.ts  # Seed sample projects
    └── seed-techstack.ts # Seed tech stack categories
```

### Backend Status: COMPLETE

The backend includes:
- Express 5.2.1 server
- MongoDB with Mongoose ODM
- Passport.js OAuth (Google + GitHub)
- RESTful API endpoints
- Admin middleware for protected routes
- Nodemailer for contact form emails
- MongoDB and Redis session store support

---

## Implementation Status

### Completed
- Initial project structure setup
- Frontend development (all 7 pages)
- Backend development (all API routes)
- Database models (MongoDB)
- Authentication (OAuth)
- Visual effects implementation
- Docker configuration for backend

### Development Commands

### Frontend
```bash
cd /home/ret/Portfolio/FE
npm install
npm run dev     # Start dev server on port 5173
npm run build   # Build for production
npm run lint    # Run ESLint
```

### Backend
```bash
cd /home/ret/Portfolio/BE
npm install
npm run dev     # Start dev server on port 3000 with watch mode
npm run build   # Compile TypeScript
npm start       # Start production server
```

---

## Database Configuration

### MongoDB Collections

#### Users Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| provider | string | OAuth provider (google/github) |
| providerId | string | Provider user ID |
| name | string | User display name |
| email | string | User email (optional) |
| avatarUrl | string | Profile image URL |
| isAdmin | boolean | Admin flag |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |

#### Projects Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| title | string | Project title |
| description | string | Project description |
| techStack | string[] | Technologies used |
| imageUrl | string | Project screenshot |
| demoUrl | string | Live demo URL |
| repoUrl | string | Repository URL |
| featured | boolean | Featured flag |
| displayOrder | number | Sort order |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |

#### Guestbook Messages Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Reference to User |
| message | string | Message content |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |

#### TechStack Categories Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| name | string | Category name |
| items | string[] | Technology items |
| displayOrder | number | Sort order |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |

---

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/google | Initiate Google OAuth |
| GET | /auth/google/callback | Google OAuth callback |
| GET | /auth/github | Initiate GitHub OAuth |
| GET | /auth/github/callback | GitHub OAuth callback |
| GET | /auth/logout | Logout user |
| GET | /auth/me | Get current user |

### Guestbook API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/guestbook | Get all messages |
| POST | /api/guestbook | Create message (auth required) |
| DELETE | /api/guestbook/:id | Delete message (owner only) |

### Projects API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project (admin only) |
| PUT | /api/projects/:id | Update project (admin only) |
| DELETE | /api/projects/:id | Delete project (admin only) |

### TechStack API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/techstack | Get all categories |
| POST | /api/techstack | Create category (admin only) |
| PUT | /api/techstack/:id | Update category (admin only) |
| DELETE | /api/techstack/:id | Delete category (admin only) |

### Contact API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Send contact email |

---

## Code Quality Standards

### TypeScript
- Strict mode enabled
- All files must be type-checked
- No `any` types without explicit justification

### ESLint
- React hooks rules enabled
- React refresh rules enabled
- TypeScript ESLint integration

### Formatting
- Prettier for code formatting
- 2-space indentation
- Single quotes for strings

---

## Next Steps

1. **Deployment** - Deploy frontend to Vercel/Netlify, backend to VPS
2. **Production Configuration** - Set up environment variables for production
3. **SSL/TLS** - Configure HTTPS with Nginx
4. **Monitoring** - Add health checks and logging

---

*Document Version: 1.2*
*Last Updated: 2026-03-08*
