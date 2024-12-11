/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState, FC } from "react";

interface EditReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (currentId: string, content: string, type: string, status: string, source: string) => void;
    currentContent: string;
    currentType: string;
    currentStatus: string;
    currentSource: string;
    currentId: string;
}

const EditReportModal: FC<EditReportModalProps> = ({ isOpen, onClose, onSubmit, currentContent, currentType, currentStatus, currentId, currentSource }) => {
    const [content, setContent] = useState<string>(currentContent);
    const [type, setType] = useState<string>(currentType);
    const [source, setSource] = useState<string>(currentSource);
    const [status, setStatus] = useState<string>("not solved")
    const [error, setError] = useState<string>('');

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setContent(currentContent);
        setType(currentType);
        setSource(currentSource);
        setStatus(currentStatus);
    }, [currentContent, currentType, currentSource, currentStatus]);
    

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

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!content.trim() || !type.trim()) {
            setError('Content and type are required.');
            return;
        }
        onSubmit(currentId, content, type, status, source);
        setContent("")
        setType("")
        setStatus("")
        setSource("")
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
    `;

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
                    <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Edit Report</p>
                    <Icon icon="mdi:close" onClick={onClose} fontSize={20} color="#51587E" css={closeButtonStyle} />
                </div>
                <div css={formStyle}>
                    <div className="contentContainer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p>Content</p>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            css={inputStyle}
                            style={{ fontSize: "15px", padding: "10px", height: "100px", resize: "none" }}
                            rows={4}
                        />
                    </div>
                    <div className="typeContainer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p>Type</p>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            css={inputStyle}
                            style={{ fontSize: "15px" }}
                        >
                            <option value="Urgent">Urgent</option>
                            <option value="Report">Report</option>
                            <option value="Complaint">Complaint</option>
                        </select>
                    </div>
                    <div className="typeContainer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p>Status</p>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            css={inputStyle}
                            style={{ fontSize: "15px" }}
                        >
                            <option value="solved">Solved</option>
                            <option value="not solved">Not Solved</option>
                        </select>
                    </div>
                    <div className="typeContainer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p>Source</p>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            css={inputStyle}
                            style={{ fontSize: "15px" }}
                        >
                            <option value="Student">Student</option>
                            <option value="Enrichment">Enrichment</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>
                    {error && <p css={errorStyle}>{error}</p>}
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                        <button css={buttonStyle} onClick={handleSubmit}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditReportModal;
