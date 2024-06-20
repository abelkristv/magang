/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import Sidebar from '../components/Sidebar';
import DashboardBox from '../components/DashboardBox';
import SearchBox from '../components/SearchBox';
import FormBox from '../components/AddNewReportFormBox';
import { useAuth } from '../helper/AuthProvider';

function Dashboard() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); 
    const {currentUser} = useAuth()
    console.log(currentUser.email)
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        // gap: 50px;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    const centerCardStyle = css`
        width: 95%;
        height: 90%;
        background: rgb(255,255,255, 0.8);
        border-radius: 15px;
        flex-direction: column;
        align-items: center;
        margin-right: 50px;
        display: flex;
        padding-top: 40px;
        overflow: scroll;
    `;  

    return (
        <>
            <main css={mainStyle}>
            {isSidebarVisible && (
                    <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} toggleSidebar={toggleSidebar} />
                )}
                {activeComponent === 'dashboard' && <DashboardBox onSearch={() => setActiveComponent('search')} />}
                {activeComponent === 'search' && <SearchBox />}
                {activeComponent === 'form' && <FormBox />}
            </main>
        </>
    );
}

export default Dashboard;
