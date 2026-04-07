import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const surveyRouter = Router();
// GET /v1/survey – obtener encuesta del usuario autenticado
surveyRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        // Verificar si la tabla SurveyResponse existe y obtener datos
        const surveyResponse = await prisma.surveyResponse?.findUnique({
            where: { userId: req.user.id }
        });
        return res.json({ data: surveyResponse || null });
    }
    catch (error) {
        console.error('Error in GET /survey:', error);
        // SIEMPRE devolver null en caso de error
        return res.json({ data: null });
    }
});
// POST /v1/survey – crear o actualizar encuesta del usuario
surveyRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const { responses } = req.body;
        if (!responses) {
            return res.status(400).json({ message: 'El campo responses es requerido.' });
        }
        const surveyResponse = await prisma.surveyResponse?.upsert({
            where: { userId: req.user.id },
            update: {
                responses,
                updatedAt: new Date()
            },
            create: {
                userId: req.user.id,
                responses
            }
        });
        return res.json({
            data: surveyResponse,
            message: 'Encuesta guardada correctamente'
        });
    }
    catch (error) {
        console.error('Error in POST /survey:', error);
        // Devolver un mensaje de servicio no disponible
        return res.status(200).json({
            data: null,
            message: 'Servicio de encuestas no disponible temporalmente'
        });
    }
});
