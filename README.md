# Portfolio - Fullstack Portfolio with OAuth Guestbook

A personal portfolio website featuring 7 tabs (Home, About, TechStack, Projects, Contact, Guestbook, Admin) with OAuth authentication via Google and GitHub. Includes an admin dashboard for managing portfolio projects and tech stack.

## Features

- **7 Tab Portfolio**: Home, About, TechStack, Projects, Contact, Guestbook, Admin
- **OAuth Authentication**: Sign in with Google or GitHub
- **Guestbook**: Visitors can leave messages after signing in
- **Admin Dashboard**: Manage projects and tech stack (CRUD operations)
- **Contact Form**: Send email via Nodemailer
- **Modern Stack**: React 19, Express 5, TypeScript, Tailwind CSS 4

## Tech Stack

### Frontend
- React 19.2.0
- TypeScript 5.9
- Vite 7.3.1
- Tailwind CSS 4.2.1
- React Router DOM 7.13.1
- Axios 1.13.6
- @react-spring/web 10.0.3

### Backend
- Express 5.2.1
- TypeScript 5.9.3
- Passport.js 0.7.0 (Google & GitHub OAuth)
- Mongoose 9.2.4
- MongoDB
- express-session 1.19.0
- Nodemailer 8.0.1
- Redis support for session store

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Google OAuth credentials (Google Cloud Console)
- GitHub OAuth credentials (GitHub Developer Settings)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Portfolio
```

### 2. Setup Backend

```bash
cd BE

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

The backend runs on `http://localhost:3000` by default.

### 3. Setup Frontend

```bash
cd FE

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with API URL (default: http://localhost:3000)

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

### Backend (BE/.env)

```env
# Server
PORT=3000
NODE_ENV=development
FE_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/portfolio

# Session
SESSION_SECRET=your-session-secret-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Email (Nodemailer)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CONTACT_TO_EMAIL=your-email@gmail.com
```

### Frontend (FE/.env)

```env
VITE_API_URL=http://localhost:3000
```

## Getting OAuth Credentials

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID credentials
5. Set authorized redirect URIs to `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to .env

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set authorization callback URL to `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Client Secret to .env

## Database Setup

MongoDB collections are created automatically by Mongoose when the server starts.

Collections created:
- `users` - User accounts (OAuth data)
- `projects` - Portfolio projects
- `guestbookmessages` - Guestbook entries
- `techstackcategories` - Tech stack categories

## Making a User Admin

After logging in with OAuth, use MongoDB Compass or CLI to update:

```javascript
db.users.updateOne({ email: "your-email@example.com" }, { $set: { isAdmin: true } })
```

Or use the seed script:
```bash
npm run seed:admin
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/google | Google OAuth |
| GET | /auth/github | GitHub OAuth |
| GET | /auth/me | Get current user |
| GET | /auth/logout | Logout |

### Guestbook
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/guestbook | Get all messages |
| POST | /api/guestbook | Create message (auth) |
| DELETE | /api/guestbook/:id | Delete message (auth) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project (admin) |
| PUT | /api/projects/:id | Update project (admin) |
| DELETE | /api/projects/:id | Delete project (admin) |

### TechStack
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/techstack | Get all categories |
| POST | /api/techstack | Create category (admin) |
| PUT | /api/techstack/:id | Update category (admin) |
| DELETE | /api/techstack/:id | Delete category (admin) |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Send contact email |

## Scripts

### Frontend (FE)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (BE)

```bash
npm run dev         # Start development server (watch mode)
npm run build       # Compile TypeScript
npm start           # Start production server
npm run seed:admin  # Create admin user
npm run seed:projects # Seed sample projects
npm run seed:techstack # Seed tech stack categories
```

## Project Structure

```
Portfolio/
├── FE/                     # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── layout/   # Layout, Sidebar
│   │   │   ├── guestbook/ # LoginPrompt, MessageForm, MessageList
│   │   │   ├── CursorFollower.tsx
│   │   │   └── TextTransition.tsx
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # ThemeContext, CursorFollowerContext
│   │   ├── hooks/       # useAuth, useGuestbook
│   │   ├── lib/         # api.ts, utils.ts
│   │   ├── types/       # TypeScript types
│   │   └── App.tsx
│   ├── public/          # Static assets
│   └── package.json
│
├── BE/                     # Backend
│   ├── src/
│   │   ├── middleware/    # Admin middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── strategies/   # OAuth strategies
│   │   ├── scripts/      # Seed scripts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── docs/                   # Documentation
│   ├── project-overview-pdr.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   ├── system-architecture.md
│   └── deployment-guide.md
│
└── README.md
```

## Deployment

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Production

See [Deployment Guide](./docs/deployment-guide.md) for step-by-step instructions:
- Frontend: Deploy to Vercel
- Backend: Deploy to VPS with Docker/PM2
- Database: MongoDB on Atlas or self-hosted
- Session Store: Redis (optional) or MongoDB
- SSL: Nginx with Let's Encrypt

## Documentation

- [Deployment Guide](./docs/deployment-guide.md) - Step-by-step production deployment
- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)

## License

ISC

## Author

Duy Hoàng
