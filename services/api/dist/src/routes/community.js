import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const communityRouter = Router();
// GET /v1/community/gallery – imágenes aprobadas para galería pública
communityRouter.get('/gallery', async (_req, res, next) => {
    try {
        const submissions = await prisma.communitySubmission.findMany({
            where: { status: 'APPROVED', allowGallery: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                userName: true,
                composedImageUrl: true,
                appCaption: true,
                createdAt: true,
            },
        });
        return res.json({ data: submissions });
    }
    catch (error) {
        return next(error);
    }
});
// POST /v1/community/submissions – crear nueva submission (requiere auth)
communityRouter.post('/submissions', requireAuth, async (req, res, next) => {
    try {
        const { userName, originalImageUrl, composedImageUrl, appCaption, allowGallery } = req.body;
        if (!userName || !originalImageUrl) {
            return res.status(400).json({ message: 'userName y originalImageUrl son requeridos.' });
        }
        const submission = await prisma.communitySubmission.create({
            data: {
                userName,
                originalImageUrl,
                composedImageUrl: composedImageUrl ?? null,
                appCaption: appCaption ?? null,
                allowGallery: allowGallery ?? false,
                status: 'PENDING',
            },
        });
        return res.status(201).json({ data: submission });
    }
    catch (error) {
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
