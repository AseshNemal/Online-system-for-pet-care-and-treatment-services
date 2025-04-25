import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import logger from "./utils/logger.js";
import { connect } from "./utils/database.connection.js";
import { googleAuth } from "../src/configs/google.auth.js";
import { routesInit } from "./API/middleware/routesInit.js";
import config from "./configs/index.js";
import router from "./API/routes/pets.js";
import Employee from "./API/model/Employee.js";
import PetAd from "./API/model/PetAd.js";


const app = express();
const PORT = process.env.PORT || "8090";


app.use(cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true 
}));

// ✅ Ensure Express parses JSON properly
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Prevent empty sessions
    store: MongoStore.create({ mongoUrl: config.DB_CONNECTION_STRING}),
    cookie: { 
        secure: false,  // Change to `true` in production (HTTPS required)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day session expiration
    }
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Apply Routes
routesInit(app, passport);

// ✅ Main Routes
app.get("/", (req, res) => {
    res.send("<a href='http://localhost:8090/auth/google'>Login with Google</a> <h1>Welcome</h1>");
});

// ✅ Fix: Get session correctly
app.get("/get-session", (req, res) => {
    if (req.user) {
        res.json({ sessionID: req.sessionID, user: req.user });
    } else {
        res.json({ message: "No session found", user: null });
    }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Error logging out" });
      }
      req.session.destroy(() => {
          res.clearCookie("connect.sid"); // ✅ Clear session cookie
          res.redirect("http://localhost:3000"); // ✅ Redirect to React home page
      });
  });
});

const petRouter = require("./API/routes/pets.js")
app.use("/pet" , petRouter)

const dataRoutes = require("./API/routes/dataRoutes.js")
app.use('/api', dataRoutes);

const medicalRecords = require("./API/routes/medicalRecords.js")
app.use('/medical', medicalRecords);

//Route for product
const productRouter = require("./API/routes/productRoutes.js")
app.use("/product", productRouter)

//Route for Order
const orderRoutes = require("./API/routes/orderRoutes.js")
app.use("/order", orderRoutes);

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

const employeeRoutes = require("./API/routes/employeeRoutes.js")
app.use("/employee",employeeRoutes)

const PetAdRoutes = require("./API/routes/PetAdRoutes.js")
app.use("/pet-ad", PetAdRoutes);


app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`);
    connect();
    googleAuth(passport);
});

export default app;
