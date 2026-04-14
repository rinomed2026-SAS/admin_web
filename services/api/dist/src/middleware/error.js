import { ZodError } from 'zod';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: err.flatten() });
    }
    // Log only the message + name to avoid flooding stdout
    if (err instanceof Error) {
        console.error(`[ERR] ${err.name}: ${err.message}`);
    }
    else {
        console.error('[ERR] Unknown error', err);
    }
    return res.status(500).json({ message: 'Internal server error' });
}
