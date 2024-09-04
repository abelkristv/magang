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
        width: 900px;
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
        max-height: 500px;
        overflow-y: auto;
        scrollbar-width: thin;
        border: 1px solid #ACACAC;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    `;

    const pictureGridContainerStyle = css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 0px;
    `;

    const pictureGridItemStyle = css`
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    `;

    const deleteIconStyle = css`
        position: absolute;
        cursor: pointer;
        top: 10px;
        right: 10px;
        background-color: white;
        box-shadow: 1px 1px 4px 1px #dbdbdb;
        border-radius: 50%;
        padding: 2px;
        &:hover {
            // background-color: rgba(255, 255, 255, 1);
        }
    `;

    const addButtonStyle = css`
        background-color: #49A8FF;
        color: white;
        padding: 10px 20px;
        margin-top: 30px;
        margin-bottom: 15px;
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
    `;

    const inputContainerStyle = css`
        display: flex;
        align-items: center;
        border: 1px solid #ACACAC;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        height: 40px;
        position: relative;
    `;

    const hiddenFileInputStyle = css`
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
    `;

    const browseButtonStyle = css`
        background-color: #F0ECEC;
        border-radius: 0 5px 5px 0;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin-left: 775px;
        font-size: 15px;
    `;

    const pictureDivStyle = css`
        display: flex;
        flex-direction: column;
        align-items: start;
        margin: 0px 20px;
        p{
            margin-top: 10px;
            margin-bottom: 10px;
        }
    `;

    return (
        isPicturesModalOpen && (
            <div css={modalStyle}>
                <div css={modalContentStyle} ref={picturesModalRef}>
                    <div className="modalHeader" css={modalHeaderStyle}>
                        <p className="headerp">List of Pictures</p>
                        <Icon icon="mdi:close" onClick={closePicturesModal} fontSize={25} color="#51587E" css={closeButtonStyle} /> 

                    </div>

                    <div css={pictureDivStyle}>
                        <p>Picture</p>
                        <div css={inputContainerStyle}>
                            <input
                                id="hiddenFileInput"
                                type="file"
                                accept="image/*"
                                css={hiddenFileInputStyle}
                                onChange={handlePictureChange}
                            />
                            {fileName && (
                                <div style={{position:"absolute", marginLeft:"10px", fontSize:"15px"}}>
                                    {fileName}
                                </div>
                            )}
                            <div css={browseButtonStyle}>Browse</div>
                        </div>
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
                                        <img src={picture.url} alt={`Picture ${index + 1}`} style={{ width: "100%", height: "auto", borderRadius: "5px" }} />
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
