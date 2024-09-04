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
    periods: string[];
    companies: { company_name: string }[];
    majors: { name: string }[];
    userRole: string | null;
    handleTempPeriodChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleTempCompanyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleTempMajorChange: (event: ChangeEvent<HTMLSelectElement>) => void;
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
    left: -10%;
    text-align: start;
    padding: 10px 15px 15px 15px;
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
        margin-bottom: 15px;
    }

    button {
        margin-top: 20px;
        width: 30%;
        font-size: 17px;
        padding: 11px;
        box-sizing: border-box;
        font-weight: 500;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 10px;

        &:hover {
            cursor: pointer;
            background-color: #363636;
        }
    }
`;


const FilterDropdown = ({
    isDropdownOpen,
    toggleDropdown,
    tempSelectedPeriod,
    tempSelectedCompany,
    tempSelectedMajor,
    periods,
    companies,
    majors,
    userRole,
    handleTempPeriodChange,
    handleTempCompanyChange,
    handleTempMajorChange,
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
                {userRole === "Enrichment" && (
                    <>
                        <p>Company</p>
                        <select value={tempSelectedCompany} onChange={handleTempCompanyChange}>
                            <option value="">All</option>
                            {companies.map((company, index) => (
                                <option key={index} value={company.company_name}>{company.company_name}</option>
                            ))}
                        </select>
                    </>
                )}
                <div 
                    className="buttonContainer"
                    style={{display: "flex", justifyContent: "end"}}>
                    <button onClick={handleApplyFilters} style={{backgroundColor: '#49A8FF'}}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
