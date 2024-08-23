/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

interface ResultsModalProps {
    isResultsModalOpen: boolean;
    closeResultsModal: () => void;
    results: string[];
    newResult: string;
    setNewResult: (result: string) => void;
    handleAddResult: () => void;
    handleResultChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveResult: (index: number) => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
    isResultsModalOpen,
    closeResultsModal,
    results,
    newResult,
    setNewResult,
    handleAddResult,
    handleResultChange,
    handleRemoveResult,
}) => {
    const resultsModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resultsModalRef.current && !resultsModalRef.current.contains(event.target as Node)) {
                closeResultsModal();
            }
        };

        if (isResultsModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isResultsModalOpen]);

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
        padding-right: 10px;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        background-color: #F0ECEC;

        .headerp {
            padding: 10px;
            padding-left: 20px;
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
        isResultsModalOpen && (
            <div css={modalStyle}>
                <div css={modalContentStyle} ref={resultsModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">Add a Result</p>
                        <button css={closeButtonStyle} onClick={closeResultsModal}>x</button>
                    </div>
                    <div className="inputAndButtonContainer" css={inputAndButtonContainerStyle}>
                        <p>Results</p>
                        <input
                            type="text"
                            placeholder="New Result"
                            value={newResult}
                            onChange={(e) => setNewResult(e.target.value)}
                        />
                    </div>
                    <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box" }}>
                        <button type="button" css={addButtonStyle} onClick={handleAddResult}>
                            Add
                        </button>
                    </div>
                    <form css={modalFormStyle}>
                        <div className="modalBox" css={modalBoxStyle}>
                            {results.map((result, index) => (
                                <div key={index} className="attendeeInputContainer" css={attendeeInputContainerStyle}>
                                    <div className="inputNumContainer" style={{ display: "grid", width: "100%", minHeight: "47px", gridTemplateColumns: "0.3fr 1fr 1fr", paddingLeft: "10px", alignItems: "center" }}>
                                        <p style={{fontSize: "17px"}}>{index + 1}</p>
                                        <input
                                            placeholder={`Result ${index + 1}`}
                                            value={result}
                                            onChange={(e) => handleResultChange(index, e)}
                                            style={{fontSize: "17px"}}
                                        />
                                    </div>
                                    <Icon
                                        icon="mdi:delete"
                                        color="#51587E"
                                        fontSize={25}
                                        className="removeIcon"
                                        onClick={() => handleRemoveResult(index)}
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

export default ResultsModal;
