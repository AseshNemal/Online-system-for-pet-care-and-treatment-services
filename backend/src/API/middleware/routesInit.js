import { authenticate } from "./auth.middlewere";

const routesInit = (app, passport) => {
  // Environment check
  const isProduction = process.env.NODE_ENV === 'production';
  const frontendURL = isProduction ? process.env.FRONTEND_URL : "http://localhost:3000";

  // Google Login Route
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  // Google Callback Route
  app.get("/auth/google/callback", 
    passport.authenticate("google", {
      failureRedirect: `${frontendURL}/login?error=auth_failed`,  // Redirect to login on failure
    }),
    (req, res) => {
      // Successfully authenticated
      console.log("User authenticated successfully:", req.user);
      res.redirect(`${frontendURL}/profile`);  // Redirect to frontend profile page
    }
  );

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    res.send("<h3>User is authenticated</h3><a href='" + frontendURL + "/profile'>Profile</a>");
  });
};

export { routesInit };
