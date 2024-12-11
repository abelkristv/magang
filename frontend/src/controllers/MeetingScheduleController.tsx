import { Timestamp } from "firebase/firestore";
import MeetingSchedule from "../model/MeetingSchedule";

export const fetchMeetingSchedules = async (reportIds: string[]): Promise<{ [key: string]: MeetingSchedule }> => {
    const schedules: { [key: string]: MeetingSchedule } = {};
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/meeting-schedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ reportIds }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch meeting schedules');
        }

        const data = await response.json();

        // Map the response data to the schedules object
        for (const reportId of reportIds) {
            if (data[reportId]) {
                const meetingData = data[reportId];
                
                // Convert createdAt to Firebase Timestamp and map fields to match the interface
                schedules[reportId] = {
                    id: meetingData.id,
                    createdAt: Timestamp.fromDate(new Date(meetingData.createdAt)),
                    date: meetingData.date,
                    description: meetingData.description,
                    place: meetingData.place,
                    studentReport_id: meetingData.studentReportId, // Map to studentReport_id
                    timeEnd: meetingData.timeEnd,
                    timeStart: meetingData.timeStart,
                    type: meetingData.type,
                };
            }
        }
    } catch (error) {
        console.error('Error fetching meeting schedules:', error);
    }

    return schedules;
};


export const scheduleMeeting = async (
    data: {
        timeStart: string;
        timeEnd: string;
        description: string;
        place: string;
        date: string;
        meetingType: string;
        studentReportId: string;
    },
    existingSchedules: { [key: string]: any }
): Promise<{ [key: string]: any }> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/meeting-schedules/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to schedule meeting');
        }

        const result = await response.json();
        // alert(result.message);

        // Fetch the updated schedules
        return result.updatedSchedules;
    } catch (error) {
        console.error('Error scheduling meeting: ', error);
        alert('Failed to schedule meeting. Please try again.');
        throw error;
    }
};

