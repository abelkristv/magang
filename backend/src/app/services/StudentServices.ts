import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';

export class StudentService {
  private studentRepository: StudentRepository = new StudentRepository();

  async getStudentById(id: string) {
    if (!id) {
      throw new Error('Invalid input: ID is required');
    }

    const student = await this.studentRepository.findStudentById(id);

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  async getPaginatedStudents(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = query.name || '';
    const period = query.period || '';
    const status = query.status || '';
    const numericPeriod = period.match(/\d+\.\d+/)?.[0] || '';

    const whereClause = {
        AND: [
            searchQuery
                ? {
                    name: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                }
                : undefined,
            numericPeriod
                ? {
                    period: {
                        equals: numericPeriod,
                    },
                }
                : undefined,
            status && (status === "Active" || status === "Not Active")
                ? {
                    status: {
                        equals: status,
                    },
                }
                : undefined,
        ].filter(Boolean),
    };

    const students = await this.studentRepository.findStudents(offset, limit, whereClause);
    const totalStudents = await this.studentRepository.countStudents(whereClause);
    const totalPages = Math.ceil(totalStudents / limit);

    return {
        students,
        pagination: {
            currentPage: page,
            totalPages,
            totalStudents,
            limit,
        },
    };
  }


  async updateStudentNotes(id: string, notes: string) {
    if (!id) {
      throw new Error('Invalid input: ID is required');
    }
    if (!notes) {
      throw new Error('Invalid input: Notes cannot be empty');
    }

    return this.studentRepository.updateStudentNotes(id, notes);
  }

  async getStudentReportCount(id: string) {
    if (!id) {
      throw new Error('Invalid input: ID is required');
    }

    const student = await this.studentRepository.findStudentById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    const reportCount = await this.studentRepository.countStudentReports(student.name);
    return { studentName: student.name, reportCount };
  }

  async searchStudents(studentName: string, page: number, limit: number) {
    if (!studentName) {
      throw new Error('Invalid input: studentName is required');
    }

    if (page < 1 || limit < 1) {
      throw new Error('Invalid pagination parameters: page and limit must be greater than 0');
    }

    const offset = (page - 1) * limit;

    const students = await this.studentRepository.findStudentsByName(studentName, offset, limit);
    const totalStudents = await this.studentRepository.countStudentsByName(studentName);
    const totalPages = Math.ceil(totalStudents / limit);

    return {
      students,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents,
        limit,
      },
    };
}
  
}
