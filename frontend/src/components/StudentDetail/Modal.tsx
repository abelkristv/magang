/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState, FC, FormEvent } from "react";
import SuccessPopup from "../Elementary/SuccessPopup";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        timeStart: string;
        timeEnd: string;
        description: string;
        place: string;
        date: string;
        meetingType: string;
        studentReportId: string;
    }) => void;
    studentReportId: string; 
    setVisible: (value: boolean) => void;
}


const Modal: FC<ModalProps> = ({ isOpen, onClose, onSubmit, studentReportId, setVisible }) => {
    const [timeStart, setTimeStart] = useState<string>('');
    const [timeEnd, setTimeEnd] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [meetingType, setMeetingType] = useState<string>('online'); // New state for meeting type
    const modalRef = useRef<HTMLDivElement>(null);

    const [dateError, setDateError] = useState<string>('');
    const [timeStartError, setTimeStartError] = useState<string>('');
    const [timeEndError, setTimeEndError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');
    const [placeError, setPlaceError] = useState<string>('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setTimeEnd('')
                setTimeStart('')
                setDescription('')
                setPlace('')
                setDate('')
                setError('')
                setDateError('')
                setTimeStartError('')
                setTimeEndError('')
                setDescriptionError('')
                setPlaceError('')
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setError('');
        setDateError('');
        setTimeStartError('');
        setTimeEndError('');
        setDescriptionError('');
        setPlaceError('');
    
        let hasError = false;
    
        const currentDate = new Date();
        const selectedDate = new Date(date);
        if (!date) {
            setDateError('Date is required.');
            hasError = true;
        } else if (selectedDate < currentDate) {
            setDateError('Date cannot be in the past.');
            hasError = true;
        }
    
        if (!timeStart) {
            setTimeStartError('Start time is required.');
            hasError = true;
        }
        if (!timeEnd) {
            setTimeEndError('End time is required.');
            hasError = true;
        }
    
        const start = new Date(`1970-01-01T${timeStart}:00`);
        const end = new Date(`1970-01-01T${timeEnd}:00`);
    
        if (timeStart && timeEnd) {
            if (end < start) {
                setTimeEndError('End time cannot be earlier than start time.');
                hasError = true;
            }
        }
    
        if (!description.trim()) {
            setDescriptionError('Description is required.');
            hasError = true;
        }
    
        if (!place.trim()) {
            setPlaceError('Place or Zoom Link is required.');
            hasError = true;
        } else if (meetingType === 'online') {
            const zoomUrlRegex = /^https:\/\/(www\.)?zoom\.us\/[a-zA-Z0-9/?=&_.-]+$/;
            if (!zoomUrlRegex.test(place)) {
                setPlaceError('Please provide a valid Zoom URL.');
                hasError = true;
            }
        }
    
        if (hasError) return;
    
        setError('');
        onSubmit({ timeStart, timeEnd, description, place, date, meetingType, studentReportId });
        setTimeEnd('');
        setTimeStart('');
        setDescription('');
        setPlace('');
        setDate('');
        setMeetingType('online');
        setTimeout(() => {
            setVisible(false);
        }, 5000);
        onClose();
    };
    

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
        width: 650px;
        display: flex;
        flex-direction: column;
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

    const buttonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #68b5fc;
        }
    `;

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;

        p {
            text-align: start;
            font-size: 17px;
        }
    `

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        background-color: #F0ECEC;

        border-radius: 10px 10px 0px 0px;

        .headerp {
            margin-bottom: 0px;
        }
    `;

    const closeButtonStyle = css`
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888;
        margin-right: 5px;
    `;

    const errorStyle = css`
        color: red;
        text-align: center;
    `;

    const handleButtonClose = () => {
        setTimeEnd('')
        setTimeStart('')
        setDescription('')
        setPlace('')
        setDate('')
        setError('')
        console.log(dateError)
        setDateError('')
        setTimeStartError('')
        setTimeEndError('')
        setDescriptionError('')
        setPlaceError('')
        onClose()
    }
    
    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Schedule a meeting</p>
                    <Icon icon="mdi:close" onClick={handleButtonClose} fontSize={20} color="#51587E" css={closeButtonStyle} />
                </div>
                <div css={formStyle}>
                    <div className="dateContainer" style={{display: "flex", justifyContent:"space-between"}}>
                        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                            <p>Date</p>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                css={inputStyle}
                                style={{width:"15rem", fontSize:"15px"}}
                                // required
                            />
                            {dateError && <p css={errorStyle} style={{fontSize:"13px"}}>{dateError}</p>}
                        </div>
                        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                            <p>Meeting Type</p>
                            <select
                                value={meetingType}
                                onChange={(e) => setMeetingType(e.target.value)}
                                css={inputStyle}
                                style={{width:"20.5rem", fontSize:"15px"}}
                                // required
                            >
                                <option value="online" style={{fontSize:"15px"}}>Online</option>
                                <option value="onsite" style={{fontSize:"15px"}}>Onsite</option>
                            </select>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent:"space-between", alignItems:"start", marginTop:"9px"}}>
                        <div className="timeContainer">
                            <p>Period</p>
                            <div className="timeChooserContainer" style={{display: "flex", flexDirection:"column", gap: "3px", marginTop:"10px"}}>
                                <div className="startTime" style={{display: "flex", gap: "20px", alignItems: "center"}}>
                                    <p style={{fontSize:"15px", width:"auto"}}>Start</p>
                                    <input
                                        type="time"
                                        placeholder="Start Time"
                                        value={timeStart}
                                        onChange={(e) => setTimeStart(e.target.value)}
                                        css={inputStyle}
                                        style={{width:"11.55rem", fontSize:"15px"}}
                                        // required
                                    />
                                </div>
                                {timeStartError && <p css={errorStyle} style={{fontSize:"13px", marginBottom:"10px", marginTop:"3px", marginLeft:"55px"}}>{timeStartError}</p>}
                                
                                <div className="endTime" style={{display: "flex", gap: "20px", alignItems: "center", marginTop:"3px"}}>
                                    <p style={{fontSize:"15px", width:"35px"}}>End</p>
                                    <input
                                        type="time"
                                        placeholder="End Time"
                                        value={timeEnd}
                                        onChange={(e) => setTimeEnd(e.target.value)}
                                        css={inputStyle}
                                        style={{width:"11.55rem", fontSize:"15px"}}
                                        // required
                                    />
                                </div>
                                {timeEndError && <p css={errorStyle} style={{fontSize:"13px", marginBottom:"10px", marginTop:"3px", marginLeft:"55px"}}>{timeEndError}</p>}
                                {error && <p css={errorStyle} style={{fontSize:"13px", marginTop:"8px"}}>{error}</p>}
                            </div>
                        </div>
                        <div className="descriptionContainer" style={{display: "flex", flexDirection: "column", width:"20.5rem"}}>
                            <p>Description</p>
                            <textarea
                                // placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                css={inputStyle}
                                style={{marginTop:"10px", fontSize:"15px", padding:"10px 12px", scrollbarWidth:"thin", resize:"none", height:"78px"}}
                                rows={4}
                                // required
                            />
                            {descriptionError && <p css={errorStyle} style={{fontSize:"13px", marginTop:"10px"}}>{descriptionError}</p>}
                        </div>
                    </div>
                    <div className="placeContainer" style={{display: "flex", flexDirection: "column", marginTop:"9px"}}>
                        <p>Place / Zoom Link</p>
                        <input
                            type="text"
                            // placeholder="Place / Zoom Link"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            css={inputStyle}
                            style={{marginTop:"10px", fontSize:"15px"}}
                            // required
                        />
                        {placeError && <p css={errorStyle} style={{fontSize:"13px", marginTop:"7px"}}>{placeError}</p>}
                    </div>
                    
                    <div style={{marginTop: "2.2rem", display:"flex", flexDirection:"column", alignItems:"center"}}>
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                            <button css={buttonStyle} onClick={handleSubmit}>
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
