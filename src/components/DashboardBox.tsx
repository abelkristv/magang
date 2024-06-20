/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from '../components/Button';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import Student from '../model/Student';

interface DashboardBoxProps {
    onSearch: () => void;
}

function DashboardBox({ onSearch }: DashboardBoxProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "student"));
            const studentsData = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id, 
                    name: doc.data().name, 
                    nim: doc.data().nim,
                    tempat_magang: doc.data().tempat_magang,
                    semester: doc.data().semester,
                    image_url: doc.data().image_url
                } as Student
            });
            setStudents(studentsData);
            setLoading(false);
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 50px;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    const centerCardStyle = css`
        width: 100%;
        height: 100%;
        background: rgb(255,255,255);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        display: flex;
        padding-top: 40px;
        overflow: scroll;
    `;

    const centerCardContent = css`
        display: flex;
        width: 90%;
        align-items: start;
        padding: 50px;
        flex-direction: column;
    `;

    const recentlyAddedInformationStyle = css`
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        border-bottom: 2px solid black;
    `;

    const cardStyle = css`
        display: flex;
        flex-direction: column;
        background-color: #f2f2f2;
        padding: 40px;
        justify-content: start;
        text-align: start;
        border-radius: 15px;
    `;

    const recentlyAddedInformationCardsStyle = css`
        margin-top: 50px;
        display: flex;
        gap: 40px;
        flex-wrap: wrap;
    `;

    const photoStyle = css`
        border-radius: 100%;
        width: 200px;
        height: 200px;
        object-fit: cover;
    `;

    const contentInformationStyle = css`
        display:flex;
        flex-direction: column;
        margin-bottom: 40px;
    `;

    const placeholderAnimation = keyframes`
        0% {
            background-position: -200px 0;
        }
        100% {
            background-position: calc(200px + 100%) 0;
        }
    `;

    const placeholderCardStyle = css`
        display: flex;
        flex-direction: column;
        background-color: #f2f2f2;
        padding: 40px;
        justify-content: start;
        text-align: start;
        border-radius: 15px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: ${placeholderAnimation} 1.5s infinite;
    `;

    const placeholderImageStyle = css`
        width: 200px;
        height: 200px;
        border-radius: 100%;
        background: #e0e0e0;
    `;

    const placeholderLineStyle = css`
        height: 20px;
        width: 100%;
        background: #e0e0e0;
        margin: 10px 0;
        border-radius: 5px;
    `;

    const handleSeeMoreClick = (id: string) => {
        navigate(`/student/${id}`);
    };

    return (
        <div css={centerCardStyle}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={onSearch} />
            <div css={centerCardContent}>
                <div css={recentlyAddedInformationStyle}>
                    <h1>Recently Added Information</h1>
                </div>
                <div css={recentlyAddedInformationCardsStyle}>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div css={placeholderCardStyle} key={index}>
                                <div css={placeholderImageStyle}></div>
                                <div css={placeholderLineStyle}></div>
                                <div css={placeholderLineStyle}></div>
                                <div css={placeholderLineStyle}></div>
                            </div>
                        ))
                    ) : (
                        filteredStudents.map((student) => (
                            <div css={cardStyle} key={student.id}>
                                <img src={student.image_url} alt="" css={photoStyle} />
                                <div css={contentInformationStyle}>
                                    <h1>{student.name}</h1>
                                    <p>NIM : {student.nim}</p>
                                    <p>Semester: {student.semester}</p>
                                    <p>Internship Place: {student.tempat_magang}</p>
                                </div>
                                <PrimaryButton content={"See More"} onClick={() => handleSeeMoreClick(student.id)} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardBox;
