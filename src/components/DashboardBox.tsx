/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from './elementary/Button';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import Student from '../model/Student';
import { useAuth } from '../helper/AuthProvider';
import CustomSelect from './elementary/CustomSelect';
import Modal from './elementary/Modal';
import Navbar from './Navbar';
import StarRating from './StarRating';
import CustomRadioButton from './elementary/CustomRadioButton';
import User from '../model/User';
import StudentCard from './card/StudentCard';
import { fetchUser } from '../controllers/UserController';
import { fetchAllStudents } from '../controllers/StudentController';

function DashboardBox() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false); // New state for search mode
    const navigate = useNavigate();
    const [rating, setRating] = useState<number>(0);
    const [response, setResponse] = useState<string>('');
    const userAuth = useAuth();
    const [user, setUser] = useState<User | null>(null);

    // New state variables for filters
    const [semesterFilter, setSemesterFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            const students = await fetchAllStudents()
            
            setUser(user)
            setStudents(students)
        }
        fetchData()
        setLoading(false)
    }, []);

    const filteredStudents = students.filter(student =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         student.nim.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (user?.role !== "Company" || student.tempat_magang === user?.company_name) &&
        (!semesterFilter || student.semester === semesterFilter) &&
        (!statusFilter || student.status === statusFilter)
    );

    const centerCardStyle = css`
        width: 100%;
        height: 100%;
        background-color: #F5F5F5;
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        display: flex;
        padding-top: 140px;
        overflow: scroll;
    `;

    const centerCardContent = css`
        display: flex;
        width: 90%;
        gap: 5%;
        align-items: start;
        justify-content: space-between;
        padding: 50px;
    `;

    const recentlyAddedInformationStyle = css`
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        width: 100%;
        align-items: left;
        h1 {
            text-align: left;
        }
    `;

    const cardStyle = css`
        display: flex;
        justify-content: space-between;
        background-color: white;
        border: 1px solid #dbdbdb;
        padding: 20px;
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
    `;

    const recentlyAddedInformationCardsStyle = css`
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 40px;
        overflow: scroll;
        height: 60vh;
    `;

    const searchResultsStyle = css`
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 40px;
        flex-wrap: wrap;
    `;

    const photoStyle = css`
        width: 210px;
        height: 250px;
        border-radius: 10px;
        object-fit: cover;
    `;

    const contentInformationStyle = css`
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        height: 100%;
        width: 100%;

        p {
            font-size: 20px;
        }
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
        padding: 20px;
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

    const leftSide = css`
        display: flex;
        gap: 50px;
        width: 100%;
        height: 250px;
    `;

    const [selectedStudent, setSelectedStudent] = useState<Student>({} as Student);
    const [report, setReport] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                timestamp: new Date(),
                rating: rating,
                sentiment: response
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
        border-radius: 20px;
        flex-direction: column;
        align-items: center;
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        overflow: scroll;
        border: 1px solid #dbdbdb;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
    `;

    const textareaStyle = css`
        width: 100%;
        height: 150px;
        margin-bottom: 20px;
        border-radius: 10px;
        resize: none;
        box-sizing: border-box;
        border: 1px solid #ccc;
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        height: 100%;
        gap: 20px;
        width: 100%;

        label {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;

    const closeModal = () => {
        setIsModalOpen(false);
        setMessage('');
    };

    const handleSeeMoreClick = (id: string) => {
        navigate(`/student/${id}`);
    };

    const mainLeftSide = css`
        width: ${user?.role == "Company" ? "67.5%" : "100%"};
    `;

    const mainRightSide = css`
        width: 27.5%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        label {
            font-size: 20px;
        }
    `;

    const fullWidthStyle = css`
        width: 100%;
    `;

    const onSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(query.trim().length > 0);
    };

    const buttonContainerStyle = css`
        display: flex;
        justify-content: start;
        width: 100%;
        margin-left: 10%;
    `;

    const buttonContainer = css`
        display: flex;
        justify-content: end;
        align-items: end;
    `;

    const studentTopStyle = css``;

    const filterContainerStyle = css`
        display: flex;
        justify-content: start;
        width: 100%;
        margin-top: 20px;
        gap: 20px;
    `;

    return (
        <div css={centerCardStyle}>
            <Navbar />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={onSearch} isSearching={isSearching} setIsSearching={setIsSearching} />

            <div css={centerCardContent}>
                {!isSearching && (
                    <div css={mainLeftSide}>
                        <div css={recentlyAddedInformationStyle}>
                            <h1>Recently Added Information</h1>
                        </div>
                        <div css={recentlyAddedInformationCardsStyle}>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, index) => (
                                    <div css={placeholderCardStyle} key={index}>
                                        <div css={placeholderImageStyle}></div>
                                        <div css={placeholderLineStyle}></div>
                                        <div css={placeholderLineStyle}></div>
                                        <div css={placeholderLineStyle}></div>
                                    </div>
                                ))
                            ) : (
                                students.filter(student =>
                                    user?.role !== "Company" || student.tempat_magang === user?.company_name
                                ).slice(0, 2).map((student) => (
                                    <div css={cardStyle} key={student.iden}>
                                        <div css={leftSide}>
                                            <img src={student.image_url} alt="" css={photoStyle} />
                                            <div css={contentInformationStyle}>
                                                <div className="name-nim">
                                                    <h1>{student.name}</h1>
                                                    <p>{student.nim}</p>
                                                </div>
                                                <div className="information" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                                    <p>Semester {student.semester}</p>
                                                    <p>
                                                        <span style={student.status === "Active" ?
                                                            { backgroundColor: "#37ad4b", color: "white", padding: "7px", borderRadius: "10px" }
                                                            : { backgroundColor: "#b03a38", color: "white", padding: "7px", borderRadius: "10px" }}>
                                                            {student.status === "Active" ? "Active" : "Inactive"}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div css={buttonContainer}>
                                                    <PrimaryButton content={"Detail"} onClick={() => handleSeeMoreClick(student.iden)} width={120} height={50} borderRadius={"10px"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {isSearching && (
                    <div css={fullWidthStyle}>
                        <div css={recentlyAddedInformationStyle}>
                            <h1>Search Results</h1>
                        </div>
                        <div css={filterContainerStyle}>
                            <label>
                                Semester:
                                <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>
                            </label>
                            <label>
                                Status:
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </label>
                        </div>
                        <div css={searchResultsStyle}>
                            {filteredStudents.map((student) => (
                                <StudentCard student={student} />
                            ))}
                        </div>
                    </div>
                )}

                {!isSearching && !loading && user?.role != "Enrichment" && (
                    <div css={mainRightSide}>
                        <div css={formBoxStyle}>
                            <form onSubmit={handleSubmit} css={formStyle}>
                                <h1>Add new Student Record</h1>
                                <label>
                                    <p>Student Select</p>
                                    <CustomSelect
                                        options={students}
                                        value={selectedStudent}
                                        onChange={setSelectedStudent}
                                    />
                                </label>
                                <label>
                                    <p>Report</p>
                                    <textarea value={report} onChange={handleReportChange} css={textareaStyle}></textarea>
                                </label>
                                <div className="rating">
                                    <p style={{ textAlign: "left", marginLeft: "5px", fontSize: "20px" }}>Rating</p>
                                    <StarRating count={5} value={rating} onChange={setRating} />
                                </div>
                                <CustomRadioButton
                                    name="response"
                                    value="positive"
                                    label="Positive"
                                    checked={response === 'positive'}
                                    onChange={setResponse}
                                />
                                <CustomRadioButton
                                    name="response"
                                    value="neutral"
                                    label="Neutral"
                                    checked={response === 'neutral'}
                                    onChange={setResponse}
                                />
                                <CustomRadioButton
                                    name="response"
                                    value="negative"
                                    label="Negative"
                                    checked={response === 'negative'}
                                    onChange={setResponse}
                                />

                                <PrimaryButton content={"Submit"} height={60} borderRadius='10px' />
                            </form>
                            {isModalOpen && <Modal message={message} onClose={closeModal} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardBox;
