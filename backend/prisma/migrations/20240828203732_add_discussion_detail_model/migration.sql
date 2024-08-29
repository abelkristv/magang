-- CreateTable
CREATE TABLE "DiscussionDetail" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "discussionTitle" TEXT NOT NULL,
    "furtherActions" TEXT NOT NULL,
    "personResponsible" TEXT NOT NULL,
    "docId" TEXT NOT NULL,

    CONSTRAINT "DiscussionDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscussionDetail" ADD CONSTRAINT "DiscussionDetail_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Documentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
