import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

export class StudentDataService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async saveStudentData(studentData: any[], periodYear: string): Promise<void> {
    console.log(`Saving ${studentData.length} records for period ${periodYear}`);

    try {
      await this.studentRepository.saveStudents(studentData);
      console.log(`Successfully saved ${studentData.length} records for period ${periodYear}`);
    } catch (error) {
      console.error(`Failed to save records for period ${periodYear}:`, error);
      throw new Error('Failed to save student data');
    }
  }

  transformStudentData(data: any[], periodYear: string): any[] {
    return data.map((row) => ({
      name: row.NAME || '', // Ensure default values for missing fields
      email: row.EMAIL || '',
      major: row.MAJOR || '',
      nim: String(row['STUDENT ID'] || ''),
      semester: "6",
      period: periodYear,
      tempatMagang: "",
      phone: "",
      imageUrl: "",
      status: "active",
      facultySupervisor: "",
      siteSupervisor: "",
    }));
  }
}
