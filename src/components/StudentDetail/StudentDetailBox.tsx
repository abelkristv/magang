/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useAuth } from "../../helper/AuthProvider";
import { Icon } from "@iconify/react";
import { collection, doc, getDoc, getDocs, query, where, addDoc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Student from "../../model/Student";
import { fetchUser } from "../../controllers/UserController";
import * as XLSX from 'xlsx';
import User from "../../model/User";
import Modal from "./Modal";
import ExportModal from "./ExportModal";
import AddRecordBox from "./AddARecordBox";

interface StudentDetailBoxProps {
    studentId: string;
}

import {
    Main,
    NavSide,
    ContentSide,
    UserCard,
    UserDesc,
    InfoContainer,
    Information,
    GreaterInformationContainer,
    Filter,
    BottomContentContainer,
    Dropdown,
    DropdownContent,
    Button,
    ReportItem,
    ButtonWhite,
    ShowMeetingSchedule,
    ExpandedCard,
    Placeholder,
} from "./StudentDetailBox.styles";
import { css } from "@emotion/react";

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
}

const StudentDetailBox = ({ studentId }: StudentDetailBoxProps) => {
    const userAuth = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [meetingSchedules, setMeetingSchedules] = useState<{ [key: string]: any }>({});
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
    const [userEmailsToNames, setUserEmailsToNames] = useState<{ [key: string]: string }>({});
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [editedType, setEditedType] = useState<string>("");

    // State variables for editing notes
    const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
    const [editedNotes, setEditedNotes] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const user: User = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag == "Some" ? user.value : { id: "null" } as User);
            if (user.id == "null") {
                console.log("User not found");
            }

            setUser(user);
        };
        fetchData();
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
                        notes: data.notes
                    } as Student);
                    setEditedNotes(data.notes || ""); // Initialize editedNotes
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

            if (filterStartDate) {
                reportsQuery = query(reportsQuery, where("timestamp", ">=", new Date(filterStartDate)));
            }
            if (filterEndDate) {
                reportsQuery = query(reportsQuery, where("timestamp", "<=", new Date(filterEndDate)));
            }

            const reportSnapshot = await getDocs(reportsQuery);
            const reportList = reportSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

            setReports(reportList);
            await checkMeetingSchedules(reportList.map(report => report.id));
            await fetchUserNames(reportList);

            setIsFetching(false);
        }
    };

    const fetchUserNames = async (reports) => {
        const uniqueEmails = [...new Set(reports.map(report => report.data.writer))];
        const emailToNameMap = {};

        for (const email of uniqueEmails) {
            const userDoc = await getDocs(query(collection(db, "user"), where("email", "==", email)));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                emailToNameMap[email] = userData.name;
            }
        }

        setUserEmailsToNames(emailToNameMap);
    };

    const checkMeetingSchedules = async (reportIds) => {
        const schedules = {};
        for (const reportId of reportIds) {
            const q = query(collection(db, "meetingSchedule"), where("studentReport_id", "==", reportId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const meetingData = querySnapshot.docs[0].data();
    
                const reportDoc = await getDoc(doc(db, "studentReport", meetingData.studentReport_id));
                if (reportDoc.exists()) {
                    const writerEmail = reportDoc.data().writer;
    
                    const userQuery = query(collection(db, "user"), where("email", "==", writerEmail));
                    const userSnapshot = await getDocs(userQuery);
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        meetingData.writer = userData.name;
                    } else {
                        meetingData.writer = "Unknown User";
                    }
                } else {
                    meetingData.writer = "Unknown";
                }
    
                schedules[reportId] = meetingData;
            }
        }
        setMeetingSchedules(schedules);
    };

    useEffect(() => {
        fetchReports();
    }, [student, filterStartDate, filterEndDate]);

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
            place: data.place,
            type: data.meetingType, // Add the meeting type here
            createdAt: Timestamp.now(), // Add the creation timestamp here
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

    const handleDeleteReport = async (reportId: string) => {
        try {
            setDeletingReportId(reportId);

            await deleteDoc(doc(db, "studentReport", reportId));
            setReports(reports.filter(report => report.id !== reportId));

            alert("Report deleted successfully!");
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Failed to delete report. Please try again.");
        } finally {
            setDeletingReportId(null);
        }
    };

    const handleEditReport = (reportId: string, currentContent: string, currentType: string) => {
        setEditingReportId(reportId);
        setEditedContent(currentContent);
        setEditedType(currentType);
    };

    const handleCycleType = () => {
        const types = ["Urgent", "Report", "Complaint"];
        const currentIndex = types.indexOf(editedType);
        const nextIndex = (currentIndex + 1) % types.length;
        setEditedType(types[nextIndex]);
    };

    const handleSaveEditReport = async (reportId: string) => {
        try {
            setIsUpdating(true);

            const updatedTimestamp = Timestamp.now();

            await updateDoc(doc(db, "studentReport", reportId), {
                report: editedContent,
                type: editedType,
                timestamp: updatedTimestamp,
            });

            setReports(reports.map(report => 
                report.id === reportId
                    ? {
                        ...report,
                        data: {
                            ...report.data,
                            report: editedContent,
                            type: editedType,
                            timestamp: updatedTimestamp,
                        }
                    }
                    : report
            ));

            setEditingReportId(null);
            alert("Report updated successfully!");
        } catch (error) {
            console.error("Error updating report: ", error);
            alert("Failed to update report. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const exportToExcel = (startDate, endDate) => {
        const filteredReports = reports.filter(report => {
            const reportDate = new Date(report.data.timestamp.seconds * 1000);
            return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
        });

        const reportCount = filteredReports.length;

        const summaryData = [
            ['Student Performance and Behaviour Documentation'],
            ['Start Date', startDate],
            ['End Date', endDate],
            ['Report Count', reportCount.toString()],
        ];

        const headers = [
            'Writer',
            'Report',
            'Timestamp',
        ];

        const data = filteredReports.map(report => ({
            Writer: report.data.writer,
            Report: report.data.report,
            Timestamp: new Date(report.data.timestamp.seconds * 1000).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(worksheet, summaryData);
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: summaryData.length });
        XLSX.utils.sheet_add_json(worksheet, data, { origin: summaryData.length + 1, skipHeader: true });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

        XLSX.writeFile(workbook, "StudentReports.xlsx");
    };

    const handleExportModalClose = () => {
        setIsExportModalOpen(false);
    };

    const handleExportModalSubmit = ({ startDate, endDate }) => {
        exportToExcel(startDate, endDate);
    };

    const handleRecordAdded = () => {
        fetchReports();
    };

    const handleEditNotesClick = async () => {
        if (isEditingNotes) {
            // Save the edited notes to Firestore
            if (student) {
                try {
                    const studentDocRef = doc(db, "student", studentId);
                    await updateDoc(studentDocRef, { notes: editedNotes });
                    setStudent({ ...student, notes: editedNotes });
                    alert("Notes updated successfully!");
                } catch (error) {
                    console.error("Error updating notes: ", error);
                    alert("Failed to update notes. Please try again.");
                }
            }
        }
        setIsEditingNotes(!isEditingNotes);
    };

    const meetindDescriptionComponentStyle = css`
        display: grid;
        align-items: center;
        font-size: 16px;
        margin-top: 2px;
        grid-template-columns: 0.1fr 0.3fr 1fr;
    `;

    return (
        <Main>
            <NavSide>
                <p style={{ fontWeight: "300" }}>Student Detail</p>
                <Filter>
                    <p>Period: </p>
                    <select name="" id="">
                        <option value="">Odd Semester 23.10</option>
                    </select>
                </Filter>
            </NavSide>
            <ContentSide>
                <UserCard>
                    {student ? (
                        <>
                            <img src={student.image_url} alt={student.name} />
                            <UserDesc>
                                <div className="userHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div className="leftSide">
                                        <p style={{ fontSize: "20px", fontWeight: "500" }}>{student.name}</p>
                                        <p style={{ color: "#51587E", fontWeight: "500", fontSize: "17px" }}>{student.nim}</p>
                                    </div>
                                    <div className="rightSide">
                                        <button onClick={handleEditNotesClick}>
                                            {isEditingNotes ? "Submit" : "Edit"}
                                        </button>
                                    </div>
                                </div>
                                <GreaterInformationContainer>
                                    <div className="left-side">
                                        <Information>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"mdi:college-outline"} fontSize={22} />
                                                    <p>Major</p>
                                                </div>
                                                <p>{student.major}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ph:building-bold"} fontSize={22} />
                                                    <p>Organization Name</p>
                                                </div>
                                                <p>{student.tempat_magang}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ic:outline-email"} fontSize={22} />
                                                    <p>Email Address</p>
                                                </div>
                                                <p>{student.email}</p>
                                            </InfoContainer>
                                        </Information>
                                    </div>
                                    <div className="right-side">
                                        <Information>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"material-symbols:supervisor-account"} fontSize={22} />
                                                    <p>Faculty Supervisor</p>
                                                </div>
                                                <p>{student.faculty_supervisor}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ic:outline-people"} fontSize={22} />
                                                    <p>Site Supervisor</p>
                                                </div>
                                                <p>{student.site_supervisor}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"mdi:notes-outline"} fontSize={22} />
                                                    <p>Notes</p>
                                                </div>
                                                {isEditingNotes ? (
                                                    <textarea
                                                        value={editedNotes}
                                                        onChange={(e) => setEditedNotes(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            minHeight: '60px',
                                                            padding: '10px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #D9D9D9',
                                                        }}
                                                    />
                                                ) : (
                                                    <p>{student.notes}</p>
                                                )}
                                            </InfoContainer>
                                        </Information>
                                    </div>
                                </GreaterInformationContainer>
                            </UserDesc>
                        </>
                    ) : (
                        <Placeholder>Loading student details...</Placeholder>
                    )}
                </UserCard>

                <BottomContentContainer>
                    <div className="left-side">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px" }}>
                            <h2 style={{ textAlign: "left", marginBottom: "0px", fontWeight: "500", fontSize: "22px" }}>Records</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
                                <p>Filter : </p>
                                <Dropdown onClick={handleDropdownClick}>
                                    <p>All Records</p>
                                    <Icon icon={"weui:arrow-filled"} rotate={45} />
                                </Dropdown>
                                <DropdownContent isOpen={isDropdownOpen}>
                                    <div className="time">
                                        <p>Time</p>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", gap: "20px" }}>
                                                <p>Start</p>
                                                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                                            </div>
                                            <div style={{ display: "flex", gap: "20px" }}>
                                                <p>End</p>
                                                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </DropdownContent>
                            </div>
                        </div>
                        {isFetching ? (
                            <Placeholder>Loading records...</Placeholder>
                        ) : (
                            <div style={{ overflow: "scroll", height: "400px", marginTop: "30px" }}>
                                {reports.map((report) => {
                                    const timestamp = new Date(report.data.timestamp.seconds * 1000);
                                    const formattedDate = timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                    const formattedTime = timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                                    return (
                                        <ReportItem key={report.id}>
                                            <div className="topSide">
                                                <div className="topLeftSide">
                                                    <p className="report-writer" style={{ fontSize: '18px', fontWeight: "500" }}>{userEmailsToNames[report.data.writer] || report.data.writer}</p>
                                                    {editingReportId === report.id ? (
                                                        <p
                                                            onClick={handleCycleType}
                                                            style={{
                                                                backgroundColor: editedType === 'Report' ? '#A024FF' : editedType === 'Urgent' ? 'red' : 'orange',
                                                                color: 'white',
                                                                padding: '2px',
                                                                borderRadius: '10px',
                                                                width: '75px',
                                                                textAlign: 'center',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {editedType}
                                                        </p>
                                                    ) : (
                                                        <p
                                                            style={{
                                                                backgroundColor: report.data.type === 'Report' ? '#A024FF' : report.data.type === 'Urgent' ? 'red' : 'orange',
                                                                color: 'white',
                                                                padding: '2px',
                                                                borderRadius: '10px',
                                                                width: '75px',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {report.data.type}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="topRightSide">
                                                    {deletingReportId === report.id ? (
                                                        <p style={{ color: 'red' }}>Deleting...</p>
                                                    ) : editingReportId === report.id ? (
                                                        <>
                                                            {isUpdating ? (
                                                                <p style={{ color: 'blue' }}>Updating...</p>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleSaveEditReport(report.id)}
                                                                    style={{
                                                                        backgroundColor: '#49A8FF',
                                                                        color: 'white',
                                                                        padding: '5px 10px',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon
                                                                icon={"material-symbols:edit"}
                                                                fontSize={24}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleEditReport(report.id, report.data.report, report.data.type)}
                                                            />
                                                            <Icon
                                                                icon={"ic:baseline-delete"}
                                                                fontSize={24}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleDeleteReport(report.id)}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="infoAndDate">
                                                <p style={{
                                                    fontStyle: "italic",
                                                    color: "#51587E",
                                                    fontSize: "14px"
                                                }}>By {report.data.person} - {formattedTime} on {formattedDate}</p>
                                            </div>
                                            {editingReportId === report.id ? (
                                                <textarea
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '87px',
                                                        padding: '10px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #D9D9D9',
                                                    }}
                                                />
                                            ) : (
                                                <p className="report-content" style={{ minHeight: "87px" }}>{report.data.report}</p>
                                            )}
                                            {meetingSchedules[report.id] ? (
                                                <>
                                                    <ShowMeetingSchedule onClick={() => handleShowMeetingScheduleClick(report.id)}>
                                                        Show meeting schedule
                                                    </ShowMeetingSchedule>
                                                    {expandedReportId === report.id && (
                                                        <ExpandedCard>
                                                            <p style={{fontWeight: "500", fontSize: "17px"}}>Meeting Scheduled</p>
                                                            <p style={{ color: "#51587E", fontStyle: "italic", fontSize: "14px" }}>
                                                                By {meetingSchedules[report.id].writer} 
                                                                {meetingSchedules[report.id].createdAt ? 
                                                                    ` - ${meetingSchedules[report.id].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                                                    ${formatDate(meetingSchedules[report.id].createdAt.toDate().toISOString().split('T')[0])}` : 'N/A'}
                                                            </p>

                                                            <p style={{fontSize: "16px"}}>{meetingSchedules[report.id].description}</p>
                                                            <div className="meeting-description">
                                                                <div className="leftSide">
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"material-symbols:meeting-room"} color="#51587E"  />
                                                                        <p style={{color: "#51587E"}}>Type</p>
                                                                        <p>{meetingSchedules[report.id].type}</p>
                                                                    </div>
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"mdi:location"} color="#51587E" />
                                                                        <p style={{color: "#51587E"}}>Location</p>
                                                                        <p>{meetingSchedules[report.id].place}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="rightSide">
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"clarity:date-solid"} color="#51587E" />
                                                                        <p style={{color: "#51587E"}}>Date</p>
                                                                        <p>{formatDate(meetingSchedules[report.id].date)}</p>
                                                                    </div>
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"mingcute:time-fill"} color="#51587E" />
                                                                        <p style={{color: "#51587E"}}>Time</p>
                                                                        <p>{meetingSchedules[report.id].timeStart} - {meetingSchedules[report.id].timeEnd}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ExpandedCard>
                                                    )}

                                                </>
                                            ) : user?.role == "Enrichment" && (
                                                <ButtonWhite onClick={() => handleScheduleMeetingClick(report.id)}>
                                                    Schedule a meeting
                                                </ButtonWhite>
                                            )}
                                        </ReportItem>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="right-side">
                        <div style={{ display: "flex", justifyContent: 'start', marginBottom: "20px" }}>
                            <Button onClick={() => setIsExportModalOpen(true)} style={{ marginTop: "0px" }}>Export to Excel</Button>
                        </div>
                        <AddRecordBox studentName={student?.name || ''} onRecordAdded={handleRecordAdded} />
                    </div>
                </BottomContentContainer>

            </ContentSide>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                studentReportId={selectedReportId}
            />
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={handleExportModalClose}
                onExport={handleExportModalSubmit}
            />
        </Main>
    );
};

export default StudentDetailBox;
