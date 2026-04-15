import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { pdfRateLimiter } from '../middleware/rateLimit.js';

export const certificateRouter = Router();

// ─── Configuración de certificados por rol ───
// Cada tipo de certificado corresponde a una plantilla visual distinta:
//   1. ASSISTANT          → "Certificado de Asistencia / Certificate of Attendance"
//   2. SPEAKER            → "Certificado de Faculty / Faculty Certificate"
//   3. ASSISTANT_SURGICAL → "Certificado de Observación Quirúrgica / Certificate of Surgical Observership"
//   4. ASSISTANT_VIRTUAL  → "Certificado de Participación Virtual / Certificate of Virtual Participation"
//   5. COMMITTEE / STAFF / SPONSOR / ADMIN → usan el certificado de asistencia como base

interface RoleCertConfig {
  mainTitleEs: string;
  mainTitleEn: string;
  bodyEs: string;
  bodyEn: string;
  hours: string;
  templateFileName: string;
  nameYRatio: number;
  nameMaxWidthRatio: number;
  nameBaseFontSize: number;
  nameMinFontSize: number;
  color: { r: number; g: number; b: number };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certificateAssetsDir = path.resolve(__dirname, '../../../assets/certificates');

const roleConfig: Record<string, RoleCertConfig> = {
  ASSISTANT: {
    mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
    mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
    bodyEs: 'Participó como asistente presencial en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated as an on-site attendee at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
    hours: '30',
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.569,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },  // púrpura (estilo del diploma)
  },
  SPEAKER: {
    mainTitleEs: 'CERTIFICADO DE FACULTY',
    mainTitleEn: 'FACULTY CERTIFICATE',
    bodyEs: 'Participó como conferencista en RINOMED 2026, contribuyendo con conferencias y participación académica en cirugía nasal avanzada. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated as faculty in RINOMED 2026, contributing with lectures and academic participation in advanced nasal surgery. Including live surgical demonstrations with real-time decision-making.',
    hours: '20',
    templateFileName: 'RM-certificado-faculty.png',
    nameYRatio: 0.542,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  ASSISTANT_SURGICAL: {
    mainTitleEs: 'CERTIFICADO DE OBSERVACIÓN QUIRÚRGICA',
    mainTitleEn: 'CERTIFICATE OF SURGICAL OBSERVERSHIP',
    bodyEs: 'Participó como observador en quirófano durante RINOMED 2026, con acceso a cirugías en vivo y análisis intraoperatorio en rinoplastia avanzada. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated as an operating room observer during RINOMED 2026, with access to live surgeries and intraoperative analysis in advanced rhinoplasty. Including live surgical demonstrations with real-time decision-making.',
    hours: '40',
    templateFileName: 'RM-certificado-observacion-quirurgica.png',
    nameYRatio: 0.555,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  ASSISTANT_VIRTUAL: {
    mainTitleEs: 'CERTIFICADO DE PARTICIPACIÓN VIRTUAL',
    mainTitleEn: 'CERTIFICATE OF VIRTUAL PARTICIPATION',
    bodyEs: 'Participó en modalidad virtual en RINOMED 2026, incluyendo transmisiones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated virtually in RINOMED 2026. Including live streaming of surgeries with real-time decision-making.',
    hours: '25',
    templateFileName: 'RM-certificado-virtual.png',
    nameYRatio: 0.541,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  COMMITTEE: {
    mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
    mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
    bodyEs: 'Participó como miembro del comité científico en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated as a scientific committee member at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
    hours: '35',
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  STAFF: {
    mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
    mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
    bodyEs: 'Participó como personal de apoyo en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026.',
    bodyEn: 'This is to certify that participated as support staff at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026.',
    hours: '15',
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  SPONSOR: {
    mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
    mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
    bodyEs: 'Participó como patrocinador en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026.',
    bodyEn: 'This is to certify that participated as a sponsor at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026.',
    hours: '10',
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
  ADMIN: {
    mainTitleEs: 'CERTIFICADO DE ASISTENCIA',
    mainTitleEn: 'CERTIFICATE OF ATTENDANCE',
    bodyEs: 'Participó como organizador en RINOMED 2026, Curso Internacional de Rinoplastia y Cirugía Plástica Facial, realizado en Medellín, Colombia, los días 17 y 18 de abril de 2026, con acceso al programa académico y transmisión en vivo de cirugías. Incluyendo demostraciones quirúrgicas en vivo con toma de decisiones en tiempo real.',
    bodyEn: 'This is to certify that participated as an organizer at RINOMED 2026, International Course on Rhinoplasty and Facial Plastic Surgery, held in Medellín, Colombia, on April 17–18, 2026, with access to the academic program and live surgery streaming. Including live surgical demonstrations with real-time decision-making.',
    hours: '45',
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
    color: { r: 0.44, g: 0.22, b: 0.44 },
  },
};

// GET /v1/certificate – devuelve metadata JSON del certificado
certificateRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const [user, eventInfo] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user!.id } }),
      prisma.eventInfo.findFirst(),
    ]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
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
  } catch (error) {
    return next(error);
  }
});

// GET /v1/certificate/pdf – genera y descarga el PDF del certificado
certificateRouter.get('/pdf', requireAuth, pdfRateLimiter, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user!.id } }),
    ]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const config = roleConfig[user.role];
    const templatePath = path.join(certificateAssetsDir, config.templateFileName);
    const templateBytes = await readFile(templatePath);

    const pdfDoc = await PDFDocument.create();
    const isJpeg = /\.jpe?g$/i.test(config.templateFileName);
    const templateImage = isJpeg
      ? await pdfDoc.embedJpg(templateBytes)
      : await pdfDoc.embedPng(templateBytes);
    const { width, height } = templateImage.scale(1);
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const nameText = user.name.toUpperCase();
    const maxNameWidth = width * config.nameMaxWidthRatio;
    const minFontSize = config.nameMinFontSize;
    let fontSize = config.nameBaseFontSize;

    while (fontSize > minFontSize && nameFont.widthOfTextAtSize(nameText, fontSize) > maxNameWidth) {
      fontSize -= 1;
    }

    const textWidth = nameFont.widthOfTextAtSize(nameText, fontSize);
    const nameX = (width - textWidth) / 2;
    const nameY = height * config.nameYRatio - fontSize / 3;

    page.drawText(nameText, {
      x: nameX,
      y: nameY,
      size: fontSize,
      font: nameFont,
      color: rgb(1, 1, 1),
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
