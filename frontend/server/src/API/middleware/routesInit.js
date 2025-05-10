import { authenticate } from "./auth.middlewere";

const routesInit = (app, passport) => {
  // Google Login Route
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  // Google Callback Route
  app.get("/auth/google/callback", 
    passport.authenticate("google", {
      failureRedirect: "/login",  // Redirect to login on failure
    }),
    (req, res) => {
      res.redirect("http://localhost:3000/profile");  // Redirect to frontend profile page
    }
  );

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    res.send("<h3>User is authenticated</h3><a href='http://localhost:3000/profile'>Profile</a>");
  });
};

export { routesInit };
