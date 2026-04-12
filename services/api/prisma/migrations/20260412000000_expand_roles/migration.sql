-- AlterEnum: expand Role from 4 to 8 types + create CertificateConfig
-- These changes were applied directly to the database

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ASSISTANT_SURGICAL';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'ASSISTANT_VIRTUAL';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SPEAKER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMMITTEE';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SPONSOR';

-- CreateTable
CREATE TABLE IF NOT EXISTS "CertificateConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mainTitle" TEXT NOT NULL DEFAULT 'CERTIFICADO DE PARTICIPACIÓN',
    "introText" TEXT NOT NULL DEFAULT 'Se certifica que',
    "participationText" TEXT NOT NULL DEFAULT 'ha participado como {subtitle} con una intensidad de {hours} horas',
    "eventText" TEXT NOT NULL DEFAULT 'en {eventName}',
    "issuedText" TEXT NOT NULL DEFAULT 'Expedido en {city}, {date}',
    "validationText" TEXT NOT NULL DEFAULT 'Código de validación:',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CertificateConfig_pkey" PRIMARY KEY ("id")
);
