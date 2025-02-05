export interface Picture {
    base64: string;
  }
  
  export interface ModalDiscussionDetail {
    id: string;
    discussionTitle: string;
    personResponsible: string;
    furtherActions: string;
    deadline: string;
  }
  
  export interface DocumentationPayload {
    user: { email: string };
    title: string;
    invitationNumber: string;
    description: string;
    meetingLeader: string;
    location: string;
    time: string;
    attendees: string[];
    results: string[];
    pictures: Picture[];
    documentationType: string;
    modalDiscussionDetails: ModalDiscussionDetail[];
  }
  