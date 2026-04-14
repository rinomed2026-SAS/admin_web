-- CreateIndex
CREATE INDEX "Session_day_startTime_idx" ON "Session"("day", "startTime");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Question_userId_idx" ON "Question"("userId");

-- CreateIndex
CREATE INDEX "Question_sessionId_idx" ON "Question"("sessionId");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "SponsorLead_userId_idx" ON "SponsorLead"("userId");

-- CreateIndex
CREATE INDEX "SponsorLead_sponsorId_idx" ON "SponsorLead"("sponsorId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "CommunitySubmission_status_allowGallery_idx" ON "CommunitySubmission"("status", "allowGallery");
