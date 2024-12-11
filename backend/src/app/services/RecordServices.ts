import { StudentReportRepository } from '../../infrastructure/repositories/StudentReportRepository';

export class RecordService {
  private reportRepository: StudentReportRepository = new StudentReportRepository();

  async getRecordsAndDocumentation(email: string) {
    if (!email) {
      throw new Error('Email query parameter is required');
    }

    const urgentReports = await this.reportRepository.findUrgentReports();
    const studentNames = [...new Set(urgentReports.map(report => report.studentName))];

    const students = await this.reportRepository.findStudentsByName(studentNames);
    const studentDict = students.reduce((acc, student) => {
      acc[student.name] = student;
      return acc;
    }, {} as Record<string, any>);

    const reportIds = urgentReports.map(report => report.id);
    const meetings = await this.reportRepository.findMeetingsByReportIds(reportIds);

    const meetingDict = meetings.reduce((acc, meeting) => {
      if (!acc[meeting.studentReportId]) {
        acc[meeting.studentReportId] = [];
      }
      acc[meeting.studentReportId].push(meeting);
      return acc;
    }, {} as Record<string, any[]>);

    const records = urgentReports.map(report => {
      const student = studentDict[report.studentName] || null;
      const timestampDate = new Date(report.timestamp);

      return {
        ...report,
        studentData: student,
        imageUrl: student?.image_url || null,
        major: student?.major || null,
        meetings: meetingDict[report.id] || [],
        timestamp: {
          seconds: Math.floor(timestampDate.getTime() / 1000),
          nanoseconds: timestampDate.getMilliseconds() * 1e6,
        },
      };
    });

    const documentation = await this.reportRepository.findDocumentationByWriter(email);

    return { records, documentations: documentation };
  }
}
