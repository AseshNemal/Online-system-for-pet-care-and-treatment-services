import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import logger from "./utils/logger.js";
import { connect } from "./utils/database.connection.js";
import { googleAuth } from "../src/configs/google.auth.js";
import routesInit from "./API/middleware/routesInit.js";
import config from "./configs/index.js";
import router from "./API/routes/pets.js";
import Employee from "./API/model/Employee.js";
import PetAd from "./API/model/PetAd.js";



const app = express();
const PORT = process.env.PORT || "8090";


app.use(cors({
    origin: "https://petwellnesshub.vercel.app", // Frontend URL
    credentials: true 
}));

// ✅ Ensure Express parses JSON properly
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: config.DB_CONNECTION_STRING,
    ttl: 24 * 60 * 60, // 1 day in seconds
    autoRemove: 'native',
    touchAfter: 24 * 3600 // time period in seconds
  }),
  name: 'sessionId', // Change the default connect.sid
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/'
  }
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Initialize Google Auth
googleAuth(passport);

// ✅ Apply Routes
routesInit(app, passport);

// ✅ Main Routes
app.get("/", (req, res) => {
    res.send("<a href='https://online-system-for-pet-care-and-treatment.onrender.com/auth/google'>Login with Google</a> <h1>Welcome</h1>");
});

// ✅ Fix: Get session correctly
app.get("/get-session", (req, res) => {
  console.log("Cookies:", req.headers.cookie);
  console.log("Session:", req.session);
  console.log("User:", req.user);
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("Session ID:", req.sessionID);
  console.log("Session Store:", req.sessionStore);

  if (req.isAuthenticated()) {
    res.json({ 
      sessionID: req.sessionID, 
      user: req.user,
      isAuthenticated: true 
    });
  } else {
    res.json({ 
      message: "No session found", 
      user: null,
      isAuthenticated: false 
    });
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
          res.redirect("https://petwellnesshub.vercel.app"); // ✅ Redirect to React home page
      });
  });
});

const petRouter = require("./API/routes/pets.js")
app.use("/pet" , petRouter)

import imageProxyRouter from "./API/routes/imageProxy.js";
app.use("/image-proxy", imageProxyRouter);

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

// Appointment routes
import appointmentRoutes from "./API/routes/appointmentRoutes.js";
app.use("/api/appointments", appointmentRoutes);

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

const employeeRoutes = require("./API/routes/employeeRoutes.js")
app.use("/employee",employeeRoutes)

const PetAdRoutes = require("./API/routes/PetAdRoutes.js")
app.use("/pet-ad", PetAdRoutes);


const expenseRoutes = require("./API/routes/expenseRoutes.js");
app.use("/api/expenses", expenseRoutes);

const geminiRoutes = require("./API/routes/gemini.js")
app.use("/gemini", geminiRoutes);


const feedbackRoutes = require("./API/routes/feedbackRoutes.js")
app.use("/feedback", feedbackRoutes);

// Notification routes
import notificationRoutes from "./API/routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);



app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`);
    connect();
});

export default app;
