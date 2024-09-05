import { addDoc, collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import MeetingSchedule from "../model/MeetingSchedule";
import { db } from "../firebase";

export const fetchMeetingSchedules = async (reportIds: string[]): Promise<{ [key: string]: MeetingSchedule }> => {
    const schedules: { [key: string]: MeetingSchedule } = {};

    try {
        const response = await fetch('http://localhost:3001/api/meeting-schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    try {
        const response = await fetch('http://localhost:3001/api/meeting-schedules/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

