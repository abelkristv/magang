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

  async deleteDocumentation(documentationId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.discussionDetail.deleteMany({
        where: { id: documentationId },
      });
      return tx.documentation.delete({
        where: { id: documentationId },
      });
    });
  }

async updateDocumentationWithDetails(
  documentationId: string,
  documentationData: any,
  discussionDetails?: any[]
) {
  return this.prisma.$transaction(async (tx) => {
    const updatedDocumentation = await tx.documentation.update({
      where: { id: documentationId },
      data: documentationData,
    });

    if (discussionDetails && discussionDetails.length > 0) {
      await tx.discussionDetail.deleteMany({
        where: { docId: documentationId },
      });
      await Promise.all(
        discussionDetails.map((detail) =>
          tx.discussionDetail.create({
            data: {
              ...detail,
              documentation: { connect: { id: documentationId } },
            },
          })
        )
      );
    }
    return updatedDocumentation;
  });
}

  
}
