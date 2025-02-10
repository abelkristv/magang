import { PrismaClient } from '@prisma/client';
import Database from '../database/Database';

export class MeetingScheduleRepository {
  private prisma: PrismaClient = Database.getPrismaInstance();

  async findSchedulesByReportIds(reportIds: string[]) {
    return this.prisma.meetingSchedule.findMany({
      where: {
        studentReportId: { in: reportIds },
      },
      select: {
        id: true,
        studentReportId: true,
        timeStart: true,
        timeEnd: true,
        description: true,
        place: true,
        date: true,
        type: true,
        createdAt: true,
      },
    });
  }
  

  async updateMeetingSchedule(meetingId: string, updateData: any) {
    console.log("Updating meeting schedule:", meetingId, updateData);
    const updatedRecord = await this.prisma.meetingSchedule.update({
      where: { studentReportId: meetingId },
      data: updateData,
    });
    console.log("Updated record:", updatedRecord);
    return updatedRecord;
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

  async deleteMeetingSchedule(meetingScheduleId: string) {
    return this.prisma.meetingSchedule.delete({
      where: { id: meetingScheduleId },
    });
  }
  
}
