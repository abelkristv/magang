-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "tempatMagang" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "facultySupervisor" TEXT NOT NULL,
    "siteSupervisor" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "notes" TEXT,
    "period" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
