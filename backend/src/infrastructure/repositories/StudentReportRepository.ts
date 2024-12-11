import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class StudentReportRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findReports(conditions: any) {
    return this.prisma.studentReport.findMany({
      where: conditions,
    });
  }

  async updateReport(
    id: string,
    data: { report: string; type: string; status: string; person: string; timestamp: Date }
  ) {
    return this.prisma.studentReport.update({
      where: { id },
      data,
    });
  }

  async deleteReport(id: string) {
    return this.prisma.studentReport.delete({
      where: { id },
    });
  }

  async findUrgentReports() {
    return this.prisma.studentReport.findMany({
      where: {
        type: 'Urgent',
      },
    });
  }

  async createReport(data: {
    type: string;
    person: string;
    status: string;
    report: string;
    studentName: string;
    timestamp: Date;
    writer: string;
    sentiment: string;
  }) {
    return this.prisma.studentReport.create({ data });
  }

  async findReportsByStudentNames(studentNames: string[]) {
    return this.prisma.studentReport.findMany({
      where: {
        studentName: {
          in: studentNames,
        },
      },
      select: {
        id: true,
        studentName: true,
      },
    });
  }

  async countCommentsByReportIds(reportIds: string[]) {
    return this.prisma.studentReportComment.groupBy({
      by: ['reportID'],
      _count: {
        reportID: true,
      },
      where: {
        reportID: {
          in: reportIds,
        },
      },
    });
  }

  async findStudentsByName(studentNames: string[]) {
    return this.prisma.student.findMany({
      where: {
        name: {
          in: studentNames,
        },
      },
    });
  }

  async findMeetingsByReportIds(reportIds: string[]) {
    return this.prisma.meetingSchedule.findMany({
      where: {
        studentReportId: {
          in: reportIds,
        },
      },
    });
  }

  async findDocumentationByWriter(email: string) {
    return this.prisma.documentation.findMany({
      where: { writer: email },
    });
  }
}
