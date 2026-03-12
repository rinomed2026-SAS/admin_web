import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const speakersRouter = Router();

speakersRouter.get('/', async (req, res, next) => {
  try {
    const querySchema = z.object({ query: z.string().optional() });
    const { query } = querySchema.parse(req.query);
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { specialty: { contains: query, mode: 'insensitive' } }
      ];
    }
    const speakers = await prisma.speaker.findMany({ where, orderBy: { name: 'asc' } });
    return res.json({ data: speakers });
  } catch (error) {
    return next(error);
  }
});

speakersRouter.get('/:id', async (req, res, next) => {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: req.params.id },
      include: { sessions: { include: { session: true } } }
    });
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
    return res.json({
      ...speaker,
      sessions: speaker.sessions.map((link) => link.session)
    });
  } catch (error) {
    return next(error);
  }
});
