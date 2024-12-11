import { Request, Response } from 'express';
import { StudentService } from '../services/StudentServices';

export class StudentController {
  private studentService: StudentService = new StudentService();

  async getStudentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log('Fetching student with ID:', id);

    try {
      const student = await this.studentService.getStudentById(id);
      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);

      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.studentService.getPaginatedStudents(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching students:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateStudentNotes(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { notes } = req.body;

    try {
      const updatedStudent = await this.studentService.updateStudentNotes(id, notes);
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student notes:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudentReportCount(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const result = await this.studentService.getStudentReportCount(id);
      res.json(result);
    } catch (error) {
      console.error('Error fetching report count:', error);

      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async searchStudents(req: Request, res: Response): Promise<void> {
    const { studentName, page = 1, limit = 10 } = req.query;

    try {
      const result = await this.studentService.searchStudents(
        studentName as string,
        parseInt(page as string),
        parseInt(limit as string)
      );
      res.json(result);
    } catch (error) {
      console.error('Error searching students:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
  
}
