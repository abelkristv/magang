/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ChangeEvent } from "react";
import { Icon } from "@iconify/react";

interface FilterDropdownProps {
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
    tempSelectedPeriod: string;
    tempSelectedCompany: string;
    tempSelectedMajor: string;
    tempSelectedStatus: string; // New
    periods: string[];
    companies: { company_name: string }[];
    majors: { name: string }[];
    userRole: string | null;
    handleTempPeriodChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleTempCompanyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleTempMajorChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleTempStatusChange: (event: ChangeEvent<HTMLSelectElement>) => void; // New
    handleApplyFilters: () => void;
}


const filterViewStyle = css`
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
`;

const dropdownStyle = css`
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    width: 200px;
    background-color: #EBEBEB;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const dropdownContentStyle = (isDropdownOpen: boolean) => css`
    display: ${isDropdownOpen ? 'block' : 'none'};
    position: absolute;
    background-color: #EBEBEB;
    top: 120%;
    left: -30%;
    text-align: start;
    padding: 10px 15px 15px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 120%;
    z-index: 1;

    p {
        margin: 0;
        padding: 10px 0px 10px 0px;
        cursor: pointer;
    }

    select {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: white;
        font-size: 15px;
        cursor: pointer;
        margin-bottom: 15px;
    }

`;

const buttonContainerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: end;
`;

const buttonStyle = css`
    border: none;
    background-color: #49A8FF;
    padding: 10px 20px;
    color: white;
    border-radius: 10px;
    font-weight: 500;
    font-size: 17px;
    margin-top: 30px;
    width: auto;

    &:hover {
        cursor: pointer;
        background-color: #309CFF;
    }
`;


const FilterDropdown = ({
    isDropdownOpen,
    toggleDropdown,
    tempSelectedPeriod,
    tempSelectedMajor,
    tempSelectedStatus,
    periods,
    majors,
    handleTempPeriodChange,
    handleTempMajorChange,
    handleTempStatusChange,
    handleApplyFilters,
}: FilterDropdownProps) => {
    console.log("Periods : ", periods)

    return (
        <div className="filterView" css={filterViewStyle}>
            <p style={{fontSize:"15px"}}>Filter by: </p>
            <div className="dropdown" css={dropdownStyle} onClick={toggleDropdown}>
                <p>All Students</p>
                <Icon icon={"weui:arrow-filled"} rotate={45} fontSize={10} />
            </div>
            <div className="dropdown-content" css={dropdownContentStyle(isDropdownOpen)}>
                <p>Period</p>
                <select value={tempSelectedPeriod} onChange={handleTempPeriodChange} >
                    <option value="" >All</option>
                    {periods.map((period, index) => (
                        <option key={index} value={period}>{period}</option>
                    ))}
                </select>
                <p>Major</p>
                <select value={tempSelectedMajor} onChange={handleTempMajorChange}>
                    <option value="">All</option>
                    {majors.map((major, index) => (
                        <option key={index} value={major.name}>{major.name}</option>
                    ))}
                </select>
                <p>Status</p>
                <select value={tempSelectedStatus} onChange={handleTempStatusChange}>
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Not Active">Not Active</option>
                </select>
                <div css={buttonContainerStyle}>
                    <button className="button" css={buttonStyle} onClick={handleApplyFilters}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
