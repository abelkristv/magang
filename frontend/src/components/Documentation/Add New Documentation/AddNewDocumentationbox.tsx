/** @jsxImportSource @emotion/react */
import { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from '../../../helper/AuthProvider';
import { fetchUser } from '../../../controllers/UserController';
import User from "../../../model/User";
import DropdownComponent from "../DocumentationBox/DropdownComponent";
import AttendeeModal from "./Modal/AttendeeModal";
import DiscussionModal from "./Modal/DiscussionModal";
import ResultsModal from "./Modal/ResultsModal";
import PicturesModal from "./Modal/PicturesModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, ContentContainer, ContentSide, DocumentationMeeting, ErrorText, Header, HeaderGrid, LocationContainer, MainContainer, NavSide, RequiredLabel, ScheduleTopSide, TimeContainer, TitleContainer } from "./AddNewDocumentationBox.styles";
import { addDocumentation, fetchAllDocumentation } from '../../../controllers/DocumentationController';
import Documentation from '../../../model/Documentation';
import Compressor from 'compressorjs';
import { fetchDiscussionDetails } from '../../../controllers/DiscussionDetailController';

interface DiscussionDetail {
    discussionTitle: string;
    personResponsible: string;
    furtherActions: string;
    deadline: string; 
}

interface Picture {
    file: File;
    url: string;
}

const AddNewDocumentationBox: React.FC = () => {
    const [date, _setDate] = useState<Date>(new Date());
    const [selectedButton, _setSelectedButton] = useState<string>('All');
    const [documentations, setDocumentations] = useState<any[]>([]);
    const [_filteredDocumentations, setFilteredDocumentations] = useState<any[]>([]);
    const [selectedDocumentation, _setSelectedDocumentation] = useState<any | null>(null);
    const [activeTab, _setActiveTab] = useState<string>('discussion');
    const [discussionDetails, setDiscussionDetails] = useState<DiscussionDetail[]>([]);
    const [_userRole, setUserRole] = useState<string | null>(null);
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState<boolean>(false);
    const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState<boolean>(false);
    const [modalDiscussionDetails, setModalDiscussionDetails] = useState<DiscussionDetail[]>([]);
    const [attendees, setAttendees] = useState<string[]>([]);
    const [newAttendee, setNewAttendee] = useState<string>(""); 
    const [results, setResults] = useState<string[]>([]);
    const [newResult, setNewResult] = useState<string>(""); 
    const [totalCounter, setTotalCounter] = useState<number>(0); 
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [newPicture, setNewPicture] = useState<File | null>(null); 
    const [isPicturesModalOpen, setIsPicturesModalOpen] = useState<boolean>(false);
    const userAuth = useAuth();

    const [title, setTitle] = useState<string>("");
    const [invitationNumber, setInvitationNumber] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [documentationType, setDocumentationType] = useState<string>("Meeting"); 
    const [meetingLeader, setMeetingLeader] = useState<string>("");
    const [discussionTitle, setDiscussionTitle] = useState<string>("");
    const [personResponsible, setPersonResponsible] = useState<string>("");
    const [furtherActions, setFurtherActions] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [type, setType] = useState<string>("Online");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [user, setUser] = useState<User | undefined>();

    const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);

    const [fileName, setFileName] = useState<string>("");

    // Error states
    const [titleError, setTitleError] = useState<string>("");
    const [documentationTypeError, setDocumentationTypeError] = useState<string>("");
    const [meetingLeaderError, setMeetingLeaderError] = useState<string>("");
    const [timeError, setTimeError] = useState<string>("");
    const [locationError, setLocationError] = useState<string>("");

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
            const docsCollection = await fetchAllDocumentation();
            let docs: Documentation[];
            if (docsCollection._tag == "None") {
                console.log("Failed to fetch documentation");
                docs = []
            } else {
                docs = docsCollection.value;
            }
            setDocumentations(docs);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserRole = async () => {
            const user = await fetchUser(userAuth?.currentUser?.email!);
            if (user._tag === "Some") {
                setUserRole(user.value.role);
            } else {
                setUserRole(null);
            }
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
        const loadDiscussionDetails = async () => {
            if (selectedDocumentation && activeTab === 'discussion') {
                const details = await fetchDiscussionDetails(selectedDocumentation.id!);
                setDiscussionDetails(details);
            }
        };

        loadDiscussionDetails();
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
            setNewAttendee(""); 
        }
    };

    const handleAttendeeChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newAttendees = [...attendees];
        newAttendees[index] = event.target.value;
        setAttendees(newAttendees);
    };

    const handleRemoveAttendee = (index: number) => {
        const newAttendees = [...attendees];
        newAttendees.splice(index, 1);
        setAttendees(newAttendees);
    };

    const handleAddDiscussionDetail = () => {
        if (isEditing && editingIndex !== null) {
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

    const handleEditDiscussionDetail = (index: number) => {
        const detail = modalDiscussionDetails[index];
        setDiscussionTitle(detail.discussionTitle);
        setPersonResponsible(detail.personResponsible);
        setFurtherActions(detail.furtherActions);
        setDeadline(detail.deadline);
        setIsEditing(true);
        setEditingIndex(index);
        openDiscussionModal();
    };

    const handleDeleteDiscussionDetail = (index: number) => {
        const updatedDetails = [...modalDiscussionDetails];
        updatedDetails.splice(index, 1);
        setModalDiscussionDetails(updatedDetails);
        setTotalCounter(totalCounter - 1);
    };

    // const storage = getStorage();

    const validateInputs = () => {
        let valid = true;

        if (!title.trim()) {
            setTitleError("Title is required");
            valid = false;
        } else {
            setTitleError("");
        }

        if (!documentationType.trim()) {
            setDocumentationTypeError("Documentation Type is required");
            valid = false;
        } else {
            setDocumentationTypeError("");
        }

        if (!meetingLeader.trim()) {
            setMeetingLeaderError("Meeting Leader is required");
            valid = false;
        } else {
            setMeetingLeaderError("");
        }

        if (!time.trim()) {
            setTimeError("Time is required");
            valid = false;
        } else {
            setTimeError("");
        }

        if (!location.trim()) {
            setLocationError("Location is required");
            valid = false;
        } else {
            setLocationError("");
        }

        return valid;
    };

    const handleAddPicture = () => {
        if (newPicture) {
            const objectUrl = URL.createObjectURL(newPicture);
            setPictures([...pictures, { file: newPicture, url: objectUrl }]);
    
            setNewPicture(null);
            setFileName("");
        }
    };
    
    
    const handleAddDocumentation = async () => {
        if (!validateInputs()) {
            return;
        }
    
        try {
            // Convert images to base64 strings
            
            const compressImage = (file: any) => {
                return new Promise((resolve, reject) => {
                    new Compressor(file, {
                        quality: 0.6, // Adjust quality to ensure the size is below 1 MB
                        maxWidth: 1920, // Optionally set max width to reduce size
                        maxHeight: 1080, // Optionally set max height to reduce size
                        success(result) {
                            resolve(result);
                        },
                        error(err) {
                            reject(err);
                        },
                    });
                });
            };
            
            const picturesBase64 = await Promise.all(
                pictures.map(async (picture) => {
                    const compressedFile: any = await compressImage(picture.file);
                    
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedFile);
                        reader.onload = () => {
                            if (typeof reader.result === "string") {
                                const base64 = reader.result.split(',')[1];
                                const sizeInBytes = (base64.length * (3/4)) - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
            
                                // if (sizeInBytes <= 1 * 1024 * 1024) { // Ensure size is less than 1 MB
                                    resolve(reader.result);
                                // } else {
                                //     reject(new Error("Compressed image size exceeds 1 MB."));
                                // }
                            } else {
                                reject(new Error("Failed to convert picture to base64."));
                            }
                        };
                        reader.onerror = (error) => reject(error);
                    });
                })
            );
            
            console.log("Pictures array:", picturesBase64);
    
            // Call the addDocumentation function that communicates with the backend API
            const result = await addDocumentation(
                user,
                title,
                invitationNumber,
                description,
                meetingLeader,
                location,
                time,
                attendees,
                results,
                picturesBase64.map((base64, index) => ({
                    fileName: pictures[index].file.name,
                    base64,
                })),
                documentationType,
                modalDiscussionDetails
            );
    
            if (result.success) {
                alert(result.message);
    
                // Reset all form fields after successful submission
                setTitle("");
                setInvitationNumber("");
                setDescription("");
                setDocumentationType("");
                setMeetingLeader("");
                setDiscussionTitle("");
                setPersonResponsible("");
                setFurtherActions("");
                setDeadline("");
                setLocation("");
                setTime("");
                setAttendees([]);
                setModalDiscussionDetails([]);
                setTotalCounter(0);
                setResults([]);
                setPictures([]);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error handling documentation addition: ", error);
            alert("Failed to add documentation. Please try again.");
        }
    };
    
    
    const handleAddResult = () => {
        if (newResult.trim() !== "") {
            setResults([...results, newResult]);
            setNewResult(""); 
        }
    };

    const handleResultChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newResults = [...results];
        newResults[index] = event.target.value;
        setResults(newResults);
    };

    const handleRemoveResult = (index: number) => {
        const newResults = [...results];
        newResults.splice(index, 1);
        setResults(newResults);
    };

    const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewPicture(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    const handleRemovePicture = (index: number) => {
        const newPictures = [...pictures];
        newPictures.splice(index, 1);
        setPictures(newPictures);
    };

    return (
        <MainContainer>
            <NavSide>
                <p>Add New Documentation</p>
            </NavSide>
            <ContentContainer>
                <Header>Add a documentation</Header>
                <ContentSide>
                    <div className="leftSide">
                        {/* <p style={{ fontSize: "19px" }}>Main</p> */}
                        <HeaderGrid>
                            <TitleContainer>
                                <div className="inputTitle">
                                    <RequiredLabel>
                                        {/* Title <span>*</span> */}
                                        Title
                                    </RequiredLabel>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                    {titleError && <ErrorText>{titleError}</ErrorText>}
                                </div>
                            </TitleContainer>
                            <DocumentationMeeting>
                                <div className="inputDoc">
                                    <RequiredLabel>
                                        {/* Documentation Type <span>*</span> */}
                                        Documentation Type
                                    </RequiredLabel>
                                    <DropdownComponent
                                        selectedValue={documentationType}
                                        setSelectedValue={setDocumentationType}
                                        options={["Meeting", "Evaluation", "Discussion"]}
                                    />
                                    {documentationTypeError && <ErrorText>{documentationTypeError}</ErrorText>}
                                </div>
                                <div className="inputDoc">
                                    <RequiredLabel>
                                        {/* Meeting Leader <span>*</span> */}
                                        Meeting Leader
                                    </RequiredLabel>
                                    <input type="text" value={meetingLeader} onChange={(e) => setMeetingLeader(e.target.value)} />
                                    {meetingLeaderError && <ErrorText>{meetingLeaderError}</ErrorText>}
                                </div>
                            </DocumentationMeeting>
                        </HeaderGrid>
                        <div className="leftBottomContainer" >
                            {/* <p className="header" style={{ marginBottom: "20px", fontSize: "19px" }}>Discussion</p> */}
                            <div className="discussionItem" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                                <div className="item">
                                    <p>Details <span style={{ color: "#49A8FF" }}>({totalCounter})</span></p>
                                    <Button onClick={openDiscussionModal}>See or Add More</Button>
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
                                    <Button onClick={openResultsModal}>See or Add more</Button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="rightSide">
                        <div className="scheduleContainer">
                            {/* <p style={{fontSize: "19px"}}>Schedule</p> */}
                            <ScheduleTopSide>
                                <div className="typeContainer" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <RequiredLabel>
                                        {/* Type <span>*</span> */}
                                        Type
                                    </RequiredLabel>
                                    <DropdownComponent selectedValue={type} setSelectedValue={setType} options={["Online", "Onsite"]} />
                                </div>
                                <TimeContainer>
                                    <RequiredLabel>
                                        {/* Time <span>*</span> */}
                                        Time
                                    </RequiredLabel>
                                    <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
                                    {timeError && <ErrorText>{timeError}</ErrorText>}
                                </TimeContainer>
                            </ScheduleTopSide>
                            <LocationContainer>
                                <RequiredLabel>
                                    {/* Location <span>*</span> */}
                                    Location
                                </RequiredLabel>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                                {locationError && <ErrorText>{locationError}</ErrorText>}
                            </LocationContainer>
                            
                        </div>
                        {/* <p className="header" style={{ marginBottom: "20px", fontSize: "19px", marginTop: "20px" }}>Snapshot</p> */}
                        <div className="snapshotItemContainer" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                            <div className="item">
                                <p>Attendees <span style={{ color: "#49A8FF" }}>({attendees.length})</span></p>
                                <Button onClick={openAttendeeModal}>See or Add more</Button>
                            </div>
                            <div className="item">
                                <p>Pictures <span style={{ color: "#49A8FF" }}>({pictures.length})</span></p>
                                <Button onClick={openPicturesModal}>See or Add more</Button>
                            </div>
                        </div>

                    </div>
                </ContentSide>
                <div css={{ textAlign: 'center', padding: "0px 50px 50px 50px"}}>
                    <Button style={{width: "300px"}} onClick={handleAddDocumentation}>Add Documentation</Button>
                </div>
                
            </ContentContainer>
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
        </MainContainer>
    );
}

export default AddNewDocumentationBox;
