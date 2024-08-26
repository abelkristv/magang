/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Student from "../../model/Student";

interface StudentTableProps {
    students: Student[];
    totalComments: { [key: string]: number };
    sortField: string | null;
    sortOrder: "asc" | "desc";
    handleSort: (field: string) => void;
}

const tableStyle = css`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 20px;
    border: 2px solid #ECEAEA;
    border-radius: 15px;
    overflow: hidden;

    .no-column {
        width: 7%;
    }

    th,
    td {
        padding: 13px 25px; /* Increase the padding to increase row height */
        border: none;
        text-align: left;
        cursor: pointer;
    }

    th {
        background-color: #f2f2f2;
    }

    thead th:first-of-type {
        border-top-left-radius: 10px;
    }

    thead th {
        background-color: #C2C2C2;
        font-weight: 500;
    }

    thead th:last-of-type {
        border-top-right-radius: 10px;
    }

    tbody tr:nth-of-type(odd) {
        background-color: #ffffff;
        &:hover{
            background-color: #E2E2E2;
        }
    }
    
    tbody tr:nth-of-type(even) {
        background-color: #CFCFCF;
        &:hover{
            background-color: #C7C7C7;
        }
    }

    tbody tr:last-of-type td:first-of-type {
        border-bottom-left-radius: 10px;
    }

    tbody tr:last-of-type td:last-of-type {
        border-bottom-right-radius: 10px;
    }

    .name-column {
        width: 40%; /* Adjust the width as needed */
    }

    .nim-column {
        width: 10%;
    }
`;

const arrowStyle = css`
    margin-left: 5px; /* Add gap between the text and the arrow */
`;

const getSortArrow = (field: string, sortField: string | null, sortOrder: "asc" | "desc") => {
    if (field !== "major" && sortField === field) {
        return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '▼'; // Default position is down
};

const StudentTable = ({ students, totalComments, sortField, sortOrder, handleSort }: StudentTableProps) => {
    return (
        <table css={tableStyle}>
            <thead>
                <tr>
                    <th className="no-column">No.</th>
                    <th className="name-column" onClick={() => handleSort('name')}>
                        Name <span css={arrowStyle}>{getSortArrow('name', sortField, sortOrder)}</span>
                    </th>
                    <th className="nim-column" onClick={() => handleSort('nim')}>
                        NIM <span css={arrowStyle}>{getSortArrow('nim', sortField, sortOrder)}</span>
                    </th>
                    <th>
                        Major
                    </th>
                </tr>
            </thead>
            <tbody>
                {students.map((student, index) => (
                    <tr key={student.iden}>
                        <td className="no-column" style={{ borderBottom: index === students.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{index + 1}</td>
                        <td className="name-column" style={{ borderBottom: index === students.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{student.name}</td>
                        <td className="nim-column" style={{ borderBottom: index === students.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{student.nim}</td>
                        <td style={{ borderBottom: index === students.length - 1 ? "2px solid #F2F2F2" : "none", borderTop: "none" }}>{student.major}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentTable;
