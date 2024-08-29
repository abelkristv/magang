/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const checkboxContainer = css`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const checkboxLabel = css`
    cursor: pointer;
`;

const checkboxInput = css`
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    appearance: none;
    &:checked {
        background-color: #4caf50;
        border-color: #4caf50;
    }
`;

function CustomCheckbox({ label, checked, onChange }: CustomCheckboxProps) {
    return (
        <div css={checkboxContainer}>
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={onChange} 
                css={checkboxInput} 
            />
            <label css={checkboxLabel} onClick={onChange}>{label}</label>
        </div>
    );
}

export default CustomCheckbox;
