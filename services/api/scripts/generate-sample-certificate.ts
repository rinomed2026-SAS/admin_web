import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../assets/certificates');
const outputDir = path.resolve(assetsDir, 'examples');

type Role =
  | 'ASSISTANT'
  | 'ASSISTANT_SURGICAL'
  | 'ASSISTANT_VIRTUAL'
  | 'SPEAKER'
  | 'COMMITTEE'
  | 'STAFF'
  | 'SPONSOR'
  | 'ADMIN';

const templateByRole: Record<Role, {
  templateFileName: string;
  nameYRatio: number;
  nameMaxWidthRatio: number;
  nameBaseFontSize: number;
  nameMinFontSize: number;
}> = {
  ASSISTANT: {
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.569,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  ASSISTANT_SURGICAL: {
    templateFileName: 'RM-certificado-observacion-quirurgica.png',
    nameYRatio: 0.555,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  ASSISTANT_VIRTUAL: {
    templateFileName: 'RM-certificado-virtual.png',
    nameYRatio: 0.541,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  SPEAKER: {
    templateFileName: 'RM-certificado-faculty.png',
    nameYRatio: 0.542,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  COMMITTEE: {
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  STAFF: {
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  SPONSOR: {
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
  ADMIN: {
    templateFileName: 'RM-certificado-asistencia.png',
    nameYRatio: 0.548,
    nameMaxWidthRatio: 0.72,
    nameBaseFontSize: 30,
    nameMinFontSize: 18,
  },
};

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function normalizeRole(input: string | undefined): Role {
  const role = (input ?? 'ASSISTANT').toUpperCase() as Role;
  if (!(role in templateByRole)) {
    throw new Error(`Rol inválido: ${input}. Usa uno de: ${Object.keys(templateByRole).join(', ')}`);
  }
  return role;
}

async function main() {
  const role = normalizeRole(getArg('--role'));
  const name = getArg('--name') ?? 'DRA. VALENTINA RESTREPO';
  const outputName = getArg('--output') ?? `certificado-ejemplo-${role.toLowerCase()}.pdf`;

  const templateConfig = templateByRole[role];
  const templatePath = path.join(assetsDir, templateConfig.templateFileName);
  const templateBytes = await readFile(templatePath);

  const pdfDoc = await PDFDocument.create();
  const isJpeg = /\.jpe?g$/i.test(templateConfig.templateFileName);
  const templateImage = isJpeg
    ? await pdfDoc.embedJpg(templateBytes)
    : await pdfDoc.embedPng(templateBytes);

  const { width, height } = templateImage.scale(1);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(templateImage, { x: 0, y: 0, width, height });

  const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const nameText = name.toUpperCase();
  const maxNameWidth = width * templateConfig.nameMaxWidthRatio;
  const minFontSize = templateConfig.nameMinFontSize;
  let fontSize = templateConfig.nameBaseFontSize;

  while (fontSize > minFontSize && nameFont.widthOfTextAtSize(nameText, fontSize) > maxNameWidth) {
    fontSize -= 1;
  }

  const textWidth = nameFont.widthOfTextAtSize(nameText, fontSize);
  const nameX = (width - textWidth) / 2;
  const nameY = height * templateConfig.nameYRatio - fontSize / 3;

  page.drawText(nameText, {
    x: nameX,
    y: nameY,
    size: fontSize,
    font: nameFont,
    color: rgb(1, 1, 1),
  });

  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, outputName);
  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);

  console.log(`PDF generado: ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
