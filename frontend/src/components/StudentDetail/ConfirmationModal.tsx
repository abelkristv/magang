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

    const buttonContainerStyle = css`
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
    `;

    const buttonStyle = css`
        background-color: #ff243d;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #ff455a;
        }
    `;

    const cancelButtonStyle = css`
        background-color: #ccc;
        color: black;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #ddd;
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
            margin-left: 6px;
            margin-bottom: 0px;
        }
    `;

    const closeButtonStyle = css`
        cursor: pointer;
        margin-right: 8px;
    `;

    const messageStyle = css`
        text-align: center;
        font-size: 16px;
        padding: 20px;
    `;

    return (
        <div css={modalStyle}>
            <div ref={modalRef} css={modalContentStyle}>
                <div className="modalHeader" css={modalHeaderStyle}>
                    <p className="headerp" style={{ fontSize: "19px", fontWeight: "600" }}>Confirmation</p>
                    <Icon icon="mdi:close" onClick={onClose} fontSize={25} color="#51587E" css={closeButtonStyle} />
                </div>
                <p css={messageStyle}>{message}</p>
                <div css={buttonContainerStyle}>
                    <button css={cancelButtonStyle} onClick={onClose}>
                        Cancel
                    </button>
                    <button css={buttonStyle} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
