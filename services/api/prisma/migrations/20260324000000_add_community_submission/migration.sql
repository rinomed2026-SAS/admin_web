-- CreateEnum
CREATE TYPE "CommunitySubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CommunitySubmission" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "originalImageUrl" TEXT NOT NULL,
    "composedImageUrl" TEXT,
    "allowGallery" BOOLEAN NOT NULL DEFAULT false,
    "status" "CommunitySubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunitySubmission_pkey" PRIMARY KEY ("id")
);
