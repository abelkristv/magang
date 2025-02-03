/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

interface AttendeeModalProps {
    isAttendeeModalOpen: boolean;
    closeAttendeeModal: () => void;
    attendees: string[];
    newAttendee: string;
    setNewAttendee: (attendee: string) => void;
    handleAddAttendee: () => void;
    handleAttendeeChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveAttendee: (index: number) => void;
}

const AttendeeModal: React.FC<AttendeeModalProps> = ({
    isAttendeeModalOpen,
    closeAttendeeModal,
    attendees,
    newAttendee,
    setNewAttendee,
    handleAddAttendee,
    handleAttendeeChange,
    handleRemoveAttendee,
}) => {
    const attendeeModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (attendeeModalRef.current && !attendeeModalRef.current.contains(event.target as Node)) {
                closeAttendeeModal();
            }
        };

        if (isAttendeeModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAttendeeModalOpen]);

    const modalStyle = css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `;

    const modalContentStyle = css`
        background: white;
        border-radius: 10px;
        width: 630px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
        align-items: center;
        background-color: #F0ECEC;
        border-radius: 10px 10px 0px 0px;
        height: 50px;

        .headerp {
            margin-left: 19px;
            margin-bottom: 0px;
            font-weight: 600;
            font-size: 18px;
        }
    `;

    const modalFormStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        box-sizing: border-box;

        p {
            text-align: start;
        }
        
        hr {
            width: 100%;
            background-color: #ACACAC;
            color: #ACACAC;
        }
    `;

    const modalBoxStyle = css`
        max-height: 460px;
        overflow-y: auto;
        scrollbar-width: thin;
        border: 1px solid #eee;
        display: flex;
        flex-direction: column;
        justify-content: start;

        .attendeeInputContainer {
            display: flex;
            input {
                flex-grow: 1;
            }
            .removeIcon {
                text-alignment: end;
                cursor: pointer;
                visibility: hidden;
            }
            &:hover .removeIcon {
                visibility: visible;
            }
        }

        .attendeeInputContainer:nth-of-type(odd) {
            background-color: #F5F5F5;
            input {
                flex-grow: 1;
                background-color: #F5F5F5;
            }
        }
        .attendeeInputContainer:nth-of-type(even) {
            background-color: white;
            input {
                flex-grow: 1;
                background-color: white;
            }
        }
    `;

    const inputAndButtonContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        text-align: start;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        margin-top: 10px;

        input {
            flex-grow: 1;
            font-size: 15px;
            border-radius: 5px;
            border: 1px solid gray;
            padding: 10px;
            height: 26px;
        }

        button {
            padding: 10px 20px;
            background-color: #49A8FF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 15px;

            &:hover {
                background-color: #62b3fc;
            }
        }
    `;

    const addButtonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px 20px;
        height: auto;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 17px;
        font-weight: 500;
        &:hover {
            background-color: #68b5fc;
        }
    `;

    const closeButtonStyle = css`
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888;
        margin-right: 9px;
    `;

    const attendeeInputContainerStyle = css`
        display: flex;
        align-items: flex-start; /* Aligns items at the top */
        gap: 10px;
        padding: 10px 30px;
        word-break: break-word; /* Ensures long strings break onto the next line */
        width: 100%;
        box-sizing: border-box;
        
        p {
            margin: 0;
        }

        .index {
            font-size: 16px;
            min-width: 30px; /* Ensures a fixed width for the number column */
            text-align: start;
            flex-shrink: 0;
        }

        .resultText {
            font-size: 16px;
            flex-grow: 1;
            overflow: hidden;
            text-align: start; /* Center align for single-line text */
            white-space: pre-wrap; /* Preserve whitespace and wrap text */
        }

        .removeIcon {
            flex-shrink: 0;
            cursor: pointer;
            visibility: hidden; /* Hide by default */
            align-self: start; /* Vertically center the delete icon */
            margin-left: auto;
        }

        &:hover .removeIcon {
            visibility: visible; /* Show the icon on hover */
        }
    `;

    return (
        isAttendeeModalOpen && (
            <div css={modalStyle}>
                <div css={modalContentStyle} ref={attendeeModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">List Of Attendees</p>
                        <Icon icon="mdi:close" onClick={closeAttendeeModal} fontSize={25} color="#51587E" css={closeButtonStyle} /> 

                    </div>
                    <div className="inputAndButtonContainer" css={inputAndButtonContainerStyle}>
                        <p>Attendee</p>
                        <input
                            type="text"
                            value={newAttendee}
                            onChange={(e) => setNewAttendee(e.target.value)}
                        />
                    </div>
                    <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box", marginTop: "30px",
        marginBottom:"7px" }}>
                        <button type="button" css={addButtonStyle} onClick={handleAddAttendee}>
                            Add
                        </button>
                    </div>
                    <form css={modalFormStyle}>
                        <div className="modalBox" css={modalBoxStyle}>
                            {attendees.map((attendee, index) => (
                                <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                    <p className="index">{index + 1}</p>
                                    <p className="resultText">{attendee}</p>
                                    <Icon
                                        icon="mdi:delete"
                                        color="#51587E"
                                        fontSize={25}
                                        className="removeIcon"
                                        onClick={() => handleRemoveAttendee(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}

export default AttendeeModal;
