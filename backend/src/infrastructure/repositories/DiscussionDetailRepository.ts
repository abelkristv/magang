import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class DiscussionDetailRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findDiscussionDetailsByDocId(docId: string) {
    return this.prisma.discussionDetail.findMany({
      where: {
        docId,
      },
    });
  }
}
