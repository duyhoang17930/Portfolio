import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import type { Profile as GitHubProfile } from 'passport-github2';
import { User } from '../models/index.js';
import type { DoneCallback } from 'passport';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (clientId && clientSecret) {
  passport.use(new GitHubStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
  }, async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: DoneCallback) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'github' });

      if (!user) {
        user = await User.create({
          provider: 'github',
          providerId: profile.id,
          name: profile.displayName || profile.username || 'Unknown',
          email: profile.emails?.[0]?.value || '',
          avatarUrl: profile.photos?.[0]?.value || ''
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  console.log('GitHub OAuth strategy loaded');
} else {
  console.log('GitHub OAuth not configured - missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
}

passport.serializeUser((user: any, done: DoneCallback) => done(null, user._id));
passport.deserializeUser(async (id: string, done: DoneCallback) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
