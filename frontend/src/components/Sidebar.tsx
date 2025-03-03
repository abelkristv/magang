/** @jsxImportSource @emotion/react */
import binusLogo from "../assets/icons/binusLogo.png";
import sidebarBackground from "../assets/icons/sidebar_background.jpg";
import bookIcon from "../assets/icons/book.png";
import { Icon } from '@iconify/react';
import { css } from "@emotion/react";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

interface SideBarProps {
    width?: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setSelectedStudentId: (studentId: string |  null) => void;
    todayReportsCount: number;
}

const Sidebar = ({activeTab, setActiveTab, setSelectedStudentId, todayReportsCount }: SideBarProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        } else {
            setActiveTab("Home"); 
        }
    }, [setActiveTab]);

    const handleTabClick = (tab: string, path: string) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab); 
        navigate(path);
    };

    const sidebarStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        min-width: ${'300px'};
        max-width: ${'303px'};
        background-image: url(${sidebarBackground});
        background-size: cover;
        background-position: center;
        box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .68);
    `;

    const enrichmentDocumentationStyle = css`
        display: flex;
        align-items: center;
        color: white;
        text-align: start;
        font-size: 13px;
        padding-right: 9px;
        padding-left: 9px;

        h2 {
            font-weight: 500;
        }
    `;

    const sidebarContentContainerStyle = (isActive: boolean) => css`
        width: 100%;
        height: 57px;
        display: flex;
        align-items: center;
        gap: 15px;
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
            height: 0.09px;
            background-color: white;
            border: none;
        }
    `;

    const buttonStyle = css`
        display: flex;
        width: 100%;
        padding: 15px;
        padding-left: 19.5px;
        gap: 18px;
        font-size: 16px;
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

    const linkStyle = (isActive: boolean) => css`
        color: ${isActive ? 'black' : 'white'};
        text-decoration: none;
        font-weight: ${isActive ? '500' : '300'};
    `;

    

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/enrichment-documentation/login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="sidebar" css={sidebarStyle}>
            <div className="top-side" css={topSideStyle}>
                <div className="enrichmentDokum">
                    <div className="enrichmentDocumentationStyle" css={enrichmentDocumentationStyle}>
                        <h2 style={{fontWeight: '400'}}>Enrichment Documentation</h2>
                        <img src={binusLogo} alt="" width={50} height={50} />
                    </div>
                    <hr />
                </div>
                <div className="sidebarContent" css={sidebarContentStyle}>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Home")}
                        onClick={() => handleTabClick('Home', '/enrichment-documentation/workspaces/home')}
                    >
                        <Icon icon={"ic:round-dashboard"} color={activeTab === "Home" ? "black" : "white"} fontSize={25} />
                        <a href="#" css={linkStyle(activeTab === "Home")}>Home</a>
                    </div>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Student")}
                        onClick={() => handleTabClick('Student', '/enrichment-documentation/workspaces/student')}
                    >
                        <Icon icon={"material-symbols:person"} color={activeTab === "Student" ? "black" : "white"} fontSize={25} />
                        <a href="#" css={linkStyle(activeTab === "Student")}>Student</a>
                    </div>
                </div>
                <hr />
                <div className="sidebarContent" css={sidebarContentStyle}>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Internal Activity")}
                        onClick={() => handleTabClick('Internal Activity', '/enrichment-documentation/workspaces/internal-activity')}
                    >
                        <Icon icon={"material-symbols:book"} color={activeTab === "Internal Activity" ? "black" : "white"} fontSize={25} />
                        <a href="#" css={linkStyle(activeTab === "Internal Activity")}>Internal Activity</a>
                    </div>
                    <div
                        className="sidebarContentContainer"
                        css={sidebarContentContainerStyle(activeTab === "Upload")}
                        onClick={() => handleTabClick('Upload', '/enrichment-documentation/workspaces/upload-student-data')}
                    >
                        <Icon icon={"mdi:cloud-upload"} color={activeTab === "Upload" ? "black" : "white"} fontSize={25} />
                        <a href="#" css={linkStyle(activeTab === "Upload")}>Upload</a>
                    </div>
                </div>
                <hr />
                <div
                    className="sidebarContentContainer"
                    css={sidebarContentContainerStyle(activeTab === "Profile")}
                    onClick={() => handleTabClick('Profile', '/enrichment-documentation/workspaces/profile')}
                >
                    <Icon icon={"material-symbols:face"} color={activeTab === "Profile" ? "black" : "white"} fontSize={25} />
                    <a href="#" css={linkStyle(activeTab === "Profile")}>Profile</a>
                    {todayReportsCount > 0 && ( 
                        <div className="notificationContainer" style={{display: "flex", width: "50%", justifyContent: "end", position: "relative", alignItems: "center", paddingRight: '8px'}}>
                            <Icon icon={"clarity:notification-solid"} fontSize={22} color={activeTab === "Profile" ? "51587E" : "white"} />
                            <span style={{ color: 'red', borderRadius: '50%', position: "absolute", top: "-8px", right: "-4px"}}>
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
