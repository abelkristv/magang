import { Request, Response } from 'express';
import { CompanyService } from '../services/CompanyServices';

export class CompanyController {
  private companyService: CompanyService = new CompanyService();

  async getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this.companyService.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
