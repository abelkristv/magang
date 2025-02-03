import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Icon } from "@iconify/react";

export const Dropdown = styled.div`
    position: relative;
    display: flex;
    background-color: white;
    border: 1px solid #ACACAC;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 47px;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    // margin-top: 10px;
`;

export const DropdownContent = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    gap: 0px;
    font-size: 18px;
    background-color: white;
    text-align: start;
    position: absolute;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    p {
        padding: 10px;
        margin: 0;
    }
    p:hover {
        background-color: #49A8FF;
        color: white;
        cursor: pointer;
    }
`;

interface DropdownComponentProps {
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    options: string[];
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ selectedValue, setSelectedValue, options }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        setIsDropdownOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Dropdown onClick={handleDropdownClick}>
                <p style={{fontSize:"15px"}}>{selectedValue}</p>
                <Icon icon={"weui:arrow-filled"} rotate={45} fontSize={10} color='black' />
            </Dropdown>
            <DropdownContent isOpen={isDropdownOpen}>
                {options.map((option, index) => (
                    <p key={index} onClick={() => handleOptionClick(option)} style={{fontSize:"15px"}}>
                        {option}
                    </p>
                ))}
            </DropdownContent>
        </div>
    );
};

export default DropdownComponent;
