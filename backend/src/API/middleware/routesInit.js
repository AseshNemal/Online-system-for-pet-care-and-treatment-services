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
      res.redirect("https://online-system-for-pet-care-and-treatment-services-y8-bcdt1rxb5.vercel.app/profile");  // Redirect to frontend profile page
    }
  );

  // Protected User Route
  app.get("/user", authenticate, (req, res) => {
    res.send("<h3>User is authenticated</h3><a href='https://online-system-for-pet-care-and-treatment-services-y8-105b16fy9.vercel.app/profile'>Profile</a>");
  });
};

export { routesInit };
