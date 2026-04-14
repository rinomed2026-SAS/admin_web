import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
export const infoRouter = Router();
const cache = new Map();
function cached(key, ttlMs, fn) {
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now())
        return Promise.resolve(hit.data);
    return fn().then((data) => {
        cache.set(key, { data, expiresAt: Date.now() + ttlMs });
        return data;
    });
}
infoRouter.get('/event-info', async (_req, res, next) => {
    try {
        const info = await cached('eventInfo', 120_000, () => prisma.eventInfo.findFirst());
        res.set('Cache-Control', 'public, max-age=120');
        return res.json({ data: info });
    }
    catch (error) {
        return next(error);
    }
});
infoRouter.get('/hotels', async (_req, res, next) => {
    try {
        const hotels = await cached('hotels', 120_000, () => prisma.hotel.findMany({ orderBy: { rating: 'desc' } }));
        res.set('Cache-Control', 'public, max-age=120');
        return res.json({ data: hotels });
    }
    catch (error) {
        return next(error);
    }
});
infoRouter.get('/tourism', async (_req, res, next) => {
    try {
        const tourism = await cached('tourism', 120_000, () => prisma.tourism.findMany({ orderBy: { name: 'asc' } }));
        res.set('Cache-Control', 'public, max-age=120');
        return res.json({ data: tourism });
    }
    catch (error) {
        return next(error);
    }
});
