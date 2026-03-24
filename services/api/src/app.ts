import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './lib/config.js';
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
import { errorHandler } from './middleware/error.js';

export const app = express();

// Trust Railway's reverse proxy so express-rate-limit works correctly
app.set('trust proxy', 1);

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
app.use(express.json({ limit: '12mb' }));

app.use(privacyRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

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

app.use(errorHandler);
