import { Timestamp } from "firebase/firestore"

interface DiscussionDetail {
    id?: string;    // Optional: present when editing/updating existing details.
    docID?: string; // Optional: can be used to store a reference to the related documentation.
    discussionTitle: string;
    personResponsible: string;
    furtherActions: string;
    deadline: string;
  }
  

export default DiscussionDetail;