import { Request, Response } from 'express';
import { DiscussionService } from '../services/DiscussionServices';

export class DiscussionController {
  private discussionService: DiscussionService = new DiscussionService();

  async getDiscussionsWithDetails(req: Request, res: Response): Promise<void> {
    const { docIds } = req.body;

    try {
      const discussionsWithDetails = await this.discussionService.getDiscussionsWithDetails(docIds);
      res.json(discussionsWithDetails);
    } catch (error) {
      console.error('Error fetching discussions with details:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
