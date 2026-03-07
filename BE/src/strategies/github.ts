import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import type { Profile as GitHubProfile } from 'passport-github2';
import { User } from '../models/index.js';
import type { DoneCallback } from 'passport';

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
}, async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: DoneCallback) => {
  try {
    let user = await User.findOne({ where: { providerId: profile.id, provider: 'github' } });

    if (!user) {
      user = await User.create({
        provider: 'github',
        providerId: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatarUrl: profile.photos?.[0]?.value
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err as Error);
  }
}));

passport.serializeUser((user: any, done: DoneCallback) => done(null, user.id));
passport.deserializeUser(async (id: number, done: DoneCallback) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
