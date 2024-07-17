/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import dummyPhoto from '../assets/photo.jpg'
import dummyBackground from '../assets/dummy_background.jpg'
import PrimaryButton from "../components/elementary/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentRecord from "../model/StudentRecord";
import Student from "../model/Student";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import User from "../model/User";

function Profile() {

    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) {
                console.error("No student ID provided");
                return;
            }
            const docRef = doc(db, "user", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const studentData = { id: docSnap.id, ...docSnap.data() } as Student;
                setUser(studentData);
                await fetchStudentRecords(studentData.email); // Fetch student records
            } else {
                console.log("No such document!");
            }
            setLoading(false); // Set loading to false after data is fetched
        };

        const fetchStudentRecords = async (email: string) => {
            const q = query(collection(db, 'studentReport'), where('writer', '==', email));
            const querySnapshot = await getDocs(q);
            const recordsData = querySnapshot.docs.map(doc => 
                ({
                    id : doc.id,
                    title: doc.data().title,
                    timestamp: doc.data().timestamp,
                    report: doc.data().report,
                    writer: doc.data().writer,
                    rating: doc.data().rating,
                    sentiment: doc.data().sentiment
                }) as StudentRecord
            );
            setStudentRecords(recordsData);
        };

        fetchStudent();
    }, [id]);

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

    const placeholderStyle = css`
        width: 250px;
        height: 300px;
        border-radius: 15px;
        animation: ${pulse} 1.5s infinite ease-in-out;
    `;

    const placeholderBoxStyle = css`
        width: 100%;
        // height: 500px;
        border-radius: 15px;
        animation: ${pulse} 1.5s infinite ease-in-out;
        border: 1px solid #dbdbdb;
        background-color: #f0f0f0;
    `;

    const photoStyle = css`
        width: 250px;
        height: 300px;
        border-radius: 15px;
        object-fit: cover;
    `;

    const informationStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

    const profileBoxStyle = css`
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding: 20px;
    `;

    const profileBoxContainer = css`
        position: relative;
        box-sizing: border-box;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5%;
        align-items: center;
        width: 100%;
        height: 100%;
    `;

    const profileBoxContentStyle = css`
        // padding: 20px;
        // box-sizing: border-box;
        width: 100%;
        height: 60%;
        gap: 100px;
        display: flex;
        justify-content: center;
    `;

    const topRightSide = css`
        width: 100%;
        height: 30%;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        border-radius: 20px;
        box-sizing: border-box;
        justify-content: space-between;
    `;

    const leftSide = css`
        display: flex;
        justify-content: space-between;
    `

    const rightSide = css`
        width: 30%;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        overflow: scroll;
        background-color: white;
        border-radius: 15px;
        border: 1px solid #dbdbdb;
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        box-sizing: border-box;

        h1 {
            font-size: 40px;
        }
    `;

    const informationComponent = css`
        display: grid;
        grid-template-columns: 0.1fr 0.1fr 0.1fr;
        text-align: left;
    `;

    const commentContainer = css`
        padding: 10px;
        &:hover {
            background-color: #dbdbdb;
            border-radius: 15px;
            cursor: pointer;
        }
    `;

    const topContainerStyle = css`
        width: 30%;
        display: flex;
        background-color: white;
        border-radius: 15px;
        border: 1px solid #dbdbdb;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        padding: 20px;
        gap: 60px;
        box-sizing: border-box;
        img {
            height: 200px; 
            border-radius: 10px;
        }
    `

    return (
        <>
            <div css={profileBoxStyle}>
                <div css={profileBoxContainer}>
                    <div css={topContainerStyle}>
                        {loading ? (
                            <>
                                <div css={placeholderStyle}></div>
                                <div css={placeholderBoxStyle}></div>
                            </>
                        ) : (
                            <>
                                <img src={user?.image_url} alt="" />
                                <div css={topRightSide}>
                                    <div css={informationStyle}>
                                        <div css={informationComponent}>
                                            <p>Name</p>
                                            <p>:</p>
                                            <p>{user?.name}</p>
                                        </div>
                                        <div css={informationComponent}>
                                            <p>Email</p>
                                            <p>:</p>
                                            <p>{user?.email}</p>
                                        </div>
                                        <div css={informationComponent}>
                                            <p>Company</p>
                                            <p>:</p>
                                            <p>{user?.company_name}</p>
                                        </div>
                                    </div>
                                    <PrimaryButton content="Back To Dashboard" height={50} borderRadius="10px" width={200} onClick={() => navigate("/dashboard")} />
                                </div>
                            </>
                        )}
                    </div>
                    <div css={profileBoxContentStyle}>
                        {loading ? (
                            <div css={placeholderBoxStyle}></div>
                        ) : (
                            <div css={rightSide}>
                                <h1>Recently Added Comment</h1>
                                {studentRecords.map((record) => (
                                    <div key={record.id} css={commentContainer}>
                                        <p>To: Michael Iskandardinata</p>
                                        <p>{record.report}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
