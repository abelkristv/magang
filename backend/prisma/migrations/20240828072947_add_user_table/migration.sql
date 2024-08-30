-- CreateTable
CREATE TABLE "CompanyUser" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "CompanyUser_pkey" PRIMARY KEY ("id")
);
