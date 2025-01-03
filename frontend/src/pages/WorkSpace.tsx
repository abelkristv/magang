/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Sidebar from '../components/Sidebar';
import DashboardBox from '../components/Dashboard/DashboardBox';
import SearchBox from '../components/Search/SearchBox';
import StudentListBox from '../components/StudentList/StudentListBox';
import ProfileBox from '../components/ProfileBox';
import DocumentationBox from '../components/Documentation/DocumentationBox/DocumentationBox';
import StudentDetailBox from '../components/StudentDetail/StudentDetailBox';
import UploadStudentData from '../components/UploadStudentData/UploadStudentData';
import AddNewDocumentationBox from '../components/Documentation/Add New Documentation/AddNewDocumentationbox';
import { useAuth } from '../helper/AuthProvider';
import { Route, Routes, Navigate } from 'react-router-dom';
import { fetchUrgentStudentReports } from '../controllers/ReportController';

const WorkSpace = () => {
    const [activeTab, setActiveTab] = useState<string>("Dashboard");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [urgentReportsCount, setUrgentReportsCount] = useState<number>(0);
    const userAuth = useAuth();

    useEffect(() => {
        const fetchReportSize = async () => {
            const reports = await fetchUrgentStudentReports();
            setUrgentReportsCount(reports.length);
        };
        fetchReportSize();
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
                todayReportsCount={urgentReportsCount}
            />
            <Routes>
                <Route path="/" element={<Navigate to="/workspaces" />} />
                <Route path="/dashboard" element={<DashboardBox setActiveTab={setActiveTab} />} />
                <Route path="/search" element={<SearchBox onSelectStudent={setSelectedStudentId} />} />
                <Route path="/student-list" element={<StudentListBox onSelectStudent={setSelectedStudentId} />} />
                <Route path="/student-detail/:studentId" element={<StudentDetailBox/>} />
                <Route path="/profile" element={<ProfileBox setTodayReportsCount={setUrgentReportsCount} />} />
                <Route path="/add-new-documentation" element={<AddNewDocumentationBox />} />
                <Route path="/documentation" element={<DocumentationBox setGlobalActiveTab={setActiveTab} />} />
                <Route path="/upload-student-data" element={<UploadStudentData />} />
            </Routes>
        </main>
    );
};

export default WorkSpace;
