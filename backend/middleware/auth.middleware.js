import { verifyToken } from '../lib/auth.lib.js';

function extractToken(req) {
    const header = req.headers.authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
}

/** Require a valid JWT. Attaches req.user = { id, role }. */
export const authenticate = (req, res, next) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/** Attach req.user if a valid token is present, otherwise continue anonymously. */
export const optionalAuth = (req, _res, next) => {
    const token = extractToken(req);
    if (token) {
        try {
            const payload = verifyToken(token);
            req.user = { id: payload.sub, role: payload.role };
        } catch {
            /* ignore invalid token for optional auth */
        }
    }
    next();
};

/** Restrict to the given role(s). Use after authenticate. */
export const authorize = (roles = []) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        if (allowed.length && !allowed.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};
