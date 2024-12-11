import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class CompanyRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findAllCompanies() {
    return this.prisma.company.findMany();
  }
}
