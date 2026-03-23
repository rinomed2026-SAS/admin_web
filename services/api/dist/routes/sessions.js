import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
export const sessionsRouter = Router();
sessionsRouter.get('/', optionalAuth, async (req, res, next) => {
    try {
        const querySchema = z.object({
            day: z.string().optional(),
            query: z.string().optional(),
            page: z.coerce.number().min(1).optional(),
            limit: z.coerce.number().min(1).max(50).optional()
        });
        const { day, query, page = 1, limit = 20 } = querySchema.parse(req.query);
        const where = {};
        if (day) {
            where.day = new Date(day);
        }
        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { topic: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ];
        }
        const sessions = await prisma.session.findMany({
            where,
            orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
            skip: (page - 1) * limit,
            take: limit
        });
        let favoritesSet = new Set();
        if (req.user) {
            const favorites = await prisma.favorite.findMany({
                where: { userId: req.user.id },
                select: { sessionId: true }
            });
            favoritesSet = new Set(favorites.map((fav) => fav.sessionId));
        }
        const data = sessions.map((session) => ({
            ...session,
            isFavorite: req.user ? favoritesSet.has(session.id) : false
        }));
        return res.json({ data, page, limit });
    }
    catch (error) {
        return next(error);
    }
});
sessionsRouter.get('/:id', optionalAuth, async (req, res, next) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
            include: { speakers: { include: { speaker: true } } }
        });
        if (!session)
            return res.status(404).json({ message: 'Session not found' });
        let isFavorite = false;
        if (req.user) {
            const fav = await prisma.favorite.findUnique({
                where: { userId_sessionId: { userId: req.user.id, sessionId: session.id } }
            });
            isFavorite = Boolean(fav);
        }
        return res.json({
            ...session,
            isFavorite,
            speakers: session.speakers.map((link) => link.speaker)
        });
    }
    catch (error) {
        return next(error);
    }
});
