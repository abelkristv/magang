/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

interface PicturesModalProps {
    isPicturesModalOpen: boolean;
    closePicturesModal: () => void;
    pictures: { url: string }[];
    fileName: string;
    setFileName: (name: string) => void;
    newPicture: File | null;
    handleAddPicture: () => void;
    handlePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemovePicture: (index: number) => void;
}

const PicturesModal: React.FC<PicturesModalProps> = ({
    isPicturesModalOpen,
    closePicturesModal,
    pictures,
    fileName,
    // setFileName,
    handleAddPicture,
    handlePictureChange,
    handleRemovePicture,
}) => {
    const picturesModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (picturesModalRef.current && !picturesModalRef.current.contains(event.target as Node)) {
                closePicturesModal();
            }
        };

        if (isPicturesModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPicturesModalOpen]);

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
        padding: 10px;
        padding-right: 20px;
        padding-left: 20px;
        align-items: center;
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
    `;

    const pictureGridContainerStyle = css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 10px;
    `;

    const pictureGridItemStyle = css`
        position: relative;
        width: 100%;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
    `;

    const deleteIconStyle = css`
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        padding: 2px;
        &:hover {
            background-color: rgba(255, 255, 255, 1);
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

    return (
        isPicturesModalOpen && (
            <div css={modalStyle}>
                <div css={modalContentStyle} ref={picturesModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">List of Picture</p>
                        <button css={closeButtonStyle} onClick={closePicturesModal}>x</button>
                    </div>
                    <div className="inputContainer" style={{ position: "relative", height: "60px", border: "1px solid #ACACAC", margin: "20px", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePictureChange}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                boxSizing: "border-box",
                                top: 0, left: 0, opacity: 0, zIndex: 2, cursor: "pointer",
                            }}
                        />
                        <div className="labelContainer" style={{ position: "absolute", right: "0px", display: "flex", padding: "10px", boxSizing: "border-box", backgroundColor: "#F0ECEC", alignItems: "center", height: "100%", zIndex: 1, cursor: "pointer" }}>
                            <label
                                htmlFor="input"
                                style={{
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "inline-block"
                                }}
                            >
                                Browse
                            </label>
                        </div>
                        {fileName && (
                            <div style={{ marginLeft: "10px", padding: "10px", boxSizing: "border-box", zIndex: 1 }}>
                                {fileName}
                            </div>
                        )}
                    </div>

                    <div className="buttonContainer" style={{ display: "flex", justifyContent: "end", paddingRight: "20px", boxSizing: "border-box" }}>
                        <button type="button" css={addButtonStyle} onClick={handleAddPicture}>
                            Add
                        </button>
                    </div>
                    <form css={modalFormStyle}>
                        <div className="modalBox" css={modalBoxStyle}>
                            <div className="pictureGridContainer" css={pictureGridContainerStyle}>
                                {pictures.map((picture, index) => (
                                    <div key={index} className="pictureGridItem" css={pictureGridItemStyle}>
                                        <img src={picture.url} alt={`Picture ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }} />
                                        <Icon
                                            icon="mdi:delete"
                                            color="#51587E"
                                            fontSize={25}
                                            className="removeIcon"
                                            onClick={() => handleRemovePicture(index)}
                                            css={deleteIconStyle}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}

export default PicturesModal;
