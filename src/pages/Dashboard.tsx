/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import Sidebar from '../components/Sidebar';
import DashboardBox from '../components/DashboardBox';
import SearchBox from '../components/SearchBox';
import StudentListBox from '../components/StudentListBox';
import ProfileBox from '../components/ProfileBox';
import DocumentationBox from '../components/DocumentationBox';
import StudentDetailBox from '../components/StudentDetailBox'; // Import StudentDetailBox

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<string>("Dashboard");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    console.log(activeTab)
    console.log(selectedStudentId)

    return (
        <main css={mainStyle}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedStudentId={setSelectedStudentId} />
            {activeTab == "Dashboard" && <DashboardBox />}
            {activeTab == "Search" && <SearchBox />}
            {activeTab == "Student List" && 
                selectedStudentId ? (
                    <StudentDetailBox studentId={selectedStudentId} />
                ) : activeTab == "Student List" && (
                    <StudentListBox onSelectStudent={setSelectedStudentId} />
                )
            }
            {activeTab == "Profile" && <ProfileBox />}
            {activeTab == "Documentation" && <DocumentationBox />}
        </main>
    );
}

export default Dashboard;
