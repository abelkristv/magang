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
    border-collapse: collapse;
    margin-top: 20px;
    border-radius: 10px;

    th, td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
        cursor: pointer;
    }

    th {
        background-color: #f2f2f2;
    }
`;

const StudentTable = ({ students, totalComments, sortField, sortOrder, handleSort }: StudentTableProps) => {
    return (
        <table css={tableStyle}>
            <thead>
                <tr>
                    <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => handleSort('nim')}>NIM {sortField === 'nim' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th>Total Comments</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.iden}>
                        <td>{student.name}</td>
                        <td>{student.nim}</td>
                        <td>{student.email}</td>
                        <td>{totalComments[student.name] || 0}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentTable;
