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

        fetchUser();
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
                    hasRead: doc.data().hasRead
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

        fetchStudent();
        fetchComments();
    }, [id]);

    const handleRecordClick = async (recordId: string) => {
        const recordDocRef = doc(db, 'studentReport', recordId);

        setStudentRecords(prevRecords =>
            prevRecords.map(record =>
                record.id === recordId ? { ...record, hasRead: true } : record
            )
        );

        if (user?.role === "Enrichment" || user?.role === "Company") {
            setOpenCommentForm(openCommentForm === recordId ? null : recordId);
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

    const hasCommented = (recordId: string) => {
        return comments.some(comment => comment.reportID === recordId && comment.writer === currentUser?.email);
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
        border-radius: 10px;
        margin-bottom: 10px;
        &:hover {
            cursor: pointer;
        }
    `;

    const filterButtonContainerStyle = css`
        display: flex;
        justify-content: start;
        gap: 20px;
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
        margin-bottom: 20px;
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
                            <img src={student?.image_url} alt="" css={photoStyle} />
                            <div style={{textAlign: "left", width: "100%"}}>
                                <h1>{student?.name}</h1>
                                <p>{student?.nim}</p>
                            </div>
                            <div css={studentDescStyle}>
                                <p>🎓 Semester {student?.semester}</p>
                                <p>💼 {student?.tempat_magang}</p>
                                <p>📬 {student?.email}</p>
                                {/* <p>Phone: {student?.phone}</p> */}
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
                            {filteredRecords.map((record) => {
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
                                                <p style={{fontSize: "15px"}}>Written by: <a href="#" onClick={(e) => { 
                                                    e.preventDefault();
                                                    navigate(`/profile/${userEmailsToIds[record.writer]}`) 
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
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default StudentDetail;
