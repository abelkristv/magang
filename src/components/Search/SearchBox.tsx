/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Student from "../../model/Student";
import { useAuth } from "../../helper/AuthProvider";
import User from "../../model/User";
import { fetchUser } from "../../controllers/UserController";
import { fetchAllStudents } from "../../controllers/StudentController";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import notFoundImage from "../../assets/not_found.png";
import MainBox from "../elementary/MainBox";
import SearchInput from "./SearchInput";
import ViewChooser from "./ViewChooser";
import FilterDropdown from "./FilterDropdown";
import StudentCard from "./StudentCard";
import StudentTable from "./StudentTable";
import SearchHistory from "./SearchHistory";
import { SearchState, FilterOptions } from "./Interfaces";
import { fetchAllCompanies } from "../../controllers/CompanyController";
import { fetchAllMajors } from "../../controllers/MajorController";

interface SearchBoxProps {
    onSelectStudent: (studentId: string | null) => void;
}

const SearchBox = ({ onSelectStudent }: SearchBoxProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [periods, setPeriods] = useState<string[]>([]);
    const [totalComments, setTotalComments] = useState<{ [key: string]: number }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const userAuth = useAuth();

    const [searchState, setSearchState] = useState<SearchState>({
        searchQuery: "",
        isDropdownOpen: false,
        isGridView: true,
        sortField: null,
        sortOrder: "asc",
        isSearchHistoryOpen: false,
    });

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        selectedPeriod: "",
        selectedCompany: "",
        selectedMajor: "",
        periods: [],
        companies: [],
        majors: [],
        userRole: null,
    });

    const [tempFilterOptions, setTempFilterOptions] = useState<FilterOptions>({
        selectedPeriod: "",
        selectedCompany: "",
        selectedMajor: "",
        periods: [],
        companies: [],
        majors: [],
        userRole: null,
    });

    onSelectStudent(null);

    useEffect(() => {
        const fetchPeriods = async () => {
            const periodsCollection = collection(db, "period");
            const periodSnapshot = await getDocs(periodsCollection);
            const periodList = periodSnapshot.docs.map(doc => doc.data().name);
            setPeriods(periodList);
            setFilterOptions(prev => ({
                ...prev,
                periods: periodList,
            }));
            setTempFilterOptions(prev => ({
                ...prev,
                periods: periodList,
            }));
        };

        const fetchData = async () => {
            setIsLoading(true);
            const user: User = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);
            if (user.id === "null") {
                console.log("User not found");
            }

            const students: Student[] = await fetchAllStudents()
                .then((student) => student._tag === "Some" ? student.value : [{ iden: "null" }] as Student[])
                .then((students) =>
                    user.role === "Company" ?
                        students.filter(student => student.tempat_magang === user.company_name) :
                        students);

            if (students[0].iden === "null") {
                console.log("Students not found");
            }

            const companies: Company[] = await fetchAllCompanies()
                .then((companies) => companies._tag === "Some" ? companies.value : [{ id: "null" }] as Company[]);

            if (companies[0].id === "null") {
                console.log("Company not found");
            }

            const majors: Major[] = await fetchAllMajors()
                .then((majors) => majors._tag === "Some" ? majors.value : [{ id: "null" }] as Major[]);

            if (majors[0].id === "null") {
                console.log("Majors not found");
            }

            setUser(user);
            setStudents(students);
            setFilteredStudents(students);
            setCompanies(companies);
            setMajors(majors);
            fetchTotalComments(students);

            setFilterOptions(prev => ({
                ...prev,
                userRole: user.role,
                companies: companies,
                majors: majors,
            }));

            setTempFilterOptions(prev => ({
                ...prev,
                userRole: user.role,
                companies: companies,
                majors: majors,
            }));

            setIsLoading(false);
        };

        fetchPeriods();
        fetchData();
    }, [userAuth]);

    useEffect(() => {
        if (searchState.searchQuery.trim() === "") {
            setFilteredStudents([]);
        }
    }, [searchState.searchQuery, students]);

    const fetchTotalComments = async (students: Student[]) => {
        const newTotalComments: { [key: string]: number } = {};
    
        for (const student of students) {
            const studentReportsCollection = collection(db, "studentReport");
            const studentReportsQuery = query(studentReportsCollection, where("studentName", "==", student.name));
            const studentReportsSnapshot = await getDocs(studentReportsQuery);
    
            // Extract all report IDs related to the student
            const reportIds = studentReportsSnapshot.docs.map(doc => doc.id);
    
            if (reportIds.length > 0) {
                const commentsCollection = collection(db, "studentReportComment");
                const commentsQuery = query(commentsCollection, where("reportID", "in", reportIds));
                const commentsSnapshot = await getDocs(commentsQuery);
    
                // Count the number of comments for this student
                newTotalComments[student.name] = commentsSnapshot.size;
            } else {
                // If there are no reports, set the total comments to 0
                newTotalComments[student.name] = 0;
            }
        }
    
        setTotalComments(newTotalComments);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchState(prevState => ({
            ...prevState,
            searchQuery: event.target.value,
            isSearchHistoryOpen: event.target.value.trim() !== "",
        }));
    };

    const handleSearch = () => {
        let filtered = students;
        if (searchState.searchQuery.trim() !== "") {
            filtered = students.filter(student =>
                student.name.toLowerCase().includes(searchState.searchQuery.toLowerCase()) ||
                student.nim.toLowerCase().includes(searchState.searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchState.searchQuery.toLowerCase())
            );
        }

        if (filterOptions.selectedPeriod) {
            filtered = filtered.filter(student => student.period === filterOptions.selectedPeriod);
        }

        if (filterOptions.selectedCompany) {
            filtered = filtered.filter(student => student.tempat_magang === filterOptions.selectedCompany);
        }

        if (filterOptions.selectedMajor) {
            filtered = filtered.filter(student => student.major === filterOptions.selectedMajor);
        }

        if (searchState.sortField) {
            filtered.sort((a, b) => {
                if (a[searchState.sortField!] < b[searchState.sortField!]) {
                    return searchState.sortOrder === "asc" ? -1 : 1;
                }
                if (a[searchState.sortField!] > b[searchState.sortField!]) {
                    return searchState.sortOrder === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredStudents(filtered);

        if (!searchHistory.includes(searchState.searchQuery)) {
            setSearchHistory([searchState.searchQuery, ...searchHistory].slice(0, 5));
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleDropdown = () => {
        setSearchState(prevState => ({
            ...prevState,
            isDropdownOpen: !prevState.isDropdownOpen,
        }));
    };

    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchState(prevState => ({
            ...prevState,
            isGridView: event.target.value === 'grid',
        }));
    };

    const handleSort = (field: string) => {
        setSearchState(prevState => ({
            ...prevState,
            sortField: field,
            sortOrder: prevState.sortField === field && prevState.sortOrder === "asc" ? "desc" : "asc",
        }));
        handleSearch();
    };

    const handleTempPeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempFilterOptions(prevState => ({
            ...prevState,
            selectedPeriod: event.target.value,
        }));
    };

    const handleTempCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempFilterOptions(prevState => ({
            ...prevState,
            selectedCompany: event.target.value,
        }));
    };

    const handleTempMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempFilterOptions(prevState => ({
            ...prevState,
            selectedMajor: event.target.value,
        }));
    };

    const handleApplyFilters = () => {
        setFilterOptions(tempFilterOptions);
        handleSearch();
        toggleDropdown();
    };

    const handleSearchFocus = () => {
        setSearchState(prevState => ({
            ...prevState,
            isSearchHistoryOpen: true,
        }));
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setSearchState(prevState => ({
                ...prevState,
                isSearchHistoryOpen: false,
            }));
        }, 100); // Delay to allow click event to register
    };

    const handleSearchHistoryClick = (query: string) => {
        setSearchState(prevState => ({
            ...prevState,
            searchQuery: query,
            isSearchHistoryOpen: false,
        }));
        handleSearch();
    };

    const searchContainerStyle = css`
        display: flex;
        align-items: center;
        gap: 65px;
        margin-top: 30px;
        position: relative;
    `;

    const resultsStyle = css`
        margin-top: 40px;
        font-size: 20px;
        font-weight: 500;
        text-align: start;
    `;

    const studentRow = css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    `;

    const totalStyle = css`
        margin-top: 40px;
        font-size: 25px;
        font-weight: bold;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 700px;
        img {
            height: 372px;
            width: 372px;
        }
    `;

    const searchHistoryWrapperStyle = css`
        position: relative;
        width: 808px;
    `;

    return (
        <MainBox navText="Search">
            <div css={searchContainerStyle}>
                <div css={searchHistoryWrapperStyle}>
                    <SearchInput
                        searchQuery={searchState.searchQuery}
                        onSearchChange={handleSearchChange}
                        onSearch={handleSearch}
                        onKeyDown={handleKeyDown}
                        onSearchFocus={handleSearchFocus}
                        onSearchBlur={handleSearchBlur}
                    />
                    <SearchHistory
                        searchHistory={searchHistory}
                        isSearchHistoryOpen={searchState.isSearchHistoryOpen}
                        handleSearchHistoryClick={handleSearchHistoryClick}
                    />
                </div>
                <ViewChooser
                    isGridView={searchState.isGridView}
                    onViewChange={handleViewChange}
                />
                <FilterDropdown
                    isDropdownOpen={searchState.isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                    tempSelectedPeriod={tempFilterOptions.selectedPeriod}
                    tempSelectedCompany={tempFilterOptions.selectedCompany}
                    tempSelectedMajor={tempFilterOptions.selectedMajor}
                    periods={filterOptions.periods}
                    companies={filterOptions.companies}
                    majors={filterOptions.majors}
                    userRole={filterOptions.userRole}
                    handleTempPeriodChange={handleTempPeriodChange}
                    handleTempCompanyChange={handleTempCompanyChange}
                    handleTempMajorChange={handleTempMajorChange}
                    handleApplyFilters={handleApplyFilters}
                />
            </div>
            <div css={resultsStyle}>
                Search Results: {filteredStudents.length}
            </div>
            {filteredStudents.length > 0 ? (
                searchState.isGridView ? (
                    <div className="studentRow" css={studentRow}>
                        {filteredStudents.map((student, index) => (
                            <StudentCard 
                                key={student.id} 
                                student={student} 
                                onClick={() => onSelectStudent(student.iden)} 
                                totalComments={totalComments[student.name] || 0} 
                                isLoading={isLoading} 
                            />
                        ))}
                    </div>
                ) : (
                    <StudentTable
                        students={filteredStudents}
                        totalComments={totalComments}
                        sortField={searchState.sortField}
                        sortOrder={searchState.sortOrder}
                        handleSort={handleSort}
                    />
                )
            ) : (
                <div css={totalStyle}>
                    <img src={notFoundImage} alt="" />
                    <p>No Student Found</p>
                </div>
            )}
        </MainBox>
    );
};

export default SearchBox;
