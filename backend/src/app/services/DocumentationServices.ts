import { DocumentationRepository } from '../../infrastructure/repositories/DocumentationRepository';
import { DocumentationPayload, ModalDiscussionDetail, Picture } from '../../types/DocumentationTypes';

export class DocumentationService {
  private documentationRepository: DocumentationRepository = new DocumentationRepository();

  async getAllDocumentation() {
    try {
      return await this.documentationRepository.findAllDocumentation();
    } catch (error) {
      throw new Error('Error fetching documentation');
    }
  }

  async getDocumentationByEmail(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }

    const documentation = await this.documentationRepository.findDocumentationByWriter(email);

    if (documentation.length === 0) {
      throw new Error('No documentation found for the provided email');
    }

    return documentation;
  }

  async createDocumentationWithDetails(payload: DocumentationPayload) {
    const {
      user,
      title,
      invitationNumber,
      description,
      meetingLeader,
      location,
      time,
      attendees,
      results,
      pictures,
      documentationType,
      modalDiscussionDetails,
    } = payload;
  
    if (!user?.email) {
      throw new Error('User is not defined or user email is missing');
    }
  
    const parsedTime = new Date(time).toISOString();
  
    const encodedPictures = pictures.map((picture: Picture) => {
      if (!picture.base64) {
        throw new Error('Invalid picture data: file is undefined.');
      }
      return picture.base64;
    });
  
    const documentationData = {
      title,
      nomorUndangan: invitationNumber,
      description,
      leader: meetingLeader,
      place: location,
      time: parsedTime,
      attendanceList: { set: attendees },
      results: { set: results },
      pictures: { set: encodedPictures },
      type: documentationType,
      writer: user.email,
      timestamp: parsedTime,
    };
  
    const documentation = await this.documentationRepository.createDocumentation(documentationData);
  
    if (modalDiscussionDetails && modalDiscussionDetails.length > 0) {
      const formattedDetails = modalDiscussionDetails.map((detail: ModalDiscussionDetail) => ({
        discussionTitle: detail.discussionTitle,
        personResponsible: detail.personResponsible,
        furtherActions: detail.furtherActions,
        deadline: new Date(detail.deadline).toISOString(),
      }));
  
      await this.documentationRepository.createDiscussionDetails(formattedDetails, documentation.id);
    }
  
    return documentation;
  }

  
  
}
