/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import User from "../model/User";
import Student from "../model/Student";
import { css } from "@emotion/react";
import PrimaryButton from "../components/elementary/Button";
import StudentCard from "../components/card/StudentCard";
import { fetchAllStudents, fetchStudents } from "../controllers/StudentController";
import { fetchUser } from "../controllers/UserController";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const StudentList = () => {
    const [_loading, _setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [siteSupervisors, setSiteSupervisors] = useState<string[]>([]);
    const [facultySupervisors, setFacultySupervisors] = useState<string[]>([]);
    const [selectedSiteSupervisor, setSelectedSiteSupervisor] = useState('');
    const [selectedFacultySupervisor, setSelectedFacultySupervisor] = useState('');
    const navigate = useNavigate();
    const curUser = useAuth();
    const [_user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const user: User | null = await fetchUser(curUser?.currentUser.email!);
            const students = user?.role == "Company" ? await fetchStudents(user?.company_name!) : await fetchAllStudents();
            setUser(user);
            setStudents(students);
        };

        const fetchSupervisors = async () => {
            try {
                const siteSupervisorSnapshot = await getDocs(collection(db, 'site_supervisor'));
                const siteSupervisorsList = siteSupervisorSnapshot.docs.map(doc => doc.data().name);
                setSiteSupervisors(siteSupervisorsList);

                const facultySupervisorSnapshot = await getDocs(collection(db, 'faculty_supervisor'));
                const facultySupervisorsList = facultySupervisorSnapshot.docs.map(doc => doc.data().name);
                setFacultySupervisors(facultySupervisorsList);
            } catch (error) {
                console.error('Error fetching supervisors:', error);
            }
        };

        fetchData();
        fetchSupervisors();
    }, []);

    const handleSiteSupervisorChange = (event) => {
        setSelectedSiteSupervisor(event.target.value);
    };

    const handleFacultySupervisorChange = (event) => {
        setSelectedFacultySupervisor(event.target.value);
    };

    const filteredStudents = students.filter(student => {
        const matchesSiteSupervisor = selectedSiteSupervisor ? student.site_supervisor === selectedSiteSupervisor : true;
        const matchesFacultySupervisor = selectedFacultySupervisor ? student.faculty_supervisor === selectedFacultySupervisor : true;
        return matchesSiteSupervisor && matchesFacultySupervisor;
    });

    const mainStyle = css`
        padding: 30px;
    `;

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
        margin-bottom: 50px;
    `;

    const filterContainerStyle = css`
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    `;

    const studentCardContainer = css`
        display: flex;
        flex-wrap: wrap;
        gap: 50px;
    `;

    return (
        <>
            <div className="main" css={mainStyle}>
                <div className="header" css={headerStyle}>
                    <h1>Student List</h1>
                    <PrimaryButton content={"Back to Dashboard"} onClick={() => navigate("/dashboard")} width={200} height={50} borderRadius={"10px"} />
                </div>
                {_user?.role === "Enrichment" && (
                    <div css={filterContainerStyle}>
                        <div>
                            <label>Site Supervisor : </label>
                            <select value={selectedSiteSupervisor} onChange={handleSiteSupervisorChange}>
                                <option value="">All</option>
                                {siteSupervisors.map((supervisor, index) => (
                                    <option key={index} value={supervisor}>{supervisor}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Faculty Supervisor : </label>
                            <select value={selectedFacultySupervisor} onChange={handleFacultySupervisorChange}>
                                <option value="">All</option>
                                {facultySupervisors.map((supervisor, index) => (
                                    <option key={index} value={supervisor}>{supervisor}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                <div className="student-card-container" css={studentCardContainer}>
                    {filteredStudents.map((student) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default StudentList;
