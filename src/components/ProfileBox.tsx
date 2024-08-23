/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { useEffect, useState } from "react";
import User from "../model/User";
import { fetchUser } from "../controllers/UserController";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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
    
                const reportQuery = query(
                    studentReportRef,
                    where("writer", "==", user.email),
                    where("type", "==", "Urgent") // Fetch only records with type="Urgent"
                );
    
                const reportSnapshot = await getDocs(reportQuery);
                console.log("Report snapshot size:", reportSnapshot.size);
                
                // Create a dictionary to store student data by student name
                const studentDataDict = {};
    
                const fetchedRecords = await Promise.all(reportSnapshot.docs.map(async doc => {
                    const record = doc.data();
                    console.log("Record:", record);
                    
                    let studentData;
                    if (studentDataDict[record.studentName]) {
                        studentData = studentDataDict[record.studentName];
                    } else {
                        const studentQuery = query(collection(db, "student"), where("name", "==", record.studentName));
                        const studentSnapshot = await getDocs(studentQuery);
                        studentData = studentSnapshot.docs[0]?.data();
                        studentDataDict[record.studentName] = studentData;  // Save the student data in the dictionary
                    }
    
                    const meetingQuery = query(collection(db, "meetingSchedule"), where("studentReport_id", "==", doc.id));
                    const meetingSnapshot = await getDocs(meetingQuery);
                    const meetingData = meetingSnapshot.docs.map(meetingDoc => meetingDoc.data());
    
                    return {
                        ...record,
                        studentData,  // Attach student data to each record
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
        padding: 40px 15px 40px 43px;
        box-sizing: border-box;
    `;

    const navSide = css`
        width: 98%;
        max-height: 10px;
        p {
            text-align: start;
            font-size: 20px;
        }
    `;

    const headerTop = css`
        font-weight: 300;
    `;

    const loadingWidth = css`
        max-height: 155px;
    `;
    

    const contentSide = css`
        margin-top: 37px;
    `;

    const userCardStyle = css`
        display: flex;
        gap: 30px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;
        min-height: 155px;

        img {
            min-width: 145px;
            width: 155px;
            height: 185px;
            object-fit: cover;
            border-radius: 10px 0px 0px 10px;
        }
    `;

    const userDescStyle = css`
        display: flex;
        flex-direction: column;
        items-align: center;
        justify-content: center;
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
            font-size: 16px;
        }
    `;

    const informationStyle = css`
        margin-top: 20px;
        color: #51587E;
        display: flex;

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
        margin-top: 20px;
        .bottomContainer {
            width: 100%;
            .heading {
                display: flex;
                justify-content: space-between;
                font-weight: medium;
            }

            .fixTextWeight{
                font-weight: 600;
            }

            .filterMajor {
                display: flex;
                gap: 10px;
                position: relative;
            }
        }
    `;

    const recentlyAddedRecordsContainerStyle = css`
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 2px;
        box-sizing: border-box;
        overflow: auto;
        height: 500px;

        .recordCard {
            display: flex;
            flex-direction: row;
            box-shadow: 1px 1px 4px 3px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: white;
            align-items: center;
            height: 160px;

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
        background-color: white;
        border-radius: 10px;
        width: 100%;
        min-width: 900px;
        min-height: 155px;
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
        background-color: #EBEBEB;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            font-size: 15px;
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
            font-size: 16px;
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
            font-weight: 500;
            cursor: pointer;
            margin-top: 10px;
            &:hover {
                background-color: #363636;
            }
        }
    `;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    
        return { time: formattedTime, date: formattedDate };
    };
    

    const recordCard = css``;

    const cardStyle = css`
        .leftSide {
            // width: ${editableUser?.role == "Enrichment" ? "50%" : "100%"} !important;
            overflow: hidden;
        }
        .rightSide {
            width: 50%;
        }

        height: 100%;
    `;

    const editInputStyle = css`
        border: none;
        width: 258px !important;
        border-bottom: 1px solid gray;
        padding: 0px;
        font-size: 16px !important;
    `;



    return (
        <main className="mainStyle" css={mainStyle}>
            {isLoading ? (
                <div className="navSide" css={navSide}>
                    <div css={loadingWidth}>
                        <p css={headerTop}>Profile</p>
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
                                <div className="heading fixTextWeight">
                                    <p>Unresolved Urgent Student Records</p>
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
                </div>
            ) : (
                <div className="navSide" css={navSide}>
                    <p css={headerTop}>Profile</p>
                    <div className="contentSide" css={contentSide}>
                        <div className="userCard" css={userCardStyle}>
                            <img src={user?.image_url} alt="" />
                            <div className="userDesc" css={userDescStyle}>
                                <div className="nameHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1px" }}>
                                    <p style={{ fontWeight: "600", fontSize: "18px" }}>{editableUser?.name}</p>
                                    {isEditing ? (
                                        (<Icon icon={"mingcute:check-line"} fontSize={30} onClick={handleEditClick} style={{ cursor: 'pointer' }} />)
                                    ) : (
                                        <Icon icon={"mingcute:edit-line"} fontSize={30} onClick={handleEditClick} style={{ cursor: 'pointer' }} />
                                    )}
                                </div>
                                <p style={{ color: "#51587E", fontWeight: "500", fontSize: "16px" }}>{editableUser?.role == "Company" ? "Site Supervisor" : "Enrichment SOCS"}</p>
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
                                <div className="pContainer" style={{display: "flex", alignItems: "center"}}>
                                    <p style={{fontWeight: "600", fontSize: "19px"}}>Unresolved Urgent Student Records</p>
                                </div>
                                <div className="righSide" style={{display: "flex", gap: "10px", alignItems: "center", position: "relative"}}>
                                    <p style={{fontSize: '15px'}}>Filter By : </p>
                                    <div className="filterMajor" css={dropdownStyle} onClick={toggleDropdown}>
                                        <p>{selectedMajor || "All Majors"}</p>
                                        <Icon icon={"weui:arrow-filled"} rotate={45} fontSize={10} />
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
                                                <button onClick={handleApplyFilters} style={{backgroundColor: "#49A8FF"}}>Apply</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="recentlyAddedRecordsContainer" css={recentlyAddedRecordsContainerStyle}>
                                {filteredRecords.length === 0 ? (
                                    <p>No Record Written Today</p>
                                ) : (
                                    filteredRecords.map((record, index) => {
                                        const { time, date } = formatDate(record.timestamp);
                                        const timestamp = new Date(record.timestamp.seconds * 1000);
                                        const formattedDate = timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                        const formattedTime = timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                        return (
                                        <div key={index} className="recordCard">
                                            {record.imageUrl && <img src={record.imageUrl} alt={record.studentName} style={{height:"7px"}} />}
                                            <div style={{
                                                width: "100%",
                                                padding: "10px",
                                                boxSizing: "border-box",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                paddingRight: "20px",
                                                gap: "10px"
                                            }}>
                                                <div css={cardStyle} className="leftSide" style={
                                                    editableUser?.role == "Enrichment" ? { width: "50%", paddingTop: "0px" } :
                                                    { width: "100%", paddingTop: "0px" }
                                                    }>
                                                    <div className="name-header" style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                                        <p style={{ fontSize: "17.5px", fontWeight: "500" }}>{record.studentName}</p>
                                                        <p style={{fontSize: "15px", fontWeight: "500", color: "#51587E"}}>{record.studentData.nim}</p>
                                                        <div className="studentInfoContainer" style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "10px",
                                                            marginTop: "10px"
                                                        }}>
                                                            <div style={{display: 'flex', flexDirection: "column", gap: "5px"}}>
                                                                <div className="studentInfoContent" style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "0.063fr 0.31fr 0.3fr",
                                                                    alignItems:"center"
                                                                }}>
                                                                    <Icon icon={"ph:building-bold"} fontSize={20} color="#51587E" />
                                                                    <p style={{fontSize: "15px", color: "#51587E"}}>Organization Name</p>
                                                                    <p style={{fontSize: "15px", color: "black"}}>{record.studentData.tempat_magang}</p>
                                                                </div>
                                                                <div className="studentInfoContent" style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "0.063fr 0.31fr 0.3fr",
                                                                    alignItems:"center"
                                                                }}>
                                                                    <Icon icon={"material-symbols:supervisor-account"} fontSize={20} color="#51587E" />
                                                                    <p style={{fontSize: "15px", color: "#51587E"}}>Faculty Supervisor</p>
                                                                    <p style={{fontSize: "15px", color: "black"}}>{record.studentData.faculty_supervisor}</p>
                                                                </div>
                                                                <div className="studentInfoContent" style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "0.063fr 0.31fr 0.3fr",
                                                                    alignItems:"center"
                                                                }}>
                                                                    <Icon icon={"ic:outline-people"} fontSize={20} color="#51587E" />
                                                                    <p style={{fontSize: "15px", color: "#51587E"}}>Site Supervisor</p>
                                                                    <p style={{fontSize: "15px", color: "black"}}>{record.studentData.site_supervisor}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="rightSide" style={{position:"relative", width: "70%", paddingLeft: "10px", height: "100%", boxSizing: "border-box" }}>
                                                    <div style={{
                                                        marginBottom: "10px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        height: "100%",
                                                        // gap: "5px",
                                                        paddingLeft: "35px",
                                                        borderLeft: "1px solid #ACACAC"
                                                    }} css={recordCard}>
                                                        <div className="record-header" style={{
                                                            display: "flex",
                                                            gap: "20px",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <p style={{fontSize: "16px", fontWeight: "500"}}>{record.writer}</p>
                                                            <p
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0px",
                                                                    top: "5px",
                                                                    backgroundColor: record.type === 'Report' ? '#A024FF' : record.type === 'Urgent' ? 'red' : 'orange',
                                                                    color: 'white',
                                                                    fontWeight: '500',
                                                                    padding: '2px',
                                                                    borderRadius: '10px',
                                                                    fontSize: "15px",
                                                                    width: '75px',
                                                                    textAlign: 'center',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                {record.type}
                                                            </p>
                                                        </div>
                                                        <div className="additional-header">
                                                            <p style={{
                                                                fontSize: "14px",
                                                                fontStyle: "italic",
                                                                color: "#51587E"
                                                            }}>By {record.person} - {formattedTime}, {formattedDate}</p>
                                                        </div>
                                                        <div className="content">
                                                            <p style={{
                                                                color: "#5F6368",
                                                                fontSize: "16px",
                                                                marginTop: "13px"
                                                            }}>{record.report}</p>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div className="bottomSide">
                                            </div>
                                        </div>
                                    )})
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
