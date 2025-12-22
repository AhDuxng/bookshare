const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware để verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            console.log('⚠️ No token in request:', req.method, req.path);
            return next(); // Continue without user info
        }

        console.log('🔐 Verifying token for:', req.method, req.path);
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('✅ Token verified for user:', decoded.id);
        next();
    } catch (error) {
        console.warn('❌ Token verification failed:', error.message);
        return next(); // Continue without user info instead of failing
    }
};

// Middleware để require authentication
const requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('❌ No token provided for:', req.method, req.path);
            return res.status(401).json({ error: 'No token provided' });
        }

        console.log('🔐 Verifying required auth token for:', req.method, req.path);
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('✅ Auth verified for user:', decoded.id);
        next();
    } catch (error) {
        console.error('❌ Auth verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken, requireAuth, JWT_SECRET };
