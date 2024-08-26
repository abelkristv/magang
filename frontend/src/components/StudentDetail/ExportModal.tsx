/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState, FC, FormEvent } from "react";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (dates: { startDate: string; endDate: string }) => void;
}

const ExportModal: FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [error, setError] = useState<string>('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

    const validateDates = (): boolean => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (end < start) {
            setError('The end date cannot be earlier than the start date.');
            return false;
        } else if (diffDays > 31) {
            setError('The end date must be within one month from the start date.');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateDates()) {
            onExport({ startDate, endDate });
            onClose();
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
        margin-bottom: 3rem;
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
            padding: 10px 14px;
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
        height: auto;
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
        padding: 20px;
        padding-top: 0;

        p {
            text-align: start;
        }
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
        align-items: center;
        background-color: #F0ECEC;
        border-radius: 10px 10px 0px 0px;

        .headerp {
            margin-left: 5px;
            margin-bottom: 0px;
        }
    `;

    const closeButtonStyle = css`
        cursor: pointer;
    `;

    const popupHeaderStyle = css`
        font-size: 17px;
        margin-bottom: 12px;
    `;

    const errorStyle = css`
        color: red;
        font-size: 13px;
        text-align: center;
    `;

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Export to Excel</p>
                    <Icon icon="mdi:close" onClick={onClose} fontSize={20} color="#51587E" css={closeButtonStyle} />
                </div>
                <form onSubmit={handleSubmit} css={formStyle}>
                    <p css={popupHeaderStyle}>Period</p>
                    <div className="content" style={{display: "flex", justifyContent: "space-between"}}>
                        <div className="dateContainer" style={{display: "flex", alignItems: "center", gap: "10px", width: "45%", fontSize:"15px"}}>
                            <p>Start</p>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                css={inputStyle}
                                style={{width:"14.3rem", fontSize:"15px"}}
                                required
                            />
                        </div>
                        <div className="dateContainer" style={{display: "flex", alignItems: "center", gap: "10px", width: "45%", fontSize:"15px"}}>
                            <p>End</p>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                css={inputStyle}
                                style={{width:"14.3rem", fontSize:"15px"}}
                                required
                            />
                        </div>
                    </div>
                    <div style={{marginTop: "2.2rem", display:"flex", flexDirection:"column", alignItems:"center"}}>
                        {error && <p css={errorStyle}>{error}</p>}
                        <div className="buttonContainer" style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                            <button type="submit" css={buttonStyle}>
                                Export
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportModal;
