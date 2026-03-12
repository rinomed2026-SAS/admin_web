import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const questionsRouter = Router();

questionsRouter.use(requireAuth);

questionsRouter.get('/questions', async (req: AuthRequest, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      where: { userId: req.user!.id },
      include: { session: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ data: questions });
  } catch (error) {
    return next(error);
  }
});

questionsRouter.post('/sessions/:id/questions', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({ text: z.string().min(3) });
    const { text } = schema.parse(req.body);
    const question = await prisma.question.create({
      data: {
        userId: req.user!.id,
        sessionId: req.params.id,
        text
      }
    });
    return res.status(201).json({ data: question });
  } catch (error) {
    return next(error);
  }
});

questionsRouter.delete('/questions/:id', async (req: AuthRequest, res, next) => {
  try {
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await prisma.question.delete({ where: { id: question.id } });
    return res.json({ message: 'Question deleted' });
  } catch (error) {
    return next(error);
  }
});
