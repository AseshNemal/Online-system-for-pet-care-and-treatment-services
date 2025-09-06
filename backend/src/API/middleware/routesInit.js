import { authenticate } from "./auth.middlewere";

const routesInit = (app, passport) => {
  // Use production frontend URL
  const frontendURL = process.env.FRONTEND_URL || "https://your-frontend-domain.com";

  console.log('Environment:', { 
    frontendURL, 
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL 
  });

  // Google Login Route
  app.get("/auth/google", (req, res, next) => {
    console.log('Initiating Google OAuth');
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });

  // Google Callback Route with enhanced error handling
  app.get("/auth/google/callback", 
    (req, res, next) => {
      console.log('Google callback hit:', {
        query: req.query,
        session: req.sessionID
      });
      
      passport.authenticate("google", {
        failureRedirect: `${frontendURL}/login?error=auth_failed`,
      })(req, res, next);
    },
    (req, res) => {
      try {
        console.log("User authenticated successfully:", {
          user: req.user,
          sessionID: req.sessionID,
          isAuthenticated: req.isAuthenticated()
        });
        
        if (!req.user) {
          console.error('No user found after authentication');
          return res.redirect(`${frontendURL}/login?error=no_user`);
        }
        
        res.redirect(`${frontendURL}/profile`);
      } catch (error) {
        console.error('Error in callback route:', error);
        res.redirect(`${frontendURL}/login?error=callback_error`);
      }
    }
  );

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    res.send("<h3>User is authenticated</h3><a href='" + frontendURL + "/profile'>Profile</a>");
  });
};

export default routesInit;
