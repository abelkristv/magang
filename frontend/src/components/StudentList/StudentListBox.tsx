/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import Student from "../../model/Student";
import User from "../../model/User";
import { useAuth } from "../../helper/AuthProvider";
import { fetchUser } from "../../controllers/UserController";
import { fetchAllStudents } from "../../controllers/StudentController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { css } from "@emotion/react";
import { fetchAllCompanies } from "../../controllers/CompanyController";
import { fetchAllMajors } from "../../controllers/MajorController";
import { fetchPeriods } from "../../controllers/PeriodController";
import notFoundImage from "../../assets/not_found.png";

interface StudentListBoxProps {
    onSelectStudent: (studentId: string | null) => void;
}

const StudentListBox = ({ onSelectStudent }: StudentListBoxProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, _setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isGridView, _setIsGridView] = useState<boolean>(true);
    const [sortField, setSortField] = useState<keyof Student | null>(null); // Use keyof Student
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [majors, setMajors] = useState<string[]>([]);
    const [periods, setPeriods] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [selectedMajor, setSelectedMajor] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

    // State to hold temporary filter values before applying
    const [tempSelectedPeriod, setTempSelectedPeriod] = useState<string>("");
    const [tempSelectedCompany, setTempSelectedCompany] = useState<string>("");
    const [tempSelectedMajor, setTempSelectedMajor] = useState<string>("");

    const userAuth = useAuth();

    onSelectStudent(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);

            if (user.id === "null") {
                console.log("User not found");
            }

            const allStudents = await fetchAllStudents()
                .then((students) => students._tag === "Some" ? students.value : [{ iden: "null" }] as Student[])
                .then(
                    (students) => user.role === "Company" ?
                        students.filter(student => student.tempat_magang === user.company_name) :
                        students
                );

            if (allStudents[0].iden === "null") {
                console.log("Students not found");
            }

            const companies = await fetchAllCompanies()
                .then((companies) => companies._tag === "Some" ? companies.value : [{ id: "null" }] as Company[]);

            if (companies[0].id === "null") {
                console.log("Companies not found");
            }

            setUser(user);
            setStudents(allStudents);
            setCompanies(companies);
            setFilteredStudents(allStudents);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchMajors = async () => {
            const majorListCollection = await fetchAllMajors();
            if (majorListCollection._tag == 'Some') {
                setMajors(majorListCollection.value.map(major => major.name))
            }
        };
        fetchMajors();
    }, []);

    useEffect(() => {
        const loadPeriods = async () => {
            try {
                const periodList = await fetchPeriods();
                setPeriods(periodList);
            } catch (error) {
                console.error("Error loading periods:", error);
            }
        };
        loadPeriods();
    }, []);

    useEffect(() => {
        let filtered = students;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedPeriod) {
            filtered = filtered.filter(student => selectedPeriod.includes(student.period));
        }

        if (selectedCompany) {
            filtered = filtered.filter(student => student.tempat_magang === selectedCompany);
        }

        if (selectedMajor) {
            filtered = filtered.filter(student => student.major === selectedMajor);
        }

        if (sortField) {
            filtered.sort((a, b) => {
                if (a[sortField]! < b[sortField]!) {
                    return sortOrder === "asc" ? -1 : 1;
                }
                if (a[sortField]! > b[sortField]!) {
                    return sortOrder === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredStudents(filtered);
    }, [searchQuery, students, sortField, sortOrder, selectedPeriod, selectedCompany, selectedMajor]);

    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchQuery(event.target.value);
    // };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setIsGridView(event.target.value === 'grid');
    // };

    const handleSort = (field: keyof Student) => { // Updated type to keyof Student
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempSelectedPeriod(event.target.value);
    };

    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempSelectedCompany(event.target.value);
    };

    const handleMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempSelectedMajor(event.target.value);
    };

    const handleApplyFilters = () => {
        setSelectedPeriod(tempSelectedPeriod);
        setSelectedCompany(tempSelectedCompany);
        setSelectedMajor(tempSelectedMajor);
        toggleDropdown();
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 40px 43px 40px 43px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
            font-weight: 300;
        }
    `;

    const contentSide = css`
        margin-top: 30px;
        width: 100%;
    `;

    const searchRow = css`
        display: flex;
        align-items: center;
        justify-content: space-between;

        input {
            padding: 10px;
            border-radius: 50px 0px 0px 50px;
            border: 1px solid #49A8FF;
            width: 50%;
        }
    `;

    const studentRow = css`
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 35px;
        margin-top: 40px;
    `;

    const cardStyle = css`
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        height: 287px;
        width: 221px;
        cursor: pointer;

        img {
            width: 139px;
            min-height: 139px;
            border-radius: 50%;
            object-fit: cover;
        }

        p {
            margin: 5px 0;
            text-align: center;
        }
    `;

    const cardStudentDescription = css`
        text-align: start;
        width: 100%;
        height: 100%;
        margin-top: -15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `;

    const placeholderStyle = css`
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        height: 287px;
        width: 221px;
        animation: pulse 1.5s infinite;

        @keyframes pulse {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        div {
            width: 139px;
            height: 139px;
            border-radius: 50%;
            background-color: #ddd;
        }

        p {
            width: 80%;
            height: 20px;
            background-color: #ddd;
            border-radius: 4px;
        }
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
        padding: 10px 15px 15px 15px;
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
            margin-bottom: 15px;
        }

        button {
            margin-top: 20px;
            width: 30%;
            font-size: 17px;
            padding: 11px;
            box-sizing: border-box;
            font-weight: 500;
            background-color: #49A8FF;
            color: white;
            border: none;
            border-radius: 10px;
            transition: 0.15s ease all;

            &:hover {
                cursor: pointer;
                background-color: #68b5fc;
            }
        }
    `;

    const tableStyle = css`
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;

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
        font-size: 20px;
        font-weight: 500;
        text-align: start;
    `;

    const notFoundStyle = css`
        font-size: 25px;
        font-weight: 600;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 700px;
        margin-top: 10px;
        img {
            height: 300px;
            width: 300px;
        }
        p{
            margin-top: 10px;
        }
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p style={{fontWeight: "300"}}>Student List</p>
            </div>
            <div className="contentSide" css={contentSide}>
                <div className="searchRow" css={searchRow}>
                    <div css={totalStyle}>
                        Total: {filteredStudents.length}
                    </div>
                    <div className="filterView" css={filterViewStyle}>
                        <p style={{fontSize:"15px"}} >Filter by: </p>
                        <div className="dropdown" css={dropdownStyle} onClick={toggleDropdown}>
                            <p>All Students</p>
                            <Icon style={{fontSize:"10px"}} icon={"weui:arrow-filled"} rotate={45} />
                        </div>
                        <div className="dropdown-content" css={dropdownContentStyle}>
                            <p>Period</p>
                            <select onChange={handlePeriodChange}>
                                <option value="">All</option>
                                {periods.map((period, index) => (
                                    <option key={index} value={period}>{`${period}`}</option>
                                ))}
                            </select>
                            {user?.role === "Enrichment" && (
                                <>
                                    <p>Company</p>
                                    <select onChange={handleCompanyChange}>
                                        <option value="">All</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company.company_name}>{company.company_name}</option>
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
                            <div className="buttonContainer" style={{display: "flex", justifyContent: "end"}}>
                                <button onClick={handleApplyFilters}>Apply</button>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="studentRow" css={studentRow}>
                        {Array.from({ length: 18 }).map((_, index) => (
                            <div key={index} className="placeholder" css={placeholderStyle}>
                                <div></div>
                                <p></p>
                                <p></p>
                                <p></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    isGridView ? (
                        <div className="studentRow">
                            {filteredStudents ? (
                                <div css={studentRow}>
                                    {filteredStudents.map(student => (
                                        <div key={student.iden} className="card" css={cardStyle} onClick={() => onSelectStudent(student.iden)}>
                                            <img src={student.image_url} alt={student.name} />
                                            <div className="student-description" css={cardStudentDescription}>
                                                <div className="text">
                                                    <p style={{ fontSize: "18px", fontWeight: "500" }}>{student.name}</p>
                                                    <p style={{ color: "#49A8FF", fontSize: "16px" }}>{student.nim}</p>
                                                    <p style={{ fontSize: "13px", fontWeight: "500" }}>{student.major}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div css={notFoundStyle}>
                                    <img src={notFoundImage} alt="No Student Found" />
                                    <p>No Student Found</p>
                                </div>
                            )}
                            
                        </div>
                    ) : (
                        <table css={tableStyle}>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('nim')}>NIM {sortField === 'nim' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.iden}>
                                        <td>{student.name}</td>
                                        <td>{student.nim}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </main>
    );
}

export default StudentListBox;
