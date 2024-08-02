/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Student from "../../model/Student";

interface StudentCardProps {
    student: Student;
    totalComments: number;
}

const cardStyle = css`
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 20px;
    align-items: center;
    height: 200px;

    img {
        height: 100%;
        width: 150px;
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
    width: 100%;
`;

const StudentCard = ({ student, totalComments }: StudentCardProps) => {
    return (
        <div className="card" css={cardStyle}>
            <img src={student.image_url} alt={student.name} />
            <div className="student-description" css={cardStudentDescription}>
                <div className="text">
                    <p style={{ fontWeight: "bold", fontSize: "30px" }}>{student.name}</p>
                    <p>{student.nim}</p>
                    <p>{student.email}</p>
                </div>
                <div className="buttonContainer" css={buttonContainerStyle}>
                    <p>Total Comments: </p><span style={{ marginLeft: "10px", fontWeight: "bold", backgroundColor: "#49A8FF", color: "white", padding: "10px", textAlign: "center", width: "20px", height: "20px", borderRadius: "5px" }}>{totalComments}</span>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
