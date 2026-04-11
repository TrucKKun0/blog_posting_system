const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const optionAuthMiddleware = (req, res, next) => {
    // First, try to get userId from x-user-id header (for direct API calls)
    const userIdFromHeader = req.headers['x-user-id'];
    if (userIdFromHeader) {
        req.userId = userIdFromHeader;
        return next();
    }

    // Second, try to validate JWT token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const user = jwt.verify(token, JWT_SECRET_KEY);
            req.userId = user.userId;
            req.user = user; // Also set the full user object for consistency
            logger.info(`JWT validated for user: ${user.userId}`);
        } catch (error) {
            logger.warn(`Invalid JWT token: ${error.message}`);
            // Don't block the request, just proceed without authentication
        }
    }

    next();
}
module.exports = { optionAuthMiddleware };