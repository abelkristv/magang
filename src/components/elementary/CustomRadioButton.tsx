/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

interface CustomRadioButtonProps {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: string) => void;
}

const radioContainer = css`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const radioLabel = css`
    cursor: pointer;
`;


const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ name, value, label, checked, onChange }) => {
    const radioInput = css`
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
        appearance: none;
        &:checked {
            background-color: ${value == "negative" ? "#ff3333" : value == "neutral" ? "gray" : "#4caf50"};
            border-color: ${value == "negative" ? "#ff3333" : value == "neutral" ? "gray" : "#4caf50"};
        }
    `;

    return (
        <div css={radioContainer}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                css={radioInput}
            />
            <label css={radioLabel} onClick={() => onChange(value)}>
                {label}
            </label>
        </div>
    );
};

export default CustomRadioButton;
