import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class MajorRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findAllMajors() {
    return this.prisma.major.findMany();
  }
}
