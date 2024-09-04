import User from "../model/User";
import { Option } from "fp-ts/lib/Option";
import { option } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Report } from "../model/Report";
import { fetchAllCompanies } from "./CompanyController";

const fetchUser = async (email: string): Promise<Option<User>> => {
    try {
        const response = await fetch(`http://localhost:3001/api/user/email/${email}`);
        
        if (!response.ok) {
            console.error('Error fetching user:', response.statusText);
            return option.none;
        }
        
        const data = await response.json();

        const user: User = {
            id: data.id,
            email: data.email,
            image_url: data.imageUrl,       
            name: data.name,
            role: data.role,
            company_name: data.companyName,
            phone_number: data.phoneNumber  
        };

        return option.some(user);
        
    } catch (error) {
        console.error('Error fetching user:', error);
        return option.none;
    }
};

const fetchUserNames = async (reports: Report[]): Promise<{ [key: string]: string }> => {
    const uniqueEmails = [...new Set(reports.map(report => report.writer))];

    try {
        const response = await fetch('http://localhost:3001/api/user/names', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emails: uniqueEmails }),
        });

        if (!response.ok) {
            console.error('Error fetching user names:', response.statusText);
            return {};
        }

        const emailToNameMap: { [key: string]: string } = await response.json();
        return emailToNameMap;
    } catch (error) {
        console.error('Error fetching user names:', error);
        return {};
    }
};


export const fetchUserAndCompanies = async (email: string | undefined) => {
    if (!email) return { user: undefined, companyAddress: undefined };

    const fetchedUser = await fetchUser(email)
        .then(user => user._tag === "Some" ? user.value : { id: "null" } as User);

    if (fetchedUser.id === "null") {
        console.log("User not found");
        return { user: undefined, companyAddress: undefined };
    }

    const companiesResult = await fetchAllCompanies();
    let companyAddress;
    if (companiesResult._tag === "Some") {
        const company = companiesResult.value.find(c => c.company_name === fetchedUser.company_name);
        companyAddress = company?.company_address;
    } else {
        console.error("No companies found");
    }

    return { userFetched: fetchedUser, companyAddress };
};

export const updateUser = async (updatedUser: User) => {
    try {
        const response = await axios.put(`/api/user/${updatedUser.id}`, updatedUser);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
};

export {fetchUser, fetchUserNames}
