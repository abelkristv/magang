import { Timestamp } from "firebase/firestore"

interface DiscussionDetail {
    id?: string;
    docID?: string;
    discussionTitle: string;
    personResponsible: string;
    furtherActions: string;
    deadline: string;
  }
  

export default DiscussionDetail;