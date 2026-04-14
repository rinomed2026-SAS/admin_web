import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { message: 'Too many login attempts. Try again soon.' },
  validate: { xForwardedForHeader: false }
});

// Certificate PDF generation is CPU-heavy (pdf-lib + QR).
// Limit to 5 requests per minute per IP.
export const pdfRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: { message: 'Too many PDF requests. Try again in a minute.' },
  validate: { xForwardedForHeader: false }
});
