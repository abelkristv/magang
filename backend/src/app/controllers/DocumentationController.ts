import { Request, Response } from 'express';
import { DocumentationService } from '../services/DocumentationServices';

export class DocumentationController {
  private documentationService: DocumentationService = new DocumentationService();

  async getAllDocumentation(req: Request, res: Response): Promise<void> {
    try {
      const documentation = await this.documentationService.getAllDocumentation();
      res.json(documentation);
    } catch (error) {
      console.error('Error fetching internal activity:', error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getDocumentationByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    try {
      const documentation = await this.documentationService.getDocumentationByEmail(email);
      res.json(documentation);
    } catch (error) {
      console.error('Error fetching internal activity by email:', error);

      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createDocumentation(req: Request, res: Response): Promise<void> {
    try {
      const documentation = await this.documentationService.createDocumentationWithDetails(req.body);
      res.json({ success: true, message: 'Internal activity added successfully!', documentation });
    } catch (error) {
      console.error('Error adding internal activity:', error);

      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to add internal activity. Please try again.', error });
      }
    }
  }
}
