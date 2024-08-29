export interface Report {
    id: string;
    hasRead: boolean;
    person: string;
    report: string;
    sentiment: string;
    studentName: string;
    timestamp: Date; 
    type: string;
    writer: string;
}
