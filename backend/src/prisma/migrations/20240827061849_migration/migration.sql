-- CreateTable
CREATE TABLE "StudentReport" (
    "id" TEXT NOT NULL,
    "hasRead" BOOLEAN,
    "person" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "writer" TEXT,

    CONSTRAINT "StudentReport_pkey" PRIMARY KEY ("id")
);
