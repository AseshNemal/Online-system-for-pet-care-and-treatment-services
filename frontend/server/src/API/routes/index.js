import { authenticate } from "../middleware/auth.middlewere";

const routesInit =  (app, passport) => {
    app.get("/auth/google",passport.authenticate("google",{scope: ["profile","email"]}));
    
    app.get('/auth/google/callback', 
        passport.authenticate('google',
             { 
                failureRedirect: '/login',
                successRedirect: '/user',
              }),
        
        (req,res) => {
            console.log("user authenticated");
        }
    );

    app.get("/user", authenticate, (req,res)=> {
        res.send("<h3>User is authenticated</h3><a href='http://localhost:3000/profile'>Profile</a>");


    });
};
export { routesInit };