import { Report } from '../model/Report'; // Assuming Report interface is in the model folder
import Student from '../model/Student';
import User from '../model/User';

export const fetchReports = async (
    studentName: string, 
    filterStartDate?: string, 
    filterEndDate?: string
): Promise<Report[]> => {

    try {
        const params = new URLSearchParams({ studentName });

        if (filterStartDate) {
            params.append('filterStartDate', filterStartDate);
        }
        if (filterEndDate) {
            params.append('filterEndDate', filterEndDate);
        }

        const response = await fetch(`http://localhost:3001/api/reports?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Error fetching reports: ${response.statusText}`);
        }

        const data = await response.json();

        return data as Report[];
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
};

export const updateStudentReport = async (
    reportId: string,
    editedContent: string,
    editedType: string,
    reports: Report[]
): Promise<Report[]> => {
    try {
        const updatedTimestamp = new Date().toISOString();

        const response = await fetch(`http://localhost:3001/api/reports/${reportId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report: editedContent,
                type: editedType,
                timestamp: updatedTimestamp,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error updating report: ${response.statusText}`);
        }

        const updatedReport = await response.json();

        const updatedReports = reports.map(report =>
            report.id === reportId
                ? {
                    ...report,
                    ...updatedReport,
                    timestamp: new Date(updatedReport.timestamp),
                }
                : report
        );

        alert("Report updated successfully!");
        return updatedReports;
    } catch (error) {
        console.error("Error updating report:", error);
        alert("Failed to update report. Please try again.");
        throw error;
    }
};

export const deleteStudentReport = async (
    reportId: string,
    reports: Report[]
): Promise<Report[]> => {
    try {
        const response = await fetch(`http://localhost:3001/api/reports/${reportId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error deleting report: ${response.statusText}`);
        }

        alert("Report deleted successfully!");
        return reports.filter(report => report.id !== reportId);
    } catch (error) {
        console.error("Error deleting report:", error);
        alert("Failed to delete report. Please try again.");
        throw error;
    }
};


export const fetchTotalReportsByStudent = async (
    students: Student[]
): Promise<{ [key: string]: number }> => {
    const totals: { [key: string]: number } = {};

    for (const student of students) {
        const response = await fetch(
            `http://localhost:3001/api/student/${student.iden}/reports/count`
        );

        if (!response.ok) {
            console.error(`Failed to fetch reports for ${student.name}`);
            totals[student.name] = 0;
            continue;
        }

        const { reportCount } = await response.json();
        totals[student.name] = reportCount;
    }

    return totals;
};

export const fetchUrgentStudentReports = async (): Promise<Report[]> => {
    try {
        const response = await fetch('http://localhost:3001/api/reports/urgent');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const urgentReports: Report[] = await response.json();
        return urgentReports;
    } catch (error) {
        console.error("Error fetching urgent student reports:", error);
        return [];
    }
};


export const fetchRecordsAndDocumentation = async (user: User) => {
    try {
        // Fetch records and documentation from the backend API
        const response = await fetch(
            `http://localhost:3001/api/records-and-documentation?email=${encodeURIComponent(user.email)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch records and documentation');
        }

        const data = await response.json();

        const fetchedRecords = data.records.map((record: any) => {
            const timestampDate = new Date(record.timestamp.seconds * 1000 + record.timestamp.nanoseconds / 1e6);

            return {
                ...record,
                timestamp: timestampDate,
            };
        });

        return { records: fetchedRecords, documentations: data.documentations };
    } catch (error) {
        console.error('Error fetching records and documentation:', error);
        throw error;
    }
};
