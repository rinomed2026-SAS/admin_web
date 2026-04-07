import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const communityRouter = Router();
// GET /v1/community/gallery – imágenes aprobadas para galería pública
communityRouter.get('/gallery', async (_req, res, next) => {
    try {
        // Verificar conexión a la base de datos primero
        try {
            await prisma.$connect();
        }
        catch (dbError) {
            console.error('Database connection failed:', dbError);
            return res.status(503).json({
                message: 'Servicio temporalmente no disponible',
                data: []
            });
        }
        const submissions = await prisma.communitySubmission.findMany({
            where: { status: 'APPROVED', allowGallery: true },
            orderBy: { createdAt: 'desc' },
        });
        // Mapear los resultados para incluir solo campos seguros
        const safeSubmissions = submissions.map(sub => ({
            id: sub.id,
            userName: sub.userName,
            composedImageUrl: sub.composedImageUrl,
            createdAt: sub.createdAt,
            // Solo incluir appCaption si existe en el objeto
            ...sub.appCaption && { appCaption: sub.appCaption }
        }));
        return res.json({ data: safeSubmissions });
    }
    catch (error) {
        console.error('Error in /gallery endpoint:', error);
        // Devolver un array vacío en caso de error para que la app no falle
        return res.status(503).json({
            message: 'Servicio temporalmente no disponible',
            data: []
        });
    }
});
// POST /v1/community/submissions – crear nueva submission (requiere auth)
communityRouter.post('/submissions', requireAuth, async (req, res, next) => {
    try {
        const { userName, originalImageUrl, composedImageUrl, appCaption, allowGallery } = req.body;
        if (!userName || !originalImageUrl) {
            return res.status(400).json({ message: 'userName y originalImageUrl son requeridos.' });
        }
        // Datos base que siempre existen
        const baseData = {
            userName,
            originalImageUrl,
            composedImageUrl: composedImageUrl ?? null,
            allowGallery: allowGallery ?? false,
            status: 'PENDING',
        };
        // Solo agregar appCaption si se proporciona y el campo existe en el schema
        if (appCaption) {
            try {
                baseData.appCaption = appCaption;
            }
            catch (e) {
                // Si falla, continúa sin el campo appCaption
                console.warn('appCaption field not available in schema yet');
            }
        }
        const submission = await prisma.communitySubmission.create({
            data: baseData,
        });
        return res.status(201).json({ data: submission });
    }
    catch (error) {
        console.error('Error in POST /submissions:', error);
        return next(error);
    }
});
// GET /v1/community/submissions – admin: ver todas las submissions
communityRouter.get('/submissions', requireAuth, async (req, res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const submissions = await prisma.communitySubmission.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ data: submissions });
    }
    catch (error) {
        return next(error);
    }
});
// PATCH /v1/community/submissions/:id/status – admin: aprobar o rechazar
communityRouter.patch('/submissions/:id/status', requireAuth, async (req, res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { status } = req.body;
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Estado inválido. Use APPROVED o REJECTED.' });
        }
        const updated = await prisma.communitySubmission.update({
            where: { id: req.params.id },
            data: { status },
        });
        return res.json({ data: updated });
    }
    catch (error) {
        return next(error);
    }
});
// DELETE /v1/community/:id – admin: eliminar submission
communityRouter.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await prisma.communitySubmission.delete({
            where: { id: req.params.id },
        });
        return res.json({ message: 'Submission eliminada correctamente' });
    }
    catch (error) {
        return next(error);
    }
});
