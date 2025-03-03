import Documentation from "../model/Documentation";
import DiscussionDetail from "../model/DiscussionDetail";



export const fetchDiscussionDetails = async (docID: string): Promise<DiscussionDetail[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/discussion-details/${docID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

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
    const token = localStorage.getItem('token');


    try {
        // const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/discussions-with-details`, {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/discussion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 

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
