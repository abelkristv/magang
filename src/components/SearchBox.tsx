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
    const [filterSemester, setFilterSemester] = useState('');
    const [activeFilter, setActiveFilter] = useState<'tempatMagang' | 'semester' | null>(null);
    const [nestedFilterValue, setNestedFilterValue] = useState('');

    const handleSearch = async () => {
        if (!searchQuery && !filterTempatMagang && !filterSemester) return;
    
        const studentCollection = collection(db, 'student');
        let q = query(studentCollection);
    
        if (searchQuery) {
            q = query(q, 
                where('name', '>=', searchQuery), 
                where('name', '<=', searchQuery + '\uf8ff')
            );
        }
    
        if (filterTempatMagang) {
            q = query(q, where('tempat_magang', '==', filterTempatMagang));
        }
    
        if (filterSemester) {
            q = query(q, where('semester', '==', filterSemester));
        }
    
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => 
            ({ 
                id: doc.id, 
                name: doc.data().name,
                nim: doc.data().nim,
                image_url: doc.data().image_url,
                semester: doc.data().semester,
                tempat_magang: doc.data().tempat_magang
            }) as Student
        );
    
        setStudents(results);
        
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
    `;

    const filterItemStyle = css`
        display: flex;
        justify-content: space-between;
        padding: 10px;
        &:hover {
            background-color: #C1E1C1;
            border-radius: 10px;
            cursor: pointer;
        }
        position: relative;
    `;

    const nestedFilterBoxStyle = css`
        position: absolute;
        top: 0;
        left: 310px; // Adjust this value as needed to position the box correctly
        width: 300px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        text-align: start;
        padding: 20px;
        z-index: 10;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    const inputStyle = css`
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    `;

    const handleFilterClick = (filterType: 'tempatMagang' | 'semester') => {
        setActiveFilter(filterType);
        setIsFilterOpen(true);
    };

    const handleApplyFilter = () => {
        setIsFilterOpen(false);
        setActiveFilter(null);
        setNestedFilterValue('');
        handleSearch();
    };

    const closeFilters = () => {
        setIsFilterOpen(false);
        setActiveFilter(null);
        setNestedFilterValue('');
    };

    return (
        <div css={boxStyle} onClick={closeFilters}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
            <div css={filterContainerStyle} onClick={(e) => e.stopPropagation()}>
                <div css={filterContent} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <p>Filter By</p>
                </div>
                {isFilterOpen && (
                    <div css={filterBoxStyle}>
                        <div
                            css={filterItemStyle}
                            onClick={() => handleFilterClick('tempatMagang')}
                        >
                            <p>Tempat Magang</p>
                            <p>{">"}</p>
                            {activeFilter === 'tempatMagang' && (
                                <div css={nestedFilterBoxStyle}>
                                    <input
                                        type="text"
                                        value={filterTempatMagang}
                                        onChange={(e) => setFilterTempatMagang(e.target.value)}
                                        css={inputStyle}
                                        placeholder="Enter Tempat Magang"
                                    />
                                    <PrimaryButton
                                        color='black'
                                        bg_color='#C1E1C1'
                                        content={"Apply"}
                                        onClick={handleApplyFilter}
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            css={filterItemStyle}
                            onClick={() => handleFilterClick('semester')}
                        >
                            <p>Semester</p>
                            <p>{">"}</p>
                            {activeFilter === 'semester' && (
                                <div css={nestedFilterBoxStyle}>
                                    <input
                                        type="text"
                                        value={filterSemester}
                                        onChange={(e) => setFilterSemester(e.target.value)}
                                        css={inputStyle}
                                        placeholder="Enter Semester"
                                    />
                                    <PrimaryButton
                                        color='black'
                                        bg_color='#C1E1C1'
                                        content={"Apply"}
                                        onClick={handleApplyFilter}
                                    />
                                </div>
                            )}
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
