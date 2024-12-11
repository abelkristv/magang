import { Request, Response } from 'express';
import { DiscussionDetailService } from '../services/DiscussionDetailServices';

export class DiscussionDetailController {
  private discussionDetailService: DiscussionDetailService = new DiscussionDetailService();

  async getDiscussionDetails(req: Request, res: Response): Promise<void> {
    const { docID } = req.params;

    try {
      const discussionDetails = await this.discussionDetailService.getDiscussionDetailsByDocId(docID);
      res.json(discussionDetails);
    } catch (error) {
      console.error('Error fetching discussion details:', error);

      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
