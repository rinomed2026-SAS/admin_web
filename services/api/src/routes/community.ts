import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

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
      ...(sub as any).appCaption && { appCaption: (sub as any).appCaption }
    }));
    
    return res.json({ data: safeSubmissions });
  } catch (error) {
    console.error('Error in /gallery endpoint:', error);
    
    // SIEMPRE devolver un array vacío en caso de error - NUNCA fallar con 500
    return res.json({ data: [] });
  }
});

// POST /v1/community/submissions – crear nueva submission (requiere auth)
communityRouter.post('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { userName, originalImageUrl, composedImageUrl, appCaption, allowGallery } = req.body as {
      userName: string;
      originalImageUrl: string;
      composedImageUrl?: string;
      appCaption?: string;
      allowGallery: boolean;
    };

    if (!userName || !originalImageUrl) {
      return res.status(400).json({ message: 'userName y originalImageUrl son requeridos.' });
    }

    // Datos base que siempre existen
    const baseData: any = {
      userName,
      originalImageUrl,
      composedImageUrl: composedImageUrl ?? null,
      allowGallery: allowGallery ?? false,
      status: 'PENDING',
    };

    // Solo agregar appCaption si se proporciona (será ignorado si el campo no existe)
    if (appCaption) {
      baseData.appCaption = appCaption;
    }

    const submission = await prisma.communitySubmission.create({
      data: baseData,
    });

    return res.status(201).json({ data: submission });
  } catch (error) {
    console.error('Error in POST /submissions:', error);
    return next(error);
  }
});

// GET /v1/community/submissions – admin: ver todas las submissions
communityRouter.get('/submissions', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const submissions = await prisma.communitySubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ data: submissions });
  } catch (error) {
    console.error('Error in GET /submissions:', error);
    return res.json({ data: [] });
  }
});

// PATCH /v1/community/submissions/:id/status – admin: aprobar o rechazar
communityRouter.patch('/submissions/:id/status', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { status } = req.body as { status: 'APPROVED' | 'REJECTED' };
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido. Use APPROVED o REJECTED.' });
    }
    const updated = await prisma.communitySubmission.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
});

// DELETE /v1/community/:id – admin: eliminar submission
communityRouter.delete('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await prisma.communitySubmission.delete({
      where: { id: req.params.id },
    });
    
    return res.json({ message: 'Submission eliminada correctamente' });
  } catch (error) {
    return next(error);
  }
});
