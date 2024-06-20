/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import homeIcon from "../assets/icons/home.png"
import searchIcon from "../assets/icons/search.png"
import plusIcon from "../assets/icons/plus.png"
import logoutIcon from "../assets/icons/logout.png"
import Clock from '../helper/Clock'; // Ensure the path is correct
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export interface SidebarProps {
    setActiveComponent: (component: string) => void;
    activeComponent: string;
}

function Sidebar({ setActiveComponent, activeComponent }: SidebarProps) {
    const sidebarStyle = css`
        height: 100%;
        background-color: rgb(255, 255, 255);
        display: flex;
        flex-direction: column;
        gap: 1px;
        justify-content: space-between; // Ensure the clock stays at the bottom
    `;

    const dashboardButtonStyle = (isActive: boolean) => css`
        cursor: pointer;
        ${isActive ?  "background-color: RGB(162,191,254)" : "background-color: transparent;" };
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
        border-radius: 100%;

        img {
            width: 30px;
            height: 30px;
            padding: 10px;
        }
    `;

    const buttonContainerStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        gap: 1px;
    `;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            const navigate = useNavigate()
            navigate('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <>
            <div css={sidebarStyle}>
                <div css={buttonContainerStyle}>
                    <div className="button-top">
                        <div css={dashboardButtonStyle(activeComponent === 'dashboard')} onClick={() => setActiveComponent('dashboard')}>
                            <img src={homeIcon} alt="Dashboard" />
                        </div>
                        <div css={dashboardButtonStyle(activeComponent === 'search')} onClick={() => setActiveComponent('search')}>
                            <img src={searchIcon} alt="Search" />
                        </div>
                        <div css={dashboardButtonStyle(activeComponent === 'form')} onClick={() => setActiveComponent('form')}>
                            <img src={plusIcon} alt="Fill New Form" />
                        </div>
                    </div>
                    <div css={dashboardButtonStyle(activeComponent === 'logout')} onClick={() => setActiveComponent('form')}>
                            <img src={logoutIcon} alt="Fill New Form" onClick={handleLogout} />
                    </div>
                </div>
                <Clock />
            </div>
        </>
    );
}

export default Sidebar;
