/** @jsxImportSource @emotion/react */
import { useState, useEffect, ReactEventHandler } from 'react';
import { css } from '@emotion/react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from './Button';
import CustomSelect from './CustomSelect'; // Ensure the path is correct
import { useAuth } from '../helper/AuthProvider';
import Modal from './Modal'; // Ensure the path is correct
import Student from '../model/Student';

function FormBox() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student>({} as Student);
    const [report, setReport] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            const querySnapshot = await getDocs(collection(db, "student"));
            const studentsData = querySnapshot.docs.map(doc => doc.data());
            setStudents(studentsData.map(data => {
                return {name: data.name, id: data.id, nim: data.nim, semester: data.semester, tempat_magang: data.tempat_magang, image_url: data.image_url} as Student
            }));
        };
        fetchStudents();
    }, []);

    const handleReportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReport(e.target.value);
    };

    const { currentUser } = useAuth() ?? {};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "studentReport"), {
                studentName: selectedStudent.name,
                report: report,
                writer: currentUser?.email,
                timestamp: new Date() // Add a timestamp to the report
            });

            setMessage("Report submitted successfully!");
            setSelectedStudent({} as Student);
            setReport('');
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage("Failed to submit report. Please try again.");
        }
    };

    const formBoxStyle = css`
        width: 100%;
        height: 100%;
        background: rgb(255,255,255);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        display: flex;
        padding: 40px;
        overflow: scroll;
        margin-top: 40px;
    `;

    const textareaStyle = css`
        width: 100%;
        height: 150px;
        margin-bottom: 20px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid #ccc;
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        gap: 30px;
        width: 50%;
    `

    const closeModal = () => {
        setIsModalOpen(false);
        setMessage('');
    };

    return (
        <div css={formBoxStyle}>
            <form onSubmit={handleSubmit} css={formStyle} >
                <label>
                    Student Select
                    <CustomSelect
                        options={students}
                        value={selectedStudent}
                        onChange={setSelectedStudent}
                    />
                </label>
                <label>
                    Report
                    <textarea value={report} onChange={handleReportChange} css={textareaStyle}></textarea>
                </label>
                <PrimaryButton content={"Submit"} />
            </form>
            {/* {message && <p>{message}</p>} */}
            {isModalOpen && <Modal message={message} onClose={closeModal} />}
        </div>
    );
}

export default FormBox;
