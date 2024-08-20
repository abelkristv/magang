/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";
import { css } from '@emotion/react';
import Sidebar from '../components/Sidebar';
import DashboardBox from '../components/Dashboard/DashboardBox';
import SearchBox from '../components/Search/SearchBox';
import StudentListBox from '../components/StudentList/StudentListBox';
import ProfileBox from '../components/ProfileBox';
import DocumentationBox from '../components/Documentation/DocumentationBox';
import StudentDetailBox from '../components/StudentDetail/StudentDetailBox';
import AddNewDocumentationBox from '../components/Documentation/AddNewDocumentationbox';
import { useAuth } from '../helper/AuthProvider'; // Import the authentication provider

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<string>("Dashboard");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [urgentReportsCount, setUrgentReportsCount] = useState<number>(0); // Renamed state variable for clarity
    const userAuth = useAuth(); // Use authentication context to get the current user

    useEffect(() => {
        const fetchUrgentReportsCount = async () => {
            if (userAuth?.currentUser?.email) {
                const app = getApp();
                const db = getFirestore(app);
                const studentReportRef = collection(db, "studentReport");

                const reportQuery = query(
                    studentReportRef,
                    where("type", "==", "Urgent"), // Filter by type="Urgent"
                    where("writer", "==", userAuth.currentUser.email) // Filter by writer's email
                );

                const reportSnapshot = await getDocs(reportQuery);

                setUrgentReportsCount(reportSnapshot.size);
            }
        };

        fetchUrgentReportsCount();
    }, [activeTab, userAuth]);

    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1,1) 100%);
    `;

    return (
        <main css={mainStyle}>
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                setSelectedStudentId={setSelectedStudentId} 
                todayReportsCount={urgentReportsCount} // Pass the count of urgent reports to Sidebar
            />
            {activeTab === "Dashboard" && <DashboardBox setActiveTab={setActiveTab} />}
            {activeTab === "Search" && 
                (selectedStudentId ? (
                    <StudentDetailBox studentId={selectedStudentId} />
                ) : (
                    <SearchBox onSelectStudent={setSelectedStudentId} />
                ))
            }
            {activeTab === "Student List" && 
                (selectedStudentId ? (
                    <StudentDetailBox studentId={selectedStudentId} />
                ) : (
                    <StudentListBox onSelectStudent={setSelectedStudentId} />
                ))
            }
            {activeTab === "Profile" && <ProfileBox setTodayReportsCount={setUrgentReportsCount} />} {/* Pass setUrgentReportsCount to ProfileBox */}
            {activeTab === "Add New Documentation" && <AddNewDocumentationBox />}
            {activeTab === "Documentation" && <DocumentationBox setGlobalActiveTab={setActiveTab} />}
        </main>
    );
}

export default Dashboard;
