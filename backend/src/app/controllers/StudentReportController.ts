import { Request, Response } from 'express';
import { StudentReportService } from '../services/StudentReportServices';

export class StudentReportController {
  private reportService: StudentReportService = new StudentReportService();

  async getReports(req: Request, res: Response): Promise<void> {
    const { studentName, filterStartDate, filterEndDate } = req.query;

    try {
      const reports = await this.reportService.getReports(
        studentName as string,
        filterStartDate as string,
        filterEndDate as string
      );
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { report, type, status, person, timestamp } = req.body;

    try {
      const updatedReport = await this.reportService.updateReport(id, {
        report,
        type,
        status,
        person,
        timestamp,
      });

      res.json(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const deletedReport = await this.reportService.deleteReport(id);
      res.json({ message: 'Report deleted successfully', deletedReport });
    } catch (error) {
      console.error('Error deleting report:', error);

      if (error instanceof Error && error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUrgentReports(req: Request, res: Response): Promise<void> {
    try {
      const urgentReports = await this.reportService.getUrgentReports();
      res.json(urgentReports);
    } catch (error) {
      console.error('Error fetching urgent reports:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createReport(req: Request, res: Response): Promise<void> {
    const { type, person, status, report, studentName, timestamp, writer } = req.body;

    try {
      const newReport = await this.reportService.createReport({
        type,
        person,
        status,
        report,
        studentName,
        timestamp,
        writer,
      });

      res.status(201).json({ message: 'Student report added successfully', newReport });
    } catch (error) {
      console.error('Error adding report:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTotalComments(req: Request, res: Response): Promise<void> {
    const { students } = req.body;

    try {
      const totalComments = await this.reportService.getTotalCommentsByStudents(students);
      res.json(totalComments);
    } catch (error) {
      console.error('Error fetching total comments:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
  
}
