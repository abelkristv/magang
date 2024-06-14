/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

type PrimaryButtonProps = {
    content: string,
    onClick?: () => void,
}

function PrimaryButton({ content, onClick }: PrimaryButtonProps) {

    const buttonStyle = css`
        background-color: #149dff;
        border: none;
        color: white;
        font-weight: bold;
        font-size: 30px;
        border-radius: 5px;
        padding: 10px;
        &:hover {
            background-color: #36abff;
            cursor: pointer;
        }
    `;

    return (
        <button css={buttonStyle} onClick={onClick}>{content}</button>
    );
}

export default PrimaryButton;
