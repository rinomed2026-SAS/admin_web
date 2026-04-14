import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const meRouter = Router();
// Lightweight profile — counts via parallel queries instead of include
meRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [user, favorites, questions] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true, role: true },
            }),
            prisma.favorite.count({ where: { userId } }),
            prisma.question.count({ where: { userId } }),
        ]);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.json({
            ...user,
            stats: { favorites, questions, certificateAvailable: true },
        });
    }
    catch (error) {
        return next(error);
    }
});
