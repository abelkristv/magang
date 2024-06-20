import { Timestamp } from "firebase/firestore";

interface StudentRecord {
    title: string,
    report: string,
    timestamp: Timestamp,
    writer: string
}

export default StudentRecord;