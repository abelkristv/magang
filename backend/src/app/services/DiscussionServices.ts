import { DocumentationRepository } from '../../infrastructure/repositories/DocumentationRepository';

export class DiscussionService {
  private documentationRepository: DocumentationRepository = new DocumentationRepository();

  async getDiscussionsWithDetails(docIds: string[]) {
    if (!Array.isArray(docIds) || docIds.length === 0) {
      throw new Error('docIds should be a non-empty array');
    }

    const documents = await this.documentationRepository.findDocumentsWithDetails(docIds);

    return documents.map(doc => ({
      title: doc.title,
      leader: doc.leader,
      place: doc.place,
      date: doc.timestamp.toISOString().split('T')[0],
      time: doc.timestamp.toISOString().split('T')[1].split('.')[0],
      type: doc.type,
      discussionDetails: Array.isArray(doc.DiscussionDetail)
        ? doc.DiscussionDetail.map(detail => detail.discussionTitle).join(', ')
        : '',
      attendanceList: doc.attendanceList || [],
    }));
  }
}
