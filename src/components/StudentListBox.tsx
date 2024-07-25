/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import Student from "../model/Student";
import User from "../model/User";
import { useAuth } from "../helper/AuthProvider";
import { fetchUser } from "../controllers/UserController";
import { fetchAllStudents } from "../controllers/StudentController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { css } from "@emotion/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface StudentListBoxProps {
    onSelectStudent: (studentId: string | null) => void;
}

const StudentListBox = ({ onSelectStudent }: StudentListBoxProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [companys, setCompanys] = useState([]);
    const [majors, setMajors] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const userAuth = useAuth();

    onSelectStudent(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!);
            const allStudents = await fetchAllStudents();
            
            let filteredStudents = allStudents;
            if (user.role === "Company") {
                filteredStudents = allStudents.filter(student => student.tempat_magang === user.company_name);
            }

            setUser(user);
            setStudents(filteredStudents);
            setFilteredStudents(filteredStudents);
            setIsLoading(false); // Data loading complete
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchMajors = async () => {
            const majorsCollection = collection(db, "major");
            const majorSnapshot = await getDocs(majorsCollection);
            const majorList = majorSnapshot.docs.map(doc => doc.data().name);
            setMajors(majorList);
        };
        fetchMajors();
    }, []);

    useEffect(() => {
        const fetchCompanys = async () => {
            const companysCollection = collection(db, "tempat_magang");
            const companySnapshot = await getDocs(companysCollection);
            const companyList = companySnapshot.docs.map(doc => doc.data().name);
            setCompanys(companyList);
        };
        fetchCompanys();
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
    }, [searchQuery, students, sortField, sortOrder, selectedPeriod, selectedCompany, selectedMajor]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
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
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
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
        align-items: center;
        justify-content: space-between;

        input {
            padding: 10px;
            border-radius: 50px 0px 0px 50px;
            border: 1px solid #49A8FF;
            width: 50%;
        }
    `;

    const buttonStyle = css`
        background-color: #49A8FF;
        border: none;
        border-radius: 0px 20px 20px 0px;
        padding: 10px 10px 10px 5px;
        margin-right: 100px;

        &:hover {
            cursor: pointer;
            background-color: #70bbff;
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
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;
        margin-top: 20px;
    `;

    const cardStyle = css`
        background-color: white;
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
        font-size: 25px;
        font-weight: bold;
        text-align: start;
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Student List</p>
            </div>
            <div className="contentSide" css={contentSide}>
                <div className="searchRow" css={searchRow}>
                    <div css={totalStyle}>
                        Total: {filteredStudents.length}
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
                                {periods.map((period, index) => (
                                    <option key={index} value={period}>{`${period}`}</option>
                                ))}
                            </select>
                            {user?.role == "Enrichment" && (
                                <>
                                    <p>Company</p>
                                    <select onChange={handleCompanyChange}>
                                        <option value="">All</option>
                                        {companys.map((company, index) => (
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

                {isLoading ? (
                    <div className="studentRow" css={studentRow}>
                        {Array.from({ length: 6 }).map((_, index) => (
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
                        <div className="studentRow" css={studentRow}>
                            {filteredStudents.map(student => (
                                <div key={student.id} className="card" css={cardStyle} onClick={() => onSelectStudent(student.iden)}>
                                    <img src={student.image_url} alt={student.name} />
                                    <div className="student-description" css={cardStudentDescription}>
                                        <div className="text">
                                            <p>{student.name}</p>
                                            <p>{student.nim}</p>
                                            <p>{student.major}</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id}>
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
