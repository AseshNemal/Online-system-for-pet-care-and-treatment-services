const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send("<h4>User is not authenticated</h4>");
    }
};

export { authenticate };
