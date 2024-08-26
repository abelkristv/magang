import { Timestamp } from "firebase/firestore";

interface Documentation {
    id: string;
    attendanceList: string[]; 
    description: string; 
    leader: string;
    nomor_undangan: string; 
    pictures: string[];
    place: string; 
    results: string[];
    time: Timestamp; 
    timestamp: Timestamp;
    title: string; 
    type: string; 
    writer: string; 
}

export default Documentation;