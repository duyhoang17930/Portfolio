import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load strategies (registers them with passport)
import './strategies/google.js';
import './strategies/github.js';

import authRoutes from './routes/auth.js';
import guestbookRoutes from './routes/guestbook.js';
import projectsRoutes from './routes/projects.js';
import techstackRoutes from './routes/techstack.js';
import contactRoutes from './routes/contact.js';

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
app.use('/api/techstack', techstackRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Backend running' });
});

// Connect to MongoDB and start server
const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
