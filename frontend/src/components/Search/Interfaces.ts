import Student from "../../model/Student";

export interface FilterOptions {
    selectedPeriod: string;
    selectedCompany: string;
    selectedMajor: string;
    selectedStatus: string;
    periods: string[];
    companies: Company[];
    majors: Major[];
    userRole: string | null;
}

export interface SearchState {
    searchQuery: string;
    isDropdownOpen: boolean;
    isGridView: boolean;
    sortField: keyof Student | null;
    sortOrder: "asc" | "desc";
    isSearchHistoryOpen: boolean;
}
