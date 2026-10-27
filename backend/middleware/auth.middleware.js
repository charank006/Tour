const jwt = require('jsonwebtoken');

/**
 * Auth Middleware — verifyToken
 *
 * In production: validates a JWT from the 'x-auth-token' header.
 * In dev (no JWT_SECRET or DEV_MODE=true): allows requests through with a
 * synthetic guest user, so the app remains functional without a DB.
 */
module.exports = function (req, res, next) {
    const DEV_MODE = process.env.DEV_MODE === 'true' || !process.env.JWT_SECRET;

    // ── Dev bypass ────────────────────────────────────────────────────────────
    if (DEV_MODE) {
        req.user = { id: 'guest', name: 'Guest User', isGuest: true };
        return next();
    }

    // ── Production path ───────────────────────────────────────────────────────
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;   // {id, ...}
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
