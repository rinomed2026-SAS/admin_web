import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const certificateRouter = Router();

// Configuración de roles y colores
const roleConfig: Record<string, { title: string; subtitle: string; hours: string; color: { r: number; g: number; b: number } }> = {
  ASSISTANT: { title: 'Asistente', subtitle: 'asistente', hours: '30', color: { r: 0.2, g: 0.6, b: 0.9 } },
  ASSISTANT_SURGICAL: { title: 'Asistente Quirúrgico', subtitle: 'asistente quirúrgico', hours: '40', color: { r: 0.1, g: 0.7, b: 0.3 } },
  ASSISTANT_VIRTUAL: { title: 'Asistente Virtual', subtitle: 'asistente virtual', hours: '25', color: { r: 0.5, g: 0.3, b: 0.8 } },
  SPEAKER: { title: 'Ponente', subtitle: 'ponente', hours: '20', color: { r: 0.8, g: 0.1, b: 0.2 } },
  COMMITTEE: { title: 'Comité Científico', subtitle: 'miembro del comité científico', hours: '35', color: { r: 0.9, g: 0.5, b: 0.1 } },
  STAFF: { title: 'Personal Staff', subtitle: 'personal de apoyo', hours: '15', color: { r: 0.5, g: 0.5, b: 0.5 } },
  SPONSOR: { title: 'Patrocinador', subtitle: 'patrocinador', hours: '10', color: { r: 0.8, g: 0.7, b: 0.1 } },
  ADMIN: { title: 'Organizador', subtitle: 'organizador', hours: '45', color: { r: 0.8, g: 0.2, b: 0.3 } }
};

// GET /v1/certificate – devuelve metadata JSON del certificado
certificateRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const eventInfo = await prisma.eventInfo.findFirst();
    const validationCode = `RINO-${user.id.slice(0, 8).toUpperCase()}`;
    const config = roleConfig[user.role];
    
    const certificate = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      event: {
        name: eventInfo?.name ?? 'RINOMED 2026',
        city: eventInfo?.city ?? 'Medellín, Colombia',
        dates: eventInfo?.dates ?? '17–18 de abril de 2026',
        academicHours: config.hours + ' horas académicas'
      },
      certificate: {
        validationCode,
        title: config.title,
        subtitle: config.subtitle,
        hours: config.hours,
        issuedAt: new Date().toISOString(),
        validationUrl: `${process.env.APP_URL}/certificate/${validationCode}`
      }
    };

    return res.json({ data: certificate });
  } catch (error) {
    return next(error);
  }
});

// GET /v1/certificate/pdf – genera y descarga el PDF del certificado
certificateRouter.get('/pdf', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const eventInfo = await prisma.eventInfo.findFirst();
    
    // Obtener configuración personalizable del certificado
    let certificateConfig = await prisma.certificateConfig.findFirst();
    if (!certificateConfig) {
      // Crear configuración por defecto si no existe
      certificateConfig = await prisma.certificateConfig.create({
        data: {
          mainTitle: 'CERTIFICADO DE PARTICIPACIÓN',
          introText: 'Se certifica que',
          participationText: 'ha participado como {subtitle} con una intensidad de {hours} horas',
          eventText: 'en {eventName}',
          issuedText: 'Expedido en {city}, {date}',
          validationText: 'Código de validación:'
        }
      });
    }
    
    const validationCode = `RINO-${user.id.slice(0, 8).toUpperCase()}`;
    const config = roleConfig[user.role];
    
    const eventName = eventInfo?.name ?? 'RINOMED 2026';
    const eventCity = eventInfo?.city ?? 'Medellín, Colombia';
    const eventDates = eventInfo?.dates ?? '17–18 de abril de 2026';
    const issueDate = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Crear PDF en formato landscape A4
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape: 842x595 points
    const { width, height } = page.getSize();

    // Fuentes
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Color de acento según el rol
    const accentColor = rgb(config.color.r, config.color.g, config.color.b);

    // Borde decorativo
    const borderThickness = 8;
    page.drawRectangle({
      x: borderThickness / 2,
      y: borderThickness / 2,
      width: width - borderThickness,
      height: height - borderThickness,
      borderColor: accentColor,
      borderWidth: borderThickness,
    });

    // Título principal del certificado
    page.drawText(certificateConfig.mainTitle, {
      x: width / 2 - (certificateConfig.mainTitle.length * 6),
      y: height - 80,
      size: 24,
      font: titleFont,
      color: accentColor,
    });

    // Logo placeholder (rectángulo)
    page.drawRectangle({
      x: width / 2 - 40,
      y: height - 150,
      width: 80,
      height: 60,
      color: rgb(0.9, 0.9, 0.9),
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
    });
    page.drawText('LOGO', {
      x: width / 2 - 15,
      y: height - 125,
      size: 12,
      font: normalFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Texto principal
    page.drawText(certificateConfig.introText, {
      x: width / 2 - (certificateConfig.introText.length * 4),
      y: height - 200,
      size: 16,
      font: normalFont,
      color: rgb(0, 0, 0),
    });

    // Nombre del usuario
    page.drawText(user.name.toUpperCase(), {
      x: width / 2 - (user.name.length * 8),
      y: height - 240,
      size: 28,
      font: titleFont,
      color: rgb(0, 0, 0),
    });

    // Texto de participación (reemplazar placeholders)
    const participationText = certificateConfig.participationText
      .replace('{subtitle}', config.subtitle)
      .replace('{hours}', config.hours);
    page.drawText(participationText, {
      x: width / 2 - (participationText.length * 4),
      y: height - 290,
      size: 16,
      font: normalFont,
      color: rgb(0, 0, 0),
    });

    // Información del evento (reemplazar placeholders)
    const eventTextContent = certificateConfig.eventText.replace('{eventName}', eventName);
    page.drawText(eventTextContent, {
      x: width / 2 - (eventTextContent.length * 5),
      y: height - 320,
      size: 18,
      font: boldFont,
      color: accentColor,
    });

    page.drawText(`${eventCity} • ${eventDates}`, {
      x: width / 2 - 80,
      y: height - 350,
      size: 14,
      font: normalFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Fecha de emisión (reemplazar placeholders)
    const issuedTextContent = certificateConfig.issuedText
      .replace('{city}', eventCity.split(',')[0]) // Solo la ciudad, sin el país
      .replace('{date}', issueDate);
    page.drawText(issuedTextContent, {
      x: width / 2 - (issuedTextContent.length * 3),
      y: height - 420,
      size: 12,
      font: normalFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Código QR
    const validationUrl = `${process.env.APP_URL}/certificate/${validationCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, { width: 100 });
    const qrCodeImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrCodeBytes = Buffer.from(qrCodeImage, 'base64');
    const qrImage = await pdfDoc.embedPng(qrCodeBytes);

    page.drawImage(qrImage, {
      x: width - 150,
      y: 50,
      width: 80,
      height: 80,
    });

    // Código de validación visible
    page.drawText(certificateConfig.validationText, {
      x: width - 200,
      y: 140,
      size: 10,
      font: normalFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText(validationCode, {
      x: width - 200,
      y: 125,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Generar PDF
    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificado-${user.name.replace(/\s+/g, '-')}.pdf"`);
    
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
});
