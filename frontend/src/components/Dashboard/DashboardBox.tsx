/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import dashboardDocum from "../../assets/dashboard_docum.png";
import MainBox from "../Elementary/MainBox";
import { useNavigate } from "react-router-dom";


interface DashboardBoxProps {
    setActiveTab: (str: string) => void;
}

const DashboardBox = ({ setActiveTab }: DashboardBoxProps) => {

    const navigate = useNavigate();

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
            font-size: 40px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        p {
            font-size: 18px;
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
        padding: 30px 20px;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        width: 646px;
        height: 310px;
        flex-direction: column;
        gap: 15px;
        align-items: center;

        button {
            width: 250px;
        }

        h1 {
            font-size: 40px;
            font-weight: 600;
        }

        p {
            font-size: 18px;
            width: 550px;
        }
    `;

    const buttonStyle = css`
        padding: 10px;
        color: white;
        border-radius: 10px;
        border: none;
        font-weight: 500;
        font-size: 17px;
        background-color: #49A8FF;
        margin-top: 30px;
        width: 230px;

        &:hover {
            background-color: #70bbff;
            cursor: pointer;
        }
    `;

    // const navigate = useNavigate()

    return (
        <MainBox navText="Home">
            <div className="documentationBox" css={documentationBoxStyle}>
                <div className="documentationContent" css={documentationContentStyle}>
                    <h2>Documentation</h2>
                    <p>This website is used for a <u>documentation</u> of students' enrichment records and internal enrichment activities.</p>
                </div>
                <img src={dashboardDocum} alt="Documentation" />
            </div>
            <div className="bottomBox" css={bottomBoxStyle}>
                <div className="companyBox" css={companyBox}>
                    <h1>Student Records</h1>
                    <p>You can see all of the enrichment students in the <u>student page</u> and add <u>records</u> about them, either it is from the student, company, or yourself.</p>
                    <div style={{display:"flex", alignItems:"center"}} onClick={() => {
                        setActiveTab("Student");
                        navigate('/enrichment-documentation/workspaces/student');
                    }} css={buttonStyle}>
                        <p className="buttonStyle">Go to Student List {">>"}</p>
                    </div>
                </div>
                <div className="enrichmentBox" css={companyBox}>
                    <h1>Internal Activities</h1>
                    <p>If any enrichment activities, such as meetings, discussions, or evaluations, were to happen, use the <u>internal activity page</u> to log those past events.</p>
                    <div style={{display:"flex", alignItems:"center", width:"280px"}} onClick={() => {
                        setActiveTab("Internal Activity");
                        navigate('/enrichment-documentation/workspaces/internal-activity');
                    }} css={buttonStyle}>
                        <p className="buttonStyle">Go to Internal Activities {">>"}</p>
                    </div>
                </div>
            </div>
        </MainBox>
    );
}

export default DashboardBox;
