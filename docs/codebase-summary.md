# Codebase Summary

## Overview

This document summarizes the current state of the portfolio project codebase. It provides an overview of the frontend (FE) and backend (BE) directories, their structures, and current implementation status.

---

## Project Directory Structure

```
/home/ret/Portfolio/
├── BE/                     # Backend (Express + TypeScript)
│   ├── src/
│   │   └── server.ts       # Express server entry point
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── node_modules/
├── FE/                     # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   ├── App.tsx         # Main App component (default Vite template)
│   │   ├── App.css         # App styles
│   │   ├── index.css       # Global styles (Tailwind)
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.*.json     # TypeScript configurations
│   ├── vite.config.ts      # Vite configuration
│   ├── eslint.config.js    # ESLint configuration
│   ├── index.html         # HTML entry point
│   └── node_modules/
├── docs/                   # Project documentation
├── plans/                  # Implementation plans
├── .gitignore
└── README.md
```

---

## Frontend (FE) - Current State

### Technology Stack
- **React:** 19.2.0
- **TypeScript:** 5.9.3
- **Vite:** 7.3.1
- **Tailwind CSS:** 4.2.1
- **ESLint:** 9.39.1

### Dependencies (package.json)
```json
{
  "name": "fe",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "^4.2.1"
  }
}
```

### Current Source Files

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
- Default Vite + React template
- Contains counter state example
- Uses React 19 hooks

#### `/home/ret/Portfolio/FE/src/index.css`
- Tailwind CSS imports via `@tailwindcss/vite`

#### `/home/ret/Portfolio/FE/vite.config.ts`
- Configured with React plugin and Tailwind CSS plugin

### Frontend Status: MINIMAL

The frontend is currently at the scaffold stage:
- Only default Vite template code
- No custom components created
- No routing configured
- No API integration
- Tailwind CSS 4.x configured but not yet used

---

## Backend (BE) - Current State

### Technology Stack
- **Express:** 5.2.1
- **TypeScript:** 5.9.3
- **Node.js:** Latest
- **tsx:** 4.21.0 (for development)

### Dependencies (package.json)
```json
{
  "name": "be",
  "version": "1.0.0",
  "type": "module",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1"
  }
}
```

### Current Source Files

#### `/home/ret/Portfolio/BE/src/server.ts`
```typescript
import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
    res.json({ message: "Backend running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Backend Status: BASIC

The backend is currently at the scaffold stage:
- Express server running on port 5000
- No routes (other than root endpoint)
- No database connection
- No authentication configured
- No API endpoints
- No models or middleware

---

## Implementation Plan Phases

### Completed
- Initial project structure setup

### Pending

#### Phase 1: Project Setup
- [ ] Install FE dependencies (shadcn/ui, React Router, Axios)
- [ ] Install BE dependencies (Passport.js, Sequelize, MySQL, express-session)
- [ ] Configure TypeScript and build tools

#### Phase 2: Backend Development
- [ ] Setup Express server with TypeScript
- [ ] Configure MySQL connection with Sequelize
- [ ] Create User, Project, and GuestbookMessage models
- [ ] Implement Passport.js OAuth (Google + GitHub)
- [ ] Create Guestbook API endpoints
- [ ] Create Admin middleware
- [ ] Create Projects API (CRUD for admin)

#### Phase 3: Frontend Development
- [ ] Setup React Router with tab navigation
- [ ] Create layout with navigation
- [ ] Build 7 pages (Home, About, TechStack, Projects, Contact, Guestbook, Admin)
- [ ] Implement OAuth login flow
- [ ] Connect to BE API
- [ ] Create Projects page with API data
- [ ] Create Admin dashboard for project management

#### Phase 4: Deployment
- [ ] Dockerize backend
- [ ] Configure Nginx with SSL
- [ ] Deploy to Vercel (FE) and VPS (BE)

---

## Development Commands

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
npm run dev     # Start dev server on port 5000 with watch mode
```

---

## Database Configuration

### Expected Schema (Not Yet Implemented)

#### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| provider | VARCHAR(20) | NOT NULL |
| providerId | VARCHAR(255) | NOT NULL, UNIQUE |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| avatarUrl | TEXT | NULLABLE |
| isAdmin | BOOLEAN | DEFAULT FALSE |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

#### Projects Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| techStack | JSON | NULLABLE |
| imageUrl | TEXT | NULLABLE |
| demoUrl | VARCHAR(255) | NULLABLE |
| repoUrl | VARCHAR(255) | NULLABLE |
| featured | BOOLEAN | DEFAULT FALSE |
| displayOrder | INT | DEFAULT 0 |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

#### Guestbook Messages Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| userId | INT | NOT NULL, FOREIGN KEY |
| message | TEXT | NOT NULL |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

---

## API Design (Planned)

### Authentication Endpoints
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Guestbook API
- `GET /api/guestbook` - Get all messages
- `POST /api/guestbook` - Create message (auth required)
- `DELETE /api/guestbook/:id` - Delete message (owner only)

### Projects API
- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

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

1. **Install additional dependencies** for both FE and BE
2. **Configure database** connection in backend
3. **Create models** (User, Project, GuestbookMessage)
4. **Implement authentication** with Passport.js
5. **Build API routes** for guestbook and projects
6. **Create frontend pages** and components
7. **Connect frontend to backend** via API

---

*Document Version: 1.0*
*Last Updated: 2026-03-07*
