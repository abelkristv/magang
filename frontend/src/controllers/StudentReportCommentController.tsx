import Student from "../model/Student";

export const fetchTotalComments = async (students: Student[]): Promise<{ [key: string]: number }> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/reports/total-comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ students }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error fetching total comments:', error);
        return {};
    }
};