/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Student from "../../model/Student";
import { useAuth } from "../../helper/AuthProvider";
import User from "../../model/User";
import { fetchUser } from "../../controllers/UserController";
import { fetchAllStudents } from "../../controllers/StudentController";
import notFoundImage from "../../assets/not_found.png";
import MainBox from "../Elementary/MainBox";
import SearchInput from "./SearchInput";
import ViewChooser from "./ViewChooser";
import FilterDropdown from "./FilterDropdown";
import StudentCard from "./StudentCard";
import StudentTable from "./StudentTable";
import SearchHistory from "./SearchHistory";
import { SearchState, FilterOptions } from "./Interfaces";
import { fetchAllCompanies } from "../../controllers/CompanyController";
import { fetchAllMajors } from "../../controllers/MajorController";
import { fetchPeriods } from "../../controllers/PeriodController";
import { fetchTotalReportsByStudent } from "../../controllers/ReportController";

interface SearchBoxProps {
    onSelectStudent: (studentId: string | null | Student[]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSelectStudent }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [_user, setUser] = useState<User | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [_companies, setCompanies] = useState<Company[]>([]);
    const [_majors, setMajors] = useState<Major[]>([]);
    const [_periods, setPeriods] = useState<string[]>([]);
    const [comments, setComments] = useState<{ [key: string]: number }>({});
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

    useEffect(() => {
        onSelectStudent(null);

        const fetchPeriodsData = async () => {
            try {
                const periodList = await fetchPeriods();
                setPeriods(periodList);
                setFilterOptions(prev => ({
                    ...prev,
                    periods: periodList,
                }));
                setTempFilterOptions(prev => ({
                    ...prev,
                    periods: periodList,
                }));
            } catch (error) {
                console.error("Failed to fetch periods:", error);
            }
        };

        const fetchData = async () => {
            setIsLoading(true);
            const fetchedUser: User = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);

            if (fetchedUser.id === "null") {
                console.log("User not found");
            } else {
                setUser(fetchedUser);

                const fetchedStudents: Student[] = await fetchAllStudents()
                    .then((students) => students._tag === "Some" ? students.value : [{ iden: "null" }] as Student[])
                    .then((students) =>
                        fetchedUser.role === "Company" ?
                            students.filter(student => student.tempat_magang === fetchedUser.company_name) :
                            students);

                if (fetchedStudents[0].iden === "null") {
                    console.log("Students not found");
                } else {
                    setStudents(fetchedStudents);
                    setFilteredStudents(fetchedStudents);
                    const totalComments = await fetchTotalReportsByStudent(fetchedStudents); // Using fetchTotalReports here
                    setComments(totalComments);
                }

                const fetchedCompanies: Company[] = await fetchAllCompanies()
                    .then((companies) => companies._tag === "Some" ? companies.value : [{ id: "null" }] as Company[]);

                if (fetchedCompanies[0].id === "null") {
                    console.log("Company not found");
                } else {
                    setCompanies(fetchedCompanies);
                }

                const fetchedMajors: Major[] = await fetchAllMajors()
                    .then((majors) => majors._tag === "Some" ? majors.value : [{ id: "null" }] as Major[]);

                if (fetchedMajors[0].id === "null") {
                    console.log("Majors not found");
                } else {
                    setMajors(fetchedMajors);
                }

                setFilterOptions(prev => ({
                    ...prev,
                    userRole: fetchedUser.role,
                    companies: fetchedCompanies,
                    majors: fetchedMajors,
                }));

                setTempFilterOptions(prev => ({
                    ...prev,
                    userRole: fetchedUser.role,
                    companies: fetchedCompanies,
                    majors: fetchedMajors,
                }));
            }

            setIsLoading(false);
        };

        fetchPeriodsData();
        fetchData();
    }, [userAuth, onSelectStudent]);

    useEffect(() => {
        if (searchState.searchQuery.trim() === "") {
            setFilteredStudents([]);
        }
    }, [searchState.searchQuery, students]);

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
                const sortField = searchState.sortField as keyof Student;
                if (a[sortField] < b[sortField]) {
                    return searchState.sortOrder === "asc" ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
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

    const handleSort = (field: keyof Student) => {
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
        justify-content: space-between;
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
        font-size: 25px;
        font-weight: 600;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 700px;
        img {
            height: 300px;
            width: 300px;
        }
        p{
            margin-top: 10px;
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
                        {filteredStudents.map((student) => (
                            <StudentCard 
                                key={student.iden} 
                                student={student} 
                                onClick={() => onSelectStudent(student.iden)} 
                                totalComments={comments[student.name] || 0}  // Using comments for total reports
                                isLoading={isLoading} 
                            />
                        ))}
                    </div>
                ) : (
                    // <StudentTable
                    //     students={filteredStudents}
                    //     totalComments={comments}  // Using comments for total reports
                    //     sortField={searchState.sortField}
                    //     sortOrder={searchState.sortOrder}
                    //     handleSort={handleSort}
                    //     onClick={() => onSelectStudent(filteredStudents)}
                    // />
                    <StudentTable
                        students={filteredStudents}
                        totalComments={comments}
                        sortField={searchState.sortField}
                        sortOrder={searchState.sortOrder}
                        handleSort={handleSort}
                        onClick={(studentId) => onSelectStudent(studentId)}
                    />
                )
            ) : (
                <div css={totalStyle}>
                    <img src={notFoundImage} alt="No Student Found" />
                    <p>No Student Found</p>
                </div>
            )}
        </MainBox>
    );
};

export default SearchBox;
