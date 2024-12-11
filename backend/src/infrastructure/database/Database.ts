import { PrismaClient } from '@prisma/client';

class Database {
  private static prisma: PrismaClient;

  static getPrismaInstance(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
    return this.prisma;
  }

  static async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }
}

export default Database;
