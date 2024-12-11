import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";
import Documentation from "../model/Documentation";

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
            console.error('Error fetching documentation:', response.statusText);
            return option.none;
        }
        const documentationsData: Documentation[] = await response.json();
        if (documentationsData.length === 0) {
            return option.none;
        }
        return option.some(documentationsData);
    } catch (error) {
        console.error('Error fetching documentation:', error);
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
            console.error("Error fetching documentations:", response.statusText);
            return [];
        }
        
        const documentations: Documentation[] = await response.json();
        return documentations;
    } catch (error) {
        console.error("Error fetching documentations:", error);
        return [];
    }
};
