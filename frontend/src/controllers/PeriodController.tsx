export const fetchPeriods = async (): Promise<string[]> => {
    try {
        const response = await fetch('http://localhost:3001/api/periods');

        if (!response.ok) {
            throw new Error(`Error fetching periods: ${response.statusText}`);
        }

        const periods: { name: string }[] = await response.json();
        const periodList = periods.map(period => period.name);

        return periodList;
    } catch (error) {
        console.error("Error fetching periods:", error);
        throw error;
    }
};
