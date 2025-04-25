const authenticate = (req, res, next) => {
    console.log("🔒 Checking authentication status:", {
        isAuthenticated: req.isAuthenticated(),
        hasUser: !!req.user,
        sessionID: req.sessionID
    });
    
    if (req.isAuthenticated()) {
        next();
    } else {
        console.error("❌ Authentication failed: User not authenticated");
        res.status(401).json({ error: "User is not authenticated. Please log in." });
    }
};

export { authenticate };
