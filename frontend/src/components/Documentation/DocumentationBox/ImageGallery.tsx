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
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-top: 20px;
    `;

    const largeImageStyle = css`
        width: 100%;
        height: 420px;
        background-size: cover;
        border-radius: 10px;
        border: 2px solid #dbdbdb;
    `;

    const thumbnailContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 420px;
        overflow-y: scroll;
    `;

    const thumbnailStyle = css`
        width: 100%;
        cursor: pointer;
        border-radius: 10px;
        border: 2px solid #dbdbdb;
        &:hover {
            border-color: #49A8FF;
        }
    `;

    const noImagesStyle = css`
        text-align: center;
        font-size: 18px;
        color: #888;
        margin-left: 20px;
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
                <p css={noImagesStyle}>No images available</p>
            )}
        </div>
    );
};

export default ImageGallery;
