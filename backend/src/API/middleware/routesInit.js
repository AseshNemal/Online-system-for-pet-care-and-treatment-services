import { authenticate } from "./auth.middlewere";

const routesInit = (app, passport) => {
  // Google Login Route
  app.get("/auth/google", 
    (req, res, next) => {
      console.log('Starting Google OAuth flow');
      next();
    },
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      prompt: 'select_account'
    })
  );

  // Google Callback Route
  app.get("/auth/google/callback", 
    (req, res, next) => {
      console.log('Received Google OAuth callback');
      next();
    },
    passport.authenticate("google", {
      failureRedirect: "/login",
      failureMessage: true
    }),
    (req, res) => {
      console.log('Google OAuth successful, user:', req.user);
      console.log('Session ID:', req.sessionID);
      
      // Save session before redirect
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.redirect('/login');
        }
        
        // Set cookie headers explicitly
        res.setHeader('Set-Cookie', [
          `sessionId=${req.sessionID}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`
        ]);
        
        // Ensure user is authenticated
        req.login(req.user, (err) => {
          if (err) {
            console.error('Error in req.login:', err);
            return res.redirect('/login');
          }
          
          console.log('User authenticated in session:', req.isAuthenticated());
          res.redirect("https://petwellnesshub.vercel.app/profile");
        });
      });
    }
  );

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    console.log('Protected route accessed by user:', req.user);
    res.send("<h3>User is authenticated</h3><a href='https://petwellnesshub.vercel.app/profile'>Profile</a>");
  });
};

export default routesInit;
