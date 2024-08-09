/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import dashboardDocum from "../../assets/dashboard_docum.png";
import MainBox from "../elementary/MainBox";


interface DashboardBoxProps {
    setActiveTab: (str: string) => void;
}

const DashboardBox = ({ setActiveTab }: DashboardBoxProps) => {
    const documentationBoxStyle = css`
        display: flex;
        margin-top: 30px;
        justify-content: space-around;
    `;

    const documentationContentStyle = css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: start;
        width: 50%;

        h2 {
            font-size: 50px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        p {
            font-size: 20px;
        }
    `;

    const bottomBoxStyle = css`
        display: flex;
        gap: 100px;
        padding: 100px;
        box-sizing: border-box;
    `;

    const companyBox = css`
        box-shadow: 0px 0px 11.7px 1px rgba(0, 0, 0, 0.25);
        padding: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        width: 646px;
        flex-direction: column;
        gap: 30px;
        align-items: center;

        button {
            width: 250px;
        }

        h1 {
            font-size: 50px;
            font-weight: 600;
        }

        p {
            font-size: 20px;
        }
    `;

    const buttonStyle = css`
        padding: 10px;
        color: white;
        border-radius: 10px;
        border: none;
        font-weight: bold;
        font-size: 17px;
        background-color: #49A8FF;

        &:hover {
            background-color: #70bbff;
            cursor: pointer;
        }
    `;

    return (
        <MainBox navText="Dashboard">
            <div className="documentationBox" css={documentationBoxStyle}>
                <div className="documentationContent" css={documentationContentStyle}>
                    <h2>Documentation</h2>
                    <p>This website is used for a <u>documentation</u> of students' enrichment records and internal enrichment activities.</p>
                </div>
                <img src={dashboardDocum} alt="Documentation" />
            </div>
            <div className="bottomBox" css={bottomBoxStyle}>
                <div className="companyBox" css={companyBox}>
                    <h1>Company</h1>
                    <p>For companies, you can see all of your students in the <u>student list page</u> and add <u>comments</u> according to their performance and behaviour.
                    Please be <u>appropriate</u> when using the feature.</p>
                    <button className="buttonStyle" css={buttonStyle} onClick={() => setActiveTab('Student List')}>Go to Student List {">>"}</button>
                </div>
                <div className="enrichmentBox" css={companyBox}>
                    <h1>Enrichment</h1>
                    <p>For the enrichment team, other than comments, you can schedule a <u>meeting</u> to it to respond.
                    You can also use the <u>documentation page</u> to <u>log past events</u> in the enrichment team.</p>
                    <button className="buttonStyle" css={buttonStyle} onClick={() => setActiveTab('Documentation')}>Go to Documentation {">>"}</button>
                </div>
            </div>
        </MainBox>
    );
}

export default DashboardBox;
