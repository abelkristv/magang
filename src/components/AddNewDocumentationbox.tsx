/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../helper/AuthProvider';
import { fetchUser } from '../controllers/UserController';

const AddNewDocumentationBox = () => {
    const [date, setDate] = useState(new Date());
    const [selectedButton, setSelectedButton] = useState('All');
    const [documentations, setDocumentations] = useState([]);
    const [filteredDocumentations, setFilteredDocumentations] = useState([]);
    const [selectedDocumentation, setSelectedDocumentation] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');
    const [discussionDetails, setDiscussionDetails] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [attendees, setAttendees] = useState([]); // Attendees state
    const modalRef = useRef(null);
    const userAuth = useAuth();

    const [title, setTitle] = useState("");
    const [invitationNumber, setInvitationNumber] = useState("");
    const [description, setDescription] = useState("");
    const [leader, setLeader] = useState("");
    const [agendaTitle, setAgendaTitle] = useState("");
    const [personResponsible, setPersonResponsible] = useState("");
    const [furtherAction, setFurtherAction] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [time, setTime] = useState("");

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
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const addAttendee = () => {
        setAttendees([...attendees, ""]);
    };

    const handleAttendeeChange = (index, event) => {
        const newAttendees = [...attendees];
        newAttendees[index] = event.target.value;
        setAttendees(newAttendees);
    };

    const handleAddDocumentation = async () => {
        try {
            // Add the main documentation data
            const nomor_undangan = invitationNumber
            const place = location
            const docRef = await addDoc(collection(db, "documentation"), {
                title,
                nomor_undangan,
                description,
                leader,
                place,
                time,
                attendees,
                timestamp: new Date()
            });

            // Add the discussion details
            await addDoc(collection(db, "discussionDetails"), {
                docID: docRef.id,
                title: agendaTitle,
                personResponsible,
                furtherAction,
                deadline
            });

            alert("Documentation added successfully!");
            // Clear the form after successful submission
            setTitle("");
            setInvitationNumber("");
            setDescription("");
            setLeader("");
            setAgendaTitle("");
            setPersonResponsible("");
            setFurtherAction("");
            setDeadline("");
            setLocation("");
            setTime("");
            setAttendees([]);
        } catch (error) {
            console.error("Error adding documentation: ", error);
            alert("Failed to add documentation. Please try again.");
        }
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

    const headerp = css`
        background-color: #ebebeb;
        padding: 10px;
        font-size: 20px;
    `;

    const contentStyle = css`
        margin-top: 40px;
        border: 1px solid #ebebeb;
        text-align: start;
    `;

    const headerGridStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        text-align: start;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    `;

    const contentSideStyle = css`
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .leftSide {
            width: 60%;
        }
        .rightSide {
            width: 35%;
        }

        .input {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 95%;

            input {
                height: 35px;
                border-radius: 5px;
                border: 1px solid gray;
            }
        }
    `;

    const detailDiscussionGrid = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        text-align: start;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    `;

    const buttonStyle = css`
        padding: 10px;
        background-color: #F0ECEC;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 15px;
        &:hover {
            background-color: #dbdbdb;
            cursor: pointer;
        }
    `;

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

    const modalFormStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;

        p {
            text-align: start;
        }
        
        hr {
            width: 100%;
            background-color: #ACACAC;
            color: #ACACAC;
        }
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const modalBoxStyle = css`
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ACACAC;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    const addButtonContainerStyle = css`
        display: flex;
        justify-content: center;
        button {
            width: 400px;
            padding: 10px;
            font-size: 20px;
            border-radius: 10px;
            border: none;
            margin-bottom: 20px;

            background-color: #49A8FF;
            color: white;

            &:hover {
                background-color: #62b3fc;
                cursor: pointer;
            }
        }
    `

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Add New Documentation</p>
            </div>
            <div className="content" css={contentStyle}>
                <p className="headerp" css={headerp}>Add a documentation</p>
                <div className="contentSide" css={contentSideStyle}>
                    <div className="leftSide">
                        <p>Header</p>
                        <div className="headerGrid" css={headerGridStyle}>
                            <div className="input">
                                <p>Title</p>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Invitation Number</p>
                                <input type="text" value={invitationNumber} onChange={(e) => setInvitationNumber(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Description</p>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Leader</p>
                                <input type="text" value={leader} onChange={(e) => setLeader(e.target.value)} />
                            </div>
                        </div>
                        <p>Details Discussion</p>
                        <div className="detailDiscussionGrid" css={detailDiscussionGrid}>
                            <div className="input">
                                <p>Title</p>
                                <input type="text" value={agendaTitle} onChange={(e) => setAgendaTitle(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Person Responsible</p>
                                <input type="text" value={personResponsible} onChange={(e) => setPersonResponsible(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Further Action</p>
                                <input type="text" value={furtherAction} onChange={(e) => setFurtherAction(e.target.value)} />
                            </div>
                            <div className="input">
                                <p>Deadline</p>
                                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="rightSide">
                        <p>Schedule</p>
                        <div className="input" style={{ marginTop: "20px", marginBottom: "10px" }}>
                            <p>Location</p>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <div className="input" style={{ marginBottom: "20px" }}>
                            <p>Time</p>
                            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
                        </div>
                        <p style={{ marginBottom: "20px" }}>Attendance List</p>
                        <p>Total : {attendees.length}</p>
                        <button css={buttonStyle} onClick={openModal}>Add an attendee</button>
                    </div>
                </div>
                <div className="addButtonContainer" css={addButtonContainerStyle}>
                    <button onClick={handleAddDocumentation}>Add</button>
                </div>
                
            </div>
            {isModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={modalRef}>
                        <p className="headerp">Add an Attendee</p>
                        <form css={modalFormStyle}>
                            <div className="modalHeader" css={modalHeaderStyle}>
                                <p>Add</p>
                                <Icon icon={"zondicons:add-outline"} onClick={addAttendee} />
                            </div>
                            <hr />
                            <div className="modalBox" css={modalBoxStyle}>
                                {attendees.map((attendee, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Attendee ${index + 1}`}
                                        value={attendee}
                                        onChange={(e) => handleAttendeeChange(index, e)}
                                        css={inputStyle}
                                    />
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AddNewDocumentationBox;
