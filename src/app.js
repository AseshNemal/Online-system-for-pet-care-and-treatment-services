import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session"; 
import logger from "./utils/logger";
import { connect } from "./utils/database.connection";
import { googleAuth } from "./configs/google.auth";
import passport from "passport";
import { routesInit } from "./API/routes";

const app = express();
const PORT = process.env.PORT || "8090";

app.use(cors());
app.use(express.json({limit: "20mb"}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        expires: new Date(Date.now() + 10000),
        maxAge: 10000
    }
}
));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res, next) => {
    res.send("<a href='http://localhost:8090/auth/google'>Login with Google</a> <h1>hi</h1>");
    next();
});

app.listen(PORT, () => {
    logger.info(`Server is up and running on PORT ${PORT}`);
    connect();
    routesInit(app, passport);
    googleAuth(passport);
});
