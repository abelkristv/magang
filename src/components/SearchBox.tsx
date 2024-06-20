/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import SearchBar from './SearchBar';
import PrimaryButton from './Button';
import photoExp from '../assets/photos.webp';
import Student from '../model/Student';

function SearchBox() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterTempatMagang, setFilterTempatMagang] = useState('');

    const handleSearch = async () => {
        if (!searchQuery && !filterTempatMagang) return;

        let nameQuery;
        if (searchQuery) {
            nameQuery = query(collection(db, 'student'), where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
        }

        let nimQuery;
        if (searchQuery) {
            nimQuery = query(collection(db, 'student'), where('nim', '>=', searchQuery), where('nim', '<=', searchQuery + '\uf8ff'));
        }

        let tempatMagangQuery;
        if (filterTempatMagang) {
            tempatMagangQuery = query(collection(db, 'student'), where('tempat_magang', '==', filterTempatMagang));
        }

        const queries = [nameQuery, nimQuery, tempatMagangQuery].filter(Boolean);
        const querySnapshots = await Promise.all(queries.map(q => getDocs(q!)));
        const results = querySnapshots.flatMap(qs => qs.docs.map(doc => 
            ({ 
                id: doc.id, 
                name: doc.data().name,
                nim: doc.data().nim,
                image_url: doc.data().image_url,
                semester: doc.data().semeseter,
                tempat_magang: doc.data().tempat_magang
            }) as Student
        ));
        
        const uniqueResults = Array.from(new Set(results.map(a => a.id)))
            .map(id => results.find(a => a.id === id)) as Student[];

        setStudents(uniqueResults);
    };

    const boxStyle = css`
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

    const filterContainerStyle = css`
        width: 84%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5px;
        position: relative;
    `;

    const filterContent = css`
        background-color: #C1E1C1;
        padding: 10px;
        border-radius: 10px;
        &:hover {
            cursor: pointer;
        }
    `;

    const filterBoxStyle = css`
        position: absolute;
        top: 50px; // Adjust this value as needed to position the box correctly
        left: 0px;
        width: 300px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        text-align: start;
        padding: 20px;
        z-index: 10;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        p {
            
        }
    `;

    const filterItemStyle = css`
        display:flex;
        justify-content: space-between;
        padding: 10px;
        &:hover {
            background-color: #C1E1C1;
            border-radius: 10px;
            cursor: pointer;
        }
    `

    return (
        <div css={boxStyle}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
            <div css={filterContainerStyle}>
                <div css={filterContent} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <p>Filter By</p>
                </div>
                {isFilterOpen && (
                    <div css={filterBoxStyle}>
                        <div css={filterItemStyle}>
                            <p>Tempat Magang</p>
                            <p>{">"}</p>
                        </div>
                        <div css={filterItemStyle}>
                            <p>Semester</p>
                            <p>{">"}</p>
                        </div>
                    </div>
                )}
            </div>
            <div css={centerCardContent}>
                {students.map((student, index) => (
                    <div css={userCard} key={index}>
                        <img src={student.image_url || photoExp} alt="" css={photoStyle} />
                        <div css={userCardContent}>
                            <div css={cardContentStyle}>
                                <h1>{student.name}</h1>
                                <hr css={lineStyle} />
                                <p>NIM : {student.nim}</p>
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
