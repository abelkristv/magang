/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import User from "../model/User";
import { fetchUser } from "../controllers/UserController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";

const ProfileBox = () => {
    const userAuth = useAuth();
    const [user, setUser] = useState<User>();
    const [companyAddress, setCompanyAddress] = useState<string>();
    const [records, setRecords] = useState([]);
    const [documentations, setDocumentations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            const user: User = await fetchUser(userAuth?.currentUser?.email!)
                                        .then((user) => user._tag == "Some" ? user.value : {id: "null"} as User);
            if (user.id == "null") {
                console.log("User not found");
            }
            setUser(user);
            setEditableUser(user);

            if (user?.company_name) {
                const app = getApp();
                const db = getFirestore(app);
                const companyRef = collection(db, "company");
                const q = query(companyRef, where("company_name", "==", user.company_name));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const companyData = querySnapshot.docs[0].data();
                    setCompanyAddress(companyData.company_address);
                }
            }

            if (user?.email) {
                const app = getApp();
                const db = getFirestore(app);
                const studentReportRef = collection(db, "studentReport");
                const reportQuery = query(studentReportRef, where("writer", "==", user.email));
                const reportSnapshot = await getDocs(reportQuery);
                const fetchedRecords = await Promise.all(reportSnapshot.docs.map(async doc => {
                    const record = doc.data();
                    const studentQuery = query(collection(db, "student"), where("name", "==", record.studentName));
                    const studentSnapshot = await getDocs(studentQuery);
                    const studentData = studentSnapshot.docs[0]?.data();
                    const meetingQuery = query(collection(db, "meetingSchedule"), where("studentReport_id", "==", doc.id));
                    const meetingSnapshot = await getDocs(meetingQuery);
                    const meetingData = meetingSnapshot.docs.map(meetingDoc => meetingDoc.data());

                    return {
                        ...record,
                        imageUrl: studentData?.image_url || null,
                        meetings: meetingData
                    };
                }));
                setRecords(fetchedRecords);

                const documentationRef = collection(db, "documentation");
                const docQuery = query(documentationRef, where("writer", "==", user.email));
                const docSnapshot = await getDocs(docQuery);
                const fetchedDocs = docSnapshot.docs.map(doc => doc.data());
                setDocumentations(fetchedDocs);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Implement the logic to save the updated user information
        setUser(editableUser);
        setIsEditing(false);
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 40px 43px 40px 43px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const contentSide = css`
        margin-top: 40px;
    `;

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;

        img {
            min-width: 170px;
            min-height: 100%;
            object-fit: cover;
            border-radius: 10px 0px 0px 10px;
        }
    `;

    const userDescStyle = css`
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: left;
        padding: 10px;
    `;

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        color: black;

        input {
            width: 100%;
            font-size: 20px;
            margin: 0px;

            &:focus {
                outline: none;
            }
        }
    `;

    const informationStyle = css`
        margin-top: 20px;
        color: #51587E;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;

        .column {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;

    const buttonSideStyle = css`
        display: flex;
        margin-top: 30px;
        gap: 10px;

        button {
            border: 1px solid #DCDCDC;
            padding: 10px;
            background-color: white;
            border-radius: 10px;
            font-size: 17px;
            font-weight: medium;
            cursor: pointer;
            &:hover {
                background-color: #dcdcdc;
            }
        }
    `;

    const bottomContentStyle = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 40px;
        .bottomContainer {
            width: 100%;
            .heading {
                display: flex;
                justify-content: space-between;
                font-weight: medium;
            }

            .filterPeriod {
                display: flex;
                gap: 10px;
            }
        }
    `;

    const recentlyAddedRecordsContainerStyle = css`
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
        overflow: scroll;
        height: 500px;

        .recordCard {
            display: flex;
            flex-direction: row;
            box-shadow: 0px 0px 5px 1px #ACACAC;
            border-radius: 5px;
            background-color: white;
            align-items: center;
            min-height: 148px;

            img {
                width: 114px;
                min-height: 100%;
                object-fit: cover;
                border-radius: 5px 0px 0px 5px;
                margin-right: 15px;
            }
        }
    `;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const recordCard = css`
    `

    const cardStyle = css`
        .leftSide {
            width: 50%;
        }
        .rightSide {
            width: 50%;
        }
    `

    const editInputStyle = css`
        border: none;
        border-bottom: 1px solid gray;
        padding: 0px;
    `

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Profile</p>
                <div className="contentSide" css={contentSide}>
                    <div className="userCard" css={userCardStyle}>
                        <img src={user?.image_url} alt="" />
                        <div className="userDesc" css={userDescStyle}>
                            <div className="nameHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{fontWeight: "500", fontSize: "25px"}}>{editableUser?.name}</p>
                                {isEditing ? (
                                    <button onClick={handleSubmit}>Submit</button>
                                ) : (
                                    <Icon icon={"mingcute:edit-line"} fontSize={30} onClick={handleEditClick} style={{ cursor: 'pointer' }} />
                                )}
                            </div>
                            <p style={{ color: "#51587E" }}>{editableUser?.role}</p>
                            <div className="information" css={informationStyle}>
                                <div className="column">
                                    <div className="infoContainer" css={infoContainerStyle}>
                                        <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "10px" }}>
                                            <Icon icon={"ic:outline-email"} fontSize={20} />
                                            <p>Email address</p>
                                        </div>
                                        {isEditing ? (
                                            <input type="text" name="email" value={editableUser?.email} onChange={handleChange} css={editInputStyle} />
                                        ) : (
                                            <p>{editableUser?.email}</p>
                                        )}
                                    </div>
                                    <div className="infoContainer" css={infoContainerStyle}>
                                        <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "10px" }}>
                                            <Icon icon={"ic:outline-phone"} fontSize={20} />
                                            <p>Phone number</p>
                                        </div>
                                        {isEditing ? (
                                            <input type="text" name="phone_number" value={editableUser?.phone_number} onChange={handleChange} css={editInputStyle} />
                                        ) : (
                                            <p>{editableUser?.phone_number}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="infoContainer" css={infoContainerStyle}>
                                        <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "10px" }}>
                                            <Icon icon={"ph:building-bold"} fontSize={20} />
                                            <p>Company Name</p>
                                        </div>
                                        <p>{editableUser?.company_name}</p>
                                    </div>
                                    <div className="infoContainer" css={infoContainerStyle}>
                                        <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "10px" }}>
                                            <Icon icon={"entypo:address"} fontSize={20} />
                                            <p>Company Address</p>
                                        </div>
                                        <p>{companyAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottomContent" css={bottomContentStyle}>
                    <div className="bottomContainer">
                        <div className="heading">
                            <p>Recently Added Records</p>
                            <div className="filterPeriod">
                                <p>Period</p>
                                <select name="" id="">
                                    <option value="">Odd Semester 23.10</option>
                                </select>
                            </div>
                        </div>
                        <div className="recentlyAddedRecordsContainer" css={recentlyAddedRecordsContainerStyle}>
                            {records.length === 0 ? (
                                <p>No Record Found</p>
                            ) : (
                                records.map((record, index) => (
                                    <div key={index} className="recordCard">
                                        {record.imageUrl && <img src={record.imageUrl} alt={record.studentName} />}
                                        <div style={{ 
                                            width: "100%", 
                                            padding: "10px", 
                                            boxSizing: "border-box", 
                                            height: "100%", 
                                            display: "flex", 
                                            flexDirection: "row",
                                            gap: "40px",
                                            justifyContent: "space-between" }}>
                                            <div css={cardStyle} className="leftSide" style={{ overflow: "scroll", width: "50%", paddingTop: "20px" }}>
                                                <div className="name-header" style={{display: "flex", justifyContent: "space-between"}}>
                                                    <p style={{fontSize: "16px"}}><strong>{record.studentName}</strong></p>
                                                    <p style=
                                                        {{ textAlign: "right", 
                                                           color: "#ACACAC", 
                                                           fontWeight: "normal", 
                                                           fontStyle: "italic", 
                                                           fontSize: "15px" }}>{formatDate(record.timestamp)}</p>
                                                </div>
                                                <p style={{fontSize: "15px"}}>{record.report}</p>
                                            </div>
                                            <div className="rightSide" style={{ width: "50%", padding: "10px", boxSizing: "border-box" }}>
                                                {record.meetings && record.meetings.length > 0 ? (
                                                    record.meetings.map((meeting, i) => (
                                                        <div key={i} style={{ 
                                                            marginBottom: "10px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                            paddingLeft: "20px",
                                                            borderLeft: "1px solid #ACACAC"
                                                        }} css={recordCard}>
                                                            <div className="leftSide">
                                                                <Icon icon={"uis:schedule"} fontSize={50} />
                                                            </div>
                                                            <div className="rightSide" style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                                                <p style={{fontSize: "16px"}}><strong>Meeting Scheduled</strong></p>
                                                                <p style={{fontSize: "15.5px"}}>To solve this issue, we decided to hold a meeting with the student for consultation</p>
                                                                <p style={{fontSize: "13px"}}>{meeting.place}</p>
                                                            </div>
                                                            
                                                            
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No Meetings Scheduled</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bottomSide">
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProfileBox;
