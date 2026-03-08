import { Router, type Router as RouterType } from 'express';
import passport from 'passport';

const router: RouterType = Router();

const hasGoogleAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const hasGitHubAuth = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

// Google OAuth
if (hasGoogleAuth) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/?error=auth' }),
    (req, res) => {
      res.redirect(process.env.FE_URL || 'http://localhost:5173/guestbook');
    }
  );
}

// GitHub OAuth
if (hasGitHubAuth) {
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/?error=auth' }),
    (req, res) => {
      res.redirect(process.env.FE_URL || 'http://localhost:5173/guestbook');
    }
  );
}

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FE_URL || 'http://localhost:5173');
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

export default router;
