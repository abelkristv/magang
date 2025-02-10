import { MeetingScheduleRepository } from '../../infrastructure/repositories/MeetingScheduleRepository';

export class MeetingScheduleService {
  private scheduleRepository: MeetingScheduleRepository = new MeetingScheduleRepository();

  async getMeetingSchedules(reportIds: string[]) {
    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      throw new Error('Invalid input: reportIds should be a non-empty array');
    }

    const meetingSchedules = await this.scheduleRepository.findSchedulesByReportIds(reportIds);
    const studentReports = await this.scheduleRepository.findReportsByIds(reportIds);

    const reportWriterMap = studentReports.reduce((acc, report) => {
      acc[report.id] = report.writer || 'Unknown';
      return acc;
    }, {} as Record<string, string>);

    const schedules = meetingSchedules.map(schedule => ({
      ...schedule,
      writer: reportWriterMap[schedule.studentReportId] || 'Unknown',
    }));

    const schedulesMap = schedules.reduce((acc, schedule) => {
      acc[schedule.studentReportId] = schedule;
      return acc;
    }, {} as Record<string, any>);

    return schedulesMap;
  }

  async createSchedule(payload: any) {
    const { timeStart, timeEnd, description, place, date, meetingType, studentReportId } = payload;

    if (!timeStart || !timeEnd || !description || !place || !date || !meetingType || !studentReportId) {
      throw new Error('All fields are required');
    }

    const newMeeting = await this.scheduleRepository.createMeetingSchedule({
      timeStart,
      timeEnd,
      description,
      place,
      date,
      type: meetingType,
      studentReportId,
      createdAt: new Date(),
    });

    const updatedSchedules = await this.scheduleRepository.findSchedulesByReportIds([studentReportId]);

    return { newMeeting, updatedSchedules };
  }

  async updateSchedule(meetingId: string, updateData: any) {
    if (!meetingId) {
        throw new Error('Meeting schedule ID is required');
    }

    const updatedMeeting = await this.scheduleRepository.updateMeetingSchedule(meetingId, updateData);

    if (!updatedMeeting) {
        throw new Error('Meeting schedule not found');
    }

    return { message: 'Meeting schedule updated successfully', updatedMeeting };
}



  async deleteSchedule(meetingScheduleId: string) {
    if (!meetingScheduleId) {
      throw new Error('Meeting schedule ID is required');
    }
  
    await this.scheduleRepository.deleteMeetingSchedule(meetingScheduleId);
  
    return { message: 'Meeting schedule deleted successfully' };
  }
  
}
