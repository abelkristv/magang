import { option } from "fp-ts";
import { Option } from "fp-ts/lib/Option";


export const fetchAllCompanies = async (): Promise<Option<Company[]>> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/companies`);

        if (!response.ok) {
            throw new Error(`Error fetching companies: ${response.statusText}`);
        }

        const companies: any[] = await response.json();
        console.log(companies)

        if (companies.length === 0) {
            return option.none;
        }

        const formattedCompanies: Company[] = companies.map(company => ({
            id: company.id,
            company_address: company.companyAddress,
            company_detail: company.companyDetail,
            company_name: company.companyName,
        }));

        return option.some(formattedCompanies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return option.none;
    }
}
