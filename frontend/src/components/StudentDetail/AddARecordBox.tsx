/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { useAuth } from "../../helper/AuthProvider";
import { Icon } from "@iconify/react/dist/iconify.js";
import SuccessPopup from "../Elementary/SuccessPopup";
import { addStudentReport } from "../../controllers/ReportController";

interface AddRecordBoxProps {
    studentName: string;
    onRecordAdded: () => void;
}

const AddRecordBox = ({ studentName, onRecordAdded }: AddRecordBoxProps) => {
    const userAuth = useAuth();
    const [description, setDescription] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("Report");
    const [selectedPerson, setSelectedPerson] = useState<string>("Student");
    const [selectedStatus, setSelectedStatus] = useState<string>("not solved");
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
    const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState<boolean>(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setIsTypeDropdownOpen(false);
    };

    const handlePersonSelect = (person: string) => {
        setSelectedPerson(person);
        setIsPersonDropdownOpen(false);
    };

    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status)
        setIsStatusDropdownOpen(false)
    }
    
    const handleAddRecord = async () => {
        setError("");
        if(!description){
            setError("Description is required");
            return;
        }
        try {
            await addStudentReport(studentName, description, selectedType, selectedPerson, selectedStatus, userAuth!.currentUser.email);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            setDescription("");
            setSelectedType("Report");
            setSelectedPerson("Student");
            setSelectedStatus("solved")
            onRecordAdded();
        } catch (error) {
            console.error("Error adding record: ", error);
        }
    };

    const addRecordBoxStyle = css`
        width: 100%;
        border: 1px solid #ebebeb;
        box-shadow: 1px 2px 5px 1px rgba(0, 0, 0, 0.25);
        height: auto;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        p {
            text-align: start;
        }
        .headerp {
            background-color: #ebebeb;
            margin: 0px;
            font-weight: 600;
            padding: 5px;
            text-align: center;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;

    const recordFormStyle = css`
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        p {
            font-weight: 500;
            font-size: 17px;
        }
    `;

    const buttonStyle = css`
        border: none;
        background-color: #49A8FF;
        padding: 10px;
        color: white;
        border-radius: 10px;
        font-weight: 500;
        font-size: 17px;
        margin-top: 40px;
        width: 60%;
        margin: auto;

        &:hover {
            cursor: pointer;
            background-color: #309CFF;
        }
    `;

    const dropdownSectionStyle = css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    `;

    const dropdownStyle = css`
        position: relative;
        margin-top: 15px;
    `;

    const dropdownButtonStyle = css`
        background-color: white;
        border: 1px solid #D9D9D9;
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        height: 23px;

        &:hover {
            background-color: #f0f0f0;
        }
    `;

    const dropdownContentStyle = css`
        position: absolute;
        background-color: white;
        border: 1px solid #D9D9D9;
        border-radius: 5px;
        width: 100%;
        max-height: 150px;
        margin-top: 0px;
        text-align: start;
        overflow-y: auto;
        z-index: 10;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        font-size: 15px;
    `;

    const dropdownItemStyle = (isSelected: boolean) => css`
        padding: 10px;
        cursor: pointer;
        background-color: ${isSelected ? "#49A8FF" : "white"};
        color: ${isSelected ? "white" : "black"};

        &:hover {
            background-color: #68b5fc;
            color: white;
        }
    `;

    const buttonContainerStyle = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2rem;
    `;

    const errorStyle = css`
        color: red;
        margin-top: 4px;
        margin-bottom: 10px;
    `;

    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="add-a-record-box" css={addRecordBoxStyle}>
            <p className="headerp" style={{fontSize:"19px"}}>Add a record</p>
            <div className="recordForm" css={recordFormStyle}>
                <p>Description</p>
                <textarea
                    style={{
                        border: "1px solid #D9D9D9",
                        borderRadius: "5px",
                        padding: "8px",
                        outline: "none",
                        fontSize: "15px",
                        width: "100%",
                        height: "11rem",
                        resize: "none",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        lineHeight: "1.5",
                        scrollbarWidth:"thin"
                    }}
                    rows={10}
                    value={description}
                    onChange={handleDescriptionChange}
                />
                {error && <p css={errorStyle} style={{fontSize:"14px"}}>{error}</p>}
                <div className="dropdown-section" css={dropdownSectionStyle}>
                    <div className="type-dropdown" css={dropdownStyle}>
                    <p style={{marginBottom: "5px", fontSize:"17px"}}>Type</p>
                        <div css={dropdownButtonStyle} onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}>
                            <div style={{fontSize:"15px"}}>{selectedType}</div>
                            <Icon icon={"weui:arrow-filled"} color="#49A8FF" rotate={45} fontSize={10} />
                        </div>
                        {isTypeDropdownOpen && (
                            <div css={dropdownContentStyle}>
                                <div css={dropdownItemStyle(selectedType === "Report")} onClick={() => handleTypeSelect("Report")}>
                                    Report
                                </div>
                                <div css={dropdownItemStyle(selectedType === "Complaint")} onClick={() => handleTypeSelect("Complaint")}>
                                    Complaint
                                </div>
                                <div css={dropdownItemStyle(selectedType === "Urgent")} onClick={() => handleTypeSelect("Urgent")}>
                                    Urgent
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="person-dropdown" css={dropdownStyle}>
                    <p style={{marginBottom: "5px", fontSize:"17px"}}>Source</p>
                        <div css={dropdownButtonStyle} onClick={() => setIsPersonDropdownOpen(!isPersonDropdownOpen)}>
                            <div style={{fontSize:"15px"}}>{selectedPerson}</div>
                            <Icon icon={"weui:arrow-filled"} color="#49A8FF" rotate={45} fontSize={10} />
                        </div>
                        {isPersonDropdownOpen && (
                            <div css={dropdownContentStyle}>
                                <div css={dropdownItemStyle(selectedPerson === "Student")} onClick={() => handlePersonSelect("Student")}>
                                    Student
                                </div>
                                <div css={dropdownItemStyle(selectedPerson === "Enrichment")} onClick={() => handlePersonSelect("Enrichment")}>
                                    Enrichment
                                </div>
                                <div css={dropdownItemStyle(selectedPerson === "Company")} onClick={() => handlePersonSelect("Company")}>
                                    Company
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="person-dropdown" css={dropdownStyle}>
                    <p style={{marginBottom: "5px", fontSize:"17px"}}>Status</p>
                        <div css={dropdownButtonStyle} onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}>
                            <div style={{fontSize:"15px"}}>{selectedStatus}</div>
                            <Icon icon={"weui:arrow-filled"} color="#49A8FF" rotate={45} fontSize={10} />
                        </div>
                        {isStatusDropdownOpen && (
                            <div css={dropdownContentStyle}>
                                <div css={dropdownItemStyle(selectedStatus === "solved")} onClick={() => handleStatusSelect("solved")}>
                                    Solved
                                </div>
                                <div css={dropdownItemStyle(selectedStatus === "not solved")} onClick={() => handleStatusSelect("not solved")}>
                                    Not Solved
                                </div>
                            </div>
                        )}
                    </div>
                <div css={buttonContainerStyle}>
                    <button className="button" css={buttonStyle} onClick={handleAddRecord}>Add</button>
                </div>
                <SuccessPopup message='The new student record has been successfully added' isVisible={isVisible} />
            </div>
        </div>
    );
};

export default AddRecordBox;
