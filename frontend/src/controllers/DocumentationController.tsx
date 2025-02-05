import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";
import Documentation from "../model/Documentation";
import User from "../model/User";
import DiscussionDetail from "../model/DiscussionDetail";

export const addDocumentation = async (
    user: any,
    title: string,
    invitationNumber: string,
    description: string,
    meetingLeader: string,
    location: string,
    time: string,
    attendees: string[],
    results: string[],
    pictures: { fileName: string; base64: string }[],
    documentationType: string,
    modalDiscussionDetails: any[]
) => {
    try {
        const parsedTime = new Date(time);
        const token = localStorage.getItem('token');


        if (!user || !user.email) {
            throw new Error("User is not defined or user email is missing");
        }

        const documentationData = {
            user,
            title,
            invitationNumber,
            description,
            meetingLeader,
            location,
            time: parsedTime.toISOString(),
            attendees,
            results,
            pictures,
            documentationType,
            modalDiscussionDetails,
        };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/documentation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(documentationData),
        });

        // const text = await response.text();
        // console.log(text)

        const result = await response.json();

        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error("Error adding documentation: ", error);
        return { success: false, message: "Failed to add documentation. Please try again.", error };
    }
};



export const fetchAllDocumentation = async (): Promise<Option<Documentation[]>> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/documentation`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );
        if (!response.ok) {
            console.error('Error fetching internal activity:', response.statusText);
            return option.none;
        }
        const documentationsData: Documentation[] = await response.json();
        if (documentationsData.length === 0) {
            return option.none;
        }
        return option.some(documentationsData);
    } catch (error) {
        console.error('Error fetching internal activity:', error);
        return option.none;
    }
}

export const fetchDocumentationsByEmail = async (email: string): Promise<Documentation[]> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/documentation/email/${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );
        
        if (!response.ok) {
            console.error("Error fetching internal activities:", response.statusText);
            return [];
        }
        
        const documentations: Documentation[] = await response.json();
        return documentations;
    } catch (error) {
        console.error("Error fetching internal activities:", error);
        return [];
    }
};

// In DocumentationController.ts
export const updateDocumentation = async (
    documentationId: string,
    user: User | undefined,
    title: string,
    invitationNumber: string,
    description: string,
    meetingLeader: string,
    location: string,
    time: string,
    attendees: string[],
    results: string[],
    pictures: { fileName: string; base64: string }[],
    documentationType: string,
    modalDiscussionDetails: DiscussionDetail[]
  ) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/documentation/${documentationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // if required
      },
      body: JSON.stringify({
        // Include the id again if your backend expects it in the payload too
        id: documentationId,
        user,
        title,
        nomor_undangan: invitationNumber,
        description,
        leader: meetingLeader,
        place: location,
        time,
        attendanceList: attendees,
        results,
        pictures,
        type: documentationType,
        discussionDetails: modalDiscussionDetails,
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to update documentation: ' + errorText);
    }
    return await response.json();
  };
  