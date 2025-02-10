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
        res.send("<h3>user is authenticated<h3>");
    });
};
export { routesInit };