/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState, useRef } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../../../helper/AuthProvider';
import ExcelJS from 'exceljs';import { saveAs } from 'file-saver';
import { fetchAllDocumentation } from "../../../controllers/DocumentationController";
import AttendanceTable from "./AttendanceTable";
import DiscussionDetails from "./DiscussionDetails";
import DiscussionResultsTable from "./DiscussionResultsTable";
import ImageGallery from "./ImageGallery";
import { fetchUser } from "../../../controllers/UserController";
import Documentation from "../../../model/Documentation";
import { Button } from "../Add New Documentation/AddNewDocumentationBox.styles";
import notFoundImage from "../../../assets/not_found.png";
import { fetchDiscussionDetails, fetchDiscussionsWithDetails } from "../../../controllers/DiscussionDetailController";
import { useNavigate } from "react-router-dom";
import JSZip from 'jszip';

interface DocumentationBoxProps {
    setGlobalActiveTab: (tabName: string) => void;
}

const DocumentationBox: React.FC<DocumentationBoxProps> = ({ setGlobalActiveTab }) => {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedButton, setSelectedButton] = useState<string>('All');
    const [documentations, setDocumentations] = useState<Documentation[]>([]);
    const [filteredDocumentations, setFilteredDocumentations] = useState<Documentation[]>([]);
    const [selectedDocumentation, setSelectedDocumentation] = useState<Documentation | null>(null);
    const [activeTab, setActiveTab] = useState<string>('discussion');
    const [discussionDetails, setDiscussionDetails] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
    const [exportStartDate, setExportStartDate] = useState<string>('');
    const [exportEndDate, setExportEndDate] = useState<string>('');
    const [exportType, setExportType] = useState<string>('All');
    const [docDates, setDocDates] = useState<string[]>([]);
    const userAuth = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const documentation = await fetchAllDocumentation();
            if (documentation._tag === "Some") {
                setDocumentations(documentation.value);
    
                const docDates = documentation.value.map((doc: Documentation) => {
                    let docDate: Date;
    
                    if (doc.timestamp instanceof Date) {
                        docDate = doc.timestamp;
                    } else if (typeof doc.timestamp === 'string') {
                        docDate = new Date(doc.timestamp);
                    } else if (doc.timestamp && typeof (doc.timestamp as any).seconds === 'number') {
                        const firebaseTimestamp = doc.timestamp as { seconds: number, nanoseconds: number };
                        docDate = new Date(firebaseTimestamp.seconds * 1000);
                    } else {
                        console.error('Unknown timestamp format:', doc.timestamp);
                        return null; 
                    }
    
                    return docDate.toDateString();
                }).filter(date => date !== null) as string[];
    
                setDocDates(docDates);
            } else {
                setDocumentations([]);
            }
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
        const filteredDocs = documentations
            .filter(doc => {
                const docDate = new Date(doc.timestamp);
                return docDate.toDateString() === date.toDateString() && (selectedButton === 'All' || doc.type === selectedButton);
            })
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setFilteredDocumentations(filteredDocs);
    }, [date, selectedButton, documentations]);    

    useEffect(() => {
        if (selectedDocumentation && activeTab === 'discussion') {
            const loadDiscussionDetails = async () => {
                const details = await fetchDiscussionDetails(selectedDocumentation.id!);
                setDiscussionDetails(details);
            };
    
            loadDiscussionDetails();
        }
    }, [selectedDocumentation, activeTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

    useEffect(() => {
        if (filteredDocumentations.length > 0) {
            setSelectedDocumentation(filteredDocumentations[0]);
        } else {
            setSelectedDocumentation(null);
        }
    }, [filteredDocumentations]);

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
    };

    const handleDocItemClick = (doc: Documentation) => {
        setSelectedDocumentation(doc);
        setDiscussionDetails([]);
    };

    const formatDate = (timestamp?: Date | string | any) => {
        if (!timestamp) {
            return "Unknown Date";
        }
    
        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
    
        const dateObject = new Date(timestamp);
        if (!isNaN(dateObject.getTime())) {
            return dateObject.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
    
        if (timestamp.seconds) {
            const dateFromTimestamp = new Date(timestamp.seconds * 1000);
            return dateFromTimestamp.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
    
        return "Unknown Date";
    };
    
    const formatTime = (timestamp?: Date | string | any) => {
        if (!timestamp) {
            return "Unknown Time";
        }
    
        if (timestamp instanceof Date) {
            return timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
    
        const dateObject = new Date(timestamp);
        if (!isNaN(dateObject.getTime())) {
            return dateObject.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
    
        if (timestamp.seconds) {
            const dateFromTimestamp = new Date(timestamp.seconds * 1000);
            return dateFromTimestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
    
        return "Unknown Time";
    };
    
    const downloadImages = async () => {
        if (!selectedDocumentation || !selectedDocumentation.pictures?.length) {
            console.error("No images to download");
            return;
        }
    
        const zip = new JSZip();
    
        selectedDocumentation.pictures.forEach((imageBase64, index) => {
            const imgData = imageBase64.split(',')[1]; // Remove the data URI scheme part
            zip.file(`image_${index + 1}.png`, imgData, { base64: true });
        });
    
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${selectedDocumentation.title}_images.zip`);
        } catch (error) {
            console.error("Error generating zip file: ", error);
        }
    };
    

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const openExportModal = () => setIsExportModalOpen(true);
    const closeExportModal = () => setIsExportModalOpen(false);

    const exportToExcel = async () => {
        const startDate = new Date(exportStartDate);
        const endDate = new Date(exportEndDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const filteredDocs = documentations.filter(doc => {
            let docDate: Date;
    
            if (doc.timestamp instanceof Date) {
                docDate = doc.timestamp;
            } 
            else if (doc.timestamp && typeof (doc.timestamp as any).seconds === 'number') {
                const firebaseTimestamp = doc.timestamp as { seconds: number, nanoseconds: number };
                docDate = new Date(firebaseTimestamp.seconds * 1000);
            } 
            else if (typeof doc.timestamp === 'string') {
                docDate = new Date(doc.timestamp);
            } 
            else {
                console.error('Unknown timestamp format:', doc.timestamp);
                return false; 
            }
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
            'Leader',
            'Place',
            'Date',
            'Time',
            'Type',
            'Discussion Details',
            'Attendance List'
        ];
    
        const data = await fetchDiscussionsWithDetails(filteredDocs);
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Documentation');
    
        worksheet.addRows(summaryData);
    
        worksheet.addRow(headers);
        worksheet.getRow(summaryData.length + 1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    
        data.forEach((doc) => {
            const rowIndex = worksheet.lastRow!.number + 1;
            const attendanceList = doc.attendanceList;
            const discussionDetails = doc.discussionDetails.split(', '); // Assuming discussionDetails are comma-separated
    
            const numRows = Math.max(attendanceList.length, discussionDetails.length, 1);
    
            const columnsToMerge = ['A', 'B', 'C', 'D', 'E', 'F'];
    
            columnsToMerge.forEach((col) => {
                if (!worksheet.getCell(`${col}${rowIndex}`).isMerged) {
                    worksheet.mergeCells(`${col}${rowIndex}:${col}${rowIndex + numRows - 1}`);
                }
            });
    
            worksheet.getCell(`A${rowIndex}`).value = doc.title;
            worksheet.getCell(`B${rowIndex}`).value = doc.leader;
            worksheet.getCell(`C${rowIndex}`).value = doc.place;
            worksheet.getCell(`D${rowIndex}`).value = doc.date;
            worksheet.getCell(`E${rowIndex}`).value = doc.time;
            worksheet.getCell(`F${rowIndex}`).value = doc.type;
    
            if (discussionDetails.length === 1) {
                if (!worksheet.getCell(`G${rowIndex}`).isMerged) {
                    worksheet.mergeCells(`G${rowIndex}:G${rowIndex + numRows - 1}`);
                }
                worksheet.getCell(`G${rowIndex}`).value = discussionDetails[0];
            } else if (discussionDetails.length > 1) {
                discussionDetails.forEach((detail: string, i: number) => {
                    worksheet.getCell(`G${rowIndex + i}`).value = detail;
                });
            } else {
                worksheet.getCell(`G${rowIndex}`).value = '';
            }
    
            if (attendanceList.length > 1) {
                attendanceList.forEach((attendee: string, i: number) => {
                    worksheet.getCell(`H${rowIndex + i}`).value = attendee;
                });
            } else {
                if (!worksheet.getCell(`H${rowIndex}`).isMerged) {
                    worksheet.mergeCells(`H${rowIndex}:H${rowIndex + numRows - 1}`);
                }
                worksheet.getCell(`H${rowIndex}`).value = attendanceList[0] || '';
            }
    
            for (let i = rowIndex; i < rowIndex + numRows; i++) {
                worksheet.getRow(i).eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            }
        });
    
        worksheet.columns.forEach(column => {
            if (column && typeof column.eachCell === 'function') { 
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellLength = cell.value ? cell.value.toString().length : 10;
                    if (cellLength > maxLength) {
                        maxLength = cellLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
            }
        });
        
    
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'documentation.xlsx');
    
        closeExportModal();
    };



    

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortArrow = (field: string) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const sortedAttendanceList = selectedDocumentation?.attendanceList.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a > b ? 1 : -1;
        } else {
            return a < b ? 1 : -1;
        }
    }); 

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
            font-weight: 300;
        }
    `;

    const contentBoxStyle = css`
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        .leftSide {
            width: 76%;
        }

        .rightSide {
            width: 22%;
        }
    `;

    
    const calendarStyle = css`
        border: none;
        line-height: 1.125em;
        font-size: 16px;
        top: 0;

        button {
            margin: 0px !important;
            padding: 0px !important;
        }

        abbr{
            z-index: 2;
        }

        .react-calendar__navigation {
            box-sizing: unset;
            border-top: 2px solid #dedede;
            border-bottom: 2px solid #dedede;
        }

        .react-calendar__tile {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            text-align: center;
        }

        .react-calendar__tile--now {
            background: white !important;
        }

        .react-calendar__tile:hover {
            font-weight: 700;
        }

        .react-calendar__tile--active {
            color: white !important;
            background: none !important;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            position: relative;
            padding: 0px !important;
        }

        .react-calendar__tile--active:hover {
            font-weight: 400;
        }

        .react-calendar__navigation__label__labelText {
            font-size: 17px;
            color: #828282;
        }

        .react-calendar__navigation__arrow {
            font-size: 24px;
            font-weight: 200;
        }

        .react-calendar__month-view__weekdays__weekday {
            text-decoration: none;
        }

        .react-calendar__year-view__months__month:hover {
            background-color: #e6e6e6;
        }
    
        .react-calendar__year-view__months__month .docDatesActive {
            visibility: hidden;
        }

        .react-calendar__month-view__days__day:nth-of-type(7n+6) {
            color: black;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
            cursor: default;
        }
    `;




    const buttonGridStyle = css`
        display: grid;
        grid-template-columns: 0.45fr 0.9fr 1.1fr 1.1fr;
        margin-top: 20px;
        border: 1px solid #49A8FF;
        border-radius: 5px;
        width: 100%;

        button {
            font-size: 15px;
            font-weight: 400;
            padding: 7px;
            border: none;
            background-color: white;
            color: #49A8FF;
            cursor: pointer;

            &.active {
                background-color: #49A8FF;
                color: white;

                &:hover {
                    background-color: #49A8FF;
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
        width: 100%;
        height: 100%;
        max-height: 395px;
        height: 505px;
        overflow-y: auto;
        scrollbar-width: thin;

        .docItem {
            padding: 10px;
            border: 1px solid #dbdbdb;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 1px #dbdbdb;
            background-color: white;
            text-align: start;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 5px;

            &:hover {
                background-color: #f0f0f0;
            }

            .leaderContainer{
                display: grid;
                grid-template-columns: 0.05fr 1fr;
            }

            .footer{
                display: flex;
                justify-content: space-between;
                color: #49A8FF;
                font-size: 14px;
                font-style: italic;
                .footer-time{
                    color: #ACACAC;
                    font-weight: 600;
                }
            }

        }
    `;

    const docDetailBoxStyle = css`
        padding: 15px 30px;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        background-color: white;
        position: relative;
        margin-top: 0px;
        box-shadow: 0px 0px 5px 1px #dbdbdb;
        height: 727px;

        .decoBox {
            width: 34px;
            height: 34px;
            background-color: #F0ECEC;
            border-radius: 100% 100% 0% 100%;
            position: absolute;
            top: -20px;
            left: -20px;
        }

        h2 {
            margin: 0px;
        }
        p {
            text-align: start;
        }
    `;

    const tabContainerStyle = css`
        display: flex;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        
        .tab {
            cursor: pointer;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            color: #9C9C9C;
            font-weight: 500;
            font-size: 16px;
            position: relative;

            &:hover {
                color: #8C8C8C;
            }

            &.active {
                color: black;
                font-weight: 600;
                background-color: white;
                border-bottom: 1px solid #49A8FF;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #49A8FF;
                }
            }
        }

        div{
            div{
                border-bottom: 1px solid #9C9C9C;
            }
        }
    `;


    const tabContentStyle = css`
        border-top: none;
        border-radius: 0 0 5px 5px;
        margin-top: 12px;        
    `;

    const buttonContainerStyle = css`
        width: 100%;
        display: flex;
        justify-content: space-between;
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

        .rightSide {
            display: flex;

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
        width: 500px;
        display: flex;
        flex-direction: column;
    `;

    const exportModalContentStyle = css`
        display: flex;
        justify-content: space-between;
        
        .leftSide {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;
            fontSize: 15px;
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
        height: 50px;
        align-items: center;
        background-color: #F0ECEC;
        border-radius: 10px 10px 0px 0px;

        .headerp {
            margin-top: 0px;
            margin-left: 8px;
            background-color: #F0ECEC;
            border-radius: 5px;
            font-size: 20px;
            padding: 10px;
            box-sizing: border-box;
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
        margin-right: 8px;
    `;

    const exportButton = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px 20px;
        height: auto;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #68b5fc;
        }
    `

    const informationStyle = css`
        display: flex;
        flex-direction: column;
        width: 45%;
        margin-bottom: 10px;
    `

    const documentationTitleStyle = css`
        font-size: 19px;
        font-weight: 600;
    `

    const documentationInfoTitle = css`
        color: #51587E;
    `

    const documentationInfoContent = css`
        color: black;
        font-weight: 450;
    `

    const totalStyle = css`
        font-size: 25px;
        font-weight: 600;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 700px;
        img {
            height: 300px;
            width: 300px;
        }
        p{
            margin-top: 10px;
        }
    `;

    const popupHeaderStyle = css`
        font-size: 17px;
        margin-bottom: 13px;
    `;

    const inputStyle = css`
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
    `;

    const popupTypeStyle = css`
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 190px;
    `;

    const getDotColor = (docType: string) => {
        switch (docType) {
            case 'Meeting':
                return '#49A8FF';
            case 'Discussion':
                return '#FF9500';
            case 'Evaluation':
                return '#A024FF';
            default:
                return 'gray';
        }
    };

    const [selectedDate, setSelectedDate] = useState<Date|null>(new Date());
    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        const isActive = date.toDateString() === selectedDate?.toDateString();
        const visibility = isActive ? 'visible' : 'hidden';
    
        let dotColor = 'gray';
    
        if (view === 'month' && docDates.includes(date.toDateString())) {
            // find doc for current date
            const docForDate = documentations.find(doc => new Date(doc.timestamp).toDateString() === date.toDateString());
    
            if (docForDate) {
                dotColor = getDotColor(docForDate.type);
            }
    
            return (
                <div className="docDatesActive" style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: "0", marginTop: isActive ? '7px' : '37px' }}>
                    {isActive && (
                        <div className="dotDatesBlueCircle" style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#49A8FF',
                            borderRadius: '50%',
                            zIndex: 1,
                        }}> </div>
                    )}
                    <div className="docDatesDot" style={{
                        width: '6px',
                        height: '6px',
                        marginTop: "3px",
                        backgroundColor: dotColor,
                        borderRadius: '50%',
                        zIndex: 2,
                    }}></div>
                </div>
            );
        } else {
            return (
                <div className="docDatesActive" style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: "0", marginTop: "0px" }}>
                    {isActive && (
                        <div className="dotDatesBlueCircle" style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#49A8FF',
                            borderRadius: '50%',
                            zIndex: 1,
                        }}> </div>
                    )}
                </div>
            );
        }
    };
    

    const handleDateChange: CalendarProps['onChange'] = (value, event) => {
        if (value instanceof Date) {
            setDate(value);
            setSelectedDate(value);
        } else if (Array.isArray(value)) {
            if (value[0] instanceof Date) {
                setDate(value[0]);
                setSelectedDate(value[0]);
            }
        } else {
            setSelectedDate(null); // Handle other cases by setting null
        }
    };
    
    if (userRole === "Company") {
        return (
            <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>You Can't view this page</p>
            </div>
        </main>
        )
    }

    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Documentation</p>
            </div>
            <div className="contentBox" css={contentBoxStyle}>
                <div className="leftSide">
                    <div className="buttonContainer" css={buttonContainerStyle}>
                        <Button onClick={() => {
                            setGlobalActiveTab('Add New Documentation')
                            navigate("/workspaces/add-new-documentation")
                        }} style={{ marginTop: "0px", fontSize: "17px", fontWeight:"500", padding: "8px 20px 8px 20px", height:"45px" }}>
                            Add new documentation
                        </Button>
                        <div style={{display:"flex", gap:"13px"}}>
                            <Button onClick={openExportModal} style={{ marginTop: "0px", fontSize: "17px", fontWeight:"500", padding: "8px 20px 8px 20px", height:"45px" }}>Export to Excel</Button>
                            <Button onClick={downloadImages} style={{ marginTop: "0px", fontSize: "17px", fontWeight:"500", padding: "8px 20px 8px 20px", height:"45px" }}>Download pictures</Button>
                        </div>

                    </div>
                    <div className="box" css={docDetailBoxStyle}>
                        {/* <div className="decoBox">
                        </div> */}
                        {selectedDocumentation ? (
                            <div>
                                <p css={documentationTitleStyle} style={{textAlign:"center"}}>{selectedDocumentation.title}</p>
                                {/* <p>{selectedDocumentation.nomor_undangan}</p> */}
                                <div className="informationContainer" style={{display: "flex", gap: "75px", marginTop:"20px"}}>
                                    <div className="informationLeftSide" css={informationStyle}>
                                        <div className="itemContainer" style={{display: "grid", gridTemplateColumns: "0.4fr 1fr", alignItems:"start", marginBottom:"10px"}}>
                                            <div className="itemLeftSide" style={{display: "flex", alignItems: "center", gap: "17px"}}>
                                                <Icon icon={"fluent-mdl2:party-leader"} fontSize={22} color="#51587E"/>
                                                <p css={documentationInfoTitle}>Leader</p>
                                            </div>
                                            <p css={documentationInfoContent}>{selectedDocumentation.leader}</p>
                                        </div>

                                        <div className="itemContainer" style={{display: "grid", gridTemplateColumns: "0.4fr 1fr", alignItems:"start"}}>
                                            <div className="itemLeftSide" style={{display: "flex", alignItems: "center", gap: "17px"}}>
                                                <Icon icon={"mdi:filter-outline"} fontSize={22} color="#51587E"/>
                                                <p css={documentationInfoTitle}>Type</p>
                                            </div>
                                            <p css={documentationInfoContent}>{selectedDocumentation.type}</p>
                                        </div>
                                    </div>
                                    <div className="informationRightSide" css={informationStyle}>
                                        <div className="itemContainer" style={{display: "grid", gridTemplateColumns: "0.4fr 1fr", alignItems:"start", marginBottom:"10px"}}>
                                            <div className="itemLeftSide" style={{display: "flex", alignItems: "center", gap: "17px"}}>
                                                <Icon icon={"clarity:date-line"} fontSize={22} color="#51587E"/>
                                                <p css={documentationInfoTitle}>Date</p>
                                            </div>
                                            <p css={documentationInfoContent}>{formatDate(selectedDocumentation.timestamp)}</p>
                                        </div>
                                        <div className="itemContainer" style={{display: "grid", gridTemplateColumns: "0.4fr 1fr", alignItems:"start"}}>
                                            <div className="itemLeftSide" style={{display: "flex", alignItems: "center", gap: "17px"}}>
                                                <Icon icon={"mingcute:time-line"} fontSize={22} color="#51587E"/>
                                                <p css={documentationInfoTitle}>Time</p>
                                            </div>
                                            <p css={documentationInfoContent}>{formatTime(selectedDocumentation.timestamp)}</p>
                                        </div>
                                        <div className="itemContainer" style={{display: "grid", gridTemplateColumns: "0.4fr 1fr", alignItems:"start"}}>
                                            {/* Placeholder for spacing */}
                                        </div>
                                    </div>
                                </div>
                                <div className="itemContainer" style={{display:"flex", marginTop:"0px"}}>
                                    <div className="itemLeftSide" style={{display: "flex", alignItems: "center", gap: "17px", width:"12.8%"}}>
                                        <Icon icon={"ic:outline-place"} fontSize={22} color="#51587E"/>
                                        <p css={documentationInfoTitle}>Place</p>
                                    </div>
                                    <p css={documentationInfoContent} style={{width:"84%"}}>{selectedDocumentation.place}</p>
                                </div>
                                
                                {/* <p style={{marginTop: "20px"}}>{selectedDocumentation.description}</p> */}

                                <div className="tabs" css={tabContainerStyle}>
                                    <div style={{display:"flex"}}>
                                        <div
                                            className={`tab ${activeTab === 'discussion' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('discussion')}
                                        >
                                            Discussion Details
                                        </div>
                                        <div
                                            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('results')}
                                        >
                                            Discussion Results
                                        </div>
                                        <div
                                            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('attendance')}
                                        >
                                            Attendance List
                                        </div>
                                        <div
                                            className={`tab ${activeTab === 'images' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('images')}
                                        >
                                            Images
                                        </div>
                                    </div>
                                </div>
                                <div className="tabContent" css={tabContentStyle}>
                                    {activeTab === 'discussion' ? (
                                        <DiscussionDetails discussionDetails={discussionDetails} formatDate={formatDate} />
                                    ) : activeTab === 'attendance' ? (
                                        <AttendanceTable
                                            sortedAttendanceList={sortedAttendanceList || []}
                                            handleSort={handleSort}
                                            getSortArrow={getSortArrow}
                                        />
                                    ) : activeTab === 'images' ? (
                                        <ImageGallery images={selectedDocumentation.pictures || []} />
                                    ) : (
                                        <DiscussionResultsTable results={selectedDocumentation.results || []} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div css={totalStyle}>
                                <img src={notFoundImage} alt="" />
                                <p>No documentation selected</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="rightSide">
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        css={calendarStyle}
                        tileContent={tileContent}
                    />
                    <div className="buttonGrid" css={buttonGridStyle}>
                        <button
                            className={selectedButton === 'All' ? 'active' : ''}
                            style={{borderRadius:"5px 0px 0px 5px"}}
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
                            style={{borderRadius:"0px 5px 5px 0px"}}
                            onClick={() => handleButtonClick('Evaluation')}
                        >
                            Evaluation
                        </button>
                    </div>
                    <div className="documentationList" css={documentationListStyle}>
                        {filteredDocumentations.length > 0 ? (
                            filteredDocumentations.map(doc => (
                                <div key={doc.id} className="docItem" onClick={() => handleDocItemClick(doc)}>
                                    <p style={{fontWeight: "600", fontSize: "15px"}}>{doc.title}</p>
                                    {/* <p>{doc.nomor_undangan}</p> */}
                                    <div className="leaderContainer" style={{ gap: "13px", color:"#51587E"  }}>
                                        <Icon icon={"fluent-mdl2:party-leader"} fontSize={15} fontWeight={100} style={{marginTop:"5px"}}/>
                                        <p style={{fontSize:"14px"}}>{doc.leader}</p>
                                    </div>
                                    <div className="footer">
                                        <p>{doc.type}</p>
                                        <p className="footer-time">{formatTime(doc.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{display:"flex", justifyContent:"center", marginTop:"9rem", fontWeight:"600", fontSize:"18px"}}>No documentation found</p>
                        )}
                    </div>
                </div>
            </div>
            {isExportModalOpen && (
                <div css={modalStyle}>
                    <div css={modalContentStyle} ref={modalRef}>
                        <div className="modalHeader" css={modalHeaderStyle}>
                            <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Export to Excel</p>
                            <Icon icon="mdi:close" onClick={closeExportModal} fontSize={20} color="#51587E" css={closeButtonStyle} />
                        </div>
                        <div className="exportModalContent" css={exportModalContentStyle}>
                            <div className="leftSide">
                                <p css={popupHeaderStyle}>Period</p>
                                <div className="periodGrid" style={{display: "flex", alignItems: "center", gap: "10px", fontSize:"15px", justifyContent:"space-between"}}>
                                    <p style={{width:"40px"}}>Start</p>
                                    <input 
                                        type="date" 
                                        value={exportStartDate}
                                        onChange={(e) => setExportStartDate(e.target.value)}
                                        css={inputStyle}
                                        style={{width:"165px", fontSize:"15px"}}
                                        required
                                    />
                                </div>
                                <div className="periodGrid" style={{display: "flex", alignItems: "center", gap: "10px", fontSize:"15px", justifyContent:"space-between", marginTop:"9px"}}>
                                    <p style={{width:"40px"}}>End</p>
                                    <input
                                        type="date" 
                                        value={exportEndDate}
                                        onChange={(e) => setExportEndDate(e.target.value)}
                                        css={inputStyle}
                                        style={{width:"165px", fontSize:"15px"}}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="rightSide">
                                <p css={popupHeaderStyle}>Type</p>
                                <select css={popupTypeStyle} value={exportType} onChange={e => setExportType(e.target.value)}>
                                    <option value="All">All</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Discussion">Discussion</option>
                                    <option value="Evaluation">Evaluation</option>
                                </select>
                            </div>
                        </div>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginBottom:"20px", marginTop:"23px"}}>
                            <button onClick={exportToExcel} css={exportButton}>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default DocumentationBox;
