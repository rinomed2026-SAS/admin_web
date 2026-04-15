import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { pdfRateLimiter } from '../middleware/rateLimit.js';
export const certificateRouter = Router();
const roleConfig = {
    ASSISTANT: {
        mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
        mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
        bodyEs: 'Participó como asistente presencial en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated as an on-site attendee at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
        hours: '30',
        color: { r: 0.44, g: 0.22, b: 0.44 }, // púrpura (estilo del diploma)
    },
    SPEAKER: {
        mainTitleEs: 'CERTIFICADO DE FACULTY',
        mainTitleEn: 'FACULTY CERTIFICATE',
        bodyEs: 'Participó como conferencista en RINOMED 2026, contribuyendo con conferencias y participación académica en cirugía nasal avanzada. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated as faculty in RINOMED 2026, contributing with lectures and academic participation in advanced nasal surgery. Including live surgical demonstrations with real-time decision-making.',
        hours: '20',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    ASSISTANT_SURGICAL: {
        mainTitleEs: 'CERTIFICADO DE OBSERVACIÓN QUIRÚRGICA',
        mainTitleEn: 'CERTIFICATE OF SURGICAL OBSERVERSHIP',
        bodyEs: 'Participó como observador en quirófano durante RINOMED 2026, con acceso a cirugías en vivo y análisis intraoperatorio en rinoplastia avanzada. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated as an operating room observer during RINOMED 2026, with access to live surgeries and intraoperative analysis in advanced rhinoplasty. Including live surgical demonstrations with real-time decision-making.',
        hours: '40',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    ASSISTANT_VIRTUAL: {
        mainTitleEs: 'CERTIFICADO DE PARTICIPACIÓN VIRTUAL',
        mainTitleEn: 'CERTIFICATE OF VIRTUAL PARTICIPATION',
        bodyEs: 'Participó en modalidad virtual en RINOMED 2026, incluyendo transmisiones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated virtually in RINOMED 2026. Including live streaming of surgeries with real-time decision-making.',
        hours: '25',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    COMMITTEE: {
        mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
        mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
        bodyEs: 'Participó como miembro del comité científico en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated as a scientific committee member at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
        hours: '35',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    STAFF: {
        mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
        mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
        bodyEs: 'Participó como personal de apoyo en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026.',
        bodyEn: 'This is to certify that participated as support staff at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026.',
        hours: '15',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    SPONSOR: {
        mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
        mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
        bodyEs: 'Participó como patrocinador en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026.',
        bodyEn: 'This is to certify that participated as a sponsor at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026.',
        hours: '10',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
    ADMIN: {
        mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
        mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
        bodyEs: 'Participó como organizador en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
        bodyEn: 'This is to certify that participated as an organizer at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
        hours: '45',
        color: { r: 0.44, g: 0.22, b: 0.44 },
    },
};
// GET /v1/certificate – devuelve metadata JSON del certificado
certificateRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        const [user, eventInfo] = await Promise.all([
            prisma.user.findUnique({ where: { id: req.user.id } }),
            prisma.eventInfo.findFirst(),
        ]);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
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
                mainTitleEs: config.mainTitleEs,
                mainTitleEn: config.mainTitleEn,
                bodyEs: config.bodyEs,
                bodyEn: config.bodyEn,
                hours: config.hours,
                issuedAt: new Date().toISOString(),
                validationUrl: `${process.env.APP_URL}/certificate/${validationCode}`
            }
        };
        return res.json({ data: certificate });
    }
    catch (error) {
        return next(error);
    }
});
// GET /v1/certificate/pdf – genera y descarga el PDF del certificado
certificateRouter.get('/pdf', requireAuth, pdfRateLimiter, async (req, res, next) => {
    try {
        // Run both DB lookups in parallel
        const [user, eventInfo] = await Promise.all([
            prisma.user.findUnique({ where: { id: req.user.id } }),
            prisma.eventInfo.findFirst(),
        ]);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const validationCode = `RINO-${user.id.slice(0, 8).toUpperCase()}`;
        const config = roleConfig[user.role];
        const eventName = eventInfo?.name ?? 'RINOMED 2026';
        const eventCity = eventInfo?.city ?? 'Medellín, Colombia';
        const eventDates = eventInfo?.dates ?? '17–18 de abril de 2026';
        // ── Utilidad: dividir texto largo en líneas que quepan en un ancho dado ──
        function wrapText(text, font, fontSize, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            for (const word of words) {
                const test = currentLine ? `${currentLine} ${word}` : word;
                if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
                    currentLine = test;
                }
                else {
                    if (currentLine)
                        lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine)
                lines.push(currentLine);
            return lines;
        }
        // ── Utilidad: dibujar líneas centradas ──
        function drawCenteredLines(page, lines, startY, lineHeight, font, fontSize, color, pageWidth) {
            let y = startY;
            for (const line of lines) {
                const textWidth = font.widthOfTextAtSize(line, fontSize);
                page.drawText(line, { x: (pageWidth - textWidth) / 2, y, size: fontSize, font, color });
                y -= lineHeight;
            }
            return y;
        }
        // ── Crear PDF landscape ──
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([842, 595]); // A4 landscape
        const { width, height } = page.getSize();
        const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const accentColor = rgb(config.color.r, config.color.g, config.color.b);
        const darkColor = rgb(0.15, 0.15, 0.15);
        const grayColor = rgb(0.35, 0.35, 0.35);
        const margin = 80;
        const maxTextWidth = width - margin * 2;
        // ── Fondo degradado (simulado con rectángulos) ──
        page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.22, 0.10, 0.28) });
        // ── Borde decorativo ──
        page.drawRectangle({
            x: 6, y: 6, width: width - 12, height: height - 12,
            borderColor: rgb(0.55, 0.35, 0.60), borderWidth: 2,
        });
        let cursorY = height - 60;
        // ── Título principal en español (grande, con tracking) ──
        const titleEsSize = 20;
        const titleEsWidth = titleFont.widthOfTextAtSize(config.mainTitleEs, titleEsSize);
        page.drawText(config.mainTitleEs, {
            x: (width - titleEsWidth) / 2, y: cursorY,
            size: titleEsSize, font: titleFont, color: rgb(1, 1, 1),
        });
        cursorY -= 24;
        // ── Título en inglés (más pequeño) ──
        const titleEnSize = 13;
        const titleEnWidth = normalFont.widthOfTextAtSize(config.mainTitleEn, titleEnSize);
        page.drawText(config.mainTitleEn, {
            x: (width - titleEnWidth) / 2, y: cursorY,
            size: titleEnSize, font: normalFont, color: rgb(0.8, 0.75, 0.82),
        });
        cursorY -= 32;
        // ── "Se certifica que el(la) Dr(a)." ──
        const certifyText = 'Se certifica que el(la) Dr(a).';
        const certifyWidth = normalFont.widthOfTextAtSize(certifyText, 12);
        page.drawText(certifyText, {
            x: (width - certifyWidth) / 2, y: cursorY,
            size: 12, font: normalFont, color: rgb(0.85, 0.85, 0.85),
        });
        cursorY -= 30;
        // ── Nombre del usuario (grande, resaltado) ──
        const nameSize = 24;
        const nameText = user.name.toUpperCase();
        const nameWidth = titleFont.widthOfTextAtSize(nameText, nameSize);
        // Fondo semitransparente para el nombre
        page.drawRectangle({
            x: (width - nameWidth) / 2 - 16,
            y: cursorY - 6,
            width: nameWidth + 32,
            height: 32,
            color: rgb(0.35, 0.20, 0.40),
        });
        page.drawText(nameText, {
            x: (width - nameWidth) / 2, y: cursorY,
            size: nameSize, font: titleFont, color: rgb(1, 1, 1),
        });
        cursorY -= 40;
        // ── Cuerpo del certificado en español (párrafo multilínea centrado) ──
        const bodyEsLines = wrapText(config.bodyEs, normalFont, 10, maxTextWidth);
        cursorY = drawCenteredLines(page, bodyEsLines, cursorY, 14, normalFont, 10, rgb(0.9, 0.9, 0.9), width);
        cursorY -= 10;
        // ── Cuerpo en inglés (más pequeño, gris claro) ──
        const bodyEnLines = wrapText(config.bodyEn, normalFont, 8, maxTextWidth);
        cursorY = drawCenteredLines(page, bodyEnLines, cursorY, 12, normalFont, 8, rgb(0.65, 0.62, 0.68), width);
        cursorY -= 20;
        // ── COMITÉ ORGANIZADOR ──
        const comiteText = 'COMITÉ ORGANIZADOR';
        const comiteWidth = boldFont.widthOfTextAtSize(comiteText, 10);
        page.drawText(comiteText, {
            x: (width - comiteWidth) / 2, y: cursorY,
            size: 10, font: boldFont, color: rgb(1, 1, 1),
        });
        cursorY -= 50;
        // ── Firmas (dos columnas) ──
        const leftX = width * 0.25;
        const rightX = width * 0.75;
        // Línea de firma izquierda
        page.drawLine({
            start: { x: leftX - 80, y: cursorY + 10 },
            end: { x: leftX + 80, y: cursorY + 10 },
            color: rgb(0.6, 0.5, 0.65), thickness: 0.5,
        });
        const nameGL = 'Guillermo Landinez';
        const nGLw = boldFont.widthOfTextAtSize(nameGL, 9);
        page.drawText(nameGL, { x: leftX - nGLw / 2, y: cursorY - 4, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        const specGL = 'Otorrinolaringólogo y Cirujano Plástico Facial';
        const sGLw = normalFont.widthOfTextAtSize(specGL, 7);
        page.drawText(specGL, { x: leftX - sGLw / 2, y: cursorY - 16, size: 7, font: normalFont, color: rgb(0.75, 0.72, 0.78) });
        // Línea de firma derecha
        page.drawLine({
            start: { x: rightX - 80, y: cursorY + 10 },
            end: { x: rightX + 80, y: cursorY + 10 },
            color: rgb(0.6, 0.5, 0.65), thickness: 0.5,
        });
        const nameCU = 'Carlos Urzola';
        const nCUw = boldFont.widthOfTextAtSize(nameCU, 9);
        page.drawText(nameCU, { x: rightX - nCUw / 2, y: cursorY - 4, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        const specCU = 'Otorrinolaringólogo y Cirujano Plástico Facial';
        const sCUw = normalFont.widthOfTextAtSize(specCU, 7);
        page.drawText(specCU, { x: rightX - sCUw / 2, y: cursorY - 16, size: 7, font: normalFont, color: rgb(0.75, 0.72, 0.78) });
        // ── Código QR (esquina inferior derecha) ──
        const validationUrl = `${process.env.APP_URL}/certificate/${validationCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, { width: 100 });
        const qrCodeImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrCodeBytes = Buffer.from(qrCodeImage, 'base64');
        const qrImage = await pdfDoc.embedPng(qrCodeBytes);
        page.drawImage(qrImage, { x: width - 100, y: 12, width: 60, height: 60 });
        // Código de validación
        const valCodeWidth = normalFont.widthOfTextAtSize(validationCode, 7);
        page.drawText(validationCode, {
            x: width - 100 + (60 - valCodeWidth) / 2, y: 4,
            size: 7, font: normalFont, color: rgb(0.6, 0.6, 0.6),
        });
        // Generar PDF
        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificado-${user.name.replace(/\s+/g, '-')}.pdf"`);
        return res.send(Buffer.from(pdfBytes));
    }
    catch (error) {
        return next(error);
    }
});
