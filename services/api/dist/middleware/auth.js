import { verifyAccessToken } from '../lib/auth.js';
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    const [, token] = header.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Invalid authorization header' });
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
