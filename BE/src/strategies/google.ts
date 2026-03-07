import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import { User } from '../models/index.js';
import type { DoneCallback } from 'passport';

// @ts-ignore - TypeScript types are incorrect for this version
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: DoneCallback) => {
  try {
    let user = await User.findOne({ where: { providerId: profile.id, provider: 'google' } });

    if (!user) {
      user = await User.create({
        provider: 'google',
        providerId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatarUrl: profile.photos?.[0]?.value
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err as Error);
  }
}));
