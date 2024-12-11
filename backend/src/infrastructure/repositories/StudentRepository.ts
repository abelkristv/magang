import { PrismaClient, Student } from '@prisma/client';
import Database from '../database/Database';

export class StudentRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findStudentById(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }

  async findStudents(offset: number, limit: number, whereClause: any) {
    return this.prisma.student.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
    });
  }

  async countStudents(whereClause: any) {
    return this.prisma.student.count({
      where: whereClause,
    });
  }

  async updateStudentNotes(id: string, notes: string) {
    return this.prisma.student.update({
      where: { id },
      data: { notes },
    });
  }

  async countStudentReports(studentName: string) {
    return this.prisma.studentReport.count({
      where: { studentName },
    });
  }

  async findStudentsByName(name: string, offset: number, limit: number) {
    return this.prisma.student.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      skip: offset,
      take: limit,
    });
  }

  async countStudentsByName(name: string) {
    return this.prisma.student.count({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async saveStudents(studentData: Student[]): Promise<void> {
    try {
      await this.prisma.student.createMany({
        data: studentData,
        skipDuplicates: true, 
      });
    } catch (error) {
      console.error('Error saving student data:', error);
      throw new Error('Failed to save student data');
    }
  }

  
}
