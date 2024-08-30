/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState<string>(images[0] || ''); 

    useEffect(() => {
        setSelectedImage(images[0] || '');
    }, [images]);

    const galleryStyle = css`
        display: grid;
        grid-template-columns: 2.5fr 1.05fr;
        gap: 6px;
        margin-top: 20px;
    `;

    const largeImageStyle = css`
        width: 100%;
        height: 507px;
        object-fit: contain;
        border-radius: 6px;
        background-color: #CFCFCF;
    `;

    const thumbnailContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 507px;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: thin;
    `;

    const thumbnailStyle = css`
        width: 100%;
        cursor: pointer;
        border-radius: 6px;
        &:hover {
            border-color: #49A8FF;
        }
    `;

    // const noImagesStyle = css`
    //     text-align: center;
    //     font-size: 18px;
    //     color: #888;
    //     margin-left: 20px;
    // `;

    const discussionDetailStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-left: 2px solid #ACACAC;
        padding: 10px 0px 10px 15px;
        margin-top: 16px;
    `;

    return (
        <div className="gallery" css={galleryStyle}>
            {images.length > 0 ? (
                <>
                    <div className="largeImage">
                        <img src={selectedImage} alt="Selected" css={largeImageStyle} />
                    </div>
                    <div className="thumbnailContainer" css={thumbnailContainerStyle}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                css={thumbnailStyle}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div css={discussionDetailStyle}>
                    <p style={{fontWeight:"500", fontSize:"16px", marginBottom:"5px"}}>No images found</p>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
