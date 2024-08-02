/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ChangeEvent } from "react";
import { Icon } from "@iconify/react";
import { FilterOptions } from "./Interfaces";

interface FilterDropdownProps extends FilterOptions {
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
    handlePeriodChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleCompanyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleMajorChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const filterViewStyle = css`
    display: flex;
    align-items: center;
    margin-left: 88px;
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
    left: -10%;
    text-align: start;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
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
    }
`;

const FilterDropdown = ({
    isDropdownOpen,
    toggleDropdown,
    selectedPeriod,
    selectedCompany,
    selectedMajor,
    periods,
    companies,
    majors,
    userRole,
    handlePeriodChange,
    handleCompanyChange,
    handleMajorChange,
}: FilterDropdownProps) => {
    return (
        <div className="filterView" css={filterViewStyle}>
            <p>Filter View: </p>
            <div className="dropdown" css={dropdownStyle} onClick={toggleDropdown}>
                <p>All Students</p>
                <Icon icon={"weui:arrow-filled"} rotate={45} />
            </div>
            <div className="dropdown-content" css={dropdownContentStyle(isDropdownOpen)}>
                <p>Period</p>
                <select value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="">All</option>
                    {periods.map((period, index) => (
                        <option key={index} value={period}>{period}</option>
                    ))}
                </select>
                {userRole === "Enrichment" && (
                    <>
                        <p>Company</p>
                        <select value={selectedCompany} onChange={handleCompanyChange}>
                            <option value="">All</option>
                            {companies.map((company, index) => (
                                <option key={index} value={company.company_name}>{company.company_name}</option>
                            ))}
                        </select>
                    </>
                )}
                <p>Major</p>
                <select value={selectedMajor} onChange={handleMajorChange}>
                    <option value="">All</option>
                    {majors.map((major, index) => (
                        <option key={index} value={major.name}>{major.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterDropdown;
