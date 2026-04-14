import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const surveyRouter = Router();

// GET /v1/survey – obtener encuesta del usuario autenticado
surveyRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const surveyResponse = await prisma.surveyResponse.findUnique({
      where: { userId: req.user!.id },
    });

    return res.json({ data: surveyResponse || null });
  } catch (error) {
    console.error('Error in GET /survey:', error);
    // SIEMPRE devolver null en caso de error
    return res.json({ data: null });
  }
});

// POST /v1/survey – crear o actualizar encuesta del usuario
surveyRouter.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    let responses;
    
    // Soportar tanto el formato {responses: {...}} como campos directos
    if (req.body.responses) {
      // Formato: { responses: { overallRating: 5, ... } }
      responses = req.body.responses;
    } else {
      // Formato directo: { overallRating: 5, organizationRating: 5, ... }
      // Convertir a formato responses
      responses = {
        overallRating: req.body.overallRating,
        organizationRating: req.body.organizationRating,
        eventRecommend: req.body.eventRecommend,
        comments: req.body.comments,
        // Incluir cualquier otro campo que venga en el body
        ...Object.keys(req.body)
          .filter(key => !['overallRating', 'organizationRating', 'eventRecommend', 'comments'].includes(key))
          .reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {})
      };
    }

    if (!responses || Object.keys(responses).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos de encuesta válidos.' });
    }

    const surveyResponse = await prisma.surveyResponse.upsert({
      where: { userId: req.user!.id },
      update: { responses },
      create: { userId: req.user!.id, responses },
    });

    return res.json({ 
      data: surveyResponse,
      message: 'Encuesta guardada correctamente'
    });
  } catch (error) {
    console.error('[survey] POST failed:', error instanceof Error ? error.message : error);
    
    // Devolver error más específico para debug
    return res.status(500).json({ 
      message: 'Error al procesar la encuesta',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});