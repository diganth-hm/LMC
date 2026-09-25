import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config/index.js';

const users = new Map();

export const isGoogleAuthConfigured = Boolean(
  config.google.clientId && config.google.clientSecret
);

if (isGoogleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          avatar: profile.photos?.[0]?.value || '',
        };
        users.set(user.id, user);
        done(null, user);
      }
    )
  );
} else {
  console.warn('[Auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Using dev/evaluator auth fallback.');
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user || null);
});

export { users };
export default passport;
