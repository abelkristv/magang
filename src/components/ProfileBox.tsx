/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import User from "../model/User";
import { fetchUser } from "../controllers/UserController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getFirestore, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getApp } from "firebase/app";

const ProfileBox = ({ setTodayReportsCount }) => {
    const userAuth = useAuth();
    const [user, setUser] = useState<User>();
    const [companyAddress, setCompanyAddress] = useState<string>();
    const [allRecords, setAllRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [documentations, setDocumentations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);

    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tempSelectedMajor, setTempSelectedMajor] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const user: User = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);
            if (user.id === "null") {
                console.log("User not found");
                setIsLoading(false);
                return;
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

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const startOfDay = Timestamp.fromDate(today);
                const endOfDay = Timestamp.fromDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));

                const reportQuery = query(
                    studentReportRef,
                    where("writer", "==", user.email),
                    where("timestamp", ">=", startOfDay),
                    where("timestamp", "<", endOfDay)
                );

                const reportSnapshot = await getDocs(reportQuery);
                console.log("Report snapshot size:", reportSnapshot.size);
                const fetchedRecords = await Promise.all(reportSnapshot.docs.map(async doc => {
                    const record = doc.data();
                    console.log("Record:", record);
                    const studentQuery = query(collection(db, "student"), where("name", "==", record.studentName));
                    const studentSnapshot = await getDocs(studentQuery);
                    const studentData = studentSnapshot.docs[0]?.data();
                    const meetingQuery = query(collection(db, "meetingSchedule"), where("studentReport_id", "==", doc.id));
                    const meetingSnapshot = await getDocs(meetingQuery);
                    const meetingData = meetingSnapshot.docs.map(meetingDoc => meetingDoc.data());

                    return {
                        ...record,
                        imageUrl: studentData?.image_url || null,
                        major: studentData?.major || null,
                        meetings: meetingData
                    };
                }));
                setAllRecords(fetchedRecords);
                setFilteredRecords(fetchedRecords);

                const documentationRef = collection(db, "documentation");
                const docQuery = query(documentationRef, where("writer", "==", user.email));
                const docSnapshot = await getDocs(docQuery);
                const fetchedDocs = docSnapshot.docs.map(doc => doc.data());
                setDocumentations(fetchedDocs);

                setTodayReportsCount(reportSnapshot.size);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [setTodayReportsCount, userAuth?.currentUser?.email]);

    useEffect(() => {
        const fetchMajors = async () => {
            const app = getApp();
            const db = getFirestore(app);
            const majorsCollection = collection(db, "major");
            const majorSnapshot = await getDocs(majorsCollection);
            const majorList = majorSnapshot.docs.map(doc => doc.data().name);
            setMajors(majorList);
        };
        fetchMajors();
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
        setUser(editableUser);
        setIsEditing(false);
    };

    const handleMajorChange = (event) => {
        setTempSelectedMajor(event.target.value);
    };

    const handleApplyFilters = () => {
        setSelectedMajor(tempSelectedMajor);
        setIsDropdownOpen(false);
        if (tempSelectedMajor) {
            const filtered = allRecords.filter(record => record.major === tempSelectedMajor);
            setFilteredRecords(filtered);
        } else {
            setFilteredRecords(allRecords);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 40px 43px 40px 43px;
        box-sizing: border-box;
    `;

    const navSide = css`
        width: 98%;
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
        min-height: 216px;

        img {
            min-width: 163px;
            width: 163px;
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
        padding: 15px 15px 15px 0px;
        box-sizing: border-box;
    `;

    const infoContainerStyle = css`
        display: grid;
        grid-template-columns: 0.7fr 1fr;
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

        p {
            font-size: 17px;
        }
    `;

    const informationStyle = css`
        margin-top: 30px;
        color: #51587E;
        display: flex;
        gap: 50px;

        .column {
            display: flex;
            width: 500px;
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

            .filterMajor {
                display: flex;
                gap: 10px;
                position: relative;
            }
        }
    `;

    const recentlyAddedRecordsContainerStyle = css`
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 25px;
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

    const placeholderStyle = css`
        background-color: #f0f0f0;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;
        min-height: 216px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .line {
            width: 80%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
        }

        .circle {
            width: 100px;
            height: 100px;
            background-color: #e0e0e0;
            border-radius: 50%;
        }
    `;

    const dropdownStyle = css`
        padding: 10px;
        box-sizing: border-box;
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        width: 242px;
        height: 47px;
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            font-size: 17px;
        }
    `;

    const dropdownContentStyle = css`
        display: ${isDropdownOpen ? 'block' : 'none'};
        position: absolute;
        background-color: #EBEBEB;
        top: 120%;
        left: -10%;
        text-align: start;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        z-index: 1;

        p {
            margin: 0;
            padding: 10px 0px 10px 0px;
            cursor: pointer;
        }

        select {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: white;
            font-size: 15px;
            cursor: pointer;
        }

        button {
            width: 25%;
            padding: 10px;
            border: none;
            border-radius: 10px;
            background-color: #000000;
            color: white;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            &:hover {
                background-color: #363636;
            }
        }
    `;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const recordCard = css``;

    const cardStyle = css`
        .leftSide {
            // width: ${editableUser?.role == "Enrichment" ? "50%" : "100%"} !important;
        }
        .rightSide {
            width: 50%;
        }
    `;

    const editInputStyle = css`
        border: none;
        width: 258px !important;
        border-bottom: 1px solid gray;
        padding: 0px;
        font-size: 17px !important;
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            {isLoading ? (
                <div className="navSide" css={navSide}>
                    <p>Profile</p>
                    <div className="contentSide" css={contentSide}>
                        <div className="placeholder" css={placeholderStyle}>
                            <div className="circle"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="bottomContent" css={bottomContentStyle}>
                        <div className="bottomContainer">
                            <div className="heading">
                                <p>Recently Student Meeting by Enrichment Team</p>
                            </div>
                            <div className="recentlyAddedRecordsContainer" css={recentlyAddedRecordsContainerStyle}>
                                <div className="placeholder" css={placeholderStyle}>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                </div>
                                <div className="placeholder" css={placeholderStyle}>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="navSide" css={navSide}>
                    <p>Profile</p>
                    <div className="contentSide" css={contentSide}>
                        <div className="userCard" css={userCardStyle}>
                            <img src={user?.image_url} alt="" />
                            <div className="userDesc" css={userDescStyle}>
                                <div className="nameHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                    <p style={{ fontWeight: "500", fontSize: "21px" }}>{editableUser?.name}</p>
                                    {isEditing ? (
                                        <button onClick={handleSubmit}>Submit</button>
                                    ) : (
                                        <Icon icon={"mingcute:edit-line"} fontSize={30} onClick={handleEditClick} style={{ cursor: 'pointer' }} />
                                    )}
                                </div>
                                <p style={{ color: "#51587E", fontSize: "17.5px" }}>{editableUser?.role == "Company" ? "Site Supervisor" : "Enrichment SOCS"}</p>
                                <div className="information" css={informationStyle}>
                                    <div className="column">
                                        <div className="infoContainer" css={infoContainerStyle}>
                                            <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                <Icon icon={"ic:outline-email"} fontSize={24} />
                                                <p>Email address</p>
                                            </div>
                                            {isEditing ? (
                                                <input type="text" name="email" value={editableUser?.email} onChange={handleChange} css={editInputStyle} />
                                            ) : (
                                                <p>{editableUser?.email}</p>
                                            )}
                                        </div>
                                        <div className="infoContainer" css={infoContainerStyle}>
                                            <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                <Icon icon={"ic:outline-phone"} fontSize={24} />
                                                <p>Phone number</p>
                                            </div>
                                            {isEditing ? (
                                                <input type="text" name="phone_number" value={editableUser?.phone_number} onChange={handleChange} css={editInputStyle} />
                                            ) : (
                                                <p>{editableUser?.phone_number}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="column" style={{width: "600px"}}>
                                        <div className="infoContainer" css={infoContainerStyle}>
                                            <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "20px" }}>
                                                <Icon icon={"ph:building-bold"} fontSize={24} />
                                                <p>Company Name</p>
                                            </div>
                                            <p>{editableUser?.company_name}</p>
                                        </div>
                                        <div className="infoContainer" css={infoContainerStyle}>
                                            <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "start", gap: "20px" }}>
                                                <Icon icon={"entypo:address"} fontSize={24} />
                                                <p>Company Address</p>
                                            </div>
                                            <p style={{width: "130%", textAlign: "justify"}}>{companyAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottomContent" css={bottomContentStyle}>
                        <div className="bottomContainer">
                            <div className="heading">
                                <p>{editableUser?.role === "Enrichment" ? "Recently Student Meeting by Enrichment Team" : "Recent Student Records by Company"}</p>
                                <div className="righSide" style={{display: "flex", gap: "10px", alignItems: "center", position: "relative"}}>
                                    <p style={{fontSize: '15px'}}>Filter By : </p>
                                    <div className="filterMajor" css={dropdownStyle} onClick={toggleDropdown}>
                                        <p>{selectedMajor || "All Majors"}</p>
                                        <Icon icon={"weui:arrow-filled"} rotate={45} />
                                    </div>
                                    {isDropdownOpen && 
                                        <div className="dropdown-content" css={dropdownContentStyle}>
                                            <p>Major</p>
                                            <select value={tempSelectedMajor} onChange={handleMajorChange}>
                                                <option value="">All</option>
                                                {majors.map((major, index) => (
                                                    <option key={index} value={major}>{`${major}`}</option>
                                                ))}
                                            </select>
                                            
                                            <div className="buttonContainer" style={{display: "flex", justifyContent: "end", marginTop: "30px"}}>
                                                <button onClick={handleApplyFilters}>Apply</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="recentlyAddedRecordsContainer" css={recentlyAddedRecordsContainerStyle}>
                                {filteredRecords.length === 0 ? (
                                    <p>No Record Written Today</p>
                                ) : (
                                    filteredRecords.map((record, index) => (
                                        <div key={index} className="recordCard">
                                            {record.imageUrl && <img src={record.imageUrl} alt={record.studentName} />}
                                            <div style={{
                                                width: "100%",
                                                padding: "10px",
                                                boxSizing: "border-box",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "10px",
                                                justifyContent: "space-between"
                                            }}>
                                                <div css={cardStyle} className="leftSide" style={
                                                    editableUser?.role == "Enrichment" ? { overflow: "scroll", width: "49%", paddingTop: "20px" } :
                                                    { overflow: "scroll", width: "100%", paddingTop: "20px" }
                                                    }>
                                                    <div className="name-header" style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <p style={{ fontSize: "16px" }}><strong>{record.studentName}</strong></p>
                                                        <p style={{
                                                            textAlign: "right",
                                                            color: "#ACACAC",
                                                            fontWeight: "normal",
                                                            fontStyle: "italic",
                                                            fontSize: "15px"
                                                        }}>{formatDate(record.timestamp)}</p>
                                                    </div>
                                                    <p style={{ fontSize: "15px" }}>{record.report}</p>
                                                </div>
                                                
                                                {editableUser?.role === "Enrichment" && (
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
                                                                        <Icon icon={"uis:schedule"} fontSize={50} color="#51587E" />
                                                                    </div>
                                                                    <div className="rightSide" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                                        <p style={{ fontSize: "16px" }}><strong>Meeting Scheduled</strong></p>
                                                                        <p style={{ fontSize: "15.5px" }}>To solve this issue, we decided to hold a meeting with the student for consultation</p>
                                                                        <p style={{ fontSize: "13px" }}>{meeting.place}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div style={{
                                                                marginBottom: "10px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "20px",
                                                                paddingLeft: "20px",
                                                                height: "100%",
                                                                borderLeft: "1px solid #ACACAC"
                                                            }} css={recordCard}>
                                                                <div className="leftSide">
                                                                    <Icon icon={"uis:schedule"} fontSize={50} color="#51587E" />
                                                                </div>
                                                                <div className="rightSide" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "100%"}}>
                                                                    <p style={{ fontSize: "16px" }}>No Meeting Scheduled</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
            )}
        </main>
    );
}

export default ProfileBox;
