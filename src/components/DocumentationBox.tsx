/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState, useRef } from 'react';
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../helper/AuthProvider';
import { fetchUser } from '../controllers/UserController';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DocumentationBox = ({ setGlobalActiveTab }) => {
    const [date, setDate] = useState(new Date());
    const [selectedButton, setSelectedButton] = useState('All');
    const [documentations, setDocumentations] = useState([]);
    const [filteredDocumentations, setFilteredDocumentations] = useState([]);
    const [selectedDocumentation, setSelectedDocumentation] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');
    const [discussionDetails, setDiscussionDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportStartDate, setExportStartDate] = useState('');
    const [exportEndDate, setExportEndDate] = useState('');
    const [exportType, setExportType] = useState('All');
    const userAuth = useAuth();
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "documentation"));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocumentations(docs);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!);
            setUserRole(user.role);
        };

        fetchUserRole();
    }, [userAuth]);

    useEffect(() => {
        const filteredDocs = documentations.filter(doc => {
            const docDate = new Date(doc.timestamp.seconds * 1000);
            return docDate.toDateString() === date.toDateString() && (selectedButton === 'All' || doc.type === selectedButton);
        });
        setFilteredDocumentations(filteredDocs);
    }, [date, selectedButton, documentations]);

    useEffect(() => {
        if (selectedDocumentation && activeTab === 'discussion') {
            const fetchDiscussionDetails = async () => {
                const q = query(collection(db, "discussionDetails"), where("docID", "==", selectedDocumentation.id));
                const querySnapshot = await getDocs(q);
                const details = querySnapshot.docs.map(doc => doc.data());
                setDiscussionDetails(details);
            };

            fetchDiscussionDetails();
        }
    }, [selectedDocumentation, activeTab]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeExportModal();
            }
        };

        if (isExportModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExportModalOpen]);

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const handleDocItemClick = (doc) => {
        setSelectedDocumentation(doc);
        setDiscussionDetails(null);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openExportModal = () => setIsExportModalOpen(true);
    const closeExportModal = () => setIsExportModalOpen(false);

    const exportToExcel = async () => {
        // Filter documentation based on export settings
        const startDate = new Date(exportStartDate);
        const endDate = new Date(exportEndDate);
        const filteredDocs = documentations.filter(doc => {
            const docDate = new Date(doc.timestamp.seconds * 1000);
            return docDate >= startDate && docDate <= endDate && (exportType === 'All' || doc.type === exportType);
        });
    
        const meetingCount = filteredDocs.filter(doc => doc.type === 'Meeting').length;
        const discussionCount = filteredDocs.filter(doc => doc.type === 'Discussion').length;
        const evaluationCount = filteredDocs.filter(doc => doc.type === 'Evaluation').length;
    
        const summaryData = [
            ['Enrichment Activity Documentation Export', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Start Date', exportStartDate, '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['End Date', exportEndDate, '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Meeting Count', meetingCount, '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Discussion Count', discussionCount, '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Evaluation Count', evaluationCount, '', '', '', '', '', '', '', '', '', '', '', '', ''],
            [],
        ];
    
        const headers = [
            'Title',
            'Nomor Undangan',
            'Leader',
            'Place',
            'Date',
            'Time',
            'Type',
            'Description',
            'Discussion Details',
            'Attendance List'
        ];
    
        const data = await Promise.all(filteredDocs.map(async (doc) => {
            const q = query(collection(db, "discussionDetails"), where("docID", "==", doc.id));
            const querySnapshot = await getDocs(q);
            const details = querySnapshot.docs.map(detail => detail.data());
    
            return [
                doc.title,
                doc.nomor_undangan,
                doc.leader,
                doc.place,
                formatDate(doc.timestamp),
                formatTime(doc.timestamp),
                doc.type,
                doc.description,
                details.map(detail => detail.discussionTitle).join(', '),
                doc.attendanceList.join(', '),
            ];
        }));
    
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([...summaryData, headers, ...data]);
    
        XLSX.utils.book_append_sheet(wb, ws, "Documentation");
    
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
    
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "documentation.xlsx");
    
        closeExportModal();
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

    const contentBoxStyle = css`
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        .leftSide {
            width: 70%;
        }

        .rightSide {
            width: 25%;
            display: flex;
            flex-direction: column;
        }
    `;

    const calendarStyle = css`
        width: 100%;
        border: none;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.125em;

        .react-calendar__tile {
            width: 50px;
            height: 50px;
        }

        .react-calendar__tile--now {
            background: white !important;
        }

        .react-calendar__tile--active {
            background: #49A8FF !important;
            color: white !important;
            border-radius: 100% !important;
        }
    `;

    const buttonGridStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        margin-top: 20px;

        button {
            font-size: 17px;
            padding: 7px;
            border: 1px solid black;
            background-color: white;
            cursor: pointer;

            &.active {
                background-color: black;
                color: white;

                &:hover {
                    background-color: black;
                }
            }

            &:hover {
                background-color: #ebebeb;
            }
        }
    `;

    const documentationListStyle = css`
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .docItem {
            padding: 10px;
            border: 1px solid #dbdbdb;
            border-radius: 5px;
            background-color: white;
            text-align: start;
            cursor: pointer;

            &:hover {
                background-color: #f0f0f0;
            }
        }
    `;

    const docDetailBoxStyle = css`
        padding: 20px;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        background-color: white;

        h2 {
            margin: 0px;
        }
        p {
            text-align: start;
        }

        .itemContainer {
            margin-top: 10px;
            display: flex;
            gap: 20px;
            align-items: center;

            .leftSide {
                display: flex;
                align-items: center;
                gap: 20px;
                width: 20%;
            }
        }
    `;

    const tabContainerStyle = css`
        display: flex;
        margin-top: 20px;
        cursor: pointer;

        .tab {
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            margin-right: 10px;

            &.active {
                background-color: white;
                border-bottom: 1px solid #49A8FF;
            }
        }
    `;

    const tabContentStyle = css`
        padding: 20px 20px 20px 0px;
        border-top: none;
        border-radius: 0 0 5px 5px;
    `;

    const discussionDetailStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-left: 2px solid #ACACAC;
        padding-left: 20px;

        .information {
            display: flex;
            .leftSide {
                display: flex;
                width: 30%;
                align-items: center;
                gap: 20px;
            }
        }
    `;

    const attendanceTableStyle = css`
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;

        th, td {
            padding: 10px;
            border: 1px solid #dbdbdb;
        }

        th {
            background-color: #f0f0f0;
        }
    `;

    if (userRole === "Company") {
        return (
            <main className="mainStyle" css={mainStyle}>
                <div className="navSide" css={navSide}>
                    <p>Documentation</p>
                </div>
                <p>Sorry, you cant access this page</p>
            </main>
        );
    }

    const buttonContainerStyle = css`
        width: 100%;
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        button {
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #49A8FF;
            color: white;
            font-weight: 600;
            &:hover {
                background-color: #62b3fc;
                cursor: pointer;
            }
        }
    `

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
        width: 600px;
        display: flex;
        flex-direction: column;

        .headerp {
            margin-bottom: 20px;
            margin-top: 0px;
            background-color: #F0ECEC;
            border-radius: 5px;
            font-size: 20px;
            padding: 10px;
        }

        button {
            padding: 10px;
            border: none;
            margin: 10px;
            width: 40%;
            border-radius: 5px;
            background-color: #49A8FF;
            color: white;
            font-weight: 600;
            &:hover {
                background-color: #62b3fc;
                cursor: pointer;
            }
        }
    `;

    const exportModalContentStyle = css`
        display: flex;
        gap: 40px;
        .leftSide {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 50%;
        }
        .rightSide {
            width: 50%;
        }

        font-size: 20px;
        text-align: left;
        padding: 20px;
    `

    const periodGridStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
    `

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
        align-items: center;
        background-color: #F0ECEC;

        border-radius: 10px 10px 0px 0px;

        .headerp {
            margin-bottom: 0px;
        }
    `;

    const closeButtonStyle = css`
        background: none !important;
        border: none;
        width: auto !important;
        height: auto !important;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888 !important;
    `;

    const exportButton = css`
        margin-bottom: 10px;
        padding: 10px;
    `

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Documentation</p>
            </div>
            <div className="contentBox" css={contentBoxStyle}>
                <div className="leftSide">
                    <div className="buttonContainer" css={buttonContainerStyle}>
                        <button onClick={() => setGlobalActiveTab('Add New Documentation')}>Add New Documentation</button>
                        <button onClick={openExportModal}>Export to Excel</button>
                    </div>
                    <div className="box" css={docDetailBoxStyle}>
                        {selectedDocumentation ? (
                            <>
                                <h2>{selectedDocumentation.title}</h2>
                                <p>{selectedDocumentation.nomor_undangan}</p>
                                <div className="itemContainer">
                                    <div className="leftSide">
                                        <Icon icon={"fluent-mdl2:party-leader"} />
                                        <p>Leader</p>
                                    </div>
                                    <p>{selectedDocumentation.leader}</p>
                                </div>
                                <div className="itemContainer">
                                    <div className="leftSide">
                                        <Icon icon={"ic:outline-place"} />
                                        <p>Place</p>
                                    </div>
                                    <p>{selectedDocumentation.place}</p>
                                </div>
                                <div className="itemContainer">
                                    <div className="leftSide">
                                        <Icon icon={"clarity:date-line"} />
                                        <p>Date</p>
                                    </div>
                                    <p>{formatDate(selectedDocumentation.timestamp)}</p>
                                </div>
                                <div className="itemContainer">
                                    <div className="leftSide">
                                        <Icon icon={"mingcute:time-line"} />
                                        <p>Time</p>
                                    </div>
                                    <p>{formatTime(selectedDocumentation.timestamp)}</p>
                                </div>
                                <div className="itemContainer">
                                    <div className="leftSide">
                                        <Icon icon={"mdi:filter-outline"} />
                                        <p>Type</p>
                                    </div>
                                    <p>{selectedDocumentation.type}</p>
                                </div>
                                <p style={{marginTop: "20px"}}>{selectedDocumentation.description}</p>
                                {/* Tabs for Discussion Details and Attendance List */}
                                <div className="tabs" css={tabContainerStyle}>
                                    <div
                                        className={`tab ${activeTab === 'discussion' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('discussion')}
                                    >
                                        Discussion Details
                                    </div>
                                    <div
                                        className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('attendance')}
                                    >
                                        Attendance List
                                    </div>
                                </div>
                                <div className="tabContent" css={tabContentStyle}>
                                    {activeTab === 'discussion' ? (
                                        <div>
                                            {discussionDetails ? (
                                                discussionDetails.map((detail, index) => (
                                                    <div key={index} css={discussionDetailStyle}>
                                                        <p>{detail.discussionTitle}</p>
                                                        <div className="information">
                                                            <div className="leftSide">
                                                                <Icon icon={"fluent-mdl2:set-action"} />
                                                                <p>Further Actions</p>
                                                            </div>
                                                            <p>{detail.furtherActions}</p>
                                                        </div>
                                                        <div className="information">
                                                            <div className="leftSide">
                                                                <Icon icon={"material-symbols:avg-time"} />
                                                                <p>Deadline</p>
                                                            </div>
                                                            <p>{formatDate(detail.deadline)}</p>
                                                        </div>
                                                        <div className="information">
                                                            <div className="leftSide">
                                                                <Icon icon={"material-symbols:avg-time"} />
                                                                <p>Person Responsible</p>
                                                            </div>
                                                            <p>{detail.personResponsible}</p>
                                                        </div>                                                        
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Loading discussion details...</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <table css={attendanceTableStyle}>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Name</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedDocumentation.attendanceList ? (
                                                        selectedDocumentation.attendanceList.map((attendee, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{attendee}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2">No attendance list available.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p>Select a documentation to see details.</p>
                        )}
                    </div>
                </div>
                <div className="rightSide">
                    <Calendar onChange={setDate} value={date} css={calendarStyle} />
                    <div className="buttonGrid" css={buttonGridStyle}>
                        <button
                            className={selectedButton === 'All' ? 'active' : ''}
                            style={{ borderRadius: "5px 0px 0px 5px" }}
                            onClick={() => handleButtonClick('All')}
                        >
                            All
                        </button>
                        <button
                            className={selectedButton === 'Meeting' ? 'active' : ''}
                            onClick={() => handleButtonClick('Meeting')}
                        >
                            Meeting
                        </button>
                        <button
                            className={selectedButton === 'Discussion' ? 'active' : ''}
                            onClick={() => handleButtonClick('Discussion')}
                        >
                            Discussion
                        </button>
                        <button
                            className={selectedButton === 'Evaluation' ? 'active' : ''}
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                            onClick={() => handleButtonClick('Evaluation')}
                        >
                            Evaluation
                        </button>
                    </div>
                    <div className="documentationList" css={documentationListStyle}>
                        {filteredDocumentations.length > 0 ? (
                            filteredDocumentations.map(doc => (
                                <div key={doc.id} className="docItem" onClick={() => handleDocItemClick(doc)}>
                                    <p style={{fontWeight: "600", fontSize: "20px"}}>{doc.title}</p>
                                    <p>{doc.nomor_undangan}</p>
                                    <div className="leaderContainer" style={{display: "flex", alignItems: "center", gap: "20px"}}>
                                        <Icon icon={"fluent-mdl2:party-leader"} />
                                        <p>{doc.leader}</p>
                                    </div>
                                    <p style={{color: "#49A8FF"}}>{doc.type}</p>
                                </div>
                            ))
                        ) : (
                            <p>No documentation found for the selected date and type.</p>
                        )}
                    </div>
                </div>
            </div>
            {isExportModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={modalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp">Export to Excel</p>
                            <button css={closeButtonStyle} onClick={closeExportModal}>x</button>
                        </div>
                        <div className="exportModalContent" css={exportModalContentStyle}>
                            <div className="leftSide">
                                <p>Period</p>
                                <div className="periodGrid" css={periodGridStyle}>
                                    <p>Start</p>
                                    <input type="date" value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} />
                                </div>
                                <div className="periodGrid" css={periodGridStyle}>
                                    <p>End</p>
                                    <input type="date" value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="rightSide">
                                <p>Type</p>
                                <select value={exportType} onChange={e => setExportType(e.target.value)}>
                                    <option value="All">All</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Discussion">Discussion</option>
                                    <option value="Evaluation">Evaluation</option>
                                </select>
                            </div>
                        </div>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginTop: "40px"}}>
                            <button css={exportButton} onClick={exportToExcel}>Export</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default DocumentationBox;
