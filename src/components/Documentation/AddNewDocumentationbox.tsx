/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../../helper/AuthProvider';
import { fetchUser } from '../../controllers/UserController';
import User from "../../model/User";
import DropdownComponent from "./DropdownComponent";

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
    const [newAttendee, setNewAttendee] = useState(""); // State for the new attendee input
    const [results, setResults] = useState([]);
    const [newResult, setNewResult] = useState(""); // State for the new result input
    const [totalCounter, setTotalCounter] = useState(0); // Counter for total discussion details
    const [pictures, setPictures] = useState([]);
    const [newPicture, setNewPicture] = useState(null); // State for the new picture file
    const [isPicturesModalOpen, setIsPicturesModalOpen] = useState(false);
    const attendeeModalRef = useRef(null);
    const discussionModalRef = useRef(null);
    const userAuth = useAuth();

    const [title, setTitle] = useState("");
    const [invitationNumber, setInvitationNumber] = useState("");
    const [description, setDescription] = useState("");
    const [documentationType, setDocumentationType] = useState(""); // State for documentation type
    const [meetingLeader, setMeetingLeader] = useState(""); // State for meeting leader
    const [discussionTitle, setDiscussionTitle] = useState("");
    const [personResponsible, setPersonResponsible] = useState("");
    const [furtherActions, setFurtherActions] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("Meeting");
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const [user, setUser] = useState<User>();

    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

    const [fileName, setFileName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!)
            if (user._tag === "Some") {
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

    const openResultsModal = () => setIsResultsModalOpen(true);
    const closeResultsModal = () => setIsResultsModalOpen(false);

    const openPicturesModal = () => setIsPicturesModalOpen(true);
    const closePicturesModal = () => setIsPicturesModalOpen(false);

    const handleAddAttendee = () => {
        if (newAttendee.trim() !== "") {
            setAttendees([...attendees, newAttendee]);
            setNewAttendee(""); // Clear the input field after adding the attendee
        }
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

    const storage = getStorage();

    const handleAddPicture = async () => {
        try {
            if (newPicture) {
                // Create a storage reference
                const storageRef = ref(storage, `images/${newPicture.name}`);

                // Upload the file to Firebase Storage
                const snapshot = await uploadBytes(storageRef, newPicture);

                // Get the download URL
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Add the URL to the pictures array
                setPictures([...pictures, downloadURL]);

                // Clear the file input after adding the picture
                setNewPicture(null);
                setFileName("");
            }
        } catch (error) {
            console.error("Error uploading picture: ", error);
            alert("Failed to upload picture. Please try again.");
        }
    };

    const handleAddDocumentation = async () => {
        try {
            const parsedTime = new Date(time);

            if (!user || !user.email) {
                throw new Error("User is not defined or user email is missing");
            }

            // Add the main documentation data
            const docRef = await addDoc(collection(db, "documentation"), {
                title,
                nomor_undangan: invitationNumber,
                description,
                leader: meetingLeader, // Use the meetingLeader state
                place: location,
                time: parsedTime,
                attendanceList: attendees,
                discussionDetails: modalDiscussionDetails.map(detail => ({
                    discussionTitle: detail.discussionTitle,
                    personResponsible: detail.personResponsible,
                    furtherActions: detail.furtherActions,
                    deadline: new Date(detail.deadline),
                })),
                results,
                pictures, // Now contains URLs of the images from Firebase Storage
                type: documentationType, // Use the documentationType state
                writer: user.email,
                timestamp: parsedTime, // Use the parsed time as the timestamp
            });

            alert("Documentation added successfully!");

            // Clear the form after successful submission
            setTitle("");
            setInvitationNumber("");
            setDescription("");
            setDocumentationType(""); // Clear documentation type
            setMeetingLeader(""); // Clear meeting leader
            setDiscussionTitle("");
            setPersonResponsible("");
            setFurtherActions("");
            setDeadline("");
            setLocation("");
            setTime("");
            setAttendees([]);
            setModalDiscussionDetails([]);
            setTotalCounter(0); // Reset the total counter
            setResults([]); // Reset the results list
            setPictures([]); // Reset the pictures list
        } catch (error) {
            console.error("Error adding documentation: ", error);
            alert("Failed to add documentation. Please try again.");
        }
    };
    

    const handleAddResult = () => {
        if (newResult.trim() !== "") {
            setResults([...results, newResult]);
            setNewResult(""); 
        }
    };

    const handleResultChange = (index, event) => {
        const newResults = [...results];
        newResults[index] = event.target.value;
        setResults(newResults);
    };

    const handleRemoveResult = (index) => {
        const newResults = [...results];
        newResults.splice(index, 1);
        setResults(newResults);
    };

    const handlePictureChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPicture(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    const handleRemovePicture = (index) => {
        const newPictures = [...pictures];
        newPictures.splice(index, 1);
        setPictures(newPictures);
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
        background-color: #F5F5F5;
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
        padding: 80px 100px 100px 100px;
        .leftSide {
            width: 50%;
            padding-right: 50px;
            border-right: 1px solid black
        }
        .rightSide {
            width: 50%;
            padding-left: 50px;
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
        background-color: white;
        color: #49A8FF;
        border: 1px solid #49A8FF;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 15px;
        &:hover {
            background-color: white;
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
        gap: 10px;
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
        height: auto;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
    `;

    const modalFormStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        box-sizing: border-box;

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

    const inputAndButtonContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        text-align: start;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;

        input {
            flex-grow: 1;
            height: 35px;
            border-radius: 5px;
            border: 1px solid gray;
            padding: 10px;
        }

        button {
            padding: 10px 20px;
            background-color: #49A8FF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 15px;

            &:hover {
                background-color: #62b3fc;
            }
        }
    `;

    const addButtonStyle = css`
        background-color: #49A8FF;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 15px;

        &:hover {
            background-color: #62b3fc;
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
        gap: 40px;
        .inputDoc {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            input {
                width: 100%;
                box-sizing: border-box;
                height: 46px;
                border-radius: 5px;
                border: 1px solid #ACACAC;
            }
        }
        
    `

    const titleContainerStyle = css`
        width: 100%;
        margin-bottom: 10px;
        .inputTitle {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            input {
                box-sizing: border-box;
                width: 100%;
                height: 46px;
                border-radius: 5px;
                border: 1px solid #ACACAC;
            }
        }
    `

    const scheduleTopSideStyle = css`
        display: flex;
        gap: 30px;
        margin-top: 20px;
    `

    const timeContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        input {
            height: 47px;
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid #ACACAC;
            padding: 10px;
            box-sizing: border-box;
        }
    `

    const locationContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        input {
            height: 47px;
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid #ACACAC;
            padding: 10px;
            box-sizing: border-box;
        }
    `

    const pictureGridContainerStyle = css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 10px;
    `;

    const pictureGridItemStyle = css`
        position: relative;
        width: 100%;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
    `;

    const deleteIconStyle = css`
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        padding: 2px;
        &:hover {
            background-color: rgba(255, 255, 255, 1);
        }
    `;


    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Add New Documentation</p>
            </div>
            <div className="content" css={contentStyle}>
                <p className="headerp" css={headerp}>Add a documentation</p>
                <div className="contentSide" css={contentSideStyle}>
                    <div className="leftSide">
                        <p style={{fontSize: "19px"}}>Main</p>
                        <div className="headerGrid" css={headerGridStyle}>
                            <div className="titleContainer" css={titleContainerStyle}>
                                <div className="inputTitle">
                                    <p>Title</p>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div className="DocumentationMeeting" css={documentationMeetingStyle}>
                                <div className="inputDoc">
                                    <p>Documentation Type</p>
                                    <input type="text" value={documentationType} onChange={(e) => setDocumentationType(e.target.value)} />
                                </div>
                                <div className="inputDoc">
                                    <p>Meeting Leader</p>
                                    <input type="text" value={meetingLeader} onChange={(e) => setMeetingLeader(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="leftBottomContainer" >
                            <p className="header" style={{marginBottom: "20px", fontSize: "19px"}}>Discussion</p>
                            <div className="discussionItem" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                                <div className="item">
                                    <p>Details <span style={{color: "#49A8FF"}}>({totalCounter})</span></p>
                                    <button css={buttonStyle} onClick={openDiscussionModal}>See or Add More</button>
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
                                    <p>Results <span style={{color: "#49A8FF"}}>({results.length})</span></p>
                                    <button css={buttonStyle} onClick={openResultsModal}>See or Add more</button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="rightSide">
                        <div className="scheduleContainer">
                            <p>Schedule</p>
                            <div className="scheduleTopSide" css={scheduleTopSideStyle}>
                                <div className="typeContainer" style={{position: "relative"}}>
                                    <p>Type</p>
                                    <DropdownComponent selectedValue={type} setSelectedValue={setType} />
                                </div>
                                <div className="timeContainer" style={{ marginBottom: "20px" }} css={timeContainerStyle}>
                                    <p>Time</p>
                                    <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="locationContainer" style={{ marginBottom: "20px" }} css={locationContainerStyle}>
                                <p>Location</p>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                            
                        </div>
                        <p className="header" style={{marginBottom: "20px", fontSize: "19px"}}>Snapshot</p>
                        <div className="snapshotItemContainer" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                            <div className="item">
                                <p>Attendees <span style={{color: "#49A8FF"}}>({attendees.length})</span></p>
                                <button css={buttonStyle} onClick={openAttendeeModal}>See or Add more</button>
                            </div>
                            <div className="item">
                                <p>Pictures <span style={{color: "#49A8FF"}}>({pictures.length})</span></p>
                                <button css={buttonStyle} onClick={openPicturesModal}>See or Add more</button>
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
                        <div className="inputAndButtonContainer" css={inputAndButtonContainerStyle}>
                            <p>Attendee</p>
                            <input
                                type="text"
                                placeholder="New Attendee"
                                value={newAttendee}
                                onChange={(e) => setNewAttendee(e.target.value)}
                                css={inputStyle}
                            />
                        </div>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box"}}>
                            <button type="button" css={addButtonStyle} onClick={handleAddAttendee}>
                                Add
                            </button>
                        </div>
                        <form css={modalFormStyle}>
                            <div className="modalBox" css={modalBoxStyle}>
                                {attendees.map((attendee, index) => (
                                    <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                        <div className="inputNumContainer" style={{display: "grid", width: "100%", height: "auto", gridTemplateColumns: "0.1fr 1fr 1fr", paddingLeft: "10px", alignItems: "center"}}>
                                            <p>{index + 1}</p>
                                            <input
                                                placeholder={`Attendee ${index + 1}`}
                                                value={`${attendee}`}
                                                onChange={(e) => handleAttendeeChange(index, e)}
                                                css={inputStyle}
                                            />
                                        </div>
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
            {isResultsModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={attendeeModalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp">Add a Result</p>
                            <button css={closeButtonStyle} onClick={closeResultsModal}>x</button>
                        </div>
                        <div className="inputAndButtonContainer" css={inputAndButtonContainerStyle}>
                            <p>Results</p>
                            <input
                                type="text"
                                placeholder="New Result"
                                value={newResult}
                                onChange={(e) => setNewResult(e.target.value)}
                                css={inputStyle}
                            />
                        </div>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box"}}>
                            <button type="button" css={addButtonStyle} onClick={handleAddResult}>
                                Add
                            </button>
                        </div>
                        <form css={modalFormStyle}>
                            <div className="modalBox" css={modalBoxStyle}>
                                {results.map((result, index) => (
                                    <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                        <div className="inputNumContainer" style={{display: "grid", width: "100%", height: "auto", gridTemplateColumns: "0.1fr 1fr 1fr", paddingLeft: "10px", alignItems: "center"}}>
                                            <p>{index + 1}</p>
                                            <input
                                                placeholder={`Result ${index + 1}`}
                                                value={`${result}`}
                                                onChange={(e) => handleResultChange(index, e)}
                                                css={inputStyle}
                                            />
                                        </div>
                                        <Icon
                                            icon="mdi:delete"
                                            color="#51587E"
                                            fontSize={25}
                                            className="removeIcon"
                                            onClick={() => handleRemoveResult(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isPicturesModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={attendeeModalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp">Add a Picture</p>
                            <button css={closeButtonStyle} onClick={closePicturesModal}>x</button>
                        </div>
                        <div className="inputContainer" style={{ position: "relative", height: "60px", border: "1px solid #ACACAC", margin: "20px", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    boxSizing: "border-box",
                                    top: 0, left: 0, opacity: 0, zIndex: 2, cursor: "pointer",
                                }}
                            />
                            <div className="labelContainer" style={{ position: "absolute", right: "0px", display: "flex", padding: "10px", boxSizing: "border-box", backgroundColor: "#F0ECEC", alignItems: "center", height: "100%", zIndex: 1, cursor: "pointer" }}>
                                <label
                                    htmlFor="input"
                                    style={{
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        display: "inline-block"
                                    }}
                                >
                                    Browse
                                </label>
                            </div>
                            {fileName && (
                                <div style={{ marginLeft: "10px", padding: "10px", boxSizing: "border-box", zIndex: 1 }}>
                                    {fileName}
                                </div>
                            )}
                        </div>


                        <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box" }}>
                            <button type="button" css={addButtonStyle} onClick={handleAddPicture}>
                                Add
                            </button>
                        </div>
                        <form css={modalFormStyle}>
                            <div className="modalBox" css={modalBoxStyle}>
                                <div className="pictureGridContainer" css={pictureGridContainerStyle}>
                                    {pictures.map((picture, index) => (
                                        <div key={index} className="pictureGridItem" css={pictureGridItemStyle}>
                                            <img src={picture} alt={`Picture ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }} />
                                            <Icon
                                                icon="mdi:delete"
                                                color="#51587E"
                                                fontSize={25}
                                                className="removeIcon"
                                                onClick={() => handleRemovePicture(index)}
                                                css={deleteIconStyle}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}

export default AddNewDocumentationBox;
