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
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!);
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
                    return {
                        ...record,
                        imageUrl: studentData?.image_url || null
                    };
                }));
                setRecords(fetchedRecords);
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
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const contentSide = css`
        margin-top: 50px;
    `;

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;

        img {
            min-width: 220px;
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
        padding: 20px;
    `;

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        color: black;

        input {
            // border: none;
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
        gap: 10px;

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
        .leftSide {
            width: 50%;
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
        .rightSide {
            width: 45%;
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
            border-radius: 10px;
            background-color: white;
            align-items: center;
            min-height: 200px;

            img {
                width: 150px;
                min-height: 100%;
                object-fit: cover;
                border-radius: 10px 0px 0px 10px;
                margin-right: 15px;
            }
        }
    `;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Profile</p>
                <div className="contentSide" css={contentSide}>
                    <div className="userCard" css={userCardStyle}>
                        <img src={user?.image_url} alt="" />
                        <div className="userDesc" css={userDescStyle}>
                            <div className="nameHeader" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <h1>{editableUser?.name}</h1>
                                {isEditing ? (
                                    <button onClick={handleSubmit}>Submit</button>
                                ) : (
                                    <Icon icon={"mingcute:edit-line"} fontSize={30} onClick={handleEditClick} style={{ cursor: 'pointer' }} />
                                )}
                            </div>
                            <p style={{ color: "#51587E" }}>{editableUser?.company_name}</p>
                            <div className="information" css={informationStyle}>
                                <div className="column">
                                    <div className="infoContainer" css={infoContainerStyle}>
                                        <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "10px" }}>
                                            <Icon icon={"ic:outline-email"} fontSize={20} />
                                            <p>Email address</p>
                                        </div>
                                        {isEditing ? (
                                            <input type="text" name="email" value={editableUser?.email} onChange={handleChange} />
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
                                            <input type="text" name="phone_number" value={editableUser?.phone_number} onChange={handleChange} />
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
                    <div className="leftSide">
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
                                        <div style={{width: "100%", padding: "10px", boxSizing: "border-box", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                            <div className="topSide" style={{overflow: "scroll"}}>
                                                <p><strong>{record.studentName}</strong></p>
                                                <p>{record.report}</p>
                                            </div>
                                            <div className="bottomSide">
                                                <p style={{ textAlign: "right", color: "#ACACAC", fontWeight: "normal" }}>{formatDate(record.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="rightSide"></div>
                </div>
            </div>
        </main>
    );
}

export default ProfileBox;
