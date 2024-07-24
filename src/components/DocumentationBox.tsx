/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const DocumentationBox = () => {


    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
    `;

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `;


    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>Documentation</p>
            </div>
        </main>
    );
}

export default DocumentationBox;
