# Code Standards and Conventions

## Overview

This document outlines the coding standards, conventions, and best practices for the portfolio project. It covers both frontend (React) and backend (Express) development.

---

## 1. General Principles

### 1.1 Core Principles
- **KISS** (Keep It Simple, Stupid) - Prefer simple solutions over complex ones
- **DRY** (Don't Repeat Yourself) - Extract common logic into reusable functions
- **YAGNI** (You Aren't Gonna Need It) - Don't add functionality until necessary
- **Single Responsibility** - Each component/function should do one thing well

### 1.2 TypeScript Usage
- All code must be written in TypeScript
- Enable strict mode in `tsconfig.json`
- Avoid using `any` type; use `unknown` if type is truly unknown
- Define interfaces for all data structures
- Use type inference when the type is obvious

### 1.3 Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Files (components) | PascalCase | `HomePage.tsx`, `Navbar.tsx` |
| Files (utilities) | camelCase | `api.ts`, `utils.ts` |
| Functions | camelCase | `getUserData()`, `formatDate()` |
| Classes/Interfaces | PascalCase | `User`, `ProjectService` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `API_BASE_URL` |
| Enums | PascalCase (members UPPER) | `UserRole.ADMIN` |
| CSS Classes | kebab-case | `.main-content`, `.nav-link` |

---

## 2. Frontend Standards (React + TypeScript)

### 2.1 Project Structure
```
FE/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Layout.tsx
│   │   └── Footer.tsx
│   ├── ui/                 # shadcn/ui components
│   ├── guestbook/
│   │   ├── MessageList.tsx
│   │   ├── MessageForm.tsx
│   │   └── LoginPrompt.tsx
│   └── projects/
│       ├── ProjectCard.tsx
│       └── ProjectForm.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── TechStack.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Guestbook.tsx
│   └── Admin.tsx
├── context/
│   ├── ThemeContext.tsx    # Dark/light theme
│   └── AuthContext.tsx     # Authentication state
├── hooks/
│   ├── useAuth.ts
│   ├── useGuestbook.ts
│   └── useProjects.ts
├── lib/
│   ├── api.ts              # Axios instance
│   └── utils.ts            # cn() utility
├── types/
│   └── index.ts            # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css               # Tailwind CSS 4
```

### 2.2 Component Guidelines

#### Functional Components
```typescript
// Use functional components with hooks
import { useState, useEffect } from 'react';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function MyComponent({ title, onSubmit, isLoading = false }: Props) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // Effect logic here
  }, []);

  return (
    <div className="component">
      <h1>{title}</h1>
      {isLoading ? <Spinner /> : <form onSubmit={handleSubmit}>...</form>}
    </div>
  );
}
```

#### Component Best Practices
1. **Export components at the bottom** or use named exports
2. **Define props with interfaces** at the top of the file
3. **Use default props** or default parameter values
4. **Keep components small** - max 200 lines per file
5. **Extract custom hooks** for complex logic
6. **Use TypeScript generics** for reusable components

### 2.3 Hooks Guidelines

```typescript
// Custom hook example
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface UserData {
  id: string;
  name: string;
}

export function useUser(userId: string) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<UserData>(`/users/${userId}`);
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
```

### 2.4 State Management
- Use `useState` for component-local state
- Use custom hooks for shared state logic
- Use React Context for global state (ThemeContext, AuthContext)
- No external state management (Redux/Zustand)

### 2.5 Styling (Tailwind CSS 4)

#### Using cn() Utility
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Using cn() for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'primary' ? "bg-blue-500" : "bg-gray-500"
)}>
  Content
</div>
```

#### Tailwind CSS 4 Syntax
```tsx
// Tailwind CSS 4 - Direct utility usage (no @apply needed)
// Import via @tailwindcss/vite plugin in vite.config.ts
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
    Click me
  </button>
</div>
```

### 2.6 API Integration

```typescript
// api.ts - Axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token if needed
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.7 Visual Effects

#### Custom Cursor Follower (React Spring)
```typescript
import { useSpring, animated } from '@react-spring/web';

const cursorSpring = useSpring({
  x: mousePosition.x,
  y: mousePosition.y,
  config: { tension: 500, friction: 28 }
});

return (
  <animated.div
    style={{
      transform: cursorSpring.to((x, y) => `translate(${x}px, ${y}px)`)
    }}
    className="fixed pointer-events-none z-50"
  />
);
```

#### Film Grain Effect
```tsx
// CSS-based film grain overlay
<div className="fixed inset-0 pointer-events-none opacity-15 bg-[url('/grain.png')] mix-blend-overlay" />
```

---

## 3. Backend Standards (Express + TypeScript)

### 3.1 Project Structure
```
BE/src/
├── server.ts              # Entry point
├── middleware/
│   └── admin.ts           # Admin check middleware
├── models/
│   ├── index.ts           # Mongoose models
│   ├── User.ts
│   ├── Project.ts
│   ├── GuestbookMessage.ts
│   └── TechStackCategory.ts
├── routes/
│   ├── auth.ts            # Authentication routes
│   ├── guestbook.ts       # Guestbook routes
│   ├── projects.ts        # Projects routes
│   ├── techstack.ts       # TechStack routes
│   └── contact.ts         # Contact email routes
├── strategies/
│   ├── google.ts          # Google OAuth strategy
│   └── github.ts          # GitHub OAuth strategy
└── scripts/
    └── seed-*.ts          # Database seeding scripts
```

### 3.2 Express Routes

```typescript
// routes/example.ts
import { Router, Request, Response } from 'express';

const router = Router();

interface QueryParams {
  page?: string;
  limit?: string;
}

interface RequestBody {
  name: string;
  email: string;
}

// GET endpoint
router.get('/', async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const data = await getData({ page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST endpoint
router.post('/', async (req: Request<{}, {}, RequestBody>, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const created = await createRecord({ name, email });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

export default router;
```

### 3.3 Middleware Pattern

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    isAdmin: boolean;
  };
}

export function isAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  next();
}
```

### 3.4 Database Models (Mongoose)

```typescript
// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  provider: string;
  providerId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  avatarUrl: { type: String },
  isAdmin: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);
```

---

## 4. Git Conventions

### 4.1 Branch Naming
- Feature: `feature/description`
- Bug Fix: `fix/description`
- Hotfix: `hotfix/description`

### 4.2 Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add Google OAuth login

- Implement Google OAuth strategy with Passport.js
- Add user registration on first login
- Store provider and providerId in database

Closes #123
```

---

## 5. Error Handling

### Frontend
```typescript
// Use try-catch with async/await
try {
  setLoading(true);
  await api.post('/endpoint', data);
  // Show success message
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle axios error
    setError(error.response?.data?.message || 'An error occurred');
  } else {
    // Handle unexpected error
    setError('An unexpected error occurred');
  }
} finally {
  setLoading(false);
}
```

### Backend
```typescript
// Always use try-catch in route handlers
router.post('/', async (req, res) => {
  try {
    const result = await doSomething(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 6. Security Best Practices

1. **Never expose secrets** - Use environment variables
2. **Validate input** - Use validation libraries (Zod, Joi)
3. **Sanitize output** - Prevent XSS attacks
4. **Use parameterized queries** - Prevent injection (Mongoose handles this)
5. **Implement CORS properly** - Whitelist specific origins
6. **Use secure cookies** - httpOnly, secure, sameSite
7. **Rate limiting** - Protect against brute force attacks
8. **HTTPS only** - Enforce in production

---

## 7. Testing Guidelines

### Unit Tests
- Test individual functions and components
- Aim for >80% coverage on business logic
- Use Vitest or Jest for both FE and BE

### Integration Tests
- Test API endpoints
- Test user flows

---

## 8. File Header Comments

```typescript
/**
 * Component/Function description
 * @author Your Name
 * @date 2026-03-08
 * @param paramName - Parameter description
 * @returns Return description
 */
```

---

## 9. ESLint & Prettier Configuration

### Key Rules
- `react/react-in-jsx-scope`: off (React 17+)
- `react/prop-types`: off (using TypeScript)
- `@typescript-eslint/no-unused-vars`: error
- `no-console`: warn (use logger instead)

### Prettier Settings
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

*Document Version: 1.1*
*Last Updated: 2026-03-08*
