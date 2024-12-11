import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class DocumentationRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findAllDocumentation() {
    return this.prisma.documentation.findMany();
  }

  async findDocumentationByWriter(email: string) {
    return this.prisma.documentation.findMany({
      where: { writer: email },
    });
  }

  async createDocumentation(data: any) {
    return this.prisma.documentation.create({ data });
  }

  async createDiscussionDetails(details: any[], documentationId: string) {
    return Promise.all(
      details.map(detail =>
        this.prisma.discussionDetail.create({
          data: {
            ...detail,
            documentation: { connect: { id: documentationId } },
          },
        })
      )
    );
  }

  async findDocumentsWithDetails(docIds: string[]) {
    return this.prisma.documentation.findMany({
      where: {
        id: {
          in: docIds,
        },
      },
      include: {
        DiscussionDetail: true,
      },
    });
  }
}
