-- CreateTable
CREATE TABLE "Documentation" (
    "id" TEXT NOT NULL,
    "attendanceList" TEXT[],
    "description" TEXT,
    "discussionDetails" TEXT[],
    "leader" TEXT NOT NULL,
    "nomorUndangan" TEXT,
    "pictures" TEXT[],
    "place" TEXT NOT NULL,
    "results" TEXT[],
    "time" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "writer" TEXT NOT NULL,

    CONSTRAINT "Documentation_pkey" PRIMARY KEY ("id")
);
