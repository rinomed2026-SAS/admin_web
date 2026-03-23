import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { toCsv } from '../lib/csv.js';
export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));
const sessionSchema = z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    room: z.string(),
    title: z.string(),
    topic: z.string(),
    level: z.string(),
    description: z.string()
});
adminRouter.get('/sessions', async (_req, res, next) => {
    try {
        const sessions = await prisma.session.findMany({ orderBy: [{ day: 'asc' }, { startTime: 'asc' }] });
        res.json({ data: sessions });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post('/sessions', async (req, res, next) => {
    try {
        const data = sessionSchema.parse(req.body);
        const session = await prisma.session.create({ data: { ...data, day: new Date(data.day) } });
        res.status(201).json({ data: session });
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete('/sessions/:id', async (req, res, next) => {
    try {
        await prisma.session.delete({ where: { id: req.params.id } });
        res.json({ message: 'Session deleted' });
    }
    catch (error) {
        next(error);
    }
});
const speakerSchema = z.object({
    name: z.string(),
    country: z.string(),
    specialty: z.string(),
    bio: z.string(),
    photoUrl: z.string()
});
adminRouter.get('/speakers', async (_req, res, next) => {
    try {
        const speakers = await prisma.speaker.findMany({ orderBy: { name: 'asc' } });
        res.json({ data: speakers });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post('/speakers', async (req, res, next) => {
    try {
        const data = speakerSchema.parse(req.body);
        const speaker = await prisma.speaker.create({ data });
        res.status(201).json({ data: speaker });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put('/speakers/:id', async (req, res, next) => {
    try {
        const data = speakerSchema.parse(req.body);
        const speaker = await prisma.speaker.update({ where: { id: req.params.id }, data });
        res.json({ data: speaker });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete('/speakers/:id', async (req, res, next) => {
    try {
        await prisma.speaker.delete({ where: { id: req.params.id } });
        res.json({ message: 'Speaker deleted' });
    }
    catch (error) {
        next(error);
    }
});
const sponsorSchema = z.object({
    name: z.string(),
    tier: z.string(),
    description: z.string(),
    websiteUrl: z.string(),
    products: z.string()
});
adminRouter.get('/sponsors', async (_req, res, next) => {
    try {
        const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: 'asc' } });
        res.json({ data: sponsors });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post('/sponsors', async (req, res, next) => {
    try {
        const data = sponsorSchema.parse(req.body);
        const sponsor = await prisma.sponsor.create({ data });
        res.status(201).json({ data: sponsor });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put('/sponsors/:id', async (req, res, next) => {
    try {
        const data = sponsorSchema.parse(req.body);
        const sponsor = await prisma.sponsor.update({ where: { id: req.params.id }, data });
        res.json({ data: sponsor });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete('/sponsors/:id', async (req, res, next) => {
    try {
        await prisma.sponsor.delete({ where: { id: req.params.id } });
        res.json({ message: 'Sponsor deleted' });
    }
    catch (error) {
        next(error);
    }
});
const hotelSchema = z.object({
    name: z.string(),
    rating: z.number(),
    priceMinCop: z.number(),
    priceMaxCop: z.number(),
    distanceKm: z.number(),
    amenities: z.string(),
    contact: z.string(),
    promoCode: z.string()
});
adminRouter.get('/hotels', async (_req, res, next) => {
    try {
        const hotels = await prisma.hotel.findMany({ orderBy: { rating: 'desc' } });
        res.json({ data: hotels });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post('/hotels', async (req, res, next) => {
    try {
        const data = hotelSchema.parse(req.body);
        const hotel = await prisma.hotel.create({ data });
        res.status(201).json({ data: hotel });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put('/hotels/:id', async (req, res, next) => {
    try {
        const data = hotelSchema.parse(req.body);
        const hotel = await prisma.hotel.update({ where: { id: req.params.id }, data });
        res.json({ data: hotel });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete('/hotels/:id', async (req, res, next) => {
    try {
        await prisma.hotel.delete({ where: { id: req.params.id } });
        res.json({ message: 'Hotel deleted' });
    }
    catch (error) {
        next(error);
    }
});
const tourismSchema = z.object({
    name: z.string(),
    category: z.string(),
    duration: z.string(),
    highlights: z.string(),
    description: z.string()
});
adminRouter.get('/tourism', async (_req, res, next) => {
    try {
        const tourism = await prisma.tourism.findMany({ orderBy: { name: 'asc' } });
        res.json({ data: tourism });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post('/tourism', async (req, res, next) => {
    try {
        const data = tourismSchema.parse(req.body);
        const item = await prisma.tourism.create({ data });
        res.status(201).json({ data: item });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put('/tourism/:id', async (req, res, next) => {
    try {
        const data = tourismSchema.parse(req.body);
        const item = await prisma.tourism.update({ where: { id: req.params.id }, data });
        res.json({ data: item });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete('/tourism/:id', async (req, res, next) => {
    try {
        await prisma.tourism.delete({ where: { id: req.params.id } });
        res.json({ message: 'Tourism deleted' });
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get('/questions/export.csv', async (_req, res, next) => {
    try {
        const questions = await prisma.question.findMany({
            include: { session: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
        const csv = toCsv(questions.map((q) => ({
            id: q.id,
            user: q.user.email,
            session: q.session.title,
            text: q.text,
            createdAt: q.createdAt.toISOString()
        })));
        res.type('text/csv').send(csv);
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get('/leads/export.csv', async (_req, res, next) => {
    try {
        const leads = await prisma.sponsorLead.findMany({
            include: { user: true, sponsor: true },
            orderBy: { createdAt: 'desc' }
        });
        const csv = toCsv(leads.map((lead) => ({
            id: lead.id,
            user: lead.user.email,
            sponsor: lead.sponsor.name,
            createdAt: lead.createdAt.toISOString()
        })));
        res.type('text/csv').send(csv);
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
