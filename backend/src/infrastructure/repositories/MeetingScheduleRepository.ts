import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class MeetingScheduleRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findSchedulesByReportIds(reportIds: string[]) {
    return this.prisma.meetingSchedule.findMany({
      where: {
        studentReportId: { in: reportIds },
      },
    });
  }

  async findReportsByIds(reportIds: string[]) {
    return this.prisma.studentReport.findMany({
      where: {
        id: { in: reportIds },
      },
    });
  }

  async createMeetingSchedule(data: any) {
    return this.prisma.meetingSchedule.create({ data });
  }
}
