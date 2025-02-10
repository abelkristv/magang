/*
  Warnings:

  - A unique constraint covering the columns `[studentReportId]` on the table `MeetingSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MeetingSchedule_studentReportId_key" ON "MeetingSchedule"("studentReportId");
