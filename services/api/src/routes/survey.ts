import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const surveyRouter = Router();

// GET /v1/survey – obtener encuesta del usuario autenticado
surveyRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    // Verificar si la tabla SurveyResponse existe
    const surveyResponse = await (prisma as any).surveyResponse?.findUnique({
      where: { userId: req.user!.id }
    });

    if (!surveyResponse) {
      return res.json({ data: null });
    }

    return res.json({ data: surveyResponse });
  } catch (error) {
    console.error('Error in GET /survey:', error);
    // Si la tabla no existe, devolver null
    if (error instanceof Error && error.message.includes('table')) {
      return res.json({ data: null });
    }
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

    const surveyResponse = await (prisma as any).surveyResponse?.upsert({
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
    console.error('Error in POST /survey:', error);
    // Si la tabla no existe, devolver un error apropiado
    if (error instanceof Error && error.message.includes('table')) {
      return res.status(503).json({ 
        message: 'Servicio de encuestas no disponible temporalmente' 
      });
    }
    return next(error);
  }
});