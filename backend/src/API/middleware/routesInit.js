import { authenticate } from "./auth.middlewere";

const routesInit = (app, passport) => {
  // Use production frontend URL
  const frontendURL = process.env.FRONTEND_URL || "https://petwellnesshub.vercel.app";

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

        // Generate a temporary token for the user
        const userToken = Buffer.from(JSON.stringify({
          userId: req.user._id,
          email: req.user.gmail,
          displayName: req.user.displayName,
          image: req.user.image,
          timestamp: Date.now()
        })).toString('base64');
        
        // Redirect with token in URL
        res.redirect(`${frontendURL}/profile?token=${userToken}`);
      } catch (error) {
        console.error('Error in callback route:', error);
        res.redirect(`${frontendURL}/login?error=callback_error`);
      }
    }
  );

  // Token validation route
  app.post("/auth/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token required" });
      }

      // Decode the token
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is not too old (5 minutes max)
      if (Date.now() - decoded.timestamp > 5 * 60 * 1000) {
        return res.status(401).json({ error: "Token expired" });
      }

      // Find user in database
      const User = require("../../model/user.model.js").default;
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Establish session
      req.login(user, (err) => {
        if (err) {
          console.error('Session establishment error:', err);
          return res.status(500).json({ error: "Session error" });
        }
        
        res.json({ 
          user: {
            _id: user._id,
            displayName: user.displayName,
            gmail: user.gmail,
            image: user.image,
            firstName: user.firstName,
            lastName: user.lastName
          },
          sessionID: req.sessionID
        });
      });
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(500).json({ error: "Invalid token" });
    }
  });

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    res.send("<h3>User is authenticated</h3><a href='" + frontendURL + "/profile'>Profile</a>");
  });
};

export default routesInit;
