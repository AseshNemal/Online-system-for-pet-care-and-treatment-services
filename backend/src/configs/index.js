import dotenv from "dotenv";

const config = {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || process.env.MONGODB_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.NODE_ENV === 'production'
        ? 'https://online-system-for-pet-care-and-treatment-services.vercel.app/auth/google/callback'
        : 'http://localhost:8090/auth/google/callback',
    SESSION_SECRET: process.env.SESSION_SECRET
}

export default config;