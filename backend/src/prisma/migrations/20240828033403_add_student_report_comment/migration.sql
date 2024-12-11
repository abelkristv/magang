-- AlterTable
ALTER TABLE "StudentReport" ADD COLUMN     "studentId" TEXT;

-- CreateTable
CREATE TABLE "StudentReportComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "hasRead" BOOLEAN NOT NULL,
    "reportID" TEXT NOT NULL,
    "writer" TEXT NOT NULL,

    CONSTRAINT "StudentReportComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentReport" ADD CONSTRAINT "StudentReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentReportComment" ADD CONSTRAINT "StudentReportComment_reportID_fkey" FOREIGN KEY ("reportID") REFERENCES "StudentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
