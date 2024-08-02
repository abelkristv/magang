/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { ReactNode } from "react";

interface MainBoxProps {
    navText: string;
    children:  ReactNode;
}

const MainBox = ({navText,  children}: MainBoxProps) => {
    const mainStyle = css`
        background-color: white;
        width: 100%;
        height: 100%;
        padding: 40px 43px 40px 43px;
        box-sizing: border-box;
        overflow: scroll;
    `

    const navSide = css`
        p {
            text-align: start;
            font-size: 20px;
        }
    `

    const contentSide = css`
        margin-top: 50px;
        width: 100%;
    `;


    return (
        <main className="mainStyle" css={mainStyle}>
            <div className="navSide" css={navSide}>
                <p>{navText}</p>
            </div>
            <div className="contentSide" css={contentSide}>
                {children}
            </div>
        </main>
    )
}

export default MainBox;