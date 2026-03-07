# Portfolio - Fullstack Portfolio with OAuth Guestbook

A personal portfolio website featuring 6 tabs (Home, About, TechStack, Projects, Contact, Guestbook) with OAuth authentication via Google and GitHub. Includes an admin dashboard for managing portfolio projects.

## Features

- **6 Tab Portfolio**: Home, About, TechStack, Projects, Contact, Guestbook
- **OAuth Authentication**: Sign in with Google or GitHub
- **Guestbook**: Visitors can leave messages after signing in
- **Admin Dashboard**: Manage projects (CRUD operations)
- **Modern Stack**: React 19, Express 5, TypeScript, Tailwind CSS 4

## Tech Stack

### Frontend
- React 19.2.0
- TypeScript 5.9
- Vite 7.3
- Tailwind CSS 4.2
- React Router
- Axios

### Backend
- Express 5.2
- TypeScript 5.9
- Passport.js (Google & GitHub OAuth)
- Sequelize ORM
- MySQL 8.x

## Prerequisites

- Node.js 18+
- MySQL 8.x
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
# Edit .env with API URL

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

### Backend (BE/.env)

```env
PORT=3000
NODE_ENV=development
FE_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio
DB_USER=root
DB_PASSWORD=your_password

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

The database tables will be created automatically by Sequelize when the server starts.

Tables created:
- `users` - User accounts (OAuth data)
- `projects` - Portfolio projects
- `guestbook_messages` - Guestbook entries

## Making a User Admin

After logging in with OAuth, manually update the user's `isAdmin` flag in the database:

```sql
UPDATE users SET isAdmin = TRUE WHERE id = <user_id>;
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
npm run dev      # Start development server (watch mode)
npm run build    # Compile TypeScript
npm start        # Start production server
```

## Project Structure

```
Portfolio/
├── FE/                     # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
├── BE/                     # Backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── strategies/    # OAuth strategies
│   │   └── server.ts
│   └── package.json
│
├── docs/                   # Documentation
│   ├── project-overview-pdr.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   └── system-architecture.md
│
└── README.md
```

## Deployment

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Production (Recommended)

1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to VPS with PM2
3. **Database**: MySQL on VPS or cloud RDS
4. **SSL**: Use Nginx with Let's Encrypt

See `docs/system-architecture.md` for detailed deployment instructions.

## Documentation

- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)

## License

ISC

## Author

[Your Name]
