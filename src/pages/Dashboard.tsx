/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DashboardBox from '../components/DashboardBox';

const Dashboard = () => {
    const mainStyle = css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        // gap: 50px;
        background: rgb(118,232,255);
        background: linear-gradient(324deg, rgba(118,232,255,1) 0%, rgba(73,224,255,1) 22%, rgba(0,59,255,1) 100%);
    `;

    return (
        <>
            <main css={mainStyle}>
                <DashboardBox/>
            </main>
        </>
    );
}

export default Dashboard;
