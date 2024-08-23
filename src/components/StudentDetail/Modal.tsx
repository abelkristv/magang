/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit, studentReportId }) => {
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [meetingType, setMeetingType] = useState('online'); // New state for meeting type
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // time validation
        const start = new Date(`1970-01-01T${timeStart}:00`);
        const end = new Date(`1970-01-01T${timeEnd}:00`);

        if (end < start) {
            setError('End time cannot be earlier than start time.');
            return;
        }

        setError('');
        onSubmit({ timeStart, timeEnd, description, place, date, meetingType, studentReportId });
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
        width: 580px;
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
    

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Schedule a meeting</p>
                    <Icon icon="mdi:close" onClick={onClose} fontSize={20} color="#51587E" css={closeButtonStyle} />
                </div>
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div className="dateContainer" style={{display: "flex", justifyContent:"space-between"}}>
                        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                            <p>Date</p>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                css={inputStyle}
                                style={{width:"14.3rem", fontSize:"15px"}}
                                required
                            />
                        </div>
                        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                            <p>Meeting Type</p>
                            <select
                                value={meetingType}
                                onChange={(e) => setMeetingType(e.target.value)}
                                css={inputStyle}
                                style={{width:"15.4rem", fontSize:"15px"}}
                                required
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
                                        style={{width:"10.9rem", fontSize:"15px"}}
                                        required
                                    />
                                </div>
                                <div className="endTime" style={{display: "flex", gap: "20px", alignItems: "center", marginTop:"3px"}}>
                                    <p style={{fontSize:"15px", width:"35px"}}>End</p>
                                    <input
                                        type="time"
                                        placeholder="End Time"
                                        value={timeEnd}
                                        onChange={(e) => setTimeEnd(e.target.value)}
                                        css={inputStyle}
                                        style={{width:"10.9rem", fontSize:"15px"}}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="descriptionContainer" style={{display: "flex", flexDirection: "column", width:"15.4rem"}}>
                            <p>Description</p>
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                css={inputStyle}
                                style={{marginTop:"10px", fontSize:"15px", padding:"3px 6px", scrollbarWidth:"thin", resize:"none"}}
                                rows="4"
                                required
                            />
                        </div>
                    </div>
                    <div className="placeContainer" style={{display: "flex", flexDirection: "column", marginTop:"9px"}}>
                        <p>Place / Zoom Link</p>
                        <input
                            type="text"
                            placeholder="Place / Zoom Link"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            css={inputStyle}
                            style={{marginTop:"10px", fontSize:"15px"}}
                            required
                        />
                    </div>
                    
                    <div style={{marginTop: "2.2rem", display:"flex", flexDirection:"column", alignItems:"center"}}>
                        {error && <p css={errorStyle} style={{fontSize:"13px"}}>{error}</p>}
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                            <button type="submit" css={buttonStyle}>
                                Schedule
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
