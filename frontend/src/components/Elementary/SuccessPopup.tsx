/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Define the prop types
interface SuccessPopupProps {
    message: string;
    isVisible: boolean;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, isVisible }) => {
    const notificationStyles = css`
        position: fixed;
        top: 22px;
        right: 22px;
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.15s ease-in-out;
        &.show {
            opacity: 1;
        }
        display: flex;
        flex-direction: column;
        text-align: end;

        .popupHeader{
            font-weight: 600;
            font-size: 21px;
        }
        .popupContent{
            margin-top: 3px;
        }


    `;

    return (
        <div css={notificationStyles} className={isVisible ? "show" : ""}>
            <p className='popupHeader'>Success</p>
            <p className='popupContent'>{message}</p>
        </div>
    );
};

export default SuccessPopup;
