/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from '../components/Button';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

interface DashboardBoxProps {
    onSearch: (query: string) => void;
}

function DashboardBox({ onSearch }: DashboardBoxProps) {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            const querySnapshot = await getDocs(collection(db, "student"));
            const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentsData);
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
        // margin-right: 50px;
        // margin-left: 50px;
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
        // border: 1px solid black;
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
        // box-shadow: 0px 0px 5px black;
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

    const handleSeeMoreClick = (id) => {
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
                    {filteredStudents.map((student) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardBox;
