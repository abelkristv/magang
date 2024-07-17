/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

type PrimaryButtonProps = {
    content: string,
    onClick?: () => void,
    bg_color?: string,
    color?: string,
    height?: number,
    width?: number,
    fontSize?: number,
    borderRadius?: string
}

function PrimaryButton({ content, onClick, bg_color, color, height, width, fontSize, borderRadius }: PrimaryButtonProps) {

    const buttonStyle = css`
        background-color: ${bg_color? bg_color : "#149dff"};
        border: none;
        color: ${color? color : "white"};
        font-weight: bold;
        font-size: ${fontSize? fontSize : "20"}px;
        border-radius: ${borderRadius? borderRadius : "15px"};
        height: ${height? height : "200"}px;
        width: ${width? width : ""}px;
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
