import { Timestamp } from "firebase/firestore"

interface DiscussionDetail {
    id: string,
    deadline: string, 	
    discussionTitle: string, 	
    docID: string,
    furtherActions: string,
    personResponsible: string, 
}

export default DiscussionDetail;