import { Request, Response } from 'express';
import { processCsvFile, processExcelFile, validateFileType } from '../../utilities/file-processor';
import fs from 'fs';
import { StudentDataService } from '../services/StudentDataServices';

export class StudentDataController {
  private studentDataService: StudentDataService;

  constructor() {
    this.studentDataService = new StudentDataService();
  }

  async uploadStudentData(req: Request, res: Response): Promise<void> {
    const { file } = req;
    const { period } = req.body;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    if (!validateFileType(file.originalname)) {
      res.status(400).json({ message: 'Invalid file type. Only .csv, .xlsx, and .xls are allowed.' });
      return;
    }

    if (!period) {
      res.status(400).json({ message: 'Period is required.' });
      return;
    }

    const periodYear = period.split(' ')[2]?.replace('.', '.');
    if (!periodYear) {
      res.status(400).json({ message: 'Invalid period format.' });
      return;
    }

    try {
      let rawData: Record<string, any[]>;

      if (file.originalname.endsWith('.csv')) {
        rawData = { Sheet1: await processCsvFile(file.path) };
      } else {
        rawData = processExcelFile(file.path);
      }

      const studentData = this.studentDataService.transformStudentData(rawData, periodYear);

      await this.studentDataService.saveStudentData(studentData, periodYear);

      res.status(200).json({ message: 'File processed and data uploaded successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
}
