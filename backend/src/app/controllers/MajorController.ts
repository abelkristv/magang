import { Request, Response } from 'express';
import { MajorService } from '../services/MajorServices';

export class MajorController {
  private majorService: MajorService = new MajorService();

  async getAllMajors(req: Request, res: Response): Promise<void> {
    try {
      const majors = await this.majorService.getAllMajors();
      res.json(majors);
    } catch (error) {
      console.error('Error fetching majors:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
