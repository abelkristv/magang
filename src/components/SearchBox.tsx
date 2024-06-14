/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import SearchBar from './SearchBar';
import PrimaryButton from './Button';
import photoExp from '../assets/photos.webp';

function SearchBox() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);

    const handleSearch = async () => {
        console.log(searchQuery)
        if (!searchQuery) return;

        const q = query(collection(db, 'student'), where('name', '==', searchQuery));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        const studentsData = querySnapshot.docs.map(doc => doc.data());
        setStudents(studentsData);
    };

    const boxStyle = css`
        width: 95%;
        height: 90%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        margin-right: 50px;
        display: flex;
        padding-top: 40px;
        overflow: scroll;
    `;  

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
        width: 95%;
        height: 90%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        margin-right: 50px;
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

    const userCard = css`
        display: flex;
        justify-content: start;
        background-color: white;
        padding: 20px;
        gap: 50px;
        width: 100%;
        text-align: start;
        border-radius: 10px;
        margin-bottom: 20px;
    `;

    const userCardContent = css`
        display: flex;
        flex-direction: column;
    `;

    const photoStyle = css`
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 100%;
    `;

    const lineStyle = css`
        width: 100%;
    `;

    const cardContentStyle = css`
        margin-bottom: 30px;
    `;

    return (
        <div css={boxStyle}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
            <div css={centerCardContent}>
                {students.map((student, index) => (
                    <div css={userCard} key={index}>
                        <img src={student.image_url || photoExp} alt="" css={photoStyle} />
                        <div css={userCardContent}>
                            <div css={cardContentStyle}>
                                <h1>{student.name}</h1>
                                <hr css={lineStyle} />
                                <p>Tempat Magang: {student.tempat_magang}</p>
                                <p>Semester: {student.semester}</p>
                            </div>
                            <PrimaryButton content={"See More Information"} />
                        </div>
                    </div>
                ))}
            </div>   
        </div>
    );
}

export default SearchBox;
