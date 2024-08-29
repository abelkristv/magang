-- DropForeignKey
ALTER TABLE "MeetingSchedule" DROP CONSTRAINT "MeetingSchedule_studentReportId_fkey";

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_studentReportId_fkey" FOREIGN KEY ("studentReportId") REFERENCES "StudentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
