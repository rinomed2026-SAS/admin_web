import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const statisticsRouter = Router();
statisticsRouter.use(requireAuth);
statisticsRouter.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Contar total de sesiones
        const totalSessions = await prisma.session.count();
        // Contar favoritos del usuario
        const favoriteCount = await prisma.favorite.count({
            where: { userId }
        });
        // Contar preguntas del usuario
        const questionCount = await prisma.question.count({
            where: { userId }
        });
        return res.json({
            data: {
                totalSessions,
                favoriteCount,
                questionCount
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
