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
    width: 200px;
    height: 47px;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
`;

export const DropdownContent = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    gap: 0px;
    font-size: 18px;
    background-color: white;
    text-align: start;
    position: absolute;
    top: 95%;
    left: 0;
    width: 250px;
    // padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    p {
        padding: 20px;
    }
    p:hover {
        background-color: #49A8FF;
        color: white;
        cursor: pointer;
    }
`;

const DropdownComponent = ({ selectedValue, setSelectedValue }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownClick = () => {
        console.log("test")
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (value) => {
        setSelectedValue(value);
        setIsDropdownOpen(false);
    };

    return (
        <div>
            <Dropdown onClick={handleDropdownClick}>
                <p>{selectedValue}</p>
                <Icon icon={"weui:arrow-filled"} rotate={isDropdownOpen ? 180 : 0} />
            </Dropdown>
            <DropdownContent isOpen={isDropdownOpen}>
                <p onClick={() => handleOptionClick("Meeting")}>Meeting</p>
                <p onClick={() => handleOptionClick("Discussion")}>Discussion</p>
                <p onClick={() => handleOptionClick("Evaluation")}>Evaluation</p>
            </DropdownContent>
        </div>
    );
};

export default DropdownComponent;
