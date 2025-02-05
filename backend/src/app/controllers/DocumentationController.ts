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

  async deleteDocumentation(req: Request, res: Response): Promise<void> {
    const { documentationId } = req.params;
    
    if (!documentationId) {
      res.status(400).json({ success: false, message: 'Documentation ID is required' });
      return;
    }
    
    try {
      const deletedDocumentation = await this.documentationService.deleteDocumentation(documentationId);
      res.json({ success: true, message: 'Documentation deleted successfully', deletedDocumentation });
    } catch (error) {
      console.error('Error deleting documentation:', error);
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Failed to delete documentation. Please try again.' });
    }
  }

  async updateDocumentation(req: Request, res: Response): Promise<void> {
    try {
      const documentationId = req.params.documentationId;
      if (!documentationId) {
        res.status(400).json({ success: false, message: "Documentation ID is required" });
        return;
      }
      
      const updatedData = req.body;
      const payload = { documentationId, ...updatedData };
      
      const result = await this.documentationService.updateDocumentationWithDetails(payload);
      res.json({ success: true, message: "Documentation updated successfully", result });
    } catch (error) {
      console.error("Error updating documentation:", error);
      res.status(500).json({ success: false, message: "Failed to update documentation" });
    }
  }
  
  
}
