import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import logger from "./utils/logger.js";
import { connect } from "./utils/database.connection.js";
import { googleAuth } from "./configs/google.auth.js";
import { routesInit } from "./API/middleware/routesInit.js";
import config from "./configs/index.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ["https://online-system-for-pet-care-and-treatment-services.vercel.app", "https://*.vercel.app"]
        : ["http://localhost:3000"],
    credentials: true 
}));

// Body parsing middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: config.DB_CONNECTION_STRING,
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Apply Routes
routesInit(app, passport);

// Main Routes
app.get("/", (req, res) => {
    res.send("API is running");
});

// Session route
app.get("/get-session", (req, res) => {
    if (req.user) {
        res.json({ sessionID: req.sessionID, user: req.user });
    } else {
        res.json({ message: "No session found", user: null });
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Error logging out" });
        }
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.redirect(process.env.NODE_ENV === 'production' 
                ? 'https://online-system-for-pet-care-and-treatment-services.vercel.app'
                : 'http://localhost:3000');
        });
    });
});

// Import and use routes
import petRouter from "./API/routes/pets.js";
app.use("/pet", petRouter);

import imageProxyRouter from "./API/routes/imageProxy.js";
app.use("/image-proxy", imageProxyRouter);

import dataRoutes from "./API/routes/dataRoutes.js";
app.use('/api', dataRoutes);

import medicalRecords from "./API/routes/medicalRecords.js";
app.use('/medical', medicalRecords);

import productRouter from "./API/routes/productRoutes.js";
app.use("/product", productRouter);

import orderRoutes from "./API/routes/orderRoutes.js";
app.use("/order", orderRoutes);

import appointmentRoutes from "./API/routes/appointmentRoutes.js";
app.use("/api/appointments", appointmentRoutes);

// Serve static files
app.use("/uploads", express.static("uploads"));

import employeeRoutes from "./API/routes/employeeRoutes.js";
app.use("/employee", employeeRoutes);

import PetAdRoutes from "./API/routes/PetAdRoutes.js";
app.use("/pet-ad", PetAdRoutes);

import expenseRoutes from "./API/routes/expenseRoutes.js";
app.use("/api/expenses", expenseRoutes);

import geminiRoutes from "./API/routes/gemini.js";
app.use("/gemini", geminiRoutes);

import feedbackRoutes from "./API/routes/feedbackRoutes.js";
app.use("/feedback", feedbackRoutes);

import notificationRoutes from "./API/routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);

// Connect to database and initialize Google Auth
connect();
googleAuth(passport);

// Export the Express app
export default app;
