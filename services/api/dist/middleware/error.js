import { ZodError } from 'zod';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: err.flatten() });
    }
    console.error(err);
    return res.status(500).json({ message: 'Unexpected server error' });
}
