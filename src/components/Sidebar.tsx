/** @jsxImportSource @emotion/react */
import React from 'react';
import dashboardIcon from "../assets/icons/ic_round-dashboard.png";
import searchIcon from "../assets/icons/searchIcon.png";
import studentListIcon from "../assets/icons/studentList.png";
import documentationIcon from "../assets/icons/documentationIcon.png";
import profileIcon from "../assets/icons/profileIcon.png";
import binusLogo from "../assets/icons/binusLogo.png";
import sidebarBackground from "../assets/icons/sidebar_background.jpg";
import bookIcon from "../assets/icons/book.png";
import { Icon } from '@iconify/react';
import { css } from "@emotion/react";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface SideBarProps {
    width?: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setSelectedStudentId: (studentId: string |  null) => void;
    todayReportsCount: number; // Add this prop
}

const Sidebar = ({ width, activeTab, setActiveTab, setSelectedStudentId, todayReportsCount }: SideBarProps) => {
    const sidebarStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        min-width: ${'305px'};
        background-image: url(${sidebarBackground});
        background-size: cover;
        background-position: center;
        box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .7);
    `;

    const enrichmentDocumentationStyle = css`
        display: flex;
        align-items: center;
        color: white;
        text-align: start;
        font-size: 13px;

        h2 {
            font-weight: 500;
        }
    `;

    const sidebarContentContainerStyle = (isActive: boolean) => css`
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: ${isActive ? 'white' : 'transparent'};
        color: ${isActive ? 'black' : 'white'};
        padding: 15px;
        border-radius: 5px;
        box-sizing: border-box;

        &:hover {
            background-color: ${isActive ? 'white' : 'rgba(234, 234, 234, 0.5)'};
            cursor: pointer;
        }

        a {
            color: ${isActive ? 'black' : 'white'};
            text-decoration: none;
        }
    `;

    const topSideStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;

        hr {
            width: 100%;
            background-color: white;
        }
    `;

    const buttonStyle = css`
        display: flex;
        width: 100%;
        padding: 15px;
        gap: 15px;
        font-size: 20px;
        align-items: center;
        font-weight: 400;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    const sidebarContentStyle = css`
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            const navigate = useNavigate();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="sidebar" css={sidebarStyle}>
            <div className="top-side" css={topSideStyle}>
                <div className="enrichmentDokum">
                    <div className="enrichmentDocumentationStyle" css={enrichmentDocumentationStyle}>
                        <h2>Enrichment Documentation</h2>
                        <img src={binusLogo} alt="" width={50} height={50} />
                    </div>
                    <hr />
                </div>
                <div className="sidebarContent" css={sidebarContentStyle}>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Dashboard")}
                        onClick={() => setActiveTab("Dashboard")}
                    >
                        <Icon icon={"ic:round-dashboard"} color={activeTab === "Dashboard" ? "black" : "white"} fontSize={25} />
                        <a href="#">Dashboard</a>
                    </div>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Search")}
                        onClick={() => {
                            setSelectedStudentId(null);
                            setActiveTab("Search");
                        }}
                    >
                        <Icon icon={"material-symbols:search"} color={activeTab === "Search" ? "black" : "white"} fontSize={25} />
                        <a href="#">Search</a>
                    </div>
                </div>
                <hr />
                <div className="sidebarContent" css={sidebarContentStyle}>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Student List")}
                        onClick={() => {
                            setSelectedStudentId(null);
                            setActiveTab("Student List");
                        }}
                    >
                        <Icon icon={"pepicons-pop:people"} color={activeTab === "Student List" ? "black" : "white"} fontSize={25} />
                        <a href="#">Student List</a>
                    </div>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Documentation")}
                        onClick={() => setActiveTab("Documentation")}
                    >
                        <Icon icon={"material-symbols:book"} color={activeTab === "Documentation" ? "black" : "white"} fontSize={25} />
                        <a href="#">Documentation</a>
                    </div>
                </div>
                <hr />
                <div
                    className="sidebarContentContainer"
                    css={sidebarContentContainerStyle(activeTab === "Profile")}
                    onClick={() => setActiveTab("Profile")}
                >
                    <Icon icon={"material-symbols:face"} color={activeTab === "Profile" ? "black" : "white"} fontSize={25} />
                    <a href="#">Profile</a>
                    {todayReportsCount > 0 && ( // Display report count if greater than 0
                        <div className="notificationContainer" style={{display: "flex", width: "100%", justifyContent: "end", position: "relative", alignItems: "center"}}>
                            <Icon icon={"clarity:notification-solid"} fontSize={24} />
                            <span style={{ color: 'red', borderRadius: '50%', position: "absolute", top: "-8px", right: "-7px"}}>
                                {todayReportsCount}
                            </span>
                        </div>
                        
                    )}
                </div>
            </div>
            <div className="bottom-side">
                <button className="bookStyle" css={buttonStyle} onClick={handleLogout}>
                    <img src={bookIcon} alt="" />
                    <p>Logout</p>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
