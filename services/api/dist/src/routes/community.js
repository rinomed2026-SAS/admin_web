import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const communityRouter = Router();
// GET /v1/community/gallery – imágenes aprobadas para galería pública
communityRouter.get('/gallery', async (_req, res, next) => {
    // SIEMPRE devolver una respuesta válida, incluso si la base de datos falla
    try {
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
        // SIEMPRE devolver un array vacío en caso de error - NUNCA fallar con 500
        return res.json({ data: [] });
    }
});
// POST /v1/community/submissions – crear nueva submission (requiere auth)
communityRouter.post('/submissions', requireAuth, async (req, res, next) => {
    try {
        console.log('POST /submissions called with body:', JSON.stringify(req.body, null, 2));
        console.log('User:', req.user);
        // Validación más robusta
        const body = req.body;
        if (!body) {
            console.error('No body provided');
            return res.status(400).json({ message: 'Request body is required' });
        }
        const { userName, originalImageUrl, composedImageUrl, appCaption, allowGallery } = body;
        console.log('Extracted fields:', { userName, originalImageUrl, composedImageUrl, appCaption, allowGallery });
        // Resolve userName: prefer body, fallback to authenticated user profile
        let resolvedUserName = userName;
        if (!resolvedUserName && req.user?.id) {
            const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true } });
            resolvedUserName = user?.name || 'Asistente';
            console.log('Using fallback userName from auth:', resolvedUserName);
        }
        // Validaciones específicas con mensajes claros
        if (!resolvedUserName || typeof resolvedUserName !== 'string' || resolvedUserName.trim().length === 0) {
            console.error('Invalid userName after fallback:', resolvedUserName);
            return res.status(400).json({
                message: 'userName es requerido y debe ser un string no vacío.',
                received: { userName: resolvedUserName, hasImage: !!originalImageUrl }
            });
        }
        if (!originalImageUrl || typeof originalImageUrl !== 'string' || originalImageUrl.trim().length === 0) {
            console.error('Invalid originalImageUrl:', originalImageUrl);
            return res.status(400).json({
                message: 'originalImageUrl es requerido y debe ser un string no vacío.',
                received: { originalImageUrl }
            });
        }
        // Datos base que siempre existen
        const baseData = {
            userName: resolvedUserName.trim(),
            originalImageUrl: originalImageUrl.trim(),
            composedImageUrl: composedImageUrl?.trim() ?? null,
            allowGallery: Boolean(allowGallery),
            status: 'PENDING',
        };
        // Solo agregar appCaption si se proporciona (será ignorado si el campo no existe)
        if (appCaption && typeof appCaption === 'string' && appCaption.trim().length > 0) {
            baseData.appCaption = appCaption.trim();
        }
        console.log('Creating submission with data:', baseData);
        const submission = await prisma.communitySubmission.create({
            data: baseData,
        });
        console.log('Submission created successfully:', submission);
        return res.status(201).json({ data: submission });
    }
    catch (error) {
        console.error('Error in POST /submissions:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        // Devolver error más específico
        if (error instanceof Error && error.message.includes('foreign key constraint')) {
            return res.status(400).json({
                message: 'Error de referencia en la base de datos.',
                error: error.message
            });
        }
        if (error instanceof Error && error.message.includes('unique constraint')) {
            return res.status(400).json({
                message: 'Ya existe una submission con estos datos.',
                error: error.message
            });
        }
        return res.status(500).json({
            message: 'Error interno del servidor.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
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
        console.error('Error in GET /submissions:', error);
        return res.json({ data: [] });
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
