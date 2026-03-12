import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const infoRouter = Router();

infoRouter.get('/event-info', async (_req, res, next) => {
  try {
    const info = await prisma.eventInfo.findFirst();
    return res.json({ data: info });
  } catch (error) {
    return next(error);
  }
});

infoRouter.get('/hotels', async (_req, res, next) => {
  try {
    const hotels = await prisma.hotel.findMany({ orderBy: { rating: 'desc' } });
    return res.json({ data: hotels });
  } catch (error) {
    return next(error);
  }
});

infoRouter.get('/tourism', async (_req, res, next) => {
  try {
    const tourism = await prisma.tourism.findMany({ orderBy: { name: 'asc' } });
    return res.json({ data: tourism });
  } catch (error) {
    return next(error);
  }
});
