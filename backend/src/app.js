import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session"; 
import logger from "./utils/logger";
import { connect } from "./utils/database.connection";
import { googleAuth } from "./configs/google.auth";
import passport from "passport";
import MongoStore from "connect-mongo";
import config from "./configs";
import { routesInit } from "./API/routes";
import router from "./API/routes/pets.js";
import path from "path";




const app = express();
const PORT = process.env.PORT || "8090";

app.use(cors());
app.use(express.json({limit: "20mb"}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config. DB_CONNECTION_STRING }),
    cookie: { 
        secure: false,
        expires: new Date(Date.now() + 1000000),
        maxAge: 1000000
    }
}
));

app.use(passport.initialize());
app.use(passport.session());

const petRouter = require("./API/routes/pets.js")
app.use("/pet" , petRouter)

//Route for product
const productRouter = require("./API/routes/productRoutes.js")
app.use("/product", productRouter)

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));



app.get("/", (req, res, next) => {
    res.send("<a href='http://localhost:8090/auth/google'>Login with Google</a> <h1>hi</h1>");
    next();
});

app.get("/get-session", (req, res) => {
    if (req.session.user) {
      res.send({ sessionID: req.sessionID, user: req.session.user });
    } else {
      res.send({ message: "No session found" });
    }
  });
  
  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send({ message: "Logged out" });
  });
  


app.listen(PORT, () => {
    logger.info(`Server is up and running on PORT ${PORT}`);
    connect();
    routesInit(app, passport);
    googleAuth(passport);
});

export default app;