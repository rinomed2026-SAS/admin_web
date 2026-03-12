import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);

favoritesRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: { session: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ data: favorites.map((fav) => fav.session) });
  } catch (error) {
    return next(error);
  }
});

favoritesRouter.post('/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    await prisma.favorite.create({
      data: { userId: req.user!.id, sessionId: req.params.sessionId }
    });
    return res.status(201).json({ message: 'Favorite added' });
  } catch (error) {
    return next(error);
  }
});

favoritesRouter.delete('/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    await prisma.favorite.delete({
      where: { userId_sessionId: { userId: req.user!.id, sessionId: req.params.sessionId } }
    });
    return res.json({ message: 'Favorite removed' });
  } catch (error) {
    return next(error);
  }
});
