-- CreateTable
CREATE TABLE "MeetingSchedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "description" TEXT,
    "place" TEXT NOT NULL,
    "studentReportId" TEXT NOT NULL,
    "subject" TEXT,
    "timeStart" TEXT,
    "timeEnd" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "MeetingSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_studentReportId_fkey" FOREIGN KEY ("studentReportId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
