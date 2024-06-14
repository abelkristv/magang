/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import homeIcon from "../assets/icons/home.png"
import searchIcon from "../assets/icons/search.png"
import plusIcon from "../assets/icons/plus.png"

function Sidebar({ setActiveComponent }) {

    const sidebarStyle = css`
        height: 100%;
        background-color: rgb(255, 255, 255, 0.8);
        // padding: 10px;
        // margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 1px;
    `;

    const dashboardButtonStyle = css`
        background-color: #2b2b2b;
        // border-radius: 100%;
        cursor: pointer;

        img {
            width: 50px;
            height: 50px;
            padding: 10px;
        }
    `;

    return (
        <>
            <div css={sidebarStyle}>
                <div css={dashboardButtonStyle} onClick={() => setActiveComponent('dashboard')}>
                    <img src={homeIcon} alt="Dashboard" />
                </div>
                <div css={dashboardButtonStyle} onClick={() => setActiveComponent('search')}>
                    <img src={searchIcon} alt="Search" />
                </div>
                <div css={dashboardButtonStyle} onClick={() => setActiveComponent('form')}>
                    <img src={plusIcon} alt="Fill New Form" />
                </div>
            </div>
        </>
    );
}

export default Sidebar;
