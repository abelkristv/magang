import { Timestamp } from "firebase/firestore";
import MeetingSchedule from "../model/MeetingSchedule";
import { encryptData, SECRET_KEY } from "../helper/sharedKeys";

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

        for (const reportId of reportIds) {
            if (data[reportId]) {
                const meetingData = data[reportId];
                
                schedules[reportId] = {
                    id: meetingData.id,
                    createdAt: Timestamp.fromDate(new Date(meetingData.createdAt)),
                    date: meetingData.date,
                    description: meetingData.description,
                    place: meetingData.place,
                    studentReport_id: meetingData.studentReportId, 
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
        const encryptedPayload = encryptData(data, SECRET_KEY);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/meeting-schedules/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ encryptedData: encryptedPayload }),
        });

        if (!response.ok) {
            throw new Error('Failed to schedule meeting');
        }

        const result = await response.json();
        return result.updatedSchedules;
    } catch (error) {
        console.error('Error scheduling meeting: ', error);
        alert('Failed to schedule meeting. Please try again.');
        throw error;
    }
};


export const deleteMeetingSchedule = async (meetingScheduleId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/meeting-schedules/${meetingScheduleId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = `Failed to delete meeting schedule (Status: ${response.status} ${response.statusText}). Details: ${errorText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in deleteMeetingSchedule:", error);
      throw error;
    }
  };
  