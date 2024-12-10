import { Timestamp } from "firebase/firestore";

interface MeetingSchedule {
    id: string;
    createdAt: Timestamp;
    date: string;         
    description: string; 
    place: string;        
    studentReport_id: string;
    timeEnd: string;      
    timeStart: string;     
    type: string;          
}

export default MeetingSchedule;
