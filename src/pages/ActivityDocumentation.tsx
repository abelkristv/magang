/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Ensure this line is uncommented to apply default styles
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import PrimaryButton from '../components/elementary/Button';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';  // Import the xlsx library

const ActivityDocumentation = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formCategory, setFormCategory] = useState('Log');
    const [formCompanyName, setFormCompanyName] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [companies, setCompanies] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showAllDocs, setShowAllDocs] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'documentation'));
                const docs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
                        writtenDate: data.writtenDate ? data.writtenDate.toDate() : null // Convert Firestore Timestamp to JavaScript Date
                    };
                });
                console.log(docs);
                setDocuments(docs);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'tempat_magang'));
                const companyList = querySnapshot.docs.map(doc => doc.data().name);
                setCompanies(companyList);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowAllDocs(false); // Reset showAllDocs when a date is selected
        const dateString = date.toISOString().split('T')[0];
        const filteredDocs = documents.filter(doc => doc.date.toISOString().split('T')[0] === dateString);
        setSelectedDocs(filteredDocs);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormTitle('');
        setFormContent('');
        setFormCategory('Log');
        setFormCompanyName('');
        setTimeStart('');
        setTimeEnd('');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentDateTime = new Date(); // Get the current date and time
            const newDoc = {
                documentation_title: formTitle,
                documentation_content: formContent,
                category: formCategory,
                company_name: formCategory === 'Company visit' ? formCompanyName : '',
                date: Timestamp.fromDate(selectedDate), // Use the selected date
                writtenDate: Timestamp.fromDate(currentDateTime), // Use the current date and time
                time_start: timeStart,
                time_end: timeEnd
            };
            await addDoc(collection(db, 'documentation'), newDoc);
            // Directly update the documents state
            const updatedDoc = {
                ...newDoc,
                date: selectedDate,
                writtenDate: currentDateTime
            };
            setDocuments(prevDocs => [...prevDocs, updatedDoc]);
            setSelectedDocs(prevDocs => [...prevDocs, updatedDoc]);
            closeModal();
            exportToExcel(updatedDoc); // Export the new document to Excel
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    const exportToExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet([data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Documentation');
        XLSX.writeFile(workbook, `documentation_${data.date.toISOString().split('T')[0]}.xlsx`);
    };

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #F5F5F5;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
    `;

    const calendarStyle = css`
        width: 100%;
        height: 100%;
        .react-calendar {
            width: 100%;
            height: 90%;
            border: none;
        }

        .react-calendar__viewContainer button {
            height: 50px;
            width: 50px;
            position: relative;
            &:hover {
                font-weight: bold;
                background: none;
                color: black;
            }
        }

        .react-calendar__tile--active abbr {
            background-color: #149dff;
            color: white;
            border-radius: 100%;
            z-index: 1;
            padding: 5px;

            &:hover {
                background-color: #149dff !important;
                color: white !important;
                border-radius: 100% !important;
            }
        }

        .react-calendar__tile--active {
            background: none !important;
        }

        .react-calendar__tile--now {
            background: none !important; /* Ensure the background is removed */
            color: inherit !important; /* Keep the text color unchanged */
        }
    `;

    const mainCardStyle = css`
        background-color: white;
        border: 1px solid #dbdbdb;
        padding: 20px 20px 20px 0px;
        box-sizing: border-box;
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: center;
    `;

    const cardLeftSideStyle = css`
        width: 20%;
        border-right: 1px solid #dbdbdb;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 24px 20px 24px;
        // margin-right: 40px;
        box-sizing: border-box;
    `;

    const cardRightSideStyle = css`
        width: 80%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `;

    const cardStyle = css`
        border-left: 3px solid #dbdbdb;
        padding: 30px 30px 5px 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        h3 {
            margin: 0px;
        }
    `;

    const cardContainer = css`
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        height: 700px;
    `;

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;

    const modalOverlay = css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const modalContent = css`
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
    `;

    const formGroup = css`
        margin-bottom: 20px;
    `;

    const inputStyle = css`
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        box-sizing: border-box;
    `;

    const selectStyle = css`
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        box-sizing: border-box;
    `;

    const buttonContainer = css`
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    `;

    const navigate = useNavigate();

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const docsForDate = documents.filter(doc => doc.date.toISOString().split('T')[0] === dateString);
            const logCount = docsForDate.filter(doc => doc.category === 'Log').length;
            const companyVisitCount = docsForDate.filter(doc => doc.category === 'Company visit').length;
            if (docsForDate.length > 0) {
                const indicatorColor = logCount >= companyVisitCount ? 'green' : '#FFA500';
                return <div css={css`${documentIndicator}; background-color: ${indicatorColor};`}></div>;
            }
        }
        return null;
    };

    const documentIndicator = css`
        height: 5px;
        width: 5px;
        border-radius: 50%;
        margin: 0 auto;
        position: absolute;
        top: 40px;
        left: 45%;
        z-index: 0;
    `;

    const tagStyle = css`
        display: flex;
        gap: 20px;
    `;

    const cardContentStyle = css`
        display: flex;
        width: 100%;
        align-items: center;
    `;

    const filterButtonContainerStyle = css`
        display: flex;
        justify-content: start;
        gap: 12px;
        margin-bottom: 20px;
    `;

    const filterButtonStyle = css`
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        background-color: white;
        color: black;
        font-size: 20px;
        cursor: pointer;
        border: 1px solid #dbdbdb;
        &:hover {
            background-color: #dbdbdb;
        }
    `;

    const selectedFilterButtonStyle = css`
        background-color: ${filter === "Log" ? "#21A34E" : filter === "Company visit" ? "#FFA500" : "#149dff"};
        color: white;
        &:hover {
            background-color: ${filter === "Log" ? "#21A34E" : filter === "Company visit" ? "#FFA500" : "#149dff"};
        }
    `;

    const filteredDocs = showAllDocs ? documents.filter(doc => filter === 'all' || doc.category === filter) : (filter === 'all' ? selectedDocs : selectedDocs.filter(doc => doc.category === filter));

    return (
        <>
            <main css={mainStyle}>
                <div className="main-card" css={mainCardStyle}>
                    <div className="left-side" css={cardLeftSideStyle}>
                        <div className="calendar-style" css={calendarStyle}>
                            <Calendar 
                                onChange={handleDateChange}
                                value={selectedDate}
                                tileContent={tileContent}
                            />
                        </div>
                        <PrimaryButton content={showAllDocs ? 'Show Selected Date' : 'Show All Documentation'} height={50} width={310} borderRadius='10px' onClick={() => setShowAllDocs(!showAllDocs)} />
                    </div>
                    <div className="right-side" css={cardRightSideStyle}>
                        <div className="header" css={headerStyle}>
                            <p style={{ marginBottom: "20px", fontSize: "30px", fontWeight:"600" }}>{selectedDate.toDateString()}</p>
                            <PrimaryButton content='Back To Dashboard' height={50} borderRadius='10px' onClick={() => navigate("/dashboard")} />
                        </div>
                        <div css={filterButtonContainerStyle}>
                            <button 
                                css={[filterButtonStyle, filter === 'all' && selectedFilterButtonStyle]}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button 
                                css={[filterButtonStyle, filter === 'Log' && selectedFilterButtonStyle]}
                                onClick={() => setFilter('Log')}
                            >
                                Log
                            </button>
                            <button 
                                css={[filterButtonStyle, filter === 'Company visit' && selectedFilterButtonStyle]}
                                onClick={() => setFilter('Company visit')}
                            >
                                Company Visit
                            </button>
                        </div>
                        <div className="card-container" css={cardContainer}>
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map(doc => (
                                    <div key={doc.id} css={cardStyle}>
                                        <div className="content" css={cardContentStyle}>
                                            <div className="left-side" style={{width: "70%", fontSize: "20px"}}>
                                                <h3>{doc.documentation_title}</h3>
                                                <p>{doc.documentation_content}</p>
                                                <p>Written on: {new Date(doc.writtenDate).toLocaleString()}</p>
                                                {showAllDocs && <p>Date: {new Date(doc.date).toDateString()}</p>}
                                            </div>
                                            <div className="right-side" style={{width: "30%", fontWeight: "bold", textAlign: "right", fontSize: "20px"}}>
                                                {doc.category === "Company visit" && doc.company_name && (
                                                <p style={{fontSize: "30px"}}>{doc.company_name}</p>
                                                )}
                                                <p style={{fontWeight: "400"}}>{doc.time_start} - {doc.time_end}</p>
                                            </div>
                                        </div>
                                        <div className="tag" css={tagStyle}>
                                            <p css={doc.category === "Log" ? 
                                                        {backgroundColor: "#21a34e", marginTop: "20px", color: "white", padding: "5px", width: "50px", textAlign: "center", borderRadius: "10px" } : 
                                                        {backgroundColor: "#ffa500", marginTop: "20px", color: "white", padding: "5px", width: "120px", textAlign: "center", borderRadius: "10px" } }>{doc.category}</p>
                                            
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No documentation available for this date.</p>
                            )}
                        </div>
                        
                        <PrimaryButton content='Add New Documentation' height={50} borderRadius='10px' onClick={openModal} />
                    </div>
                </div>
            </main>
            {isModalOpen && (
                <div css={modalOverlay} onClick={closeModal}>
                    <div css={modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Documentation</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div css={formGroup}>
                                <label>Documentation Title</label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Documentation Content</label>
                                <textarea
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Category</label>
                                <select
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    css={selectStyle}
                                    required
                                >
                                    <option value="Log">Log</option>
                                    <option value="Company visit">Company visit</option>
                                </select>
                            </div>
                            {formCategory === 'Company visit' && (
                                <div css={formGroup}>
                                    <label>Company Name</label>
                                    <select
                                        value={formCompanyName}
                                        onChange={(e) => setFormCompanyName(e.target.value)}
                                        css={selectStyle}
                                        required
                                    >
                                        <option value="">Select a company</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company}>{company}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div css={formGroup}>
                                <label>Time Start</label>
                                <input
                                    type="time"
                                    value={timeStart}
                                    onChange={(e) => setTimeStart(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={formGroup}>
                                <label>Time End</label>
                                <input
                                    type="time"
                                    value={timeEnd}
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div css={buttonContainer}>
                                <PrimaryButton content='Cancel' height={50} borderRadius='10px' onClick={closeModal} />
                                <PrimaryButton content='Submit' height={50} borderRadius='10px' type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActivityDocumentation;
