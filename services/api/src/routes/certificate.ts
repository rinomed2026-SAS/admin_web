import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const certificateRouter = Router();

certificateRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const eventInfo = await prisma.eventInfo.findFirst();
    const validationCode = `RINO-${user.id.slice(0, 8).toUpperCase()}`;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Certificado de Participación', {
      x: 180,
      y: 520,
      size: 28,
      font,
      color: rgb(0.12, 0.12, 0.12)
    });

    page.drawText(`Se certifica que`, { x: 260, y: 470, size: 16, font: fontRegular });
    page.drawText(user.name, { x: 220, y: 440, size: 22, font });

    page.drawText(`Participó en el evento ${eventInfo?.name ?? 'RINOMED 2026'}`, {
      x: 160,
      y: 400,
      size: 14,
      font: fontRegular
    });
    page.drawText('20 horas académicas', { x: 310, y: 370, size: 14, font: fontRegular });
    page.drawText(`Código de validación: ${validationCode}`, { x: 240, y: 340, size: 12, font: fontRegular });

    const qrDataUrl = await QRCode.toDataURL(validationCode);
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, { x: 680, y: 320, width: 100, height: 100 });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="rinomed-certificado.pdf"');
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
});
