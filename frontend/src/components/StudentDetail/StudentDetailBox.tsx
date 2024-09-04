/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useAuth } from "../../helper/AuthProvider";
import { Icon } from "@iconify/react";
import Student from "../../model/Student";
import { fetchUser, fetchUserNames } from "../../controllers/UserController";
import ExcelJS from 'exceljs';
import User from "../../model/User";
import Modal from "./Modal";
import ExportModal from "./ExportModal";
import AddRecordBox from "./AddARecordBox";
import { saveAs } from 'file-saver';

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
    InfoContainer2,
} from "./StudentDetailBox.styles";
import { css } from "@emotion/react";
import styled from "styled-components";
import { Option } from "fp-ts/lib/Option";
import { fetchStudentById, updateStudentNotes } from "../../controllers/StudentController";
import { deleteStudentReport, fetchReports, updateStudentReport } from "../../controllers/ReportController";
import { Report } from "../../model/Report";
import { fetchMeetingSchedules, scheduleMeeting } from "../../controllers/MeetingScheduleController";

function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const options = { day: 'numeric', month: 'short', year: 'numeric' } as const;
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
}

const StudentDetailBox: React.FC<StudentDetailBoxProps> = ({ studentId }) => {
    const userAuth = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<Report[]>([] as Report[]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [meetingSchedules, setMeetingSchedules] = useState<{ [key: string]: any }>({});
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
    const [userEmailsToNames, setUserEmailsToNames] = useState<{ [key: string]: string }>({});
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [editedType, setEditedType] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("latest");  // Default to "latest"


    // State variables for editing notes
    const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
    const [editedNotes, setEditedNotes] = useState<string>("");

    const [filterType, setFilterType] = useState<string>("");  // for filtering by type
    const [filterPerson, setFilterPerson] = useState<string>("");  // for filtering by person


    useEffect(() => {
        const fetchData = async () => {
            const user: User = await fetchUser(userAuth?.currentUser?.email!)
                .then((user) => user._tag === "Some" ? user.value : { id: "null" } as User);
            if (user.id === "null") {
                console.log("User not found");
            }
            setUser(user);
        };
        fetchData();
    }, [userAuth]);

    useEffect(() => {
        const fetchStudent = async () => {
            const studentOption: Option<Student> = await fetchStudentById(studentId);
            if (studentOption._tag === "Some") {
                const studentData = studentOption.value;
                setStudent(studentData);
                setEditedNotes(studentData.notes || ""); 
            } else {
                console.error("No such student!");
            }
        };
        fetchStudent();
    }, [studentId]);

    useEffect(() => {
        const fetchReportsData = async () => {
            if (student && student.name) {
                let reportList = await fetchReports(student.name, filterStartDate, filterEndDate);
                
                // Apply type and person filters
                const filteredByType = filterType ? reportList.filter(report => report.type === filterType) : reportList;
                const filteredReports = filterPerson ? filteredByType.filter(report => report.person === filterPerson) : filteredByType;
    
                // Sort reports by latest or earliest
                const sortedReports = filteredReports.sort((a, b) => {
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    return sortOrder === "latest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
                });
    
                setReports(sortedReports);
    
                const emailToNameMap = await fetchUserNames(sortedReports);
                setUserEmailsToNames(emailToNameMap);
    
                const schedules = await fetchMeetingSchedules(sortedReports.map(report => report.id));
                setMeetingSchedules(schedules);
    
                setIsFetching(false);
            }
        };
        fetchReportsData();
    }, [student, filterStartDate, filterEndDate, filterType, filterPerson, sortOrder]);
    
    

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleScheduleMeetingClick = (reportId: string) => {
        setSelectedReportId(reportId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = async (data: {
        timeStart: string;
        timeEnd: string;
        description: string;
        place: string;
        date: string;
        meetingType: string;
        studentReportId: string;
    }) => {
        try {
            const updatedSchedules = await scheduleMeeting(data, meetingSchedules);
            setMeetingSchedules(updatedSchedules);

            // Construct email details
            const emailDetails = {
                to: student?.email,
                subject: "Meeting Scheduled",
                text: `A new meeting has been scheduled:
                Date: ${data.date}
                Time: ${data.timeStart} - ${data.timeEnd}
                Place: ${data.place}
                Description: ${data.description}`
            };

            // Send the email via the API
            const response = await fetch('http://localhost:3001/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailDetails),
            });

            if (!response.ok) {
                throw new Error(`Failed to send email: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Email sent:', result);

        } catch (error) {
            console.error('Error scheduling meeting or sending email:', error);
        }
    };


    const handleShowMeetingScheduleClick = (reportId: string) => {
        setExpandedReportId(reportId === expandedReportId ? null : reportId);
    };

    const handleDeleteReport = async (reportId: string) => {
        try {
            setDeletingReportId(reportId);
            const updatedReports = await deleteStudentReport(reportId, reports);
            setReports(updatedReports);
        } catch (error) {
        } finally {
            setDeletingReportId(null);
        }
    };

    const handleEditReport = (reportId: string, currentContent: string, currentType: string) => {
        setEditingReportId(reportId);
        setEditedContent(currentContent);
        setEditedType(currentType);
    };

    // const handleCycleType = () => {
        // const types = ["Urgent", "Report", "Complaint"];
        // const currentIndex = types.indexOf(editedType);
        // const nextIndex = (currentIndex + 1) % types.length;
        // setEditedType(types[nextIndex]);
    // };

    const handleCycleType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedType(event.target.value);
    };

    const handleSaveEditReport = async (reportId: string) => {
        try {
            setIsUpdating(true);
            const updatedReports = await updateStudentReport(reportId, editedContent, editedType, reports);
            setReports(updatedReports);
            setEditingReportId(null);
        } catch (error) {
            // Error handling is already done in the controller, so this block can remain empty or have additional handling if needed.
        } finally {
            setIsUpdating(false);
        }
    };

    const exportToExcel = async (startDate: string, endDate: string) => {
        const start = new Date(new Date(startDate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    
        const filteredReports = reports.filter(report => {
            const reportDate = new Date(report.timestamp);
            return reportDate >= start && reportDate <= end;
        });
    
        const reportCount = filteredReports.length;
    
        const summaryData = [
            ['Student Performance and Behaviour Documentation', '', '', '', ''],
            ['Start Date', startDate, '', '', ''],
            ['End Date', endDate, '', '', ''],
            ['Report Count', reportCount.toString(), '', '', ''],
        ];
    
        // Updated headers to include "Type" and "Person"
        const headers = [
            'Writer',
            'Report',
            'Timestamp',
            'Type',
            'Person',
        ];
    
        // Include type and person in the data map
        const data = filteredReports.map(report => ({
            Writer: report.writer,
            Report: report.report,
            Timestamp: new Date(report.timestamp).toLocaleString(),
            Type: report.type,
            Person: report.person,
        }));
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reports');
    
        // Add summary data
        worksheet.addRows(summaryData);
    
        // Define and style header row
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    
        // Add data rows
        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });
    
        // Set column widths for better readability
        worksheet.columns = [
            { key: 'Writer', width: 20 },
            { key: 'Report', width: 30 },
            { key: 'Timestamp', width: 20 },
            { key: 'Type', width: 15 },
            { key: 'Person', width: 15 },
        ];
    
        // Export the file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'StudentReports.xlsx');
    };    
    

    const handleExportModalClose = () => {
        setIsExportModalOpen(false);
    };

    const handleExportModalSubmit = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        exportToExcel(startDate, endDate);
    };

    const handleRecordAdded = () => {
        // fetchReports();
    };

    const handleEditNotesClick = async () => {
        if (isEditingNotes) {
            try {
                const updatedStudent = await updateStudentNotes(studentId, editedNotes, student);
                setStudent(updatedStudent);
            } catch (error) {
                // Error handling is already done in the controller, so this block can remain empty or have additional handling if needed.
            }
        }
        setIsEditingNotes(!isEditingNotes);
    };

    const meetindDescriptionComponentStyle = css`
        display: flex;
        gap: 13px;
        align-items: center;
        font-size: 16px;
        margin-top: 2px;
    `;

    const meetDescCompType = css`
        width: 95px;
    `;

    const meetDescCompContent = css``;

    const notesEditText = css`
        border: none;
        width: 100% !important;
        border-bottom: 1px solid gray;
        padding: 0px;
        font-size: 13px !important;
        font-weight: 500;
        margin-bottom: 0px;
    `;

    const dropdownContentButton = css`
        width: 50%;
        padding: 10px;
        border: none;
        border-radius: 10px;
        background-color: #49A8FF;
        color: white;
        font-size: 17px;
        font-weight: 500;
        cursor: pointer;
        margin-left: 83px;
        &:hover {
            background-color: #49A8FF;
        }
    `;

    const periodFilterStyle = css`
        padding: 10px;
        font-size: 15px;
        border: 100px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        width: 200px;
        background-color: #000000;
    `;

    const ReportItemPlaceholder = styled.div`
        border-bottom: 1px solid rgba(0,0,0, 0.3);
        padding: 10px 0 30px 0;
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 5px;
        margin-bottom: 18px;
        background-color: #f0f0f0;
        animation: pulse 1.5s infinite;

        .topSide {
            display: flex;
            justify-content: space-between;
            .topLeftSide, .topRightSide {
                display: flex;
                gap: 20px;
                align-items: center;
            }
        }

        .infoAndDate {
            p {
                width: 50%;
                height: 14px;
                background-color: #ddd;
                border-radius: 4px;
            }
        }

        .report-content {
            width: 100%;
            height: 87px;
            background-color: #ddd;
            border-radius: 5px;
        }

        @keyframes pulse {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }
    `;

    const Placeholder = () => (
        <div style={{marginTop:"17px"}}>
            <ReportItemPlaceholder>
                <div className="topSide">
                    <div className="topLeftSide">
                        <div className="report-writer" style={{ width: '150px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        <div style={{ width: '75px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                    </div>
                    <div className="topRightSide">
                        <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                    </div>
                </div>
                <div className="infoAndDate">
                    <p></p>
                </div>
                <div className="report-content"></div>
            </ReportItemPlaceholder>
            <ReportItemPlaceholder>
                <div className="topSide">
                    <div className="topLeftSide">
                        <div className="report-writer" style={{ width: '150px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        <div style={{ width: '75px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                    </div>
                    <div className="topRightSide">
                        <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                    </div>
                </div>
                <div className="infoAndDate">
                    <p></p>
                </div>
                <div className="report-content"></div>
            </ReportItemPlaceholder>
                <ReportItemPlaceholder>
                    <div className="topSide">
                        <div className="topLeftSide">
                            <div className="report-writer" style={{ width: '150px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                            <div style={{ width: '75px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        </div>
                        <div className="topRightSide">
                            <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                            <div style={{ width: '50px', height: '20px', backgroundColor: '#ddd', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <div className="infoAndDate">
                        <p></p>
                    </div>
                    <div className="report-content"></div>
                </ReportItemPlaceholder>
        </div>
    );
    

    return (
        <Main>
            <NavSide>
                <p style={{ fontWeight: "300" }}>Student Detail</p>
                {/* <Filter>
                    <p>Period: </p>
                    <select css={periodFilterStyle}>
                        <option value="">All</option>
                        <option>Odd Semester 23.10</option>
                    </select>
                </Filter> */}
                <br></br>
                <br></br>
            </NavSide>
            <ContentSide>
                <UserCard>
                    {student ? (
                        <>
                            <img src={student.image_url} alt={student.name} style={{ width: "150px", height: "185px", objectFit: "cover" }} />
                            <UserDesc>
                                <div className="userHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div style={{ width: "100%" }}>
                                        <div className="leftSide" style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                                            <p style={{ fontSize: "18px", fontWeight: "550" }}>{student.name}</p> - 
                                            <p style={{ color: "#51587E", fontWeight: "500", fontSize: "16px" }}>{student.nim}</p>
                                        </div>
                                        {isEditingNotes ? (
                                            <input
                                                value={editedNotes}
                                                onChange={(e) => setEditedNotes(e.target.value)}
                                                css={notesEditText}
                                            />
                                        ) : (
                                            <p style={{ fontWeight: "500", fontSize: "13px", display: "flex", fontStyle:"italic" }}>
                                                <span style={{ marginRight: "5px" }}>notes:</span>
                                                {editedNotes ? editedNotes : <p>-</p>}
                                            </p>
                                        )}
                                    </div>                            
                                    <div className="rightSide">
                                        <div onClick={handleEditNotesClick}>
                                            {isEditingNotes ? 
                                                (<Icon icon={"mingcute:check-line"} fontSize={30} style={{ cursor: 'pointer' }} />)
                                                : (<Icon icon={"mingcute:edit-line"} fontSize={30} style={{ cursor: 'pointer' }} />)}
                                        </div>
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
                                                <p style={{fontWeight: "500"}}>{student.major}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ph:building-bold"} fontSize={22} />
                                                    <p>Organization Name</p>
                                                </div>
                                                <p style={{fontWeight: "500"}}>{student.tempat_magang}</p>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ic:outline-email"} fontSize={22} />
                                                    <p>Email Address</p>
                                                </div>
                                                <p style={{fontWeight: "500"}}>{student.email}</p>
                                            </InfoContainer>
                                        </Information>
                                    </div>
                                    <div className="right-side">
                                        <Information>
                                            <InfoContainer2>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"material-symbols:supervisor-account"} fontSize={22} />
                                                    <p style={{width:"190px"}}>Faculty Supervisor</p>
                                                </div>
                                                <p style={{fontWeight: "500"}}>{student.faculty_supervisor}</p>
                                            </InfoContainer2>
                                            <InfoContainer2>
                                                <div style={{ display: "flex", color: "#51587E", alignItems: "center", gap: "16px" }}>
                                                    <Icon icon={"ic:outline-people"} fontSize={22} />
                                                    <p style={{width:"190px"}}>Site Supervisor</p>
                                                </div>
                                                <p style={{fontWeight: "500"}}>{student.site_supervisor}</p>
                                            </InfoContainer2>
                                        </Information>
                                    </div>
                                </GreaterInformationContainer>
                            </UserDesc>
                        </>
                    ) : (
                        <>
                            <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "150px", height: "185px", objectFit: "cover" }}></div>
                            <UserDesc>
                                <div className="userHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div style={{ backgroundColor:"white", width: "100%" }}>
                                        <div className="leftSide" style={{ backgroundColor:"white", display: "flex", alignItems: "center", gap: "9px" }}>
                                            <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "100px", height: "18px" }}></div>
                                            <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "60px", height: "16px" }}></div>
                                        </div>
                                        <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "100%", height: "13px", marginTop: "5px" }}></div>
                                    </div>
                                </div>
                                <GreaterInformationContainer>
                                    <div className="left-side">
                                        <Information>
                                            <InfoContainer>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "100px", height: "22px" }}></div>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "50%", height: "16px" }}></div>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "100px", height: "22px" }}></div>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "50%", height: "16px" }}></div>
                                            </InfoContainer>
                                            <InfoContainer>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "100px", height: "22px" }}></div>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "50%", height: "16px" }}></div>
                                            </InfoContainer>
                                        </Information>
                                    </div>
                                    <div className="right-side" style={{marginLeft:"70px"}}>
                                        <Information>
                                            <InfoContainer2>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "120px", height: "22px" }}></div>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "50%", height: "16px", marginLeft:"100px" }}></div>
                                            </InfoContainer2>
                                            <InfoContainer2>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "120px", height: "22px" }}></div>
                                                <div className="loading-placeholder" style={{ backgroundColor:"#ddd", width: "50%", height: "16px", marginLeft:"100px" }}></div>
                                            </InfoContainer2>
                                        </Information>
                                    </div>
                                </GreaterInformationContainer>
                            </UserDesc>
                        </>
                    )}
                </UserCard>

                <BottomContentContainer>
                    <div className="left-side">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px", alignItems:"center" }}>
                            <h2 style={{ textAlign: "left", margin:"0", fontWeight: "600", fontSize: "18px" }}>Records</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
                                <p style={{fontSize:"15px"}}>Filter by:</p>
                                <Dropdown onClick={handleDropdownClick}>
                                    <p style={{fontSize:"15px"}} >All Records</p>
                                    <Icon icon={"weui:arrow-filled"} rotate={45} fontSize={10} />
                                </Dropdown>
                                <DropdownContent isOpen={isDropdownOpen} style={{display: "", flexDirection: "row", gap: "25px"}}>
                                    <div className="time">
                                        <p style={{marginBottom: "12px", fontSize: "16px"}}>Time</p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <div style={{ display: "flex", gap: "15px", alignItems:"center" }}>
                                                <p style={{fontSize: "15px", width: "18%"}}>Start</p>
                                                <input style={{
                                                    padding: "6px",
                                                    fontSize: "15px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px"}} type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                                            </div>
                                            <div style={{ display: "flex", gap: "15px", alignItems:"center" }}>
                                                <p style={{fontSize: "15px", width: "18%"}}>End</p>
                                                <input style={{
                                                    padding: "6px",
                                                    fontSize: "15px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px"}} type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rightSide">
                                        <div className="type">
                                            <p style={{ marginBottom: "12px", fontSize: "16px" }}>Type</p>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <select
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "15px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "5px",
                                                        width: "200px",
                                                        backgroundColor: "white"
                                                    }}
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                >
                                                    <option value="">All Types</option>
                                                    <option value="Urgent">Urgent</option>
                                                    <option value="Report">Report</option>
                                                    <option value="Complaint">Complaint</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="person" style={{marginTop: "20px"}}>
                                            <p style={{ marginBottom: "12px", fontSize: "16px" }}>Person</p>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <select
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "15px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "5px",
                                                        width: "200px",
                                                        backgroundColor: "white"
                                                    }}
                                                    value={filterPerson}
                                                    onChange={(e) => setFilterPerson(e.target.value)}
                                                >
                                                    <option value="Student">Student</option>
                                                    <option value="Enrichment">Enrichment</option>
                                                    <option value="Company">Company</option>
                                                    {/* {Object.keys(userEmailsToNames).map((personEmail) => (
                                                        <option key={personEmail} value={personEmail}>
                                                            {userEmailsToNames[personEmail]}
                                                        </option>
                                                    ))} */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sorting" style={{ marginTop: "20px" }}>
                                            <p style={{ marginBottom: "12px", fontSize: "16px" }}>Sort By</p>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <select
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "15px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "5px",
                                                        width: "200px",
                                                        backgroundColor: "white"
                                                    }}
                                                    value={sortOrder}
                                                    onChange={(e) => setSortOrder(e.target.value)}
                                                >
                                                    <option value="latest">Latest</option>
                                                    <option value="earliest">Earliest</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownContent>
                            </div>
                        </div>
                        {isFetching ? (
                            <Placeholder></Placeholder>
                        ) : (
                            <div style={{ overflow: "auto", height: "572px", marginTop: "13px", scrollbarWidth:"thin" }}>
                                {reports.map((report) => {
                                    const timestamp = new Date(report.timestamp);
                                    const formattedDate = timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                    const formattedTime = timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                                    return (
                                        <ReportItem key={report.id}>
                                            <div className="topSide">
                                                <div className="topLeftSide">
                                                    <p className="report-writer" style={{ fontSize: '17px', fontWeight: "500" }}>{userEmailsToNames[report.writer] || report.writer}</p>
                                                    {editingReportId === report.id ? (
                                                        <div className="select-wrapper" style={{ position: 'relative', display: 'inline-block', width: editedType === 'Complaint' ? '130px' : '130px' }}>
                                                        <select
                                                            value={editedType}
                                                            onChange={handleCycleType}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                color: 'black',
                                                                padding: '2px 50px 2px 8px',
                                                                borderRadius: '8px',
                                                                width: '150px',
                                                                height: '33px',
                                                                textAlign: 'start',
                                                                fontWeight: "400",
                                                                border: '1px solid black',
                                                                outline: 'none',
                                                                appearance: 'none',
                                                                WebkitAppearance: 'none',
                                                                MozAppearance: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '16px',
                                                            }}
                                                        >
                                                            <option value="Urgent" style={{ backgroundColor: 'white', color: 'black' }}>Urgent</option>
                                                            <option value="Report" style={{ backgroundColor: 'white', color: 'black' }}>Report</option>
                                                            <option value="Complaint" style={{ backgroundColor: 'white', color: 'black' }}>Complaint</option>
                                                        </select>
                                                        <Icon
                                                            icon={"weui:arrow-filled"}
                                                            color="black"
                                                            rotate={45}
                                                            fontSize={9}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '-13px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none', // Prevent the icon from blocking interactions with the dropdown
                                                            }}
                                                        />
                                                    </div>                                                    
                                                ) : (
                                                    <p
                                                        style={{
                                                            backgroundColor: report.type === 'Report' ? '#A024FF' : report.type === 'Urgent' ? 'red' : '#FF8336',
                                                            color: 'white',
                                                            padding: '2px',
                                                            borderRadius: '8px',
                                                            width: report.type === 'Complaint' ? '105px' : '75px',
                                                            textAlign: 'center',
                                                            fontWeight: "600",
                                                            fontSize: '16px',
                                                        }}
                                                    >
                                                        {report.type}
                                                    </p>
                                                )}
                                                </div>
                                                <div className="topRightSide">
                                                    {deletingReportId === report.id ? (
                                                        <p style={{ color: 'red' }}>Deleting...</p>
                                                    ) : editingReportId === report.id ? (
                                                        <>
                                                            {isUpdating ? (
                                                                <p style={{ color: 'black' }}>Updating...</p>
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
                                                                onClick={() => handleEditReport(report.id, report.report, report.type)}
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
                                                    fontSize: "14px",
                                                    marginBottom: "5px"
                                                }}>By {report.person} - {formattedTime}, {formattedDate}</p>
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
                                                        fontSize: "16px",
                                                        boxSizing:"border-box",
                                                        marginBottom:"5px",
                                                    }}
                                                />
                                            ) : (
                                                <p className="report-content" style={{color:'#5F6368', fontSize:"16px"}}>{report.report}</p>
                                            )}
                                            {meetingSchedules[report.id] ? (
                                                <>
                                                    <ShowMeetingSchedule>
                                                        <ButtonWhite onClick={() => handleShowMeetingScheduleClick(report.id)} style={{marginTop: "3px", padding: "8px 14px"}}>
                                                            Show meeting
                                                        </ButtonWhite>
                                                    </ShowMeetingSchedule>
                                                    {expandedReportId === report.id && (
                                                        <ExpandedCard>
                                                            <p style={{fontWeight: "500", fontSize: "17px"}}>Meeting Scheduled</p>
                                                            <p style={{ color: "#51587E", fontStyle: "italic", fontSize: "14px" }}>
                                                                By {meetingSchedules[report.id].writer} 
                                                                {meetingSchedules[report.id].createdAt ? 
                                                                    ` - ${meetingSchedules[report.id].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                                                    ${formatDate(meetingSchedules[report.id].createdAt.toDate().toISOString().split('T')[0])}` : ' - N/A'}
                                                            </p>

                                                            <p style={{fontSize: "16px", fontWeight:"400", marginBottom:"3px", marginTop:"3px"}}>{meetingSchedules[report.id].description}</p>
                                                            <div className="meeting-description" style={{display:'flex', gap:'100px'}}>
                                                                <div className="leftSide">
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"clarity:date-solid"} fontSize={20} color="#51587E" />
                                                                        <p css={meetDescCompType} style={{color: "#51587E"}}>Date</p>
                                                                        <p css={meetDescCompContent} >{formatDate(meetingSchedules[report.id].date)}</p>
                                                                    </div>
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"mingcute:time-fill"} fontSize={20} color="#51587E" />
                                                                        <p css={meetDescCompType} style={{color: "#51587E"}}>Time</p>
                                                                        <p css={meetDescCompContent} >{meetingSchedules[report.id].timeStart} - {meetingSchedules[report.id].timeEnd}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="rightSide">
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"material-symbols:meeting-room"} fontSize={20} color="#51587E" />
                                                                        <p css={meetDescCompType} style={{color: "#51587E"}}>Type</p>
                                                                        <p css={meetDescCompContent} >{meetingSchedules[report.id].type}</p>
                                                                    </div>
                                                                    <div className="meeting-description-component" css={meetindDescriptionComponentStyle}>
                                                                        <Icon icon={"mdi:location"} fontSize={20} color="#51587E" />
                                                                        <p css={meetDescCompType} style={{color: "#51587E"}}>Location</p>
                                                                        <p css={meetDescCompContent} >{meetingSchedules[report.id].place}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ExpandedCard>
                                                    )}

                                                </>
                                            ) : user?.role == "Enrichment" && (
                                                <ButtonWhite style={{marginTop: "3px", padding: "8px 14px"}} onClick={() => handleScheduleMeetingClick(report.id)}>
                                                    Schedule meeting
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
                            <Button onClick={() => setIsExportModalOpen(true)} style={{ marginTop: "0px", fontSize: "17px", fontWeight:"500", padding: "8px 20px 8px 20px", height:"45px" }}>Export to Excel</Button>
                        </div>
                        <AddRecordBox studentName={student?.name || ''} onRecordAdded={handleRecordAdded} />
                    </div>
                </BottomContentContainer>

            </ContentSide>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                studentReportId={selectedReportId || ""}
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
