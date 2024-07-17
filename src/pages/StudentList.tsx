/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import User from "../model/User";
import Student from "../model/Student";
import { css } from "@emotion/react";
import PrimaryButton from "../components/elementary/Button";
import StudentCard from "../components/card/StudentCard";
import { fetchStudents } from "../controllers/StudentController";
import { fetchUser } from "../controllers/UserController";

const StudentList = () => {
    const [_loading, _setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([])
    const navigate = useNavigate();
    const curUser = useAuth();
    const [_user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const user: User | null = await fetchUser(curUser?.currentUser.email!)
            const students = await fetchStudents(user?.company_name!)
            setUser(user)
            setStudents(students)
        }
        
        fetchData()
    }, []);

    const mainStyle = css`
        padding: 30px;
    `

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
        // padding-top: 10px;
        margin-bottom: 50px;
    `

    const studentCardContainer = css`
        display: flex;
        flex-direction: column;
        gap: 50px;
    `

    return (
        <>
            <div className="main" css={mainStyle}>
                <div className="header" css={headerStyle}>
                    <h1>Student List</h1>
                    <PrimaryButton content={"Back to Dashboard"} onClick={() => navigate("/dashboard")} width={200} height={50} borderRadius={"10px"} />
                </div>
                <div className="student-card-container" css={studentCardContainer}>
                    {students.map((student) => (
                        <StudentCard student={student} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default StudentList