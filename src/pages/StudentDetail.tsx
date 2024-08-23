/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import PrimaryButton from '../components/elementary/Button';
import Student from '../model/Student';
import StudentRecord from '../model/StudentRecord';
import StarRating from '../components/StarRating';
import { useAuth } from '../helper/AuthProvider';
import User from '../model/User';

interface Comment {
    id: string;
    reportID: string;
    writer: string;
    comment: string;
    hasRead: boolean;
}

interface MeetingSchedule {
    id: string;
    studentReport_id: string;
    date: string;
    time: string;
    subject: string;
    description: string;
}

function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState<Student | null>(null);
    const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCommentForm, setOpenCommentForm] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
    const [user, setUser] = useState<User | null>(null);
    const [meetingSchedules, setMeetingSchedules] = useState<MeetingSchedule[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]); // State to store all users
    const [filterByWriter, setFilterByWriter] = useState<'all' | 'Company' | 'Enrichment'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [meetingSubject, setMeetingSubject] = useState('');
    const [meetingDescription, setMeetingDescription] = useState('');
    const [facultySupervisor, setFacultySupervisor] = useState<User | null>(null);
    const [siteSupervisor, setSiteSupervisor] = useState<User | null>(null);

    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser?.email) return;
            const userQuery = query(collection(db, 'user'), where('email', '==', currentUser.email));
            const userDocSnap = await getDocs(userQuery);
            if (userDocSnap.docs[0].exists()) {
                const user = { id: userDocSnap.docs[0].id, ...userDocSnap.docs[0].data() } as User;
                setUser(user);
            } else {
                console.log("No such document!");
            }
            setLoading(false); // Set loading to false after data is fetched
        };

        const fetchAllUsers = async () => {
            const usersQuery = query(collection(db, 'user'));
            const usersDocSnap = await getDocs(usersQuery);
            const usersData = usersDocSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setAllUsers(usersData);
        };

        fetchUser();
        fetchAllUsers();
    }, [currentUser]);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) {
                console.error("No student ID provided");
                return;
            }
            const docRef = doc(db, "student", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const studentData = { id: docSnap.id, ...docSnap.data() } as Student;
                setStudent(studentData);
                await fetchStudentRecords(studentData.name); // Fetch student records
                await fetchFacultySupervisor(studentData.faculty_supervisor); // Fetch faculty supervisor
                await fetchSiteSupervisor(studentData.site_supervisor); // Fetch site supervisor
            } else {
                console.log("No such document!");
            }
            setLoading(false); // Set loading to false after data is fetched
        };

        const fetchStudentRecords = async (studentName: string) => {
            const q = query(collection(db, 'studentReport'), where('studentName', '==', studentName));
            const querySnapshot = await getDocs(q);
            const recordsData = querySnapshot.docs.map(doc => 
                ({
                    id: doc.id,
                    title: doc.data().title,
                    timestamp: doc.data().timestamp,
                    report: doc.data().report,
                    writer: doc.data().writer,
                    rating: doc.data().rating,
                    sentiment: doc.data().sentiment,
                    hasRead: doc.data().hasRead,
                    faculty_supervisor: doc.data().faculty_supervisor,
                    site_supervisor: doc.data().site_supervisor
                }) as StudentRecord
            );
            setStudentRecords(recordsData);
        };

        const fetchComments = async () => {
            const q = query(collection(db, 'studentReportComment'));
            const querySnapshot = await getDocs(q);
            const commentsData = querySnapshot.docs.map(doc => 
                ({
                    id: doc.id,
                    reportID: doc.data().reportID,
                    writer: doc.data().writer,
                    comment: doc.data().comment,
                    hasRead: doc.data().hasRead
                }) as Comment
            );
            setComments(commentsData);
        };

        const fetchMeetingSchedules = async () => {
            const q = query(collection(db, 'meetingSchedule'));
            const querySnapshot = await getDocs(q);
            const schedulesData = querySnapshot.docs.map(doc => 
                ({
                    id: doc.id,
                    studentReport_id: doc.data().studentReport_id,
                    date: doc.data().date,
                    time: doc.data().time,
                    subject: doc.data().subject,
                    description: doc.data().description
                }) as MeetingSchedule
            );
            console.log(schedulesData)
            setMeetingSchedules(schedulesData);
        };

        const fetchFacultySupervisor = async (facultySupervisorName: string) => {
            const q = query(collection(db, 'user'), where('name', '==', facultySupervisorName));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const supervisorData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as User;
                setFacultySupervisor(supervisorData);
            }
        };

        const fetchSiteSupervisor = async (siteSupervisorName: string) => {
            const q = query(collection(db, 'user'), where('name', '==', siteSupervisorName));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const supervisorData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as User;
                setSiteSupervisor(supervisorData);
            }
        };

        fetchStudent();
        fetchComments();
        fetchMeetingSchedules();
    }, [id]);

    const handleRecordClick = async (recordId: string) => {
        if (openCommentForm === recordId) {
            setOpenCommentForm(null); // Close the comment form if the same record is clicked again
        } else {
            const recordDocRef = doc(db, 'studentReport', recordId);
    
            setStudentRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === recordId ? { ...record, hasRead: true } : record
                )
            );
    
            if (user?.role === "Enrichment" || user?.role === "Company") {
                setOpenCommentForm(recordId);
            }
    
            await updateDoc(recordDocRef, { hasRead: true });
    
            // Update all comments related to the record to mark them as read
            if (user?.role === "Company") {
                const commentsToUpdate = comments.filter(comment => comment.reportID === recordId && !comment.hasRead);
                commentsToUpdate.forEach(async (comment) => {
                    const commentDocRef = doc(db, 'studentReportComment', comment.id);
                    await updateDoc(commentDocRef, { hasRead: true });
                });
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.reportID === recordId ? { ...comment, hasRead: true } : comment
                    )
                );
            }
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!openCommentForm || !student || !currentUser?.email) return;

        try {
            const docRef = await addDoc(collection(db, "studentReportComment"), {
                reportID: openCommentForm,
                writer: currentUser.email,
                comment: comment,
                hasRead: false
            });

            // Add the new comment to the local state
            const newComment: Comment = {
                id: docRef.id,
                reportID: openCommentForm,
                writer: currentUser.email,
                comment: comment,
                hasRead: false
            };
            setComments((prevComments) => [...prevComments, newComment]);

            setComment('');
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    const handleMeetingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(openCommentForm)
        try {
            const meetingData = {
                studentReport_id: openCommentForm, // Set to the current report ID
                date: meetingDate,
                time: meetingTime,
                subject: meetingSubject,
                description: meetingDescription,
            };
            await addDoc(collection(db, 'meetingSchedule'), meetingData);
            setMeetingSchedules(prev => [...prev, { ...meetingData, id: 'temp' }]); // Optimistically update the state
            console.log('Meeting scheduled successfully!');
            closeModal();
        } catch (error) {
            console.error('Error scheduling meeting:', error);
        }
    };

    const hasCommented = (recordId: string) => {
        return comments.some(comment => comment.reportID === recordId);
    };

    const filteredRecords = studentRecords.filter(record => {
        if (filter === 'positive') {
            return record.sentiment === 'positive';
        } else if (filter === 'negative') {
            return record.sentiment === 'negative';
        } else if (filter === 'neutral') {
            return record.sentiment === 'neutral';
        } else {
            return true;
        }
    });

    const filteredRecordsByWriter = filteredRecords.filter(record => {
        if (filterByWriter === 'Company') {
            return allUsers.some(user => user.email === record.writer && user.role === 'Company');
        } else if (filterByWriter === 'Enrichment') {
            return allUsers.some(user => user.email === record.writer && user.role === 'Enrichment');
        } else {
            return true;
        }
    });

    const handleFilterByWriter = (role: 'Company' | 'Enrichment') => {
        setFilterByWriter(role);
    };

    const findUserByEmail = async (email: string): Promise<string | null> => {
        const userQuery = query(collection(db, 'user'), where('email', '==', email));
        const userDocSnap = await getDocs(userQuery);
        if (!userDocSnap.empty) {
            return userDocSnap.docs[0].id;
        }
        return null;
    };

    const navigateToUserProfile = async (email: string) => {
        const userId = await findUserByEmail(email);
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setMeetingDate('');
        setMeetingTime('');
        setMeetingSubject('');
        setMeetingDescription('');
    };

    const detailStyle = css`
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        border: 1px solid #dbdbdb;
        background-color: #F5F5F5;
    `;

    const cardStyle = css`
        text-align: start;
        width: 25%;
        background: rgb(255,255,255, 0.8);
        border: 1px solid #dbdbdb;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        margin: 30px;
        border-radius: 20px;
        padding: 40px;
        gap: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90%;
    `;

    const recordsContainerStyle = css`
        width: 75%;
        background: rgb(255,255,255, 0.8);
        border-radius: 20px;
        border: 1px solid #dbdbdb;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        box-sizing: border-box;
        margin: 60px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        overflow-y: scroll;
        height: 90vh;
    `;

    const recordCardStyle = css`
        background: white;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dbdbdb;
        padding: 20px;
        box-sizing: border-box;
        // border-radius: 10px;
        margin-bottom: 10px;
        &:hover {
            cursor: pointer;
        }
    `;

    const filterButtonContainerStyle = css`
        display: flex;
        justify-content: start;
        gap: 10px;
        padding: 20px;
        font-size: 20px;
        margin-top: 20px;
    `;

    const filterButtonStyle = css`
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        background-color: white;
        color: white;
        font-size: 20px;
        cursor: pointer;
        border: 1px solid #dbdbdb;
        color: black;
        &:hover {
            background-color: #dbdbdb;
        }
    `;

    const selectedFilterButtonStyle = css`
        background-color: ${filter == "all" ? "white" : filter == "neutral" ? "rgb(102, 102, 102)" : filter == "positive" ? "#4CAF50" : filter == "negative" ? "#af4c4c" :"#dbdbdb"};
        color: ${filter == "all" ? "black" : "white"};
        &:hover {
            background-color: ${filter == "all" ? "white" : filter == "neutral" ? "rgb(102, 102, 102)" : filter == "positive" ? "#4CAF50" : filter == "negative" ? "#af4c4c" :"#dbdbdb"};
        }
    `;

    const photoStyle = css`
        border-radius: 100%;
        width: 200px;
        height: 200px;
        object-fit: cover;
        // margin-bottom: 20px;
    `;

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F5F5F5;
    `;

    const studentDescStyle = css`
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: start;
        font-size: 20px;
        gap: 20px;
    `;

    const pulse = keyframes`
        0% {
            background-color: #f0f0f0;
        }
        50% {
            background-color: #e0e0e0;
        }
        100% {
            background-color: #f0f0f0;
        }
    `;

    const placeholderCard = css`
        text-align: start;
        width: 25%;
        background: #e0e0e0;
        border-radius: 15px;
        padding: 40px;
        margin: 50px;
        gap: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90vh;
        animation: ${pulse} 1.5s infinite ease-in-out;
    `;

    const placeholderPhoto = css`
        border-radius: 100%;
        width: 200px;
        height: 200px;
        background-color: #ccc;
        margin-bottom: 20px;
    `;

    const placeholderText = css`
        width: 70%;
        height: 20px;
        background-color: #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
    `;

    const placeholderRecordsContainer = css`
        width: 75%;
        background: #e0e0e0;
        border-radius: 15px;
        padding: 20px;
        margin: 50px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        overflow-y: scroll;
        height: 90vh;
        animation: ${pulse} 1.5s infinite ease-in-out;
    `;

    const placeholderRecordCard = css`
        background: #ccc;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        margin-bottom: 10px;
    `;

    const recordContainerHeaderStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 20px;

        h2 {
            font-size: 30px;
        }
    `;

    const recordLeftSide = css`
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
    `;

    const recordRightSide = css`
        img {
            width: 100px;
            height: 100px;
        }

        p {
            font-size: 80px;
        }
    `;

    const commentFormStyle = css`
        margin-top: 20px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            box-sizing: border-box;
            margin-bottom: 10px;
            font-size: 20px;
            border-radius: 5px;
            border: 1px solid #dbdbdb;
            resize: none;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            font-size: 20px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            &:hover {
                background-color: #45a049;
            }
        }
    `;

    const topSideStyle = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `;

    const commentListStyle = css`
        width: 100%;
        padding: 10px;
    `;

    const meetingScheduleStyle = css`
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 10px;
        margin-bottom: 20px;
        background-color: #dbdbdb;
    `

    const filterButtonEnrichmentContainerStyle = css`
        display: flex;
        justify-content: start;
        gap: 10px;
        margin-left: 20px;
        font-size: 20px;
    `

    const modalOverlay = css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const modalContent = css`
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
    `;

    const formGroup = css`
        margin-bottom: 20px;
    `;

    const inputStyle = css`
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        box-sizing: border-box;
    `;

    const buttonContainer = css`
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    `;

    const supervisorCardStyle = css`
        display: flex;
        align-items: center;
        gap: 20px;
        background-color: #e8e8e8;
        border-radius: 10px;
        
        p {
            font-size: 17px;
        }

        img {
            object-fit: cover;
            border-radius: 10px 0px 0px 10px;
            width: 83px;
            height: 100px;
        }
    `

    return (
        <main css={mainStyle}>
            <div css={detailStyle}>
                {loading ? (
                    <>
                        <div css={placeholderCard}>
                            <div css={placeholderPhoto}></div>
                            <div css={placeholderText}></div>
                            <div css={placeholderText}></div>
                            <div css={placeholderText}></div>
                            <div css={placeholderText}></div>
                        </div>
                        <div css={placeholderRecordsContainer}>
                            <div css={placeholderRecordCard}></div>
                            <div css={placeholderRecordCard}></div>
                            <div css={placeholderRecordCard}></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div css={cardStyle}>
                            <img src={student?.image_url} alt="" css={photoStyle} width={200} height={200} />
                            <div style={{textAlign: "center", width: "100%", marginBottom: "10px"}}>
                                <h1>{student?.name}</h1>
                                <p>{student?.nim}</p>
                            </div>
                            <div css={studentDescStyle}>
                                <p>🎓 Semester {student?.semester}</p>
                                <p>💼 {student?.tempat_magang}</p>
                                <p>📬 {student?.email}</p>
                                {facultySupervisor && (
                                    <div className="supervisorCardStyle" css={supervisorCardStyle}>
                                        <img src={facultySupervisor.image_url} width={100} height={100} alt="" />
                                        <div className="right-side">
                                            <p><strong>{facultySupervisor.name}</strong></p>
                                            <p>Faculty Supervisor</p>
                                            <p><a href="#" onClick={async (e) => { 
                                                    e.preventDefault();
                                                    await navigateToUserProfile(facultySupervisor.email);
                                                }}>{facultySupervisor.email ? facultySupervisor.email : " " }</a></p>
                                        </div>
                                    </div>
                                )}
                                {siteSupervisor && (
                                    <div className="supervisorCardStyle" css={supervisorCardStyle}>
                                        <img src={siteSupervisor.image_url} width={100} height={100} alt="" />
                                        <div className="right-side">
                                            <p><strong>{siteSupervisor.name}</strong></p>
                                            <p>Site Supervisor</p>
                                            <p><a href="#" onClick={async (e) => { 
                                                    e.preventDefault();
                                                    await navigateToUserProfile(siteSupervisor.email);
                                                }}>{siteSupervisor.email ? siteSupervisor.email : " " }</a></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div css={recordsContainerStyle}>
                            <div css={recordContainerHeaderStyle}>
                                <p></p>
                                <h2>Student Records</h2>
                                <div className="back-to-db" style={{display: "flex", justifyContent: "end", padding: "20px"}}>
                                    <PrimaryButton content={"Back to Dashboard"} borderRadius='10px' onClick={() => navigate("/dashboard")} height={50} width={200} />
                                </div>
                            </div>
                            <div css={filterButtonContainerStyle}>
                                <button 
                                    css={[filterButtonStyle, filter === 'all' && selectedFilterButtonStyle]}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button 
                                    css={[filterButtonStyle, filter === 'positive' && selectedFilterButtonStyle]}
                                    onClick={() => setFilter('positive')}
                                >
                                    Positive
                                </button>
                                <button 
                                    css={[filterButtonStyle, filter === 'negative' && selectedFilterButtonStyle]}
                                    onClick={() => setFilter('negative')}
                                >
                                    Negative
                                </button>
                                <button 
                                    css={[filterButtonStyle, filter === 'neutral' && selectedFilterButtonStyle]}
                                    onClick={() => setFilter('neutral')}
                                >
                                    Neutral
                                </button>
                            </div>
                            <div css={filterButtonEnrichmentContainerStyle}>
                                <PrimaryButton content='Written by company' height={50} borderRadius='10px' onClick={() => handleFilterByWriter('Company')} />
                                <PrimaryButton content='Written by enrichment team' height={50} borderRadius='10px' onClick={() => handleFilterByWriter('Enrichment')} />
                            </div>
                            {filteredRecordsByWriter.map((record) => {
                                const hasUnreadComments = comments.some(comment => comment.reportID === record.id && !comment.hasRead);
                                return (
                                    <div key={record.id} css={recordCardStyle} onClick={() => handleRecordClick(record.id)}>
                                        <div css={topSideStyle}>
                                            <div css={recordLeftSide} 
                                                style={record.sentiment === "positive" ? {backgroundColor: "#D2FBEF", border: "1px solid #a7c9bf"} :
                                                    record.sentiment === "negative" ? {backgroundColor: "#FBD2D2", border: "1px solid #bd9f9f"} :
                                                    record.sentiment === "neutral" ? {border: "1px solid rgba(179, 179, 179, 0.7)"} :
                                                    {border: "1px solid white"} }> 
                                                <h3 style={{textAlign: "right", margin: "0px"}}>{(record.hasRead == false || hasUnreadComments) && user?.role == "Company" ? "New ❗" : ""}</h3>
                                                <p style={{fontSize: "20px"}}>{record.report}</p>
                                                <p><small>{new Date(record.timestamp?.toDate()).toLocaleDateString()}</small></p>
                                                <p style={{fontSize: "15px"}}>Written by: <a href="#" onClick={async (e) => { 
                                                    e.preventDefault();
                                                    await navigateToUserProfile(record.writer);
                                                }}>{record.writer ? record.writer : " " }</a></p>
                                                <StarRating value={record.rating} count={5} onChange={() => {}} hoverOn={false} />
                                            </div>
                                            <div css={recordRightSide}></div>
                                        </div>
                                        {openCommentForm === record.id && (
                                            <>
                                                {comments.filter(comment => comment.reportID === record.id).map(filteredComment => (
                                                    <div key={filteredComment.id} css={commentListStyle}>
                                                        <p><strong>{filteredComment.writer}:</strong> {filteredComment.comment}</p>
                                                    </div>
                                                ))}
                                                {user?.role === 'Enrichment' && !hasCommented(record.id) && (
                                                    <form css={commentFormStyle} onClick={(e) => e.stopPropagation()} onSubmit={handleCommentSubmit}>
                                                        <textarea value={comment} onChange={handleCommentChange} placeholder="Add a comment..."></textarea>
                                                        <button type="submit">Submit Comment</button>
                                                    </form>
                                                )}
                                                {meetingSchedules.filter(meeting => meeting.studentReport_id === record.id).map(meeting => (
                                                    <div key={meeting.id} css={meetingScheduleStyle}>
                                                        <p><strong>Meeting Scheduled at</strong></p>
                                                        <p><strong>{meeting.date} at {meeting.time}</strong></p>
                                                        <p>Subject : {meeting.subject}</p>
                                                        <p>{meeting.description}</p>
                                                    </div>
                                                ))}
                                                <div className="schedule-a-meeting-button" style={{display: "flex", justifyContent: "start", width: "100%", marginTop: "20px"}}>
                                                {user?.role === 'Enrichment' && hasCommented(record.id) && (
                                                    <PrimaryButton bg_color='#45A049' bg_color_hover='#5ca15f' content='Schedule meeting' height={60} borderRadius='10px' onClick={openModal} />
                                                )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            {isModalOpen && (
                <div css={modalOverlay} onClick={closeModal}>
                    <div css={modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Schedule a Meeting</h2>
                        <form onSubmit={handleMeetingSubmit}>
                            <div css={formGroup}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={meetingDate}
                                    onChange={(e) => setMeetingDate(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Time</label>
                                <input
                                    type="time"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={meetingSubject}
                                    onChange={(e) => setMeetingSubject(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Description</label>
                                <textarea
                                    value={meetingDescription}
                                    onChange={(e) => setMeetingDescription(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={buttonContainer}>
                                <PrimaryButton content='Cancel' height={50} borderRadius='10px' onClick={closeModal} />
                                <PrimaryButton content='Submit' height={50} borderRadius='10px' type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default StudentDetail;
