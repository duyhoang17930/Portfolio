import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

// Load strategies (registers them with passport)
import './strategies/google.js';
import './strategies/github.js';

import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import guestbookRoutes from './routes/guestbook.js';
import projectsRoutes from './routes/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FE_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/projects', projectsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Backend running' });
});

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});
