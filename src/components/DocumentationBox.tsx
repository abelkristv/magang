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
        width: 400px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        h2 {
            margin-bottom: 20px;
        }

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
    `;

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
                        <h2>Export to Excel</h2>
                        <button onClick={closeExportModal}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default DocumentationBox;
