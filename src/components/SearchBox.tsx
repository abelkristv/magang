/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import Student from "../model/Student";
import { useAuth } from "../helper/AuthProvider";
import User from "../model/User";
import { fetchUser } from "../controllers/UserController";
import { fetchAllStudents } from "../controllers/StudentController";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import notFoundImage from "../assets/not_found.png";

const SearchBox = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [companies, setCompanies] = useState([]);
    const [majors, setMajors] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [totalComments, setTotalComments] = useState<{ [key: string]: number }>({});
    const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
    const userAuth = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!);
            console.log(user);
            let students = await fetchAllStudents();

            if (user.role === "Company") {
                students = students.filter(student => student.tempat_magang === user.company_name);
            }

            setUser(user);
            setStudents(students);
            setFilteredStudents(students);
            fetchTotalComments(students);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredStudents([]);
        }
    }, [searchQuery, students]);

    useEffect(() => {
        const fetchMajors = async () => {
            const majorsCollection = collection(db, "major");
            const majorSnapshot = await getDocs(majorsCollection);
            const majorList = majorSnapshot.docs.map(doc => doc.data().name);
            console.log(majorList);
            setMajors(majorList);
        };
        fetchMajors();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            const companiesCollection = collection(db, "tempat_magang");
            const companySnapshot = await getDocs(companiesCollection);
            const companyList = companySnapshot.docs.map(doc => doc.data().name);
            console.log(companyList);
            setCompanies(companyList);
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchPeriods = async () => {
            const periodsCollection = collection(db, "period");
            const periodSnapshot = await getDocs(periodsCollection);
            const periodList = periodSnapshot.docs.map(doc => doc.data().name);
            setPeriods(periodList);
        };
        fetchPeriods();
    }, []);

    const fetchTotalComments = async (students) => {
        const newTotalComments = {};
        for (const student of students) {
            const commentsCollection = collection(db, "studentReportComment");
            const commentsQuery = query(commentsCollection, where("studentName", "==", student.name));
            const commentsSnapshot = await getDocs(commentsQuery);
            console.log(commentsSnapshot);
            newTotalComments[student.name] = commentsSnapshot.size;
        }
        setTotalComments(newTotalComments);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        let filtered = students;
        if (searchQuery.trim() !== "") {
            filtered = students.filter(student =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedPeriod) {
            filtered = filtered.filter(student => student.period === selectedPeriod);
        }

        if (selectedCompany) {
            filtered = filtered.filter(student => student.tempat_magang === selectedCompany);
        }

        if (selectedMajor) {
            filtered = filtered.filter(student => student.major === selectedMajor);
        }

        if (sortField) {
            filtered.sort((a, b) => {
                if (a[sortField] < b[sortField]) {
                    return sortOrder === "asc" ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sortOrder === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredStudents(filtered);

        if (!searchHistory.includes(searchQuery)) {
            setSearchHistory([searchQuery, ...searchHistory].slice(0, 5));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleViewChange = (event) => {
        setIsGridView(event.target.value === 'grid');
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        handleSearch();
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
        handleSearch();
    };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
        handleSearch();
    };

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
        handleSearch();
    };

    const handleSearchFocus = () => {
        setIsSearchHistoryOpen(true);
    };

    const handleSearchBlur = () => {
        setTimeout(() => setIsSearchHistoryOpen(false), 100); // Delay to allow click event to register
    };

    const handleSearchHistoryClick = (query) => {
        setSearchQuery(query);
        handleSearch();
        setIsSearchHistoryOpen(false);
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const contentSide = css`
        margin-top: 50px;
        width: 100%;
    `;

    const searchRow = css`
        display: flex;
        position: relative;

        input {
            padding: 15px;
            border-radius: 50px 0px 0px 50px;
            border: 1px solid #000000;
            width: 50%;

            &:focus {
                outline: none;
            }
        }
    `;

    const buttonStyle = css`
        background-color: #000000;
        border: none;
        border-radius: 0px 20px 20px 0px;
        padding: 10px 10px 10px 5px;
        width: 50px;
        margin-right: 74px;

        &:hover {
            cursor: pointer;
            background-color: #000000;
        }
    `;

    const checkbox = css`
        display: flex;
        align-items: center;
        font-size: 15px;
        gap: 5px;

        input{
            width: 20px;
            height: 20px;
        }
    `;

    const viewChooserStyle = css`
        display: flex;
        gap: 10px;
    `;

    const studentRow = css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    `;

    const cardStyle = css`
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 20px;
        align-items: center;
        height: 200px;

        img {
            height: 100%;
            width: 150px;
            border-radius: 8px;
            object-fit: cover;
        }

        p {
            margin: 5px 0;
        }
    `;

    const cardStudentDescription = css`
        text-align: start;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `;

    const buttonContainerStyle = css`
        display: flex;
        justify-content: end;
        width: 100%;
    `;

    const filterViewStyle = css`
        display: flex;
        align-items: center;
        margin-left: 88px;
        gap: 10px;
        position: relative;
    `;

    const dropdownStyle = css`
        padding: 10px;
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        width: 200px;
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const dropdownContentStyle = css`
        display: ${isDropdownOpen ? 'block' : 'none'};
        position: absolute;
        background-color: #EBEBEB;
        top: 120%;
        left: -10%;
        text-align: start;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        z-index: 1;

        p {
            margin: 0;
            padding: 10px 0px 10px 0px;
            cursor: pointer;
        }

        select {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: white;
            font-size: 15px;
            cursor: pointer;
        }
    `;

    const tableStyle = css`
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        border-radius: 10px;

        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
            cursor: pointer;
        }

        th {
            background-color: #f2f2f2;
        }
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

    const resultsStyle = css`
        margin-top: 40px;
        font-size: 25px;
        font-weight: bold;
        text-align: start;
    `;

    const searchHistoryStyle = css`
        position: absolute;
        top: 100%;
        left: 0;
        width: 51%;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px 8px 8px 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1;
        max-height: 200px;
        overflow-y: auto;

        p {
            padding: 10px;
            margin: 0;
            cursor: pointer;
            text-align: start;

            &:hover {
                background-color: #f2f2f2;
            }
        }
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Search</p>
            </div>
            <div className="contentSide" css={contentSide}>
                <div className="searchRow" css={searchRow}>
                    <input
                        type="text"
                        placeholder="Find Your Student"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                    />
                    {isSearchHistoryOpen && searchHistory.length > 0 && (
                        <div className="searchHistory" css={searchHistoryStyle}>
                            {searchHistory.map((history, index) => (
                                <p key={index} onClick={() => handleSearchHistoryClick(history)}>{history}</p>
                            ))}
                        </div>
                    )}
                    <button className="buttonStyle" css={buttonStyle} onClick={handleSearch}>
                        <Icon icon={"tabler:search"} color="white" fontSize={20} />
                    </button>
                    <div className="viewChooser" css={viewChooserStyle}>
                        <div className="checkbox" css={checkbox}>
                            <input type="checkbox" id="gridView" name="view" value="grid" checked={isGridView} onChange={handleViewChange} />
                            <label>Grid View</label>
                        </div>
                        <div className="checkbox" css={checkbox}>
                            <input type="checkbox" id="tableView" name="view" value="table" checked={!isGridView} onChange={handleViewChange} />
                            <label>Table View</label>
                        </div>
                    </div>
                    <div className="filterView" css={filterViewStyle}>
                        <p>Filter View: </p>
                        <div className="dropdown" css={dropdownStyle} onClick={toggleDropdown}>
                            <p>All Students</p>
                            <Icon icon={"weui:arrow-filled"} rotate={45} />
                        </div>
                        <div className="dropdown-content" css={dropdownContentStyle}>
                            <p>Period</p>
                            <select onChange={handlePeriodChange}>
                                <option value="">All</option>
                                {companies.map((periods, index) => (
                                    <option key={index} value={periods}>{periods}</option>
                                ))}
                            </select>
                            {user?.role == "Enrichment" && (
                                <>
                                    <p>Company</p>
                                    <select onChange={handleCompanyChange}>
                                        <option value="">All</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company}>{company}</option>
                                        ))}
                                    </select>  
                                </>
                            )}
                            <p>Major</p>
                            <select onChange={handleMajorChange}>
                                <option value="">All</option>
                                {majors.map((major, index) => (
                                    <option key={index} value={major}>{major}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div css={resultsStyle}>
                    Search Results: {filteredStudents.length}
                </div>
                {filteredStudents.length > 0 ? (
                    isGridView ? (
                        <div className="studentRow" css={studentRow}>
                            {filteredStudents.map(student => (
                                <div key={student.id} className="card" css={cardStyle}>
                                    <img src={student.image_url} alt={student.name} />
                                    <div className="student-description" css={cardStudentDescription}>
                                        <div className="text">
                                            <p style={{ fontWeight: "bold", fontSize: "30px" }}>{student.name}</p>
                                            <p>{student.nim}</p>
                                            <p>{student.email}</p>
                                        </div>
                                        <div className="buttonContainer" css={buttonContainerStyle}>
                                            <p>Total Comments: </p><span style={{ marginLeft: "10px", fontWeight: "bold", backgroundColor: "#49A8FF", color: "white", padding: "10px", textAlign: "center", width: "20px", height: "20px", borderRadius: "5px" }}>{totalComments[student.name] || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table css={tableStyle}>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('nim')}>NIM {sortField === 'nim' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                    <th>Total Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.nim}</td>
                                        <td>{student.email}</td>
                                        <td>{totalComments[student.name] || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : (
                    <div css={totalStyle}>
                        <img src={notFoundImage} alt="" />
                        <p>No Student Found</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default SearchBox;
