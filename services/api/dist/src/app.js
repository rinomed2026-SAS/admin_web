import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './lib/config.js';
import { prisma } from './lib/prisma.js';
import { privacyRouter } from './routes/privacy.js';
import { authRouter } from './routes/auth.js';
import { meRouter } from './routes/me.js';
import { sessionsRouter } from './routes/sessions.js';
import { speakersRouter } from './routes/speakers.js';
import { favoritesRouter } from './routes/favorites.js';
import { questionsRouter } from './routes/questions.js';
import { sponsorsRouter } from './routes/sponsors.js';
import { infoRouter } from './routes/info.js';
import { certificateRouter } from './routes/certificate.js';
import { statisticsRouter } from './routes/statistics.js';
import { adminRouter } from './routes/admin.js';
import { communityRouter } from './routes/community.js';
import { surveyRouter } from './routes/survey.js';
import { errorHandler } from './middleware/error.js';
export const app = express();
// Trust Railway's reverse proxy so express-rate-limit works correctly
app.set('trust proxy', 1);
// ── GLOBAL RATE LIMITER ─────────────────────────────────────────────────
// 300 req/min per IP — prevents any single client from drowning the server
const globalLimiter = rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, slow down.' },
    validate: { xForwardedForHeader: false },
});
app.use(globalLimiter);
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('tiny'));
// 2 MB is more than enough for JSON payloads; 20 MB was dangerously large
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(privacyRouter);
// ── HEALTH CHECK (pings DB to verify real connectivity) ─────────────────
app.get('/health', async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
    catch {
        res.status(503).json({ status: 'degraded', timestamp: new Date().toISOString() });
    }
});
app.use('/v1/auth', authRouter);
app.use('/v1', meRouter);
app.use('/v1/sessions', sessionsRouter);
app.use('/v1/speakers', speakersRouter);
app.use('/v1/favorites', favoritesRouter);
app.use('/v1', questionsRouter);
app.use('/v1/sponsors', sponsorsRouter);
app.use('/v1', infoRouter);
app.use('/v1/certificate', certificateRouter);
app.use('/v1/statistics', statisticsRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1/community', communityRouter);
app.use('/v1/survey', surveyRouter);
app.use(errorHandler);
