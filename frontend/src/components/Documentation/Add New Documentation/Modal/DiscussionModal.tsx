/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

interface DiscussionModalProps {
    isDiscussionModalOpen: boolean;
    closeDiscussionModal: () => void;
    discussionTitle: string;
    setDiscussionTitle: (title: string) => void;
    personResponsible: string;
    setPersonResponsible: (person: string) => void;
    furtherActions: string;
    setFurtherActions: (actions: string) => void;
    deadline: string;
    setDeadline: (deadline: string) => void;
    modalDiscussionDetails: any[];
    handleAddDiscussionDetail: () => void;
    handleEditDiscussionDetail: (index: number) => void;
    handleDeleteDiscussionDetail: (index: number) => void;
    isEditing: boolean;
}

const DiscussionModal: React.FC<DiscussionModalProps> = ({
    isDiscussionModalOpen,
    closeDiscussionModal,
    discussionTitle,
    setDiscussionTitle,
    personResponsible,
    setPersonResponsible,
    furtherActions,
    setFurtherActions,
    deadline,
    setDeadline,
    modalDiscussionDetails,
    handleAddDiscussionDetail,
    handleEditDiscussionDetail,
    handleDeleteDiscussionDetail,
    isEditing,
}) => {
    const discussionModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (discussionModalRef.current && !discussionModalRef.current.contains(event.target as Node)) {
                closeDiscussionModal();
            }
        };

        if (isDiscussionModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDiscussionModalOpen]);

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

    const discussionModalContentStyle = css`
        background: white;
        border-radius: 10px;
        width: 830px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;

        .headerp {
            margin: 0px;
            border-radius: 10px 10px 0px 0px;
            background-color: #ebebeb;
            padding: 10px;
            font-size: 19px;
            font-weight: medium;
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

    const inputGrid = css`
        display: grid;
        grid-template-columns: 1.5fr 1.5fr;
        grid-template-rows: 1.5fr 1.5fr;
        gap: 20px;

        input {
            margin: 0px;
            height: 26px;
            border-radius: 5px;
            border: 1px solid #ACACAC;
        }

        .input {
            display: flex;
            flex-direction: column;
            gap: 5px;
            p{
                font-size: 17px;
            }
        }
    `;

    const discussionCardStyle = css`
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 15px;
        background-color: white;

        .topSide{
            margin-left: 7px;
        }

        .itemAction {
            display: grid;
            grid-template-columns: 0.45fr 1fr;
            margin-top: 9px;
            margin-left: 7px;
            align-items: start;
            .leftSide {
                display: flex;
                gap: 10px;
                align-items: center;
                color: #51587E;
            }
            .rightSide {
                display: flex;
                gap: 10px;
                align-items: center;
                justify-content: flex-end;
            }
        }
    `;

    const discussionCardContainer = css`
        max-height: 420px;
        height: auto;
        overflow-y: auto;
        scrollbar-width: thin;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

    const addDiscussionButtonContainerStyle = css`
        display: flex;
        justify-content: end;
        margin-top: 30px;
        margin-bottom: 22px;
    `;

    const closeButtonStyle = css`
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        color: #888;
        margin-right: 10px;
    `;

    const iconStyle = css`
        &:hover {
            cursor: pointer;
        }
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        padding-right: 10px;
        align-items: center;
        background-color: #F0ECEC;
        border-radius: 10px 10px 0px 0px;

        .headerp {
            margin-left: 12px;
            margin-bottom: 0px;
            font-weight: 600;
        }
    `;

    const buttonStyle = css`
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

    const inputStyle = css`
        padding: 10px;
        font-size: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        height: 46px;
    `;


    return (
        isDiscussionModalOpen && (
            <div css={modalStyle}>
                <div css={discussionModalContentStyle} ref={discussionModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">List Of Discussion Details</p>
                        <Icon icon="mdi:close" onClick={closeDiscussionModal} fontSize={25} color="#51587E" css={closeButtonStyle} /> 
                    </div>
                    <form css={modalFormStyle}>
                        <div className="inputGrid" css={inputGrid}>
                            <div className="input">
                                <p>Key Objective</p>
                                <input
                                    css={inputStyle}
                                    type="text"
                                    value={discussionTitle}
                                    onChange={(e) => setDiscussionTitle(e.target.value)}
                                />
                            </div>
                            <div className="input">
                                <p>Person Responsible</p>
                                <input
                                    css={inputStyle}
                                    type="text"
                                    value={personResponsible}
                                    onChange={(e) => setPersonResponsible(e.target.value)}
                                />
                            </div>
                            <div className="input">
                                <p>Further Actions</p>
                                <input
                                    css={inputStyle}
                                    type="text"
                                    value={furtherActions}
                                    onChange={(e) => setFurtherActions(e.target.value)}
                                />
                            </div>
                            <div className="input">
                                <p>Deadline</p>
                                <input
                                    css={inputStyle}
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="buttonContainer" css={addDiscussionButtonContainerStyle}>
                            <button type="button" css={buttonStyle} onClick={handleAddDiscussionDetail}>
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>

                        <div css={discussionCardContainer}>
                            {modalDiscussionDetails.map((detail, index) => (
                                <div key={index} css={discussionCardStyle}>
                                    <div className="topSide" style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="leftSide">
                                            <p style={{ marginBottom: "5px", fontSize: "17px" }}>{index+1}. {detail.discussionTitle}</p>
                                        </div>
                                        <div className="rightSide" style={{ display: "flex", gap: "10px" }}>
                                            <Icon css={iconStyle} fontSize={24} color="#51587E" icon={"material-symbols:edit"} onClick={() => handleEditDiscussionDetail(index)} />
                                            <Icon css={iconStyle} fontSize={24} color="#51587E" icon={"material-symbols:delete"} onClick={() => handleDeleteDiscussionDetail(index)} />
                                        </div>
                                    </div>
                                    
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"fluent-mdl2:set-action"} fontSize={20} />
                                            <p>Further Actions</p>
                                        </div>
                                        <p>{detail.furtherActions}</p>
                                    </div>
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"material-symbols:avg-time"} fontSize={20} />
                                            <p>Deadline</p>
                                        </div>
                                        <p>{detail.deadline}</p>
                                    </div>
                                    <div className="itemAction">
                                        <div className="leftSide">
                                            <Icon icon={"icon-park-outline:people"} fontSize={20} />
                                            <p>Person Responsible</p>
                                        </div>
                                        <p>{detail.personResponsible}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}

export default DiscussionModal;
