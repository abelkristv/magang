/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

const ExportModal = ({ isOpen, onClose, onExport }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
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

    const validateDates = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 31;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateDates()) {
            onExport({ startDate, endDate });
            onClose();
        } else {
            setError('The end date must be within one month from the start date.');
        }
    };

    if (!isOpen) return null;

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
        width: 50%;
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
                    <p className="headerp">Export to Excel</p>
                    <button css={closeButtonStyle} onClick={onClose}>x</button>
                </div>
                <form onSubmit={handleSubmit} css={formStyle}>
                    <div className="content" style={{display: "flex", justifyContent: "space-between"}}>
                        <div className="dateContainer" style={{display: "flex", alignItems: "center", gap: "10px", width: "45%"}}>
                            <p>Start</p>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                css={inputStyle}
                                required
                            />
                        </div>
                        <div className="dateContainer" style={{display: "flex", alignItems: "center", gap: "10px", width: "45%"}}>
                            <p>End</p>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                css={inputStyle}
                                required
                            />
                        </div>
                    </div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                        <button type="submit" css={buttonStyle}>
                            Export
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default ExportModal;