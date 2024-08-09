/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Student from "../../model/Student";

interface StudentCardProps {
    student: Student;
    totalComments: number;
    onClick: () => void;
}

const cardStyle = css`
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    box-sizing: border-box;
    box-shadow: -1px 2px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    gap: 20px;
    align-items: start;
    height: 195px;
    cursor: pointer;

    img {
        height: 167px;
        width: 129px;
        border-radius: 8px;
        object-fit: cover;
    }

    p {
        margin: 5px 0;
    }
`;

const cardStudentDescription = css`
    text-align: start;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const buttonContainerStyle = css`
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
`;

const StudentCard = ({ student, totalComments, onClick }: StudentCardProps) => {
    return (
        <div className="card" css={cardStyle} onClick={onClick}>
            <img src={student.image_url} alt={student.name} />
            <div className="student-description" css={cardStudentDescription}>
                <div className="text">
                    <p style={{ fontWeight: "500", fontSize: "18px" }}>{student.name}</p>
                    <p style={{color: "#49A8FF", fontSize: "18px"}}>{student.nim}</p>
                    <p>{student.major}</p>
                </div>
                <div className="buttonContainer" css={buttonContainerStyle}>
                    <p style={{fontSize: "13px"}}>Total Comments: </p>
                    <span style={{ marginLeft: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", backgroundColor: "#49A8FF", color: "white", padding: "10px", textAlign: "center", width: "36px", height: "36px", borderRadius: "5px", boxSizing: "border-box", fontSize: "18px" }}>
                        <p style={{margin: "0px"}}>{totalComments}</p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
