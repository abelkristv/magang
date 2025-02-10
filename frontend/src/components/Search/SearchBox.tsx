/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Student from "../../model/Student";
import { useAuth } from "../../helper/AuthProvider";
import User from "../../model/User";
import { fetchUser } from "../../controllers/UserController";
import { fetchAllStudents, fetchStudentsByName, fetchStudentsWithFilters, PaginatedResponse } from "../../controllers/StudentController";
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
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
    onSelectStudent: (studentId: string | null ) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSelectStudent }) => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [_user, setUser] = useState<User | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [_companies, setCompanies] = useState<Company[]>([]);
    const [_majors, setMajors] = useState<Major[]>([]);
    const [_periods, setPeriods] = useState<string[]>([]);
    const [comments, setComments] = useState<{ [key: string]: number }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [studentResponse, setStudentResponse] = useState<PaginatedResponse>({pagination: {currentPage : 1, limit: 12}} as PaginatedResponse);
    const userAuth = useAuth();

    const handleStudentSelect = (studentId: string) => {
        onSelectStudent(studentId);
        navigate(`/enrichment-documentation/workspaces/student-detail/${studentId}`);
    };

    const [searchState, setSearchState] = useState<SearchState>({
        searchQuery: "",
        isDropdownOpen: false,
        isGridView: false,
        sortField: null,
        sortOrder: "asc",
        isSearchHistoryOpen: false,
    });    

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        selectedPeriod: "",
        selectedCompany: "",
        selectedMajor: "",
        selectedStatus: "", // New
        periods: [],
        companies: [],
        majors: [],
        userRole: null,
    });
    
    const [tempFilterOptions, setTempFilterOptions] = useState<FilterOptions>({
        selectedPeriod: "",
        selectedCompany: "",
        selectedMajor: "",
        selectedStatus: "", // New
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
        
            if (!isSearching) {
                const fetchedUser: User = await fetchUser(userAuth?.currentUser?.email!)
                    .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);
        
                if (fetchedUser.id === "null") {
                    console.log("User not found");
                } else {
                    setUser(fetchedUser);
        
                    const fetchedResponse: PaginatedResponse = await fetchAllStudents(
                        studentResponse.pagination.currentPage,
                        studentResponse.pagination.limit
                    ).then((students) => students._tag === "Some" ? students.value : {} as PaginatedResponse);
        
                    console.log("Fetched response:", fetchedResponse);
        
                    setStudentResponse(fetchedResponse);
                    setStudents(fetchedResponse.students);
                    setFilteredStudents(fetchedResponse.students);
        
                    // Fetch total comments count
                    const totalComments = await fetchTotalReportsByStudent(fetchedResponse.students);
                    setComments(totalComments);
                }
            }
        
            setIsLoading(false);
        };
        
    
        fetchPeriodsData();
        fetchData();
    }, [userAuth, onSelectStudent, isSearching, studentResponse.pagination.currentPage]);
    

    useEffect(() => {
        if (searchState.searchQuery.trim() === "") {
            setSearchState(prevState => ({
                ...prevState,
                searchQuery: "",
            }));
            setIsSearching(false);
        }
    }, [searchState.searchQuery, students]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchState(prevState => ({
            ...prevState,
            searchQuery: event.target.value,
            isSearchHistoryOpen: event.target.value.trim() !== "",
        }));
    };

    const handleSearch = async (page: number = 1) => {
        let filtered: Student[] = [];
        let paginationData: PaginatedResponse["pagination"] = studentResponse.pagination;
    
        try {
            const response = await fetchStudentsWithFilters(
                page,
                studentResponse.pagination.limit,
                searchState.searchQuery.trim(),
                filterOptions.selectedPeriod
            );
    
            if (response._tag === "Some") {
                const { students: fetchedStudents, pagination } = response.value;
                filtered = fetchedStudents;
                paginationData = pagination;
            } else {
                console.log("No students found.");
            }
        } catch (error) {
            console.error("Error while searching students:", error);
        }
    
        setFilteredStudents(filtered);
        setStudentResponse(prev => ({ ...prev, pagination: paginationData }));
    
        if (!searchHistory.includes(searchState.searchQuery) && searchState.searchQuery.trim() !== "") {
            setSearchHistory([searchState.searchQuery, ...searchHistory].slice(0, 5));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const fetchedResponse: PaginatedResponse = await fetchAllStudents(
                studentResponse.pagination.currentPage,
                studentResponse.pagination.limit
            ).then((students) => students._tag === "Some" ? students.value : {} as PaginatedResponse);
    
            setStudentResponse(fetchedResponse);
            setStudents(fetchedResponse.students);
            setFilteredStudents(fetchedResponse.students);
            setIsLoading(false);
        };
    
        fetchData();
    }, [userAuth, studentResponse.pagination.currentPage, studentResponse.pagination.limit]);  // 👈 Reacts to limit changes
    
    
    
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
        const updatedOptions = { ...filterOptions, ...tempFilterOptions };
    
        setFilterOptions(updatedOptions);
    
        handleSearchWithOptions(updatedOptions);
    
        toggleDropdown();
    };
    
    
    
    
    const handleSearchWithOptions = async (options: FilterOptions) => {
        let filtered: Student[] = [];
        let paginationData: PaginatedResponse["pagination"] = studentResponse.pagination;
    
        try {
            const response = await fetchStudentsWithFilters(
                studentResponse.pagination.currentPage,
                studentResponse.pagination.limit,
                searchState.searchQuery.trim(),
                options.selectedPeriod,
                options.selectedStatus // New
            );
    
            if (response._tag === "Some") {
                const { students: fetchedStudents, pagination } = response.value;
                filtered = fetchedStudents;
                paginationData = pagination;
            } else {
                console.log("No students found.");
            }
        } catch (error) {
            console.error("Error while applying filters:", error);
        }
    
        setFilteredStudents(filtered);
        setStudentResponse(prev => ({ ...prev, pagination: paginationData }));
    
        if (!searchHistory.includes(searchState.searchQuery) && searchState.searchQuery.trim() !== "") {
            setSearchHistory([searchState.searchQuery, ...searchHistory].slice(0, 5));
        }
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

    const renderPagination = () => {
        const totalPages = studentResponse.pagination?.totalPages || 1;
        const currentPage = studentResponse.pagination?.currentPage || 1;
    
        const paginationStyle = css`
            display: flex;
            justify-content: end;
            margin-top: 20px;
            gap: 5px;
    
            button {
                padding: 5px 10px;
                border: 1px solid #ddd;
                background-color: #f9f9f9;
                cursor: pointer;
                border-radius: 5px;
                font-size: 14px;
    
                &:hover {
                    background-color: #eaeaea;
                }
    
                &:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            }
    
            .active {
                background-color: #ddd;
                font-weight: bold;
            }
        `;
    
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
    
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        return (
            <div css={paginationStyle}>
                {/* <span>{studentResponse.pagination.totalStudents} Result(s)</span> */}
                <label> Show: </label>
                <select
                    value={studentResponse.pagination.limit}
                    onChange={(e) => setStudentResponse(prev => ({
                        ...prev,
                        pagination: { currentPage: 1, limit: parseInt(e.target.value), totalPages: prev.pagination.totalPages, totalStudents: prev.pagination.totalStudents }
                    }))}
                >
                    {[10, 20, 30, 50].map(limit => (
                        <option key={limit} value={limit}>{limit}</option>
                    ))}
                </select>
                <button onClick={() => setStudentResponse(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, currentPage: 1 }
                }))} disabled={currentPage === 1}>
                    &laquo;
                </button>
    
                <button onClick={() => setStudentResponse(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, currentPage: prev.pagination.currentPage - 1 }
                }))} disabled={currentPage === 1}>
                    &lsaquo;
                </button>
    
                <span>Page:</span>
                <select
                    value={currentPage}
                    onChange={(e) => setStudentResponse(prev => ({
                        ...prev,
                        pagination: { ...prev.pagination, currentPage: parseInt(e.target.value) }
                    }))}
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>{page}</option>
                    ))}
                </select>
    
                <button onClick={() => setStudentResponse(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, currentPage: prev.pagination.currentPage + 1 }
                }))} disabled={currentPage === totalPages}>
                    &rsaquo;
                </button>
    
                <button onClick={() => setStudentResponse(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, currentPage: totalPages }
                }))} disabled={currentPage === totalPages}>
                    &raquo;
                </button>
            </div>
        );
    };
    
    return (
        <MainBox navText="Student">
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
                    tempSelectedStatus={tempFilterOptions.selectedStatus} // New
                    periods={filterOptions.periods}
                    companies={filterOptions.companies}
                    majors={filterOptions.majors}
                    userRole={filterOptions.userRole}
                    handleTempPeriodChange={handleTempPeriodChange}
                    handleTempCompanyChange={handleTempCompanyChange}
                    handleTempMajorChange={handleTempMajorChange}
                    handleTempStatusChange={(event) => setTempFilterOptions(prev => ({
                        ...prev,
                        selectedStatus: event.target.value,
                    }))} // New
                    handleApplyFilters={handleApplyFilters}
                />

            </div>
            <div css={resultsStyle}>
                Search Results: {studentResponse.pagination.totalStudents}
            </div>
            {filteredStudents.length > 0 ? (
                searchState.isGridView ? (
                    <div className="studentRow" css={studentRow}>
                        {filteredStudents.map((student) => (
                            <StudentCard 
                                key={student.iden} 
                                student={student} 
                                onClick={() => handleStudentSelect(student.iden)} 
                                totalComments={comments[student.name] || 0}
                                isLoading={isLoading} 
                            />
                        ))}
                    </div>
                ) : (
                    <StudentTable
                        students={filteredStudents}
                        totalComments={comments}
                        sortField={searchState.sortField}
                        sortOrder={searchState.sortOrder}
                        handleSort={handleSort}
                        onClick={(studentId) => handleStudentSelect(studentId)}
                    />

                )
            ) : (
                <div css={totalStyle}>
                    <img src={notFoundImage} alt="No Student Found" />
                    <p>No Student Found</p>
                </div>
            )}
            {renderPagination()}
        </MainBox>
    );
};

export default SearchBox;
