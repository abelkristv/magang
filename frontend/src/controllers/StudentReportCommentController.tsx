import Student from "../model/Student";

export const fetchTotalComments = async (students: Student[]): Promise<{ [key: string]: number }> => {
    try {
        const response = await fetch('http://localhost:3001/api/total-comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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