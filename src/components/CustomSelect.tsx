/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import Student from '../model/Student';

export interface CustomSelectProps {
    options: Student[];
    value: Student | null;
    onChange: (option: Student) => void;
}


function CustomSelect({ options, value, onChange }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option: Student) => {
        onChange(option);
        setIsOpen(false);
    };

    const dropdownStyle = css`
        position: relative;
        width: 100%;
        box-sizing: border-box;
    `;

    const selectedStyle = css`
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

    const optionsStyle = css`
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;

    const optionStyle = css`
        padding: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            background: #f0f0f0;
        }

        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
    `;

    return (
        <div css={dropdownStyle}>
            <div css={selectedStyle} onClick={toggleDropdown}>
                <span>{value ? value.name : "Select a student"}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div css={optionsStyle}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            css={optionStyle}
                            onClick={() => handleOptionClick(option)}
                        >
                            <img src={option.image_url} alt={option.name} />
                            <span>{option.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;
