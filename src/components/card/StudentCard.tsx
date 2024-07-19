/** @jsxImportSource @emotion/react */

import { useNavigate } from "react-router-dom";
import PrimaryButton from "../elementary/Button"
import Student from "../../model/Student";
import { css } from "@emotion/react";

interface StudentCardProp {
    student: Student,
    orientation?: string
} 

const StudentCard = ({student, orientation}: StudentCardProp) => {
    const navigate = useNavigate()
    const handleSeeMoreClick = (id: string) => {
        navigate(`/student/${id}`);
    };

    const cardStyle = css`
        display: flex;
        justify-content: space-between;
        background-color: white;
        border: 1px solid #dbdbdb;
        padding: 20px;
        width: auto;
        // width: 100%;
        height: 100%;
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
    `;
    const leftSide = css`
        display: flex;
        flex-direction: ${orientation == "Horizontal" ? "row" : "column"};
        align-items: ${orientation == "Horizontal" ? "start" : "center"};
        gap: ${orientation == "Horizontal" ? "40px" : "10px"};
        width: 100%;
        height: 100%;
    `;
    const photoStyle = css`
        width: 210px;
        height: 250px;
        border-radius: 10px;
        object-fit: cover;
    `;
    const contentInformationStyle = css`
        display:flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-between;
        gap: 10px;
        height: 100%;
        width: 100%;

        p {
            font-size: 20px;
        }
    `;
    const buttonContainer = css`
        display: flex;
        justify-content: ${orientation == "Horizontal" ? "end" : "center"};
        align-items: center;
        flex-direction: ${orientation == "Horizontal" ? "row" : "column"};
        margin-top: ${orientation == "Horizontal" ? "25px" : "0px"};
        gap: 20px;
        button {
            width: ${orientation == "Horizontal" ? "120px" : "100%"};
        }
        span {
            // width: 100% !important;
        }
    `;

    return (
        <div css={cardStyle} key={student.iden}>
            <div css={leftSide}>
                <img src={student.image_url} alt="" css={photoStyle} />
                <div css={contentInformationStyle}>
                    <div className="name-nim">
                        <h1>{student.name}</h1>
                        <p>{student.nim}</p>
                    </div>
                    <div className="information" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <p>Semester {student.semester}</p>
                        
                    </div>
                    {orientation == "Horizontal" && (
                        <p style={{marginTop: "20px"}}>
                            <span style={student.status === "Active" ?
                                { backgroundColor: "#37ad4b", color: "white", padding: "11px", borderRadius: "10px"}
                                : { backgroundColor: "#b03a38", color: "white", padding: "11px", borderRadius: "10px"}}>
                                {student.status === "Active" ? "Active" : "Inactive"}
                            </span>
                        </p>
                    )}
                    <div css={buttonContainer}>
                        {orientation != "Horizontal" && (
                        <p style={student.status === "Active" ?
                            { backgroundColor: "#37ad4b", boxSizing: "border-box", textAlign: "center", color: "white", padding: "10px", borderRadius: "10px", width: "100%" }
                            : { backgroundColor: "#b03a38", boxSizing: "border-box", textAlign: "center", color: "white", padding: "10px", borderRadius: "10px", width: "100%" }}>
                                {student.status === "Active" ? "Active" : "Inactive"}
                        </p>
                        )}
                        <PrimaryButton content={"Detail"} onClick={() => handleSeeMoreClick(student.iden)} width={120} height={50} borderRadius={"10px"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentCard