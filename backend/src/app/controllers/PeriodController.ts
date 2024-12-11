import { Request, Response } from 'express';
import { PeriodService } from '../services/PeriodServices';

export class PeriodController {
  private periodService: PeriodService = new PeriodService();

  async getAllPeriods(req: Request, res: Response): Promise<void> {
    try {
      const periods = await this.periodService.getAllPeriods();
      res.json(periods);
    } catch (error) {
      console.error('Error fetching periods:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createPeriod(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    try {
      const newPeriod = await this.periodService.createPeriod(name);
      res.status(201).json(newPeriod);
    } catch (error) {
      console.error('Error saving period:', error);

      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to save period' });
      }
    }
  }
}
