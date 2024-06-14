/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from '../components/Button';

function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [studentRecords, setStudentRecords] = useState([]);

    useEffect(() => {
        const fetchStudent = async () => {
            const docRef = doc(db, "student", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const studentData = { id: docSnap.id, ...docSnap.data() };
                setStudent(studentData);
                fetchStudentRecords(studentData.name); // Fetch student records
            } else {
                console.log("No such document!");
            }
        };

        const fetchStudentRecords = async (studentName) => {
            const q = query(collection(db, 'studentReport'), where('studentName', '==', studentName));
            const querySnapshot = await getDocs(q);
            const recordsData = querySnapshot.docs.map(doc => doc.data());
            setStudentRecords(recordsData);
        };

        fetchStudent();
    }, [id]);

    const detailStyle = css`
        display: flex;
        width: 100%;
        justify-content: center;
        padding: 20px;
        align-items: center;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    const cardStyle = css`
        width: 25%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: start;
        height: 90vh;
    `;

    const recordsContainerStyle = css`
        width: 75%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        overflow-y: scroll;
        // max-height: 500px;
        height: 90vh;
        overflow: scroll;
    `;

    const recordCardStyle = css`
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
    `;

    const photoStyle = css`
        border-radius: 100%;
        width: 200px;
        height: 200px;
        object-fit: cover;
        margin-bottom: 20px;
    `;

    if (!student) {
        return <p>Loading...</p>;
    }

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    return (
        <main css={mainStyle}>
            <div css={detailStyle}>
                <div css={cardStyle}>
                    <img src={student.image_url} alt="" css={photoStyle} />
                    <h1>{student.name}</h1>
                    <p>Semester: {student.semester}</p>
                    <p>Internship Place: {student.tempat_maganga}</p>
                    <p>Email: {student.email}</p>
                    <p>Phone: {student.phone}</p>
                    <PrimaryButton content={"Back to Dashboard"} onClick={() => window.history.back()} />
                </div>
                <div css={recordsContainerStyle}>
                    <h2>Student Records</h2>
                    {studentRecords.map((record, index) => (
                        <div key={index} css={recordCardStyle}>
                            <h3>{record.title}</h3>
                            <p>{record.report}</p>
                            <p><small>{new Date(record.timestamp?.toDate()).toLocaleDateString()}</small></p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default StudentDetail;
