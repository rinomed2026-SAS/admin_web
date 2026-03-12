import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const meRouter = Router();
meRouter.get('/me', requireAuth, async (req, res, next) => {
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
