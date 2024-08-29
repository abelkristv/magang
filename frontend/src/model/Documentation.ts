import { Timestamp } from "firebase/firestore";
import DiscussionDetail from "./DiscussionDetail";

interface Documentation {
    id?: string; 
    attendanceList: string[];
    description?: string;
    discussionDetails?: DiscussionDetail[];
    leader: string;
    nomor_undangan?: string;
    pictures?: string[];
    place: string;
    results?: string[];
    time: string;
    timestamp: Date;
    title: string;
    type: string;
    writer?: string;
}

export default Documentation;
