/** @jsxImportSource @emotion/react */

import { useNavigate } from "react-router-dom";
import PrimaryButton from "../elementary/Button"
import Student from "../../model/Student";
import { css } from "@emotion/react";

interface StudentCardProp {
    student: Student
} 

const StudentCard = ({student}: StudentCardProp) => {
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
        align-items: center;
        text-align: start;
        border-radius: 20px;
        box-shadow: 0px 0px 5px 1px #dbdbdbdb;
    `;
    const leftSide = css`
        display: flex;
        gap: 50px;
        width: 100%;
        height: 250px;
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
        justify-content: end;
        align-items: end;
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
                        <p>
                            <span style={student.status === "Active" ?
                                { backgroundColor: "#37ad4b", color: "white", padding: "7px", borderRadius: "10px" }
                                : { backgroundColor: "#b03a38", color: "white", padding: "7px", borderRadius: "10px" }}>
                                {student.status === "Active" ? "Active" : "Inactive"}
                            </span>
                        </p>
                    </div>
                    <div css={buttonContainer}>
                        <PrimaryButton content={"Detail"} onClick={() => handleSeeMoreClick(student.iden)} width={120} height={50} borderRadius={"10px"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentCard