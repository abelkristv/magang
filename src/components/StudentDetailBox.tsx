/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { useAuth } from "../helper/AuthProvider";
import { Icon } from "@iconify/react";
import { collection, doc, getDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Student from "../model/Student";
import { fetchUser } from "../controllers/UserController";
import * as XLSX from 'xlsx';

const Modal = ({ isOpen, onClose, onSubmit, studentReportId }) => {
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ timeStart, timeEnd, description, place, date, studentReportId });
        onClose();
    };

    const modalStyle = css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `;

    const modalContentStyle = css`
        background: white;
        border-radius: 10px;
        width: 557px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        border-radius: 10px;

        .headerp {
            margin: 0px;
            border-radius: 10px 10px 0px 0px;
            background-color: #ebebeb;
            padding: 10px;
            font-size: 19px;
            font-weight: medium;
        }
    `;

    const inputStyle = css`
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
    `;

    const buttonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        &:hover {
            background-color: #68b5fc;
        }
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;

        p {
            text-align: start;
        }
    `

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <p className="headerp">Schedule a Meeting</p>
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div className="dateContainer" style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <p>Date</p>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            css={inputStyle}
                            required
                        />
                    </div>
                    <div className="timeContainer">
                        <p>Time</p>
                        <div className="timeChooserContainer" style={{display: "flex", gap: "30px"}}>
                            <div className="startTime" style={{display: "flex", gap: "20px", alignItems: "center"}}>
                                <p>Start</p>
                                <input
                                    type="time"
                                    placeholder="Start Time"
                                    value={timeStart}
                                    onChange={(e) => setTimeStart(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div className="endTime" style={{display: "flex", gap: "20px", alignItems: "center"}}>
                                <p>End</p>
                                <input
                                    type="time"
                                    placeholder="End Time"
                                    value={timeEnd}
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="descriptionContainer" style={{display: "flex", flexDirection: "column"}}>
                        <p>Description</p>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            css={inputStyle}
                            rows="4"
                            required
                        />
                    </div>
                    <div className="placeContainer" style={{display: "flex", flexDirection: "column"}}>
                        <p>Place / Zoom Link</p>
                        <input
                            type="text"
                            placeholder="Place / Zoom Link"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            css={inputStyle}
                            required
                        />
                    </div>
                    
                    <button type="submit" css={buttonStyle}>
                        Schedule
                    </button>
                </form>
            </div>
        </div>
    );
};


interface StudentDetailBoxProps {
    studentId: string;
}

const StudentDetailBox = ({ studentId }: StudentDetailBoxProps) => {
    const userAuth = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    });
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [meetingSchedules, setMeetingSchedules] = useState<{ [key: string]: any }>({});
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

    const [isFetching, setIsFetching] = useState<boolean>(true);

    // Filter state
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");
    const [filterRatingFrom, setFilterRatingFrom] = useState<string>("");
    const [filterRatingTo, setFilterRatingTo] = useState<string>("");
    const [user, setUser] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            console.log(user)
            
            setUser(user)
        }
        fetchData()
    }, []);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentDoc = await getDoc(doc(collection(db, "student"), studentId));
                if (studentDoc.exists()) {
                    const data = studentDoc.data();
                    setStudent({
                        iden: studentDoc.id,
                        name: data.name,
                        nim: data.nim,
                        tempat_magang: data.tempat_magang,
                        semester: data.semester,
                        email: data.email,
                        phone: data.phone,
                        image_url: data.image_url,
                        status: data.status,
                        major: data.major,
                        faculty_supervisor: data.faculty_supervisor,
                        site_supervisor: data.site_supervisor,
                    } as Student);
                } else {
                    console.error("No such student!");
                }
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };
        fetchStudent();
    }, [studentId]);

    const fetchReports = async () => {
        if (student && student.name) {
            let reportsQuery = query(collection(db, "studentReport"), where("studentName", "==", student.name));
            
            // Apply date filters
            if (filterStartDate) {
                reportsQuery = query(reportsQuery, where("timestamp", ">=", new Date(filterStartDate)));
            }
            if (filterEndDate) {
                reportsQuery = query(reportsQuery, where("timestamp", "<=", new Date(filterEndDate)));
            }

            const reportSnapshot = await getDocs(reportsQuery);
            const reportList = reportSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
            
            // Apply rating filters
            const filteredReports = reportList.filter(report => {
                const rating = parseInt(report.data.rating, 10);
                const ratingFrom = filterRatingFrom ? parseInt(filterRatingFrom, 10) : 1;
                const ratingTo = filterRatingTo ? parseInt(filterRatingTo, 10) : 5;
                return rating >= ratingFrom && rating <= ratingTo;
            });

            setReports(filteredReports);

            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let totalRating = 0;
            filteredReports.forEach(report => {
                const rating = parseInt(report.data.rating, 10);
                counts[rating] = (counts[rating] || 0) + 1;
                totalRating += rating;
            });
            setRatingCounts(counts);
            setAverageRating(totalRating / filteredReports.length);

            await checkMeetingSchedules(filteredReports.map(report => report.id));

            setIsFetching(false);
        }
    };

    const checkMeetingSchedules = async (reportIds) => {
        const schedules = {};
        for (const reportId of reportIds) {
            const q = query(collection(db, "meetingSchedule"), where("studentReport_id", "==", reportId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                schedules[reportId] = querySnapshot.docs[0].data();
            }
        }
        setMeetingSchedules(schedules);
    };

    useEffect(() => {
        fetchReports();
    }, [student, filterStartDate, filterEndDate, filterRatingFrom, filterRatingTo]);

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRating(parseInt(event.target.value));
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleAddRecord = async () => {
        if (selectedRating === null || description.trim() === "") {
            alert("Please provide a rating and a description.");
            return;
        }

        const newRecord = {
            hasRead: false,
            rating: selectedRating,
            report: description,
            sentiment: selectedRating > 3 ? "positive" : "negative",
            studentName: student!.name,
            timestamp: new Date(),
            writer: userAuth?.currentUser.email,
        };

        try {
            await addDoc(collection(db, "studentReport"), newRecord);
            alert("Record added successfully!");
            // Optionally, you can clear the form fields after successful submission
            setSelectedRating(null);
            setDescription("");
            // Fetch the updated reports
            fetchReports();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add record. Please try again.");
        }
    };

    const handleScheduleMeetingClick = (reportId) => {
        setSelectedReportId(reportId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = async (data) => {
        const newMeeting = {
            date: data.date,
            description: data.description,
            studentReport_id: data.studentReportId,
            timeStart: data.timeStart,
            timeEnd: data.timeEnd,
            place: data.place
        };

        try {
            await addDoc(collection(db, "meetingSchedule"), newMeeting);
            alert("Meeting scheduled successfully!");
            await checkMeetingSchedules(Object.keys(meetingSchedules));
        } catch (error) {
            console.error("Error scheduling meeting: ", error);
            alert("Failed to schedule meeting. Please try again.");
        }
    };

    const handleShowMeetingScheduleClick = (reportId) => {
        setExpandedReportId(reportId === expandedReportId ? null : reportId);
    };

    const exportToExcel = () => {
        const data = reports.map(report => ({
            Writer: report.data.writer,
            Rating: report.data.rating,
            Report: report.data.report,
            Timestamp: new Date(report.data.timestamp.seconds * 1000).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

        XLSX.writeFile(workbook, "StudentReports.xlsx");
    };

    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        display: flex;
        justify-content: space-between;
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
            width: 220px;
            height: 260px;
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
    `;

    const informationStyle = css`
        margin-top: 20px;
        color: #51587E;
        display: flex;
        flex-direction: column;
        gap: 10px;
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

    const greaterInformationContainerStyle = css`
        display: flex;
        justify-content: space-between;

        .left-side {
            width: 50%;
        }

        .right-side {
            width: 45%;
        }
    `;

    const filterStyle = css`
        display: flex;
        gap: 10px;
    `;

    const ratingShowcaseStyle = css`
        margin-top: 30px;
        .rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .rating-value {
            font-size: 16px;
            color: #FFA000;
        }
    `;

    const barChartStyle = css`
        margin-top: 30px;
        text-align: start;
        display: flex;
        flex-direction: column;
        .bar {
            display: flex;
            align-items: center;
            .bar-label {
                width: 50px;
            }
            .bar-value {
                height: 10px;
                background-color: #FFA000;
                margin-left: 10px;
            }
        }
    `;

    const getBarWidth = (count: number, total: number) => {
        if (total === 0) return '0%';
        const percentage = (count / total) * 100;
        return `${percentage}%`;
    };

    const barValueStyle = css`
        background-color: #49A8FF;
        height: 100%;
        border-radius: 10px;
    `;

    const ratingContainerStyle = css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        h1 {
            margin: 0px;
        }
        .averageRating {
            width: 10%;
            font-size: 68px;
            font-weight: regular;
            text-align: start;
            display: flex;
            align-items: center;
            margin: 0px;
        }

        .barChart {
            width: 82%;
            margin: 0px;
        }
    `;

    const bottomContentContainerStyle = css`
        display: flex;
        margin-top: 40px;
        gap: 50px;
        .left-side {
            width: 60%;
        }

        .right-side {
            width: 40%;
        }
    `;

    const dropdownStyle = css`
        position: relative;
        display: flex;
        background-color: #EBEBEB;
        padding: 10px;
        width: 200px;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        cursor: pointer;
    `;

    const dropdownContentStyle = css`
        display: ${isDropdownOpen ? 'flex' : 'none'};
        flex-direction: column;
        gap: 20px;
        font-size: 18px;
        background-color: #EBEBEB;
        text-align: start;
        position: absolute;
        top: 120%;
        left: -49%;
        width: 400px;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10;

        .inputText {
            width: 30px;
        }

        .time {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .rating {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    `;

    const addRecordBoxStyle = css`
        width: 100%;
        border: 1px solid #ebebeb;
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        p {
            text-align: start;
        }
        .headerp {
            background-color: #ebebeb;
            margin: 0px;
            font-size: 20px;
            font-weight: 600;
            padding: 5px;
            text-align: center;
        }
    `;

    const recordFormStyle = css`
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        p {
            font-weight: 500;
        }
    `;

    const radioButtonsStyle = css`
        display: flex;
        gap: 10px;

        label {
            display: flex;
            align-items: center;
            gap: 5px;
        }
    `;

    const buttonStyle = css`
        border: none;
        background-color: #49A8FF;
        padding: 10px;
        color: white;
        border-radius: 10px;
        font-weight: 600;
        font-size: 20px;
        margin-top: 40px;

        &:hover{
            cursor: pointer;
            background-color: #68b5fc;
        }
    `;

    const reportItemStyle = css`
        border-bottom: 1px solid #ebebeb;
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 5px;

        .report-writer {
            font-weight: bold;
        }

        .report-rating {
            color: #FFA000;
        }

        .topSide {
            display: flex;
            justify-content: space-between;
        }

        .topLeftSide {
            display: flex;
            flex-direction: column;
        }

        .topRightSide {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
        }

        .report-hour {
            font-size: 14px;
            color: #888;
        }

        .report-date {
            font-size: 12px;
            color: #888;
        }
    `;

    const buttonWhiteStyle = css`
        padding: 6px;
        border: 4px solid #ebebeb;
        border-radius: 10px;
        font-weight: 600;
        margin-top: 10px;
        width: 200px;
        color: black;
        background-color: white;

        &:hover {
            background-color: #ebebeb;
            cursor: pointer;
        }
    `

    const showMeetingScheduleStyle = css`
        cursor: pointer;
        color: #49A8FF;
        font-weight: bold;
        &:hover {
            text-decoration: underline;
        }
    `;

    const expandedCardStyle = css`
        padding: 10px 0px 0px 50px;
        border-radius: 10px;
        margin-top: 10px;
    `;

    const placeholderStyle = css`
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ebebeb;
        border-radius: 10px;
        background-color: #f9f9f9;
        color: #888;
        font-size: 18px;
    `;

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Student Detail</p>
                <div className="filter" css={filterStyle}>
                    <p>Filter : </p>
                    <select name="" id="">
                        <option value="">Odd Semester 23.10</option>
                    </select>
                </div>
            </div>
            <div className="contentSide" css={contentSide}>
                <div className="userCard" css={userCardStyle}>
                    {student ? (
                        <>
                            <img src={student.image_url} alt={student.name} />
                            <div className="userDesc" css={userDescStyle}>
                                <h1>{student.name}</h1>
                                <p style={{ color: "#51587E" }}>{student.nim}</p>
                                <div className="greaterInformationContainer" css={greaterInformationContainerStyle}>
                                    <div className="left-side">
                                        <div className="information" css={informationStyle}>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"mdi:college-outline"} fontSize={20} />
                                                    <p>Major</p>
                                                </div>
                                                <p>{student.major}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ph:building-bold"} fontSize={20} />
                                                    <p>Organization Name</p>
                                                </div>
                                                <p>{student.tempat_magang}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ic:outline-email"} fontSize={20} />
                                                    <p>Email Address</p>
                                                </div>
                                                <p>{student.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-side">
                                        <div className="information" css={informationStyle}>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"material-symbols:supervisor-account"} fontSize={20} />
                                                    <p>Faculty Supervisor</p>
                                                </div>
                                                <p>{student.faculty_supervisor}</p>
                                            </div>
                                            <div className="infoContainer" css={infoContainerStyle}>
                                                <div className="container" style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "10px" }}>
                                                    <Icon icon={"ic:outline-people"} fontSize={20} />
                                                    <p>Site Supervisor</p>
                                                </div>
                                                <p>{student.site_supervisor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div css={placeholderStyle}>Loading student details...</div>
                    )}
                </div>
                
                <div className="bottomContentContainer" css={bottomContentContainerStyle}>
                    <div className="left-side">
                        <div className="recordsContainer" style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                            <h2 style={{textAlign: "left", marginBottom: "0px"}}>Records</h2>
                            <div className="filterContainer" style={{display: "flex", alignItems: "center", gap: "20px", position: "relative"}}>
                                <p>Filter : </p>
                                <div className="dropdown" css={dropdownStyle} onClick={handleDropdownClick}>
                                    <p>All Records</p>
                                    <Icon icon={"weui:arrow-filled"} rotate={45} />
                                </div>
                                <div className="dropdown-content" css={dropdownContentStyle}>
                                    <div className="time">
                                        <p>Time</p>
                                        <div className="timeOptionContainer" style={{display: "flex", justifyContent: "space-between"}}>
                                            <div className="startTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>Start</p>
                                                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} /> 
                                            </div>
                                            <div className="endTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>End</p>
                                                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} /> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        <p>Rating</p>
                                        <div className="timeOptionContainer" style={{display: "flex", gap: "20px"}}>
                                            <div className="startTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>From</p>
                                                <input type="text" className="inputText" value={filterRatingFrom} onChange={(e) => setFilterRatingFrom(e.target.value)} /> 
                                            </div>
                                            <div className="endTimeContainer" style={{display: "flex", gap: "20px"}}>
                                                <p>To</p>
                                                <input type="text" className="inputText" value={filterRatingTo} onChange={(e) => setFilterRatingTo(e.target.value)} /> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isFetching ? (
                            <div css={placeholderStyle}>Loading records...</div>
                        ) : (
                            <>
                                {reports.length > 0 && (
                                    <div className="ratingContainerStyle" css={ratingContainerStyle}>
                                        <div className="averageRating" css={css`margin-top: 30px;`}>
                                            <p>{averageRating ? averageRating.toFixed(2) : "N/A"}</p>
                                        </div>
                                        <div className="barChart" css={barChartStyle}>
                                            {Object.keys(ratingCounts).map(rating => (
                                                <div key={rating} className="bar">
                                                    <div className="bar-label">{rating}</div>
                                                    <div
                                                        className="bar-value" css={barValueStyle}
                                                        style={{ width: "100%", borderRadius: "10px", backgroundColor: "#F0ECEC" }}
                                                    >
                                                        <div className="barValueBg" css={barValueStyle} style={{ width: getBarWidth(ratingCounts[rating], reports.length) }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="reportContainer" style={{overflow: "scroll", height: "400px"}}>
                                    {reports.map((report) => (
                                        <div key={report.id} className="reportItem" css={reportItemStyle}>
                                            <div className="topSide">
                                                <div className="topLeftSide">
                                                    <p className="report-writer">{report.data.writer}</p>
                                                    <p className="report-rating" style={{color: "#49A8FF"}}>{report.data.rating}</p>
                                                </div>
                                                <div className="topRightSide">
                                                    <p className="report-hour">{new Date(report.data.timestamp.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                                                    <p className="report-date">{new Date(report.data.timestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <p className="report-content">{report.data.report}</p>
                                            {meetingSchedules[report.id] ? (
                                                <>
                                                    <p css={showMeetingScheduleStyle} onClick={() => handleShowMeetingScheduleClick(report.id)}>
                                                        Show meeting schedule
                                                    </p>
                                                    {expandedReportId === report.id && (
                                                        <div css={expandedCardStyle}>
                                                            <p><strong>Meeting Scheduled</strong></p>
                                                            <p style={{color: "#51587E"}}>{meetingSchedules[report.id].date} / {meetingSchedules[report.id].timeStart} - {meetingSchedules[report.id].timeEnd}</p>
                                                            <p>{meetingSchedules[report.id].description}</p>
                                                            <p>Place : {meetingSchedules[report.id].place}</p>
                                                        </div>
                                                    )}
                                                </>
                                            ) : user.role == "Enrichment" && (
                                                <button css={buttonWhiteStyle} onClick={() => handleScheduleMeetingClick(report.id)}>
                                                    Schedule a meeting
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="right-side">
                        <div className="add-a-record-box" css={addRecordBoxStyle}>
                            <p className="headerp">Add a record</p>
                            <div className="recordForm" css={recordFormStyle}>
                                <p>Description</p>
                                <textarea name="" id="" rows={10} value={description} onChange={handleDescriptionChange}></textarea>
                                <p>Rating</p>
                                <div className="radioButtons" css={radioButtonsStyle}>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <label key={rating}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={rating}
                                                checked={selectedRating === rating}
                                                onChange={handleRatingChange}
                                            />
                                            {rating}
                                        </label>
                                    ))}
                                </div>
                                <button className="button" css={buttonStyle} onClick={handleAddRecord}>Add</button>
                            </div>
                        </div>
                        <button onClick={exportToExcel} style={{width: "100%", marginTop: "40px", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer"}}>Export to Excel</button>
                    </div>
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                studentReportId={selectedReportId}
            />
        </main>
    );
};

export default StudentDetailBox;
