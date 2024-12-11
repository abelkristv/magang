import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class PeriodRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findAllPeriods() {
    return this.prisma.period.findMany();
  }

  async createPeriod(name: string) {
    return this.prisma.period.create({
      data: { name },
    });
  }
}
