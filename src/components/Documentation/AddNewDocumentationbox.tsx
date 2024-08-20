/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { useAuth } from '../../helper/AuthProvider';
import { fetchUser } from '../../controllers/UserController';
import User from "../../model/User";
import DropdownComponent from "./DropdownComponent";
import AttendeeModal from "./Modal/AttendeeModal";
import DiscussionModal from "./Modal/DiscussionModal";
import ResultsModal from "./Modal/ResultsModal";
import PicturesModal from "./Modal/PicturesModal";
import { Icon } from "@iconify/react/dist/iconify.js";

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
    const userAuth = useAuth();

    const [title, setTitle] = useState("");
    const [invitationNumber, setInvitationNumber] = useState("");
    const [description, setDescription] = useState("");
    const [documentationType, setDocumentationType] = useState("Meeting"); // Default to "Meeting"
    const [meetingLeader, setMeetingLeader] = useState("");
    const [discussionTitle, setDiscussionTitle] = useState("");
    const [personResponsible, setPersonResponsible] = useState("");
    const [furtherActions, setFurtherActions] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("Online");
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

    const handleAddPicture = () => {
        if (newPicture) {
            const objectUrl = URL.createObjectURL(newPicture);
            setPictures([...pictures, { file: newPicture, url: objectUrl }]);
    
            // Clear the file input after adding the picture
            setNewPicture(null);
            setFileName("");
        }
    };
    

    const handleAddDocumentation = async () => {
        try {
            const parsedTime = new Date(time);
    
            if (!user || !user.email) {
                throw new Error("User is not defined or user email is missing");
            }
    
            // Upload each picture to Firebase Storage and collect their URLs
            const pictureUrls = await Promise.all(
                pictures.map(async (picture) => {
                    const storageRef = ref(storage, `images/${picture.file.name}`);
                    const snapshot = await uploadBytes(storageRef, picture.file);
                    return getDownloadURL(snapshot.ref);
                })
            );
    
            // Add the main documentation data
            const docRef = await addDoc(collection(db, "documentation"), {
                title,
                nomor_undangan: invitationNumber,
                description,
                leader: meetingLeader, // Use the meetingLeader state
                place: location,
                time: parsedTime,
                attendanceList: attendees,
                results,
                pictures: pictureUrls, // Now contains URLs of the images from Firebase Storage
                type: documentationType, // Use the documentationType state
                writer: user.email,
                timestamp: parsedTime, // Use the parsed time as the timestamp
            });
    
            // Add each discussion detail to the discussionDetails collection
            await Promise.all(
                modalDiscussionDetails.map(async (detail) => {
                    await addDoc(collection(db, "discussionDetails"), {
                        discussionTitle: detail.discussionTitle,
                        personResponsible: detail.personResponsible,
                        furtherActions: detail.furtherActions,
                        deadline: new Date(detail.deadline),
                        docID: docRef.id, // Reference to the main documentation document
                    });
                })
            );
    
            alert("Documentation and discussion details added successfully!");
    
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

    const buttonStyle = css`
        padding: 10px;
        background-color: #49A8FF;
        color: white;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 15px;
        cursor: pointer;

        &:hover {
            background-color: #62b3fc;
        }
    `;

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
    `;

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
    `;

    const scheduleTopSideStyle = css`
        display: flex;
        gap: 30px;
        margin-top: 20px;
    `;

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
    `;

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
                        <p style={{ fontSize: "19px" }}>Main</p>
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
                                    <DropdownComponent
                                        selectedValue={documentationType}
                                        setSelectedValue={setDocumentationType}
                                        options={["Meeting", "Evaluation", "Discussion"]}
                                    />
                                </div>
                                <div className="inputDoc">
                                    <p>Meeting Leader</p>
                                    <input type="text" value={meetingLeader} onChange={(e) => setMeetingLeader(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="leftBottomContainer" >
                            <p className="header" style={{ marginBottom: "20px", fontSize: "19px" }}>Discussion</p>
                            <div className="discussionItem" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                <div className="item">
                                    <p>Details <span style={{ color: "#49A8FF" }}>({totalCounter})</span></p>
                                    <button css={buttonStyle} onClick={openDiscussionModal}>See or Add More</button>
                                    {discussionDetails.map((detail, index) => (
                                        <div key={index}>
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
                                    <p>Results <span style={{ color: "#49A8FF" }}>({results.length})</span></p>
                                    <button css={buttonStyle} onClick={openResultsModal}>See or Add more</button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="rightSide">
                        <div className="scheduleContainer">
                            <p>Schedule</p>
                            <div className="scheduleTopSide" css={scheduleTopSideStyle}>
                                <div className="typeContainer" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <p>Type</p>
                                    <DropdownComponent selectedValue={type} setSelectedValue={setType} options={["Online", "Onsite"]} />
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
                        <p className="header" style={{ marginBottom: "20px", fontSize: "19px" }}>Snapshot</p>
                        <div className="snapshotItemContainer" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                            <div className="item">
                                <p>Attendees <span style={{ color: "#49A8FF" }}>({attendees.length})</span></p>
                                <button css={buttonStyle} onClick={openAttendeeModal}>See or Add more</button>
                            </div>
                            <div className="item">
                                <p>Pictures <span style={{ color: "#49A8FF" }}>({pictures.length})</span></p>
                                <button css={buttonStyle} onClick={openPicturesModal}>See or Add more</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="addButtonContainer" css={{ textAlign: 'center', padding: "0px 50px 50px 50px"}}>
                    <button css={buttonStyle} style={{width: "300px"}} onClick={handleAddDocumentation}>Add Documentation</button>
                </div>
                
            </div>
            <AttendeeModal
                isAttendeeModalOpen={isAttendeeModalOpen}
                closeAttendeeModal={closeAttendeeModal}
                attendees={attendees}
                newAttendee={newAttendee}
                setNewAttendee={setNewAttendee}
                handleAddAttendee={handleAddAttendee}
                handleAttendeeChange={handleAttendeeChange}
                handleRemoveAttendee={handleRemoveAttendee}
            />
            <DiscussionModal
                isDiscussionModalOpen={isDiscussionModalOpen}
                closeDiscussionModal={closeDiscussionModal}
                discussionTitle={discussionTitle}
                setDiscussionTitle={setDiscussionTitle}
                personResponsible={personResponsible}
                setPersonResponsible={setPersonResponsible}
                furtherActions={furtherActions}
                setFurtherActions={setFurtherActions}
                deadline={deadline}
                setDeadline={setDeadline}
                modalDiscussionDetails={modalDiscussionDetails}
                handleAddDiscussionDetail={handleAddDiscussionDetail}
                handleEditDiscussionDetail={handleEditDiscussionDetail}
                handleDeleteDiscussionDetail={handleDeleteDiscussionDetail}
                isEditing={isEditing}
            />
            <ResultsModal
                isResultsModalOpen={isResultsModalOpen}
                closeResultsModal={closeResultsModal}
                results={results}
                newResult={newResult}
                setNewResult={setNewResult}
                handleAddResult={handleAddResult}
                handleResultChange={handleResultChange}
                handleRemoveResult={handleRemoveResult}
            />
            <PicturesModal
                isPicturesModalOpen={isPicturesModalOpen}
                closePicturesModal={closePicturesModal}
                pictures={pictures}
                newPicture={newPicture}
                fileName={fileName}
                setFileName={setFileName}
                handleAddPicture={handleAddPicture}
                handlePictureChange={handlePictureChange}
                handleRemovePicture={handleRemovePicture}
            />
        </main>
    );
}

export default AddNewDocumentationBox;
