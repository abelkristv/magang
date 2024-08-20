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
        width: 557px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        align-items: center;
        padding: 10px;
        padding-left: 20px;
        background-color: #F0ECEC;
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
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ACACAC;
        display: flex;
        flex-direction: column;

        .attendeeInputContainer {
            display: flex;
            align-items: center;
            input {
                flex-grow: 1;
            }
            .removeIcon {
                margin-right: 10px;
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

        input {
            flex-grow: 1;
            height: 35px;
            border-radius: 5px;
            border: 1px solid gray;
            padding: 10px;
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
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 15px;

        &:hover {
            background-color: #62b3fc;
        }
    `;

    const closeButtonStyle = css`
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888;
    `;

    const attendeeInputContainerStyle = css`
        input {
            outline: none;
            border: none;
        }
    `;

    return (
        isAttendeeModalOpen && (
            <div css={modalStyle}>
                <div css={modalContentStyle} ref={attendeeModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">List Of Attendee</p>
                        <button css={closeButtonStyle} onClick={closeAttendeeModal}>x</button>
                    </div>
                    <div className="inputAndButtonContainer" css={inputAndButtonContainerStyle}>
                        <p>Attendee</p>
                        <input
                            type="text"
                            placeholder="New Attendee"
                            value={newAttendee}
                            onChange={(e) => setNewAttendee(e.target.value)}
                        />
                    </div>
                    <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box" }}>
                        <button type="button" css={addButtonStyle} onClick={handleAddAttendee}>
                            Add
                        </button>
                    </div>
                    <form css={modalFormStyle}>
                        <div className="modalBox" css={modalBoxStyle}>
                            {attendees.map((attendee, index) => (
                                <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                    <div className="inputNumContainer" style={{ display: "grid", width: "100%", minHeight: "47px", gridTemplateColumns: "0.1fr 1fr 1fr", paddingLeft: "10px", alignItems: "center" }}>
                                        <p style={{fontSize: "17px"}}>{index + 1}</p>
                                        <input
                                            style={{fontSize: "17px"}}
                                            placeholder={`Attendee ${index + 1}`}
                                            value={attendee}
                                            onChange={(e) => handleAttendeeChange(index, e)}
                                        />
                                    </div>
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
