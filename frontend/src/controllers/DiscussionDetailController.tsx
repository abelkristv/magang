import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path based on your project structure
import Documentation from "../model/Documentation";
import DiscussionDetail from "../model/DiscussionDetail";



export const fetchDiscussionDetails = async (docID: string): Promise<DiscussionDetail[]> => {
    try {
        const response = await fetch(`http://localhost:3001/api/discussion-details/${docID}`);

        if (!response.ok) {
            throw new Error('Failed to fetch discussion details');
        }

        const details: DiscussionDetail[] = await response.json();
        return details;
    } catch (error) {
        console.error('Error fetching discussion details:', error);
        return [];
    }
};


const formatDate = (timestamp: any): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (timestamp: any): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

export const fetchDiscussionsWithDetails = async (filteredDocs: Documentation[]): Promise<any[]> => {
    const docIds = filteredDocs.map(doc => doc.id);

    try {
        const response = await fetch('http://localhost:3001/api/discussions-with-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ docIds }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch discussions with details');
        }

        const discussionsWithDetails = await response.json();
        return discussionsWithDetails;
    } catch (error) {
        console.error('Error fetching discussions with details:', error);
        return [];
    }
};
