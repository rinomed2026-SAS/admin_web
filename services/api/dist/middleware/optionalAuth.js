import { verifyAccessToken } from '../lib/auth.js';
export function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header)
        return next();
    const [, token] = header.split(' ');
    if (!token)
        return next();
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
    }
    catch {
        req.user = undefined;
    }
    return next();
}
