import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
export const sponsorsRouter = Router();
sponsorsRouter.get('/', async (_req, res, next) => {
    try {
        const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: 'asc' } });
        res.set('Cache-Control', 'public, max-age=60');
        return res.json({ data: sponsors });
    }
    catch (error) {
        return next(error);
    }
});
sponsorsRouter.get('/:id', async (req, res, next) => {
    try {
        const sponsor = await prisma.sponsor.findUnique({ where: { id: req.params.id } });
        if (!sponsor)
            return res.status(404).json({ message: 'Sponsor not found' });
        return res.json({ data: sponsor });
    }
    catch (error) {
        return next(error);
    }
});
sponsorsRouter.post('/:id/leads', requireAuth, async (req, res, next) => {
    try {
        const lead = await prisma.sponsorLead.create({
            data: { userId: req.user.id, sponsorId: req.params.id }
        });
        return res.status(201).json({ data: lead });
    }
    catch (error) {
        return next(error);
    }
});
