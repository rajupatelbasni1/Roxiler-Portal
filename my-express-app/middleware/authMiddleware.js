const jwt = require('jsonwebtoken');
require('dotenv').config();

// Token Verify Karne Ka Middleware
exports.verifyToken = (req, res, next) => {
    // Frontend se token header mein aayega ('Bearer <token>')
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Decoded payload (id, role) ko request object mein daal diya
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
    return next();
};

// Role-based Access Control Middleware
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};