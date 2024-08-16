/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../helper/AuthProvider';
import { fetchUser } from '../controllers/UserController';
import User from "../model/User";

const AddNewDocumentationBox = () => {
    const [date, setDate] = useState(new Date());
    const [selectedButton, setSelectedButton] = useState('All');
    const [documentations, setDocumentations] = useState([]);
    const [filteredDocumentations, setFilteredDocumentations] = useState([]);
    const [selectedDocumentation, setSelectedDocumentation] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');
    const [discussionDetails, setDiscussionDetails] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
    const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);
    const [modalDiscussionDetails, setModalDiscussionDetails] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [totalCounter, setTotalCounter] = useState(0); // Counter for total discussion details
    const attendeeModalRef = useRef(null);
    const discussionModalRef = useRef(null);
    const userAuth = useAuth();

    const [title, setTitle] = useState("");
    const [invitationNumber, setInvitationNumber] = useState("");
    const [description, setDescription] = useState("");
    const [leader, setLeader] = useState("");
    const [discussionTitle, setDiscussionTitle] = useState("");
    const [personResponsible, setPersonResponsible] = useState("");
    const [furtherActions, setFurtherActions] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("Meeting");
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const [user, setUser] = useState<User>()

    useEffect(() => {
        const fetchData = async () => {
            const user =  await fetchUser(userAuth?.currentUser?.email!)
            if (user._tag == "Some") {
                setUser(user.value)
            } else {
                setUser({} as User)
            }
            
            
        }
        fetchData()
    }, []);

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
            if (attendeeModalRef.current && !attendeeModalRef.current.contains(event.target)) {
                closeAttendeeModal();
            }
            if (discussionModalRef.current && !discussionModalRef.current.contains(event.target)) {
                closeDiscussionModal();
            }
        };

        if (isAttendeeModalOpen || isDiscussionModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAttendeeModalOpen, isDiscussionModalOpen]);

    const openAttendeeModal = () => setIsAttendeeModalOpen(true);
    const closeAttendeeModal = () => setIsAttendeeModalOpen(false);

    const openDiscussionModal = () => setIsDiscussionModalOpen(true);
    const closeDiscussionModal = () => {
        setIsDiscussionModalOpen(false);
        setIsEditing(false);
        setDiscussionTitle("");
        setPersonResponsible("");
        setFurtherActions("");
        setDeadline("");
    };

    const addAttendee = () => {
        setAttendees([...attendees, ""]);
    };

    const handleAttendeeChange = (index, event) => {
        const newAttendees = [...attendees];
        newAttendees[index] = event.target.value;
        setAttendees(newAttendees);
    };

    const handleRemoveAttendee = (index) => {
        const newAttendees = [...attendees];
        newAttendees.splice(index, 1);
        setAttendees(newAttendees);
    };

    const handleAddDiscussionDetail = () => {
        if (isEditing) {
            const updatedDetails = [...modalDiscussionDetails];
            updatedDetails[editingIndex] = {
                discussionTitle,
                personResponsible,
                furtherActions,
                deadline
            };
            setModalDiscussionDetails(updatedDetails);
            setIsEditing(false);
            setEditingIndex(null);
        } else {
            setModalDiscussionDetails([
                ...modalDiscussionDetails,
                {
                    discussionTitle,
                    personResponsible,
                    furtherActions,
                    deadline
                }
            ]);
            setTotalCounter(totalCounter + 1);
        }

        setDiscussionTitle("");
        setPersonResponsible("");
        setFurtherActions("");
        setDeadline("");
    };

    const handleEditDiscussionDetail = (index) => {
        const detail = modalDiscussionDetails[index];
        setDiscussionTitle(detail.discussionTitle);
        setPersonResponsible(detail.personResponsible);
        setFurtherActions(detail.furtherActions);
        setDeadline(detail.deadline);
        setIsEditing(true);
        setEditingIndex(index);
        openDiscussionModal();
    };

    const handleDeleteDiscussionDetail = (index) => {
        const updatedDetails = [...modalDiscussionDetails];
        updatedDetails.splice(index, 1);
        setModalDiscussionDetails(updatedDetails);
        setTotalCounter(totalCounter - 1);
    };

    const handleAddDocumentation = async () => {
        try {
            // Parse the time field to create a Date object
            const parsedTime = new Date(time);
    
            // Check if user object and email are defined
            if (!user || !user.email) {
                throw new Error("User is not defined or user email is missing");
            }
    
            // Log values to debug
            console.log("Title:", title);
            console.log("Invitation Number:", invitationNumber);
            console.log("Description:", description);
            console.log("Leader:", leader);
            console.log("Place:", location);
            console.log("Time:", parsedTime);
            console.log("Attendance List:", attendees);
            console.log("Type:", type);
            console.log("Writer:", user.email);

            const nomor_undangan = invitationNumber
    
            // Add the main documentation data
            const docRef = await addDoc(collection(db, "documentation"), {
                title,
                nomor_undangan,
                description,
                leader,
                place: location,
                time: parsedTime,
                attendanceList: attendees,
                timestamp: parsedTime, // Use the parsed time as the timestamp
                type,
                writer: user.email // Ensure writer field is not undefined
            });
    
            // Log docRef to verify
            console.log("Document reference ID:", docRef.id);
    
            // Add the discussion details
            for (const detail of modalDiscussionDetails) {
                console.log("Adding discussion detail:", detail);
                await addDoc(collection(db, "discussionDetails"), {
                    docID: docRef.id,
                    discussionTitle: detail.discussionTitle,
                    personResponsible: detail.personResponsible,
                    furtherActions: detail.furtherActions,
                    deadline: new Date(detail.deadline)
                });
            }
    
            alert("Documentation added successfully!");
    
            // Clear the form after successful submission
            setTitle("");
            setInvitationNumber("");
            setDescription("");
            setLeader("");
            setDiscussionTitle("");
            setPersonResponsible("");
            setFurtherActions("");
            setDeadline("");
            setLocation("");
            setTime("");
            setAttendees([]);
            setModalDiscussionDetails([]);
            setTotalCounter(0); // Reset the total counter
        } catch (error) {
            console.error("Error adding documentation: ", error);
            alert("Failed to add documentation. Please try again.");
        }
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

    const headerp = css`
        background-color: #ebebeb;
        padding: 10px;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        font-size: 20px;
    `;

    const contentStyle = css`
        margin-top: 40px;
        border: 1px solid #ebebeb;
        text-align: start;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.25);
    `;

    const headerGridStyle = css`
        display: flex;
        flex-direction: column;
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
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 15px;
        &:hover {
            background-color: #303030;
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

    const discussionModalStyle = css`
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

    const discussionModalContentStyle = css`
        background: white;
        border-radius: 10px;
        width: 700px;
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
        padding-right: 10px;
        align-items: center;
        background-color: #F0ECEC;
    `;

    const modalBoxStyle = css`
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ACACAC;
        display: flex;
        flex-direction: column;
        // gap: 10px;

        .attendeeInputContainer {
            display: flex;
            align-items: center;
            input {
                flex-grow: 1;
            }
            .removeIcon {
                margin-right: 10px;

                cursor: pointer;
                visibility: hidden;
            }
            &:hover .removeIcon {
                visibility: visible;
            }
        }

        .attendeeInputContainer:nth-of-type(odd) {
            background-color: #F5F5F5;
            input {
                flex-grow: 1;
                background-color: #F5F5F5;
            }
        }
        .attendeeInputContainer:nth-of-type(even) {
            background-color: white;
            input {
                flex-grow: 1;
                background-color: white;
            }
        }
    `;

    const addButtonContainerStyle = css`
        display: flex;
        justify-content: center;
        margin-top: 50px;
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

    const addDiscussionButtonContainerStyle = css`
        display: flex;
        justify-content: end;
        button {
            width: 100px;
            padding: 10px;
            font-size: 15px;
            border-radius: 10px;
            border: none;
            margin-bottom: 20px;

            background-color: black;
            color: white;

            &:hover {
                background-color: #303030;
                cursor: pointer;
            }
        }
    `

    const inputGrid = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 20px;

        input {
            margin: 0px;
            height: 30px;
            border-radius: 5px;
            border: 1px solid #ACACAC;
        }

        .input {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    `

    const discussionCardStyle = css`
        border: 1px solid #ebebeb;
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
        background-color: white;

        .itemAction {
            display: grid;
            grid-template-columns: 1fr 1fr;
            .leftSide {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .rightSide {
                display: flex;
                gap: 10px;
                align-items: center;
                justify-content: flex-end;
            }
        }
    `;

    const attendeeInputContainerStyle = css`
        input {
            outline: none;
            border: none
        }
    `

    const closeButtonStyle = css`
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888;
    `;

    const iconStyle = css`
        &:hover {
            cursor: pointer;
        }
    `

    const documentationMeetingStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
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
                        <p>Main</p>
                        <div className="headerGrid" css={headerGridStyle}>
                            <div className="titleContainer" style={{width: "100%"}}>
                                <div className="input">
                                    <p>Title</p>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="DocumentationMeeting" css={documentationMeetingStyle}>
                                <div className="input">
                                    <p>Documentation Type</p>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="input">
                                    <p>Meeting Leader</p>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="leftBottomContainer" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                            <div className="item">
                                <p style={{ marginBottom: "20px"}}>Discussion Details</p>
                                <p>Total : {totalCounter}</p>
                                <button css={buttonStyle} onClick={openDiscussionModal}>Add a discussion details</button>
                                {discussionDetails.map((detail, index) => (
                                    <div key={index} css={discussionCardStyle}>
                                        <p><strong>Title:</strong> {detail.discussionTitle}</p>
                                        <p><strong>Person Responsible:</strong> {detail.personResponsible}</p>
                                        <p><strong>Further Actions:</strong> {detail.furtherActions}</p>
                                        <p><strong>Deadline:</strong> {detail.deadline}</p>
                                        <div className="itemAction">
                                            <div className="leftSide">
                                                <Icon icon={"fluent-mdl2:set-action"} />
                                                <p>Further Actions</p>
                                            </div>
                                            <div className="rightSide">
                                                <Icon icon={"material-symbols:edit"} onClick={() => handleEditDiscussionDetail(index)} />
                                                <Icon icon={"material-symbols:delete"} onClick={() => handleDeleteDiscussionDetail(index)} />
                                            </div>
                                            <p>{detail.furtherActions}</p>
                                        </div>
                                        <div className="itemAction">
                                            <div className="leftSide">
                                                <Icon icon={"material-symbols:avg-time"} />
                                                <p>Deadline</p>
                                            </div>
                                            <p>{detail.deadline}</p>
                                        </div>
                                        <div className="itemAction">
                                            <div className="leftSide">
                                                <Icon icon={"material-symbols:avg-time"} />
                                                <p>Person Responsible</p>
                                            </div>
                                            <p>{detail.personResponsible}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="item">
                                <p style={{ marginBottom: "20px" }}>Attendance List</p>
                                <p>Total : {attendees.length}</p>
                                <button css={buttonStyle} onClick={openAttendeeModal}>Add an attendee</button>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="rightSide">
                        <div className="scheduleContainer">
                            <p>Schedule</p>
                            <div className="input" style={{ marginTop: "20px", marginBottom: "10px" }}>
                                <p>Location</p>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                            <div className="input" style={{ marginBottom: "20px" }}>
                                <p>Time</p>
                                <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="typeContainer">
                            <p>Type</p>
                            <div className="input" style={{ marginTop: "20px", marginBottom: "10px" }}>
                                <p>Documentation Type</p>
                                <select name="" id="" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Discussion">Discussion</option>
                                    <option value="Evaluation">Evaluation</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="addButtonContainer" css={addButtonContainerStyle}>
                    <button onClick={handleAddDocumentation}>Add</button>
                </div>
                
            </div>
            {isAttendeeModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={attendeeModalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp">Add an Attendee</p>
                            <button css={closeButtonStyle} onClick={closeAttendeeModal}>x</button>
                        </div>
                        <form css={modalFormStyle}>
                            <div className="modalHeader" style={{display: "flex", justifyContent: "space-between"}}>
                                <p>Add</p>
                                <Icon icon={"zondicons:add-outline"} onClick={addAttendee} cursor={"pointer"} />
                            </div>
                            <hr />
                            <div className="modalBox" css={modalBoxStyle}>
                                {attendees.map((attendee, index) => (
                                    <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                        <input
                                            type="text"
                                            placeholder={`Attendee ${index + 1}`}
                                            value={attendee}
                                            onChange={(e) => handleAttendeeChange(index, e)}
                                            css={inputStyle}
                                        />
                                        <Icon
                                            icon="mdi:delete"
                                            color="#51587E"
                                            fontSize={25}
                                            className="removeIcon"
                                            onClick={() => handleRemoveAttendee(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDiscussionModalOpen && (
                <div css={discussionModalStyle}>
                    <div css={discussionModalContentStyle} ref={discussionModalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp">Add Discussion Details</p>
                            <button css={closeButtonStyle} onClick={closeDiscussionModal}>x</button>
                        </div>
                        <form css={modalFormStyle}>
                            <div className="inputGrid" css={inputGrid}>
                                <div className="input">
                                    <p>Key Objective</p>
                                    <input type="text" value={discussionTitle} onChange={(e) => setDiscussionTitle(e.target.value)} />
                                </div>
                                <div className="input">
                                    <p>Person Responsible</p>
                                    <input type="text" value={personResponsible} onChange={(e) => setPersonResponsible(e.target.value)} />
                                </div>
                                <div className="input">
                                    <p>Further Actions</p>
                                    <input type="text" value={furtherActions} onChange={(e) => setFurtherActions(e.target.value)} />
                                </div>
                                <div className="input">
                                    <p>Deadline</p>
                                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="buttonContainer" css={addDiscussionButtonContainerStyle}>
                                <button type="button" onClick={handleAddDiscussionDetail}>
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                            </div>
                            {modalDiscussionDetails.map((detail, index) => (
                                <div key={index} css={discussionCardStyle}>
                                    <div className="topSide" style={{display: "flex", justifyContent: "space-between"}}>
                                        <div className="leftSide">
                                            <p style={{marginBottom: "20px", fontSize: "17px"}}>{detail.discussionTitle}</p>
                                        </div>
                                        <div className="rightSide" style={{display: "flex", gap: "10px"}}>
                                            <Icon css={iconStyle} fontSize={24} color="#51587E" icon={"material-symbols:edit"} onClick={() => handleEditDiscussionDetail(index)} />
                                            <Icon css={iconStyle} fontSize={24} color="#51587E" icon={"material-symbols:delete"} onClick={() => handleDeleteDiscussionDetail(index)} />
                                        </div>
                                    </div>
                                    
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"fluent-mdl2:set-action"} />
                                            <p>Further Actions</p>
                                        </div>
                                        <p>{detail.furtherActions}</p>
                                    </div>
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"material-symbols:avg-time"} />
                                            <p>Deadline</p>
                                        </div>
                                        <p>{detail.deadline}</p>
                                    </div>
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"material-symbols:avg-time"} />
                                            <p>Person Responsible</p>
                                        </div>
                                        <p>{detail.personResponsible}</p>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AddNewDocumentationBox;
