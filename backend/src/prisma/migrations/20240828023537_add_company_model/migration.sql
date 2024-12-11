-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "companyDetail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
