import { Router } from 'express';

export const privacyRouter = Router();

privacyRouter.get('/privacy', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Política de Privacidad - RINOMED 2026</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 920px; margin: 32px auto; padding: 0 16px; line-height: 1.6; }
      h1 { color: #1C1C1C; }
      a { color: #C07AB8; }
    </style>
  </head>
  <body>
    <h1>Política de Privacidad</h1>
    <p>RINOMED 2026 recopila información básica de cuenta (nombre y correo) para autenticación y uso de la app. No solicitamos permisos de cámara ni ubicación. Los datos se usan para personalizar la experiencia, gestionar sesiones favoritas y generar certificados.</p>
    <p>Si tienes preguntas, contáctanos en <a href="mailto:info@rinomed2026.com">info@rinomed2026.com</a>.</p>
  </body>
</html>`);
});
