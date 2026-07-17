# Portfolio

This repository contains **two versions** of the portfolio project.

## Available variants

| Variant | Branch | Description |
| --- | --- | --- |
| Frontend-only | `main` | Static portfolio built with React + Vite. No backend, database, auth, or API runtime dependency. |
| Fullstack with backend | `feat/portfolio-with-backend` | Portfolio with Express, MongoDB, OAuth, contact form, guestbook, and admin dashboard. |

## Feature comparison

| Feature | Frontend-only (`main`) | Fullstack (`feat/portfolio-with-backend`) |
| --- | --- | --- |
| Home / About | Yes | Yes |
| Tech Stack | Yes | Yes |
| Projects | Yes | Yes |
| Contact page | No | Yes |
| Guestbook | No | Yes |
| Admin dashboard | No | Yes |
| OAuth login | No | Yes |
| Backend API required | No | Yes |
| MongoDB required | No | Yes |

## Tech stack

### Frontend-only version
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Fullstack version
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Express
- MongoDB + Mongoose
- Passport.js (Google & GitHub OAuth)
- Nodemailer
- express-session

## Quick start

### 1. Clone the repository

```bash
git clone <repository-url>
cd Portfolio
```

## Run the frontend-only version

This is the default `main` branch.

```bash
cd FE
npm install
npm run dev
```

- Frontend runs on `http://localhost:5173`
- No backend setup is required
- No `VITE_API_URL` is required

## Run the fullstack version

Switch to the backend-enabled branch first:

```bash
git checkout feat/portfolio-with-backend
```

### Backend

```bash
cd BE
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd FE
npm install
cp .env.example .env
npm run dev
```

Fullstack requirements:
- Node.js 20+
- MongoDB
- Google OAuth credentials
- GitHub OAuth credentials
- Email credentials for contact form

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Environment variables for the fullstack branch

### Backend (`BE/.env`)

```env
PORT=3000
NODE_ENV=development
FE_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/portfolio
SESSION_SECRET=your-session-secret-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CONTACT_TO_EMAIL=your-email@gmail.com
```

### Frontend (`FE/.env`)

```env
VITE_API_URL=http://localhost:3000
```

## Deployment

### Frontend-only (`main`)
- Deploy the `FE` app directly to Vercel, Netlify, or any static host
- No backend service is required

### Fullstack (`feat/portfolio-with-backend`)
- Deploy frontend and backend separately
- Provision MongoDB
- Configure OAuth callback URLs
- Configure environment variables for both apps

## Project structure

```text
Portfolio/
├── FE/        # React frontend
├── BE/        # Express backend (used in fullstack branch)
├── docs/      # Project documentation
└── README.md
```

## Notes

- Use `main` if you want the simplest static portfolio deployment.
- Use `feat/portfolio-with-backend` if you want guestbook, contact form, admin, and OAuth features.

## License

ISC

## Author

Duy Hoàng
