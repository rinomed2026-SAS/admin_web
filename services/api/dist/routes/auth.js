import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { hashPassword, signAccessToken, signRefreshToken, verifyPassword, verifyRefreshToken } from '../lib/auth.js';
import { config } from '../lib/config.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';
export const authRouter = Router();
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
const refreshSchema = z.object({
    refreshToken: z.string().min(10)
});
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
async function createRefreshToken(userId, role) {
    const token = signRefreshToken({ sub: userId, role });
    const tokenHash = hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.jwtRefreshTtlDays);
    await prisma.refreshToken.create({
        data: { userId, tokenHash, expiresAt }
    });
    return token;
}
authRouter.post('/register', async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const passwordHash = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: 'ASSISTANT'
            }
        });
        const accessToken = signAccessToken({ sub: user.id, role: user.role });
        const refreshToken = await createRefreshToken(user.id, user.role);
        return res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.post('/login', loginRateLimiter, async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const valid = await verifyPassword(data.password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = signAccessToken({ sub: user.id, role: user.role });
        const refreshToken = await createRefreshToken(user.id, user.role);
        return res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const payload = verifyRefreshToken(refreshToken);
        const tokenHash = hashToken(refreshToken);
        const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Refresh token invalid' });
        }
        await prisma.refreshToken.update({
            where: { tokenHash },
            data: { revokedAt: new Date() }
        });
        const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
        const newRefreshToken = await createRefreshToken(payload.sub, payload.role);
        return res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const tokenHash = hashToken(refreshToken);
        await prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() }
        });
        return res.json({ message: 'Logged out' });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                favorites: true,
                questions: true
            }
        });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            stats: {
                favorites: user.favorites.length,
                questions: user.questions.length,
                certificateAvailable: true
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
