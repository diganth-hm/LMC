import { Router } from 'express';
import passport, { isGoogleAuthConfigured, users } from '../services/passport.js';
import config from '../config/index.js';

const router = Router();

// Initiate Google OAuth with fallback check
router.get('/google', (req, res, next) => {
  if (!isGoogleAuthConfigured) {
    // If Google OAuth credentials aren't set in environment, perform mock evaluator login
    const devUser = {
      id: 'demo-lead-1',
      name: 'Demo Lead Evaluator',
      email: 'lead@lastmilecarbon.org',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    };
    users.set(devUser.id, devUser);
    req.login(devUser, (err) => {
      if (err) return next(err);
      return res.redirect(config.cors.origin + '/analytics');
    });
    return;
  }

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!isGoogleAuthConfigured) {
    return res.redirect(config.cors.origin + '/analytics');
  }
  passport.authenticate('google', { failureRedirect: '/analytics?error=auth_failed' })(req, res, () => {
    res.redirect(config.cors.origin + '/analytics');
  });
});

// Auth status check endpoint (/auth/user & /auth/status)
const authUserHandler = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        name: req.user.name || req.user.displayName,
        email: req.user.email,
        avatar: req.user.avatar || req.user.photo,
      },
    });
  }
  return res.json({ authenticated: false, user: null });
};

router.get('/user', authUserHandler);
router.get('/status', authUserHandler);

// Instant Dev/Evaluator login endpoint
router.post('/dev-login', (req, res, next) => {
  const devUser = {
    id: 'demo-lead-1',
    name: 'Demo Lead Evaluator',
    email: 'lead@lastmilecarbon.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  };
  users.set(devUser.id, devUser);
  req.login(devUser, (err) => {
    if (err) return res.status(500).json({ error: 'Login failed' });
    return res.json({ success: true, user: devUser });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

export default router;
