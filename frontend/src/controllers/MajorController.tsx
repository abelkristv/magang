import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";

export const fetchAllMajors = async (): Promise<Option<Major[]>> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/majors`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching majors: ${response.statusText}`);
        }

        const majors: Major[] = await response.json();

        if (majors.length === 0) {
            return option.none;
        }

        return option.some(majors);
    } catch (error) {
        console.error('Error fetching majors:', error);
        return option.none;
    }
}