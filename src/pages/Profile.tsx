/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { db } from "../firebase";
import PrimaryButton from "../components/elementary/Button";
import { useAuth } from "../helper/AuthProvider";

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [studentRecords, setStudentRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const curUser = useAuth()

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                if (!id) {
                    console.error("No student ID provided");
                    return;
                }
                const docRef = doc(db, "user", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const studentData = docSnap.data();
                    setUser(studentData);
                    setUsername(studentData.name); // Set the username state with the fetched name
                    setEmail(studentData.email); // Set the email state with the fetched email
                    await fetchStudentRecords(studentData.email); // Fetch student records
                } else {
                    console.log("No such document!");
                }
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching student data: ", error);
                setMessage(`Error: ${error.message}`);
            }
        };

        const fetchStudentRecords = async (email) => {
            try {
                const q = query(collection(db, "studentReport"), where("writer", "==", email));
                const querySnapshot = await getDocs(q);
                const recordsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    timestamp: doc.data().timestamp,
                    report: doc.data().report,
                    writer: doc.data().writer,
                    studentName: doc.data().studentName,
                    rating: doc.data().rating,
                    sentiment: doc.data().sentiment,
                }));
                setStudentRecords(recordsData);
            } catch (error) {
                console.error("Error fetching student records: ", error);
                setMessage(`Error: ${error.message}`);
            }
        };

        fetchStudent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            try {
                if (email !== currentUser.email) {
                    await updateEmail(currentUser, email);
                }
                if (password) {
                    await updatePassword(currentUser, password);
                }
                if (username !== user.name) {
                    const userDocRef = doc(db, "user", id);
                    await updateDoc(userDocRef, { name: username });
                }
                setMessage("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile: ", error);
                setMessage(`Error: ${error.message}`);
            }
        } else {
            setMessage("No user is signed in.");
        }
    };

    const leftSideStyle = css`
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        width: ${curUser?.currentUser.email === user?.email ? "40%" : "100%"};
        flex-direction: column;
        gap: 20px;
        height: 100%;
    `;

    const rightSideStyle = css`
        width: 60%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    `;

    const topLeftSideStyle = css`
        display: flex;
        background-color: white;
        border-radius: 20px;
        font-size: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
        height: 30%;
        gap: 50px;
    `;

    const informationStyle = css`
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        gap: 20px;
    `;

    const informationComponent = css`
        display: grid;
        width: 100%;
        grid-template-columns: 0.3fr 0.1fr 0.1fr 0.4fr;

        p {
            text-align: left;
        }
    `;

    const photoStyle = css`
        border-radius: 10px;
        object-fit: cover;
        width: 200px;
        height: 250px;
    `;

    const photoSkeletonStyle = css`
        background-color: #e0e0e0;
        border-radius: 10px;
        width: 200px;
        height: 250px;
    `;

    const bottomLeftSide = css`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background-color: white;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        border-radius: 20px;
        font-size: 18px;
        gap: 10px;
        overflow: auto;
        padding: 20px;
        height: 70%;
        box-sizing: border-box;
    `;

    const commentContainerStyle = css`
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        text-align: left;
        &:hover {
            background-color: #ededed;
            cursor: pointer;
        }
    `;

    const commentSkeletonStyle = css`
        background-color: #e0e0e0;
        height: 50px;
        border-radius: 10px;
        margin-bottom: 10px;
    `;

    const mainContainerStyle = css`
        display: flex;
        width: 100%;
        height: 100%;
    `;

    const changeInformationStyle = css`
        background-color: white;
        height: 100%;
        width: 100%;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        border-radius: 20px;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    `;

    const backToDashboardStyle = css`
        display: flex;
        justify-content: end;
    `;

    const inputContainerStyle = css`
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 10px;

        label {
            display: grid;
            grid-template-columns: 0.1fr 0.1fr;
            align-items: center;
        }
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        font-size: 20px;
        gap: 20px;
    `;

    const inputStyle = css`
        border-radius: 10px;
        font-size: 20px;
        padding: 7px;
        box-sizing: border-box;
        border: none;
        background-color: #ebebeb;
    `;

    return (
        <div className="main-container" css={mainContainerStyle}>
            <div className="left-side" css={leftSideStyle}>
                <div className="top-left-side" css={topLeftSideStyle}>
                    {loading ? (
                        <div css={photoSkeletonStyle}></div>
                    ) : (
                        <img src={user?.image_url} alt="" css={photoStyle} />
                    )}
                    <div css={informationStyle}>
                        <div css={informationComponent}>
                            <p>Name</p>
                            <p>👱</p>
                            <p>:</p>
                            <p>{loading ? "Loading..." : user?.name}</p>
                        </div>
                        <div css={informationComponent}>
                            <p>Email</p>
                            <p>📬</p>
                            <p>:</p>
                            <p>{loading ? "Loading..." : user?.email}</p>
                        </div>
                        <div css={informationComponent}>
                            <p>Company</p>
                            <p>💼</p>
                            <p>:</p>
                            <p>{loading ? "Loading..." : user?.company_name}</p>
                        </div>
                        <div css={informationComponent}>
                            <p>Role</p>
                            <p>🧑‍🔧</p>
                            <p>:</p>
                            <p>{loading ? "Loading..." : user?.role}</p>
                        </div>
                        {
                            curUser?.currentUser.email !== user?.email &&
                            <PrimaryButton content="Back To Dashboard" height={50} borderRadius="10px" width={200} onClick={() => navigate("/dashboard")} />
                        }
                    </div>
                </div>
                <div css={bottomLeftSide}>
                    <h1>Recently Added Comment</h1>
                    {loading ? (
                        <div>
                            <div css={commentSkeletonStyle}></div>
                            <div css={commentSkeletonStyle}></div>
                            <div css={commentSkeletonStyle}></div>
                        </div>
                    ) : (
                        studentRecords.map((record) => (
                            <div key={record.id} 
                                 css={commentContainerStyle}
                                 style={record.sentiment === "positive" ? {backgroundColor: "#D2FBEF", border: "1px solid #a7c9bf"} :
                                                   record.sentiment === "negative" ? {backgroundColor: "#FBD2D2", border: "1px solid #bd9f9f"} :
                                                   record.sentiment === "neutral" ? {border: "1px solid rgba(179, 179, 179, 0.7)"} :
                                                   {border: "1px solid white"} }>
                                
                                <p style={{fontSize: "20px"}}>{record.report}</p>
                                <p style={{fontSize: "15px"}}>To {record.studentName}</p>
                                <p style={{fontSize: "15px"}}><small>{new Date(record.timestamp?.toDate()).toLocaleDateString()}</small></p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {
                curUser?.currentUser.email === user?.email && (
                    <div className="right-side" css={rightSideStyle}>
                        <div className="change-information" css={changeInformationStyle}>
                            <div className="back-to-dashboard" css={backToDashboardStyle}>
                                <PrimaryButton content="Back To Dashboard" height={50} borderRadius="10px" width={200} onClick={() => navigate("/dashboard")} />
                            </div>
                            <form onSubmit={handleSubmit} css={formStyle}>
                                <div className="username-input" css={inputContainerStyle}>
                                    <label htmlFor="username">Username <p style={{fontSize: "40px"}}>👱</p></label>
                                    <input
                                        type="text"
                                        css={inputStyle}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="email-input" css={inputContainerStyle}>
                                    <label htmlFor="email">Email <p style={{fontSize: "40px"}}>📬</p></label>
                                    <input
                                        type="text"
                                        css={inputStyle}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="password-input" css={inputContainerStyle}>
                                    <label htmlFor="password">Password <p style={{fontSize: "40px"}}>🔑</p></label>
                                    <input
                                        type="password"
                                        css={inputStyle}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <PrimaryButton content="Submit" height={50} borderRadius="10px" width={200} />
                            </form>
                            {message && <p>{message}</p>}
                        </div>
                    </div>
            )}
            
        </div>
    );
};

export default Profile;
