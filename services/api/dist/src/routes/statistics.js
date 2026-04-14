import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const statisticsRouter = Router();
statisticsRouter.use(requireAuth);
statisticsRouter.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Run all three counts in parallel
        const [totalSessions, favoriteCount, questionCount] = await Promise.all([
            prisma.session.count(),
            prisma.favorite.count({ where: { userId } }),
            prisma.question.count({ where: { userId } }),
        ]);
        return res.json({
            data: { totalSessions, favoriteCount, questionCount },
        });
    }
    catch (error) {
        return next(error);
    }
});
