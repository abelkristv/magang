/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import checkMark from '../../assets/icons/checkmark.png'

export interface ModalProps {
    message: string;
    onClose: () => void;
}


const appear = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

function Modal({ message, onClose }: ModalProps) {
    const modalOverlayStyle = css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContentStyle = css`
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        width: 100%;
        animation: ${appear} 0.3s ease-out;
    `;

    const buttonStyle = css`
        margin-top: 20px;
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: #0056b3;
        }
    `;

    return (
        <div css={modalOverlayStyle} onClick={onClose}>
            <div css={modalContentStyle} onClick={e => e.stopPropagation()}>
                <img src={checkMark} alt="" />
                <p>{message}</p>
                <button css={buttonStyle} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;
