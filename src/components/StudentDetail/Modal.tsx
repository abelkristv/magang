/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit, studentReportId }) => {
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
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

    const buttonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
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
        }
    `

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
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
    `;

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp">Schedule a Meeting</p>
                    <button css={closeButtonStyle} onClick={onClose}>x</button>
                </div>
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div className="dateContainer" style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <p>Date</p>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            css={inputStyle}
                            required
                        />
                    </div>
                    <div className="timeContainer">
                        <p>Time</p>
                        <div className="timeChooserContainer" style={{display: "flex", gap: "30px"}}>
                            <div className="startTime" style={{display: "flex", gap: "20px", alignItems: "center"}}>
                                <p>Start</p>
                                <input
                                    type="time"
                                    placeholder="Start Time"
                                    value={timeStart}
                                    onChange={(e) => setTimeStart(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                            <div className="endTime" style={{display: "flex", gap: "20px", alignItems: "center"}}>
                                <p>End</p>
                                <input
                                    type="time"
                                    placeholder="End Time"
                                    value={timeEnd}
                                    onChange={(e) => setTimeEnd(e.target.value)}
                                    css={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="typeContainer" style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                        <p>Meeting Type</p>
                        <select
                            value={meetingType}
                            onChange={(e) => setMeetingType(e.target.value)}
                            css={inputStyle}
                            required
                        >
                            <option value="online">Online</option>
                            <option value="onsite">Onsite</option>
                        </select>
                    </div>
                    <div className="descriptionContainer" style={{display: "flex", flexDirection: "column"}}>
                        <p>Description</p>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            css={inputStyle}
                            rows="4"
                            required
                        />
                    </div>
                    <div className="placeContainer" style={{display: "flex", flexDirection: "column"}}>
                        <p>Place / Zoom Link</p>
                        <input
                            type="text"
                            placeholder="Place / Zoom Link"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            css={inputStyle}
                            required
                        />
                    </div>
                    
                    <button type="submit" css={buttonStyle}>
                        Schedule
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
