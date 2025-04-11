import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware for admin role verification
export const verifyAdmin = (req, res, next) => {
    if ( req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}
