export const fetchPeriods = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/periods`);

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
