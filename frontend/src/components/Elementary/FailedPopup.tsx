/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

interface FailedPopupProps {
    message: string;
    isVisible: boolean;
}

const FailedPopup: React.FC<FailedPopupProps> = ({ message, isVisible }) => {
    const notificationStyles = css`
        position: fixed;
        top: 22px;
        right: 22px;
        background-color:  #ff5858 ;
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
            <p className='popupHeader'>Failed</p>
            <p className='popupContent'>{message}</p>
        </div>
    );
};

export default FailedPopup;
