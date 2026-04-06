import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const surveyRouter = Router();

// GET /v1/survey – obtener encuesta del usuario autenticado
surveyRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const surveyResponse = await prisma.surveyResponse.findUnique({
      where: { userId: req.user!.id }
    });

    if (!surveyResponse) {
      return res.json({ data: null });
    }

    return res.json({ data: surveyResponse });
  } catch (error) {
    return next(error);
  }
});

// POST /v1/survey – crear o actualizar encuesta del usuario
surveyRouter.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { responses } = req.body as { responses: any };

    if (!responses) {
      return res.status(400).json({ message: 'El campo responses es requerido.' });
    }

    const surveyResponse = await prisma.surveyResponse.upsert({
      where: { userId: req.user!.id },
      update: { 
        responses,
        updatedAt: new Date()
      },
      create: {
        userId: req.user!.id,
        responses
      }
    });

    return res.json({ 
      data: surveyResponse,
      message: 'Encuesta guardada correctamente'
    });
  } catch (error) {
    return next(error);
  }
});