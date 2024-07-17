/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import { useAuth } from '../helper/AuthProvider';
import PrimaryButton from '../components/elementary/Button';
import { useNavigate } from 'react-router-dom';
import User from '../model/User';
import StarRating from '../components/StarRating';

const Inbox = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentName, setSelectedStudentName] = useState(null);
    const [studentRecords, setStudentRecords] = useState([]);
    const [user, setUser] = useState<User | null>(null);
    const curUser = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (curUser?.currentUser?.email) {
                try {
                    const q = query(collection(db, 'user'), where('email', '==', curUser.currentUser.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const data = {
                            id: querySnapshot.docs[0].id,
                            name: querySnapshot.docs[0].data().name,
                            email: querySnapshot.docs[0].data().email,
                            image_url: querySnapshot.docs[0].data().image_url,
                            role: querySnapshot.docs[0].data().role,
                            company_name: querySnapshot.docs[0].data().company_name
                        } as User;
                        setUser(data);
                        fetchStudents(data);
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            }
        };
        const fetchStudents = async (data) => {
            try {
                const q = query(collection(db, 'student'), where('tempat_magang', '==', data!.company_name));
                const querySnapshot = await getDocs(q);
                const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(studentList);
                setStudents(studentList);
            } catch (error) {
                console.error('Error fetching students: ', error);
            }
        };
        fetchUserData();
    }, [curUser?.currentUser?.email]);

    const handleStudentClick = async (studentName) => {
        setSelectedStudentName(studentName);
        fetchStudentRecords(studentName);
    };

    const fetchStudentRecords = async (studentName) => {
        try {
            const q = query(collection(db, 'studentReport'), where('studentName', '==', studentName));
            const querySnapshot = await getDocs(q);
            const recordsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(recordsList);
            setStudentRecords(recordsList);
        } catch (error) {
            console.error('Error fetching student records: ', error);
        }
    };

    const leftSideStyle = css`
        width: 30%;
        background-color: white;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 20px 0px 0px 20px;
        padding: 20px;
    `;

    const rightSideStyle = css`
        width: 70%;
        background-color: #F5F5F5;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        padding: 20px;
        border-radius: 0px 20px 20px 0px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

    const mainStyle = css`
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    `;

    const studentListStyle = css`
        display: flex;
        flex-direction: column;
        text-align: left;
        padding: 10px;
        border-radius: 10px;
        &:hover {
            background-color: #dbdbdb;
            cursor: pointer;
        }
    `;

    const selectedStyle = css`
        background-color: #dbdbdb;
    `;

    const studentsList = css`
        height: 80%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

    const recordLeftSide = css`
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        text-align: left;
    `;

    return (
        <main css={mainStyle}>
            <div className="left-side" css={leftSideStyle}>
                <h1>Students</h1>
                <br />
                <br />
                <div className="student-list" css={studentsList}>
                    {students.length > 0 ? (
                        students.map(student => (
                            <div
                                key={student.id}
                                css={[studentListStyle, student.name === selectedStudentName && selectedStyle]}
                                onClick={() => handleStudentClick(student.name)}
                            >
                                <h3>{student.name}</h3>
                                <p>{student.email}</p>
                                <p>{student.tempat_magang}</p>
                            </div>
                        ))
                    ) : (
                        <p>No students found for this company.</p>
                    )}
                </div>
                <PrimaryButton content={"Back to Dashboard"} borderRadius='10px' onClick={() => navigate("/dashboard")} height={50} width={200} />
            </div>
            <div className="right-side" css={rightSideStyle}>
                <h1>Student Records</h1>
                <div className="record-list" css={studentsList}>
                    {studentRecords.length > 0 ? (
                        studentRecords.map(record => (
                            <div css={recordLeftSide} 
                                style={record.sentiment === "positive" ? {backgroundColor: "#D2FBEF", border: "1px solid #a7c9bf"} :
                                        record.sentiment === "negative" ? {backgroundColor: "#FBD2D2", border: "1px solid #bd9f9f"} :
                                        record.sentiment === "neutral" ? {border: "1px solid rgba(179, 179, 179, 0.7)"} :
                                        {border: "1px solid white"} }> 
                                <h3 style={{textAlign: "right", margin: "0px"}}>{record.hasRead == false && user?.role == "Enrichment" ? "New ❗" : ""}</h3>
                                <p style={{fontSize: "20px"}}>{record.report}</p>
                                <p><small>{new Date(record.timestamp?.toDate()).toLocaleDateString()}</small></p>
                                <p style={{fontSize: "15px"}}>Written by: <a href="#" onClick={(e) => { 
                                    e.preventDefault();
                                    navigate(`/profile/${userEmailsToIds[record.writer]}`) 
                                }}>{record.writer ? record.writer : " " }</a></p>
                                <StarRating value={record.rating} count={5} onChange={() => {}} hoverOn={false} />
                            </div>
                        ))
                    ) : (
                        <p>No records found for this student.</p>
                    )}
                </div>
            </div>
        </main>
    );
};
export default Inbox;
