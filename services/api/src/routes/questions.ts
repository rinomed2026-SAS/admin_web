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
    // Log de debug para entender el problema
    console.log('Question endpoint called with body:', req.body);
    console.log('Session ID:', req.params.id);
    console.log('User ID:', req.user?.id);

    const schema = z.object({ 
      text: z.string().min(3),
      anonymous: z.boolean().optional().default(false)
    });
    
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error);
      return res.status(400).json({ 
        error: 'Invalid data format',
        details: parseResult.error.format()
      });
    }

    const { text, anonymous } = parseResult.data;
    
    // Validaciones adicionales
    if (!req.user?.id) {
      console.error('No user ID in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.params.id) {
      console.error('No session ID in params');
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Datos base que siempre existen
    const questionData: any = {
      userId: req.user.id,
      sessionId: req.params.id,
      text
    };

    // Solo agregar anonymous si se proporciona (será ignorado si el campo no existe)
    if (anonymous !== undefined) {
      questionData.anonymous = anonymous;
    }

    console.log('Creating question with data:', questionData);

    const question = await prisma.question.create({
      data: questionData
    });

    console.log('Question created successfully:', question);
    return res.status(201).json({ data: question });
  } catch (error) {
    console.error('Error creating question:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Request body:', req.body);
    console.error('Request params:', req.params);
    console.error('User data:', req.user);
    
    // Devolver respuesta genérica en caso de error
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create question'
    });
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
