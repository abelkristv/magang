/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Icon } from "@iconify/react";
import { FC, useEffect, useRef } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

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
        width: 500px;
        display: flex;
        flex-direction: column;
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

    const buttonContainerStyle = css`
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
    `;

    const buttonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px 20px;
        margin-top: 35px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #309CFF;
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
            margin-left: 8px;
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

    const messageStyle = css`
        text-align: center;
        font-size: 17px;
    `;
    const message2Style = css`
        text-align: center;
        font-size: 14px;
    `;
    const messageContainerStyle = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    `;

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp" style={{fontSize:"19px", fontWeight:"600"}}>Delete Record</p>
                    <Icon icon="mdi:close" onClick={onClose} fontSize={20} color="#51587E" css={closeButtonStyle} />
                </div>
                <div css={messageContainerStyle}>
                    <Icon
                        icon={"ic:baseline-delete"}
                        fontSize={40}
                        style={{
                            borderRadius:'100%',
                            border:'1px solid',
                            padding:'25px',
                            marginTop: '20px',
                        }}
                    />
                    <p css={messageStyle}>{message}</p>
                    <p css={message2Style}>Are you sure?</p>
                </div>
                <div css={buttonContainerStyle}>
                    <button css={buttonStyle} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
