import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import { User } from '../models/index.js';
import type { DoneCallback } from 'passport';
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (clientId && clientSecret) {
  // @ts-ignore - TypeScript types are incorrect for this version
  passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  }, async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: DoneCallback) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'google' });

      if (!user) {
        user = await User.create({
          provider: 'google',
          providerId: profile.id,
          name: profile.displayName || 'Unknown',
          email: profile.emails?.[0]?.value || '',
          avatarUrl: profile.photos?.[0]?.value || ''
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  console.log('Google OAuth strategy loaded');
} else {
  console.log('Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}
