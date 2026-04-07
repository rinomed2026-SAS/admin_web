import { ZodError } from 'zod';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: err.flatten() });
    }
    // Log del error pero nunca fallar completamente
    console.error('Unhandled error:', err);
    // Devolver una respuesta genérica pero útil
    return res.status(200).json({
        message: 'Servicio temporalmente limitado',
        data: null
    });
}
