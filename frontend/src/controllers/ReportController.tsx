import { Report } from '../model/Report'; // Assuming Report interface is in the model folder
import Student from '../model/Student';
import User from '../model/User';

export const fetchReports = async (
    studentName: string, 
    filterStartDate?: string, 
    filterEndDate?: string
): Promise<Report[]> => {
    const token = localStorage.getItem('token');
    try {
        const params = new URLSearchParams({ studentName });

        if (filterStartDate) {
            params.append('filterStartDate', filterStartDate);
        }
        if (filterEndDate) {
            params.append('filterEndDate', filterEndDate);
        }

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

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
    editedStatus: string,
    editedSource: string,
    reports: Report[]
): Promise<Report[]> => {
    const token = localStorage.getItem('token');
    try {
        const updatedTimestamp = new Date().toISOString();

        console.log("report to be updated: ", reportId)

        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports/${reportId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
                report: editedContent,
                type: editedType,
                status: editedStatus,
                person: editedSource,
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

        // alert("Report updated successfully!");
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
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports/${reportId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting report: ${response.statusText}`);
        }

        // alert("Report deleted successfully!");
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
    const token = localStorage.getItem('token');


    for (const student of students) {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/student/${student.iden}/reports/count`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
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
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports/urgent`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );
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
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/records-and-documentation?email=${encodeURIComponent(user.email)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            }
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

        const writerEmails = fetchedRecords.map((record: any) => record.writer);

        const nameResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/user/names`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 

                },
                body: JSON.stringify({ emails: writerEmails }),
            }
        );

        if (!nameResponse.ok) {
            throw new Error('Failed to fetch user names');
        }

        const emailToNameMap = await nameResponse.json();

        const updatedRecords = fetchedRecords.map((record: any) => ({
            ...record,
            writer: emailToNameMap[record.writer] || record.writer, 
        }));

        return { records: updatedRecords, documentations: data.documentations };
    } catch (error) {
        console.error('Error fetching records and documentation:', error);
        throw error;
    }
};


export const addStudentReport = async (
    studentName: string, 
    description: string, 
    selectedType: string, 
    selectedPerson: string, 
    selectedStatus: string,
    writer: string
): Promise<void> => {
    if (description.trim() === "") {
        throw new Error("Description cannot be empty.");
    }

    const token = localStorage.getItem('token');


    const newRecord = {
        hasRead: false,
        type: selectedType,
        person: selectedPerson,
        status: selectedStatus,
        report: description,
        studentName: studentName,
        timestamp: new Date(),
        writer,
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(newRecord),
        });

        if (!response.ok) {
            throw new Error(`Error adding report: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};
