import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const certificateRouter = Router();

async function loadAdminBackgroundAsPng(): Promise<Buffer | null> {
  const candidates = [
    path.resolve(process.cwd(), '..', '..', 'public', 'logo-rinomed.svg'),
    path.resolve(process.cwd(), 'public', 'logo-rinomed.svg')
  ];

  for (const candidate of candidates) {
    try {
      const svgBuffer = await readFile(candidate);
      const pngBuffer = await sharp(svgBuffer)
        .png({ quality: 100 })
        .resize({ width: 1400, fit: 'inside', withoutEnlargement: false })
        .toBuffer();
      return pngBuffer;
    } catch {
      continue;
    }
  }

  return null;
}

certificateRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const eventInfo = await prisma.eventInfo.findFirst();
    const validationCode = `RINO-${user.id.slice(0, 8).toUpperCase()}`;
    const eventName = eventInfo?.name ?? 'RINOMED 2026';
    const eventCity = eventInfo?.city ?? 'Medellín, Colombia';
    const eventDates = eventInfo?.dates ?? '17–18 de abril de 2026';
    const academicHours = eventInfo?.academicHours ?? '20 horas académicas';
    const issueDate = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const backgroundPng = await loadAdminBackgroundAsPng();

    const drawCentered = (text: string, y: number, size: number, font = fontRegular, color = rgb(0.12, 0.12, 0.12)) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size,
        font,
        color
      });
    };

    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.99, 0.99, 1) });

    if (backgroundPng) {
      const bgImage = await pdfDoc.embedPng(backgroundPng);
      const imgWidth = bgImage.width;
      const imgHeight = bgImage.height;
      const scale = Math.max(width / imgWidth, height / imgHeight) * 0.88;
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const drawX = (width - drawWidth) / 2;
      const drawY = (height - drawHeight) / 2;

      page.drawImage(bgImage, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
        opacity: 0.08
      });
    }

    page.drawRectangle({ x: 22, y: 22, width: width - 44, height: height - 44, borderWidth: 2, borderColor: rgb(0.07, 0.27, 0.45) });
    page.drawRectangle({ x: 32, y: 32, width: width - 64, height: height - 64, borderWidth: 1, borderColor: rgb(0.73, 0.8, 0.9) });

    page.drawRectangle({ x: 44, y: height - 110, width: width - 88, height: 56, color: rgb(0.07, 0.27, 0.45) });
    drawCentered('RINOMED 2026', height - 88, 20, fontBold, rgb(1, 1, 1));
    drawCentered('Curso Internacional de Rinoplastia y Cirugía Plástica Facial', height - 104, 11, fontRegular, rgb(0.91, 0.96, 1));

    drawCentered('CERTIFICADO DE PARTICIPACIÓN', height - 165, 29, fontBold, rgb(0.08, 0.18, 0.33));
    drawCentered('Se certifica que', height - 205, 15, fontRegular, rgb(0.2, 0.25, 0.32));
    drawCentered(user.name.toUpperCase(), height - 245, 26, fontBold, rgb(0.06, 0.16, 0.31));

    drawCentered('participó satisfactoriamente en el evento académico', height - 282, 14, fontRegular, rgb(0.2, 0.25, 0.32));
    drawCentered(eventName, height - 315, 15, fontBold, rgb(0.1, 0.2, 0.36));
    drawCentered(`${eventCity} | ${eventDates}`, height - 339, 12, fontRegular, rgb(0.25, 0.31, 0.39));

    page.drawRectangle({ x: 194, y: 218, width: 454, height: 38, color: rgb(0.93, 0.96, 0.99), borderWidth: 1, borderColor: rgb(0.75, 0.82, 0.9) });
    drawCentered(`Intensidad académica: ${academicHours}`, 231, 13, fontBold, rgb(0.09, 0.22, 0.38));

    page.drawLine({ start: { x: 120, y: 120 }, end: { x: 330, y: 120 }, thickness: 1, color: rgb(0.25, 0.3, 0.38) });
    page.drawLine({ start: { x: 512, y: 120 }, end: { x: 722, y: 120 }, thickness: 1, color: rgb(0.25, 0.3, 0.38) });
    page.drawText('Dirección Académica', { x: 165, y: 104, size: 11, font: fontRegular, color: rgb(0.32, 0.36, 0.42) });
    page.drawText('Comité Científico', { x: 573, y: 104, size: 11, font: fontRegular, color: rgb(0.32, 0.36, 0.42) });

    page.drawText(`Fecha de emisión: ${issueDate}`, { x: 58, y: 58, size: 10, font: fontRegular, color: rgb(0.36, 0.4, 0.47) });
    page.drawText(`Código de validación: ${validationCode}`, { x: 58, y: 42, size: 10, font: fontRegular, color: rgb(0.24, 0.28, 0.35) });

    page.drawRectangle({ x: width - 174, y: 38, width: 116, height: 116, color: rgb(1, 1, 1), borderWidth: 1, borderColor: rgb(0.7, 0.78, 0.88) });

    const qrDataUrl = await QRCode.toDataURL(validationCode);
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, { x: width - 166, y: 46, width: 100, height: 100 });
    page.drawText('Validación digital', { x: width - 160, y: 26, size: 9, font: fontRegular, color: rgb(0.36, 0.4, 0.47) });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="rinomed-certificado.pdf"');
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
});
