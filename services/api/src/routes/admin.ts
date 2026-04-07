import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { toCsv } from '../lib/csv.js';

export const adminRouter = Router();


adminRouter.use(requireAuth, requireRole('ADMIN'));

const sessionSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  room: z.string().min(1, 'Room is required'),
  title: z.string().min(1, 'Title is required'),
  topic: z.string().min(1, 'Topic is required'),
  level: z.string().min(1, 'Level is required'),
  description: z.string().optional().default('')
});

adminRouter.get('/sessions', async (_req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({ orderBy: [{ day: 'asc' }, { startTime: 'asc' }] });
    res.json({ data: sessions });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/sessions', async (req, res, next) => {
  try {
    const data = sessionSchema.parse(req.body);
    const session = await prisma.session.create({ data: { ...data, day: new Date(data.day) } });
    res.status(201).json({ data: session });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/sessions/:id', async (req, res, next) => {
  try {
    const data = sessionSchema.parse(req.body);
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: { ...data, day: new Date(data.day) }
    });
    res.json({ data: session });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/sessions/:id', async (req, res, next) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
});

const speakerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  bio: z.string().optional().default(''),
  photoUrl: z.string().optional().default('https://placehold.co/300x300'),
  websiteUrl: z.string().optional().default(''),
  instagramUrl: z.string().optional().default('')
});

adminRouter.get('/speakers', async (_req, res, next) => {
  try {
    const speakers = await prisma.speaker.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: speakers });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/speakers', async (req, res, next) => {
  try {
    const data = speakerSchema.parse(req.body);
    const speaker = await prisma.speaker.create({ data });
    res.status(201).json({ data: speaker });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/speakers/:id', async (req, res, next) => {
  try {
    const data = speakerSchema.parse(req.body);
    const speaker = await prisma.speaker.update({ where: { id: req.params.id }, data });
    res.json({ data: speaker });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/speakers/:id', async (req, res, next) => {
  try {
    await prisma.speaker.delete({ where: { id: req.params.id } });
    res.json({ message: 'Speaker deleted' });
  } catch (error) {
    next(error);
  }
});

const sponsorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tier: z.string().min(1, 'Tier is required'),
  logoUrl: z.string().optional().default(''),
  description: z.string().optional().default(''),
  websiteUrl: z.string().optional().default(''),
  products: z.string().optional().default('')
});

adminRouter.get('/sponsors', async (_req, res, next) => {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: 'asc' } });
    res.json({ data: sponsors });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/sponsors', async (req, res, next) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.create({ data });
    res.status(201).json({ data: sponsor });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/sponsors/:id', async (req, res, next) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.update({ where: { id: req.params.id }, data });
    res.json({ data: sponsor });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/sponsors/:id', async (req, res, next) => {
  try {
    await prisma.sponsor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Sponsor deleted' });
  } catch (error) {
    next(error);
  }
});

const hotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rating: z.number().optional().default(0),
  priceMinCop: z.number().optional().default(0),
  priceMaxCop: z.number().optional().default(0),
  distanceKm: z.number().optional().default(0),
  amenities: z.string().optional().default(''),
  contact: z.string().optional().default(''),
  promoCode: z.string().optional().default('')
});

adminRouter.get('/hotels', async (_req, res, next) => {
  try {
    const hotels = await prisma.hotel.findMany({ orderBy: { rating: 'desc' } });
    res.json({ data: hotels });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/hotels', async (req, res, next) => {
  try {
    const data = hotelSchema.parse(req.body);
    const hotel = await prisma.hotel.create({ data });
    res.status(201).json({ data: hotel });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/hotels/:id', async (req, res, next) => {
  try {
    const data = hotelSchema.parse(req.body);
    const hotel = await prisma.hotel.update({ where: { id: req.params.id }, data });
    res.json({ data: hotel });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/hotels/:id', async (req, res, next) => {
  try {
    await prisma.hotel.delete({ where: { id: req.params.id } });
    res.json({ message: 'Hotel deleted' });
  } catch (error) {
    next(error);
  }
});

const tourismSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().optional().default(''),
  highlights: z.string().optional().default(''),
  description: z.string().optional().default('')
});

adminRouter.get('/tourism', async (_req, res, next) => {
  try {
    const tourism = await prisma.tourism.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: tourism });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/tourism', async (req, res, next) => {
  try {
    const data = tourismSchema.parse(req.body);
    const item = await prisma.tourism.create({ data });
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/tourism/:id', async (req, res, next) => {
  try {
    const data = tourismSchema.parse(req.body);
    const item = await prisma.tourism.update({ where: { id: req.params.id }, data });
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/tourism/:id', async (req, res, next) => {
  try {
    await prisma.tourism.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tourism deleted' });
  } catch (error) {
    next(error);
  }
});

const eventInfoSchema = z.object({
  name: z.string(),
  city: z.string(),
  dates: z.string(),
  venue: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  website: z.string(),
  mapsUrl: z.string(),
  academicHours: z.string()
});

adminRouter.put('/event-info', async (req, res, next) => {
  try {
    const data = eventInfoSchema.parse(req.body);
    const info = await prisma.eventInfo.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    });
    res.json({ data: info });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/questions/export.csv', async (_req, res, next) => {
  try {
    const questions = (await prisma.question.findMany({
      include: { session: true, user: true },
      orderBy: { createdAt: 'desc' }
    })) as Array<{
      id: string;
      text: string;
      createdAt: Date;
      user: { email: string };
      session: { title: string };
    }>;
    const csv = toCsv(
      questions.map((q) => ({
        id: q.id,
        user: q.user.email,
        session: q.session.title,
        text: q.text,
        createdAt: q.createdAt.toISOString()
      }))
    );
    res.type('text/csv').send(csv);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/questions', async (_req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        session: { select: { id: true, title: true, day: true, startTime: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Mapear para incluir anonymous de manera segura
    const safeQuestions = questions.map(q => ({
      id: q.id,
      text: q.text,
      createdAt: q.createdAt,
      anonymous: (q as any).anonymous || false, // Default a false si no existe
      user: q.user,
      session: q.session
    }));

    res.json({ data: safeQuestions });
  } catch (error) {
    console.error('Error in /admin/questions:', error);
    next(error);
  }
});

adminRouter.delete('/questions/:id', async (req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/leads/export.csv', async (_req, res, next) => {
  try {
    const leads = (await prisma.sponsorLead.findMany({
      include: { user: true, sponsor: true },
      orderBy: { createdAt: 'desc' }
    })) as Array<{
      id: string;
      createdAt: Date;
      user: { email: string };
      sponsor: { name: string };
    }>;
    const csv = toCsv(
      leads.map((lead) => ({
        id: lead.id,
        user: lead.user.email,
        sponsor: lead.sponsor.name,
        createdAt: lead.createdAt.toISOString()
      }))
    );
    res.type('text/csv').send(csv);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

const userRole = z.enum(['ASSISTANT', 'PROFESSOR', 'STAFF', 'ADMIN']);
const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  role: userRole,
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: userRole.optional(),
  password: z.string().min(6).optional()
});

adminRouter.post('/users', async (req, res, next) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const { password, ...rest } = data;
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { ...rest, passwordHash } });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/users/:id', async (req, res, next) => {
  try {
    const data = userUpdateSchema.parse(req.body);
    const { password, ...rest } = data;
    const updateData: any = { ...rest };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }
    const user = await prisma.user.update({ where: { id: req.params.id }, data: updateData });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// GET /v1/admin/stats – estadísticas del dashboard
adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [
      usersCount,
      sessionsCount,
      questionsCount,
      leadsCount,
      communityCount,
      speakersCount,
      sponsorsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.question.count(),
      prisma.sponsorLead.count(),
      prisma.communitySubmission.count(),
      prisma.speaker.count(),
      prisma.sponsor.count()
    ]);

    // Intentar obtener el conteo de surveys de manera segura
    let surveysCount = 0;
    try {
      surveysCount = await (prisma as any).surveyResponse.count();
    } catch (e) {
      console.warn('SurveyResponse table not available yet, defaulting surveys count to 0');
      surveysCount = 0;
    }

    const stats = {
      users: usersCount,
      sessions: sessionsCount,
      questions: questionsCount,
      leads: leadsCount,
      surveys: surveysCount,
      community: communityCount,
      speakers: speakersCount,
      sponsors: sponsorsCount
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Error in /admin/stats:', error);
    next(error);
  }
});
