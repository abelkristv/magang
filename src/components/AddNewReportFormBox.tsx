/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from '../components/Button';

function FormBox() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [report, setReport] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            const querySnapshot = await getDocs(collection(db, "student"));
            const studentsData = querySnapshot.docs.map(doc => doc.data());
            setStudents(studentsData);
        };
        fetchStudents();
    }, []);

    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
    };

    const handleReportChange = (e) => {
        setReport(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "studentReport"), {
                studentName: selectedStudent,
                report: report,
                timestamp: new Date() // Add a timestamp to the report
            });

            setMessage("Report submitted successfully!");
            setSelectedStudent('');
            setReport('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage("Failed to submit report. Please try again.");
        }
    };

    const formBoxStyle = css`
        width: 95%;
        height: 90%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        margin-right: 50px;
        display: flex;
        padding: 40px;
        overflow: scroll;
    `;

    const inputStyle = css`
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid #ccc;
    `;

    const textareaStyle = css`
        width: 100%;
        height: 150px;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid #ccc;
    `;

    return (
        <div css={formBoxStyle}>
            <form onSubmit={handleSubmit} css={{ width: '100%' }}>
                <label>
                    Student Select:
                    <select value={selectedStudent} onChange={handleStudentChange} css={inputStyle}>
                        <option value="">Select a student</option>
                        {students.map((student, index) => (
                            <option key={index} value={student.name}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Report:
                    <textarea value={report} onChange={handleReportChange} css={textareaStyle}></textarea>
                </label>
                <PrimaryButton content={"Submit"} type="submit" />
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default FormBox;
