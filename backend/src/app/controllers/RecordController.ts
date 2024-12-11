import { Request, Response } from 'express';
import { RecordService } from '../services/RecordServices';

export class RecordController {
  private recordService: RecordService = new RecordService();

  async getRecordsAndDocumentation(req: Request, res: Response): Promise<void> {
    const { email } = req.query;

    try {
      const { records, documentations } = await this.recordService.getRecordsAndDocumentation(email as string);
      res.json({ records, documentations });
    } catch (error) {
      console.error('Error fetching records and documentation:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
