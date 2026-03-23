import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { message: 'Too many login attempts. Try again soon.' },
  validate: { xForwardedForHeader: false }
});
