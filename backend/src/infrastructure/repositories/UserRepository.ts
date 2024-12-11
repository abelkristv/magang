import { PrismaClient, User as PrismaUser } from '@prisma/client';
import Database from '../database/Database';
import { User } from '../../domain/entities/User';

export class UserRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } });
    if (!prismaUser) return null;

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.companyName,
      prismaUser.companyAddress!,
      prismaUser.imageUrl,
      prismaUser.role,
      prismaUser.password!,
      prismaUser.phoneNumber!
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!prismaUser) return null;

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.companyName,
      prismaUser.companyAddress!,
      prismaUser.imageUrl,
      prismaUser.role,
      prismaUser.password!,
      prismaUser.phoneNumber!
    );
  }

  async update(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        companyAddress: user.companyAddress,
        imageUrl: user.imageUrl,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.companyName,
      prismaUser.companyAddress!,
      prismaUser.imageUrl,
      prismaUser.role,
      prismaUser.password!,
      prismaUser.phoneNumber!
    );
  }

  async findUsersByEmails(emails: string[]) {
    return this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        email: true,
        name: true,
      },
    });
  }
}
