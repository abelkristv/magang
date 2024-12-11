/*
  Warnings:

  - You are about to drop the column `hasRead` on the `StudentReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentReport" DROP COLUMN "hasRead",
ADD COLUMN     "status" TEXT;
