import express from 'express';
import cors from 'cors';
import session, { MemoryStore } from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
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

// Session configuration
const mongoUri = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://localhost:27017/portfolio';

// Determine session store
let sessionStore: session.Store;

if (process.env.REDIS_URL) {
    console.log('Using Redis for session store');
    console.log('Redis URL:', process.env.REDIS_URL.replace(/:.*@/, ':****@')); // Hide password

    try {
        const redisClient = new (Redis as any)(process.env.REDIS_URL);

        redisClient.on('error', (err: Error) => console.error('Redis error:', err.message));
        redisClient.on('connect', () => console.log('Redis connected'));

        sessionStore = new RedisStore({ client: redisClient });
    } catch (err) {
        console.error('Failed to create Redis client:', err);
        console.log('Falling back to MongoDB session store');
        sessionStore = MongoStore.create({
            mongoUrl: mongoUri,
            collectionName: 'sessions',
            ttl: 7 * 24 * 60 * 60
        });
    }
} else {
    console.log('Using MongoDB for session store');
    sessionStore = MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
        ttl: 7 * 24 * 60 * 60
    });
}

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        path: '/'
    }
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
