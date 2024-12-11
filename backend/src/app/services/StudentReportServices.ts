import { StudentReportRepository } from '../../infrastructure/repositories/StudentReportRepository';

export class StudentReportService {
  private reportRepository: StudentReportRepository = new StudentReportRepository();

  async getReports(studentName?: string, filterStartDate?: string, filterEndDate?: string) {
    if (!studentName) {
      throw new Error('studentName is required');
    }

    const conditions: any = { studentName };

    if (filterStartDate) {
      if (isNaN(Date.parse(filterStartDate))) {
        throw new Error('Invalid filterStartDate');
      }
      conditions.timestamp = {
        ...conditions.timestamp,
        gte: new Date(filterStartDate),
      };
    }

    if (filterEndDate) {
      if (isNaN(Date.parse(filterEndDate))) {
        throw new Error('Invalid filterEndDate');
      }
      conditions.timestamp = {
        ...conditions.timestamp,
        lte: new Date(filterEndDate),
      };
    }

    return this.reportRepository.findReports(conditions);
  }

  async updateReport(id: string, data: any) {
    if (!id) {
      throw new Error('Invalid input: ID is required');
    }
    if (!data.timestamp || isNaN(Date.parse(data.timestamp))) {
      throw new Error('Invalid input: timestamp must be a valid date');
    }

    const transformedData = {
      ...data,
      timestamp: new Date(data.timestamp), 
    };

    return this.reportRepository.updateReport(id, transformedData);
  }

  async deleteReport(id: string) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid input: ID must be a non-empty string');
    }

    try {
      return await this.reportRepository.deleteReport(id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Report not found');
      }
      throw new Error('Error deleting report');
    }
  }

  async getUrgentReports() {
    try {
      return await this.reportRepository.findUrgentReports();
    } catch (error) {
      throw new Error('Error fetching urgent reports');
    }
  }

  async createReport(data: {
    type: string;
    person: string;
    status: string;
    report: string;
    studentName: string;
    timestamp: string;
    writer: string;
  }) {
    const { report, studentName, type, status, person, writer, timestamp } = data;
    console.log(data)

    if (!report || !studentName || !type || !status || !person || !writer) {
      throw new Error('Missing required fields');
    }

    if (!timestamp || isNaN(Date.parse(timestamp))) {
      throw new Error('Invalid timestamp');
    }

    const transformedData = {
      type,
      person,
      status,
      report,
      sentiment: 'neutral', 
      studentName,
      timestamp: new Date(timestamp),
      writer,
    };

    return this.reportRepository.createReport(transformedData);
  }

  async getTotalCommentsByStudents(students: { name: string }[]) {
    const studentNames = students.map(student => student.name);

    // Fetch reports for all students in a single query
    const reports = await this.reportRepository.findReportsByStudentNames(studentNames);

    if (reports.length === 0) {
      return studentNames.reduce((acc, name) => {
        acc[name] = 0;
        return acc;
      }, {} as Record<string, number>);
    }

    const reportIds = reports.map(report => report.id);

    const commentsCounts = await this.reportRepository.countCommentsByReportIds(reportIds);

    const commentsByReportId = commentsCounts.reduce((acc, comment) => {
      acc[comment.reportID] = comment._count.reportID;
      return acc;
    }, {} as Record<string, number>);

    const totalComments = studentNames.reduce((acc, name) => {
      const studentReports = reports.filter(report => report.studentName === name);
      const totalCommentsForStudent = studentReports.reduce(
        (sum, report) => sum + (commentsByReportId[report.id] || 0),
        0
      );
      acc[name] = totalCommentsForStudent;
      return acc;
    }, {} as Record<string, number>);

    return totalComments;
  }
}
