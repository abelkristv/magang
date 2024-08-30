import { Timestamp } from "firebase/firestore";

interface StudentRecord {
    title: string,
    report: string,
    timestamp: Timestamp,
    writer: string,
    rating: number,
    sentiment: string,
    hasRead: boolean
}

export default StudentRecord;