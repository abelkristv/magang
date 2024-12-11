import { DiscussionDetailRepository } from '../../infrastructure/repositories/DiscussionDetailRepository';

export class DiscussionDetailService {
  private discussionDetailRepository: DiscussionDetailRepository = new DiscussionDetailRepository();

  async getDiscussionDetailsByDocId(docId: string) {
    if (!docId) {
      throw new Error('Invalid input: docID is required');
    }

    const discussionDetails = await this.discussionDetailRepository.findDiscussionDetailsByDocId(docId);

    if (discussionDetails.length === 0) {
      throw new Error('No discussion details found for the provided docID');
    }

    return discussionDetails;
  }
}
