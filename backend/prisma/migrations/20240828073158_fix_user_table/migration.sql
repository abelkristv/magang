/*
  Warnings:

  - You are about to drop the `CompanyUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CompanyUser";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
